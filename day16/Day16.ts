import { readFileSync } from "fs";

class Packet {
  version = 0;
  typeId = 0;
  literalValue = 0;
  subPackets = new Array<Packet>();

  constructor(data: string = "") {
    if (data.length > 0)
      this.parse(data, 0);
  }

  get isValid() {
    return this.version !== 0 || this.typeId === 4 || this.subPackets.length > 0;
  }

  parse(data: string, startPos: number) {
    if (startPos >= data.length)
      return -1;
    let currPos = startPos;
    this.version = Number.parseInt(data.substr(currPos, 3), 2);
    currPos += 3;
    this.typeId = Number.parseInt(data.substr(currPos, 3), 2);
    currPos += 3;

    if (this.typeId === 4) {
      let firstBit = "";
      let binaryLiteral = "";
      do {
        firstBit = data.substr(currPos++, 1);
        binaryLiteral = binaryLiteral + data.substr(currPos, 4);
        currPos += 4;
      } while (firstBit === "1");
      this.literalValue = Number.parseInt(binaryLiteral, 2);
      return currPos;
    }

    // subpackets
    const lengthType = data[currPos++];
    if (lengthType === "0") { // length of subpacket bits
      const lengthBits = data.substr(currPos, 15);
      currPos += 15;
      const numSubPacketBits = Number.parseInt(lengthBits, 2);
      const subPacketData = data.substr(currPos, numSubPacketBits);
      currPos += numSubPacketBits;
      let subIdx = 0;
      do {
        const packet = new SubPacket(subPacketData, subIdx);
        subIdx = packet.endPos;
        if (packet.isValid) {
          this.subPackets.push(packet);
        } else {
          break;
        }
      } while (true);
      return currPos;
    }

    // num subpackets
    const numSubsBits = data.substr(currPos, 11);
    currPos += 11;
    const numSubs = Number.parseInt(numSubsBits, 2);
    Array.from({ length: numSubs }).forEach(_ => {
      const packet = new SubPacket(data, currPos);
      currPos = packet.endPos;
      this.subPackets.push(packet);
    });
    return currPos;
  }

  static typeIdMap: { [key: number]: (packet: Packet) => number } = {
    0: packet => packet.subPackets.reduce((acc, sp) => acc + sp.calculatedValue, 0),
    1: packet => packet.subPackets.reduce((acc, sp) => acc * sp.calculatedValue, 1),
    2: packet => Math.min(...packet.subPackets.map(sp => sp.calculatedValue)),
    3: packet => Math.max(...packet.subPackets.map(sp => sp.calculatedValue)),
    4: packet => packet.literalValue,
    5: packet => packet.subPackets[0].calculatedValue > packet.subPackets[1].calculatedValue ? 1 : 0,
    6: packet => packet.subPackets[0].calculatedValue < packet.subPackets[1].calculatedValue ? 1 : 0,
    7: packet => packet.subPackets[0].calculatedValue === packet.subPackets[1].calculatedValue ? 1 : 0,
  };

  get calculatedValue() {
    return Packet.typeIdMap[this.typeId](this);
  }

  get versionSum() {
    const sum: number = this.subPackets.reduce((acc, sp) => acc + sp.versionSum, this.version);
    return sum;
  }
}

class SubPacket extends Packet {
  endPos = 0;

  constructor(data: string, startPos: number) {
    super();
    if (data.length > 0)
      this.endPos = this.parse(data, startPos);
  }
}

class Day16 {
  data = "";
  packet: Packet;

  hexMap: { [key: string]: string } = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    "A": "1010",
    "B": "1011",
    "C": "1100",
    "D": "1101",
    "E": "1110",
    "F": "1111",
  };

  loadData(fileName: string) {
    const contents = readFileSync(fileName, "utf8") as string;
    this.data = Array.from(contents).map((char: string) => this.hexMap[char]).join("");
  }

  constructor() {
    this.loadData("day16/day16.txt");
    this.packet = new Packet(this.data);
  }

  partOne() {
    console.log(`Part 1 - version sum: ${this.packet.versionSum}`);
  }

  partTwo() {
    console.log(`Part 2 - calculated value: ${this.packet.calculatedValue}`);
  }

  static go() {
    const d = new Day16();
    d.partOne();
    d.partTwo();
  }
}

Day16.go();
