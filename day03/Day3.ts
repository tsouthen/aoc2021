import { readFileSync } from "fs";

class Day3 {
  readInput() {
    // const data: string = Deno.readTextFileSync('day3.txt');
    const data = readFileSync('day3_ex.txt', "utf8")
    const lines = data.split("\n");
    const bits = lines.map((line: string) => line.split('').map(bitChar => Number(bitChar)));
    return bits;
  }

  dec2bin(dec: number) {
    return (dec >>> 0).toString(2);
  }

  getSum(bits: number[][], bitIdx: number) {
    let sum = 0;
    for (const row of bits) {      
      sum += row[bitIdx];
    }
    return sum;
  }

  getSums(bits: number[][]) {
    const numBits = bits[0].length;
    const sums = Array<number>(numBits);
    for (let bitIdx = 0; bitIdx < numBits; bitIdx++) {
      sums[bitIdx] = this.getSum(bits, bitIdx);
    }
    return sums;
  }

  partOne(bits: number[][]) {
    const sums = this.getSums(bits);
    let gamma = 0;
    const numBits = bits[0].length;
    const halfSum = bits.length / 2;
    for (let idx = 0; idx < numBits; idx++) {
      if (sums[idx] > halfSum) {
        gamma += 1 << numBits - idx - 1;
      }
    }    
    const epsilon = ~gamma & (Math.pow(2, 12) - 1);
    console.log("Part 1");
    console.log(`   gamma: ${this.dec2bin(gamma)}`);
    console.log(` epsilon: 00${this.dec2bin(epsilon)}`);
    console.log(`   gamma: ${gamma} * epsilon: ${epsilon} = ${gamma * epsilon}`);
  }

  getLeastOrMostCommon(bits: number[][], bitIdx: number, leastCommon: boolean) {
    const sum = this.getSum(bits, bitIdx);
    // if sum > bits.length / 2 then it is the most common, otherwise 0 is the most common. If they're equal use 1.
    let searchVal = sum >= bits.length / 2 ? 1 : 0;
    if (leastCommon) {
      searchVal = (searchVal + 1) % 2;
    }
    const filtered = bits.filter((value: number[]) => {
      return value[bitIdx] === searchVal;
    });
    return filtered;
  }

  partTwo(bits: number[][]) {
    let leastCommon = false;
    const results = [];
    console.log("Part 2");
    for (let currBits of [bits, bits]) {
      let bitIdx = 0;
      while (currBits.length > 1) {
        currBits = this.getLeastOrMostCommon(currBits, bitIdx, leastCommon);
        bitIdx++;
      }
      const result = currBits[0].join("");
      console.log(`bits: ${result}`);
      results.push(parseInt(result, 2));
      leastCommon = true;
    }
    console.log(`results: ${results}`);
    console.log(`result: ${results[0] * results[1]}`);
  }
}

const day3 = new Day3();
const bits = day3.readInput();
day3.partOne(bits);
console.log();
day3.partTwo(bits);
  