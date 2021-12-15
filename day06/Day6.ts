import { readFileSync } from "fs";

class Day6 {
  inputData: number[] = [];

  constructor() {
    this.loadData("day6.txt");
  }

  loadData(fileName: string) {
    this.inputData = readFileSync(fileName, "utf8").split(",").map(Number);
  }

  partOne() {
    let currState = [...this.inputData];
    for (let day = 0; day < 80; day++) {
      // console.log(currState.join(","));
      //determine next generations
      const newItems = currState.filter((val) => val === 0).map(() => 8);

      //subtract one from each value
      currState = currState.map((val) => val ? val - 1 : 6);

      //append next generations
      currState.push(...newItems);
    }
    console.log(currState.length);
  }

  partTwo() {
    //Use an array for each number holding the counts as order doesn't matter
    const counts = new Array<number>(9).fill(-1);
    this.inputData.forEach(val => {
      if (counts[val] !== -1)
        counts[val] += 1;
      else
        counts[val] = 1;
    });

    for (let day = 0; day < 256; day++) {
      //subtract one from each value by shifting out the lowest (0) position
      const zeroCount = counts.shift();
      if (zeroCount !== undefined) {
        if (zeroCount > 0)
          counts[6] = Math.max(counts[6], 0) + zeroCount;
        //add next generations
        counts[8] = zeroCount > 0 ? zeroCount : -1;
      }
    }
    console.log(counts.filter(v => v > 0).reduce((sum, v) => sum + v, 0));
  }

  static go() {
    const d6 = new Day6();
    console.log("Part 1");
    d6.partOne();
    console.log("Part 2");
    d6.partTwo();
  }
}

Day6.go();
