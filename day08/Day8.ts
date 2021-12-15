import { readFileSync } from "fs";

class Entry {
  inputs: string[];
  outputs: string[];
  values: string[];

  constructor(line: string) {
    const [input, output] = line.split(" | ");
    this.inputs = input.split(" ");
    this.outputs = output.split(" ");
    this.values = new Array(10);
  }

  static sortChars(input: string) {
    return Array.from(input).sort().join("");
  }
  
  static intersection(in1: string, in2: string) {
    const s2 = new Set([...Array.from(in2)]);
    const result = Array.from(in1).filter(v => s2.has(v));
    return result.join("");
  }

  static difference(in1: string, in2: string) {
    const s2 = new Set([...Array.from(in2)]);
    const result = Array.from(in1).filter(v => !s2.has(v));
    return result.join("");
  }

  static union(in1: string, in2: string) {
    const result = new Set([...Array.from(in1), ...Array.from(in2)]);
    return Array.from(result).join("");
  }

  static includes(in1: string, in2: string) {
    const a2 = Array.from(in2);
    let includes = true;
    a2.forEach(ch => {
      if (!in1.includes(ch))
        includes = false;
    });
    return includes;    
  }

  sortValues() {
    this.inputs = this.inputs.map(v => Entry.sortChars(v));
    this.outputs = this.outputs.map(v => Entry.sortChars(v));
  }

  setValues() {
    this.sortValues();
    this.values[8] = "abcdefg";

    const oneVal = this.inputs.find((i => i.length === 2));
    if (oneVal === undefined)
      return;
    this.values[1] = oneVal;

    const sevenVal = this.inputs.find((i => i.length === 3));
    if (sevenVal === undefined)
      return;
    this.values[7] = sevenVal;

    const fourVal = this.inputs.find((i => i.length === 4));
    if (fourVal === undefined)
      return;
    this.values[4] = fourVal;

    // Five segments: 2, 3, 5
    const fiveSegs = this.inputs.filter((i => i.length === 5));
    const threeVal = fiveSegs.find(v => Entry.includes(v, oneVal)); // only the 3 has both of the 1 segments
    if (threeVal === undefined)
      return;      
    this.values[3] = threeVal;

    const twoOrFive = fiveSegs.filter(v => v != threeVal);
    const fiveSearch = Entry.difference(fourVal, oneVal); // only the 5 has the upper left segment
    const fiveIdx = twoOrFive.findIndex(v => Entry.includes(v, fiveSearch));
    const fiveVal = twoOrFive[fiveIdx];
    this.values[5] = fiveVal;
    const twoVal = twoOrFive[(fiveIdx + 1) % 2];
    this.values[2] = twoVal;

    // Six segments: 0, 6, 9
    const sixSegs = this.inputs.filter((i => i.length === 6));
    const nineSearch = Entry.union(fourVal, sevenVal); // only the 9 has upper left, upper right and middle segment
    const nineVal = sixSegs.find((v => Entry.includes(v, nineSearch)));
    if (nineVal === undefined)
      return;
    this.values[9] = nineVal;
    const zeroOrSix = sixSegs.filter((v => v != nineVal));
    const zeroSearch = Entry.difference(nineVal, fiveVal); // only 0 has upper right
    const zeroIdx = zeroOrSix.findIndex((v => Entry.includes(v, zeroSearch)));
    if (zeroIdx === -1)
      return;
    this.values[0] = zeroOrSix[zeroIdx];
    this.values[6] = zeroOrSix[(zeroIdx + 1) % 2];
    // this.values.forEach((v, idx) => console.log(`${v}: ${idx}`));
  }

  getOutputValue() {
    this.setValues();
    const strVal = this.outputs.reduce((currVal, outputVal) => currVal + this.values.findIndex(v => v == outputVal).toString(), "");
    return Number(strVal);
  }
}

class Day8 {
  data: Entry[] = [];

  constructor() {
    this.loadData("day8.txt");
  }

  loadData(fileName: string) {
    const lines: string[] = readFileSync(fileName, "utf8").split("\n");
    lines.forEach((line) => this.data.push(new Entry(line)));
  }

  partOne() {
    let count = 0;
    this.data.forEach(entry => count += entry.outputs.filter(v => v.length === 2 || v.length === 4 || v.length === 3 || v.length === 7).length);
    console.log(count);
  }

  partTwo() {
    let sum = 0;
    this.data.forEach(e => sum += e.getOutputValue());
    console.log(sum);
  }

  static go() {
    const d6 = new Day8();
    console.log("Part 1");
    d6.partOne();
    console.log("Part 2");
    d6.partTwo();
  }
}

Day8.go();
