import { readFileSync } from "fs";

class Day7 {
  inputData: number[] = [];

  constructor() {
    this.loadData("day7.txt");
  }

  loadData(fileName: string) {
    this.inputData = readFileSync(fileName, "utf8").split(",").map(Number);
  }
 
  doit(costFunc: (diff: number) => number) {
    const counts = new Map<number, number>();
    let min = 0;
    let max = 0;
    this.inputData.forEach(v => {
      counts.set(v, 1 + (counts.get(v) ?? 0));
      min = Math.min(min, v);
      max = Math.max(max, v);
    });
    let minCost = 0;
    for (let currVal = min; currVal <= max; currVal++) {
      let currCost = 0;
      counts.forEach((count, position) => {
        currCost += count * costFunc(Math.abs(position - currVal));
      });
      if (minCost === 0 || currCost < minCost) {
        minCost = currCost;
      }
    }
    console.log(minCost);
  }

  partOne() {
    this.doit(n => n);
  }

  partTwo() {
    this.doit(n => n * (n + 1) / 2);
  }

  static go() {
    const d6 = new Day7();
    console.log("Part 1");
    d6.partOne();
    console.log("Part 2");
    d6.partTwo();
  }
}

Day7.go();
