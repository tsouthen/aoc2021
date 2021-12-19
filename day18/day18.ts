import { readFileSync } from "fs";

type PairType = Array<number | Array<number>>;

class Day18 {
  data = new Array<string>();
  constructor() {
    this.loadData("day18/day18_ex.txt");
  }

  // isNumeric(str: string) {
  //   return /^\d+$/.test(str);
  // }

  // explodePair(input: string, idx: number) {
  //   console.log(`Explode pair at: ${idx}: ${input}`);
  //   // get first number to the left
  //   let leftIdx = idx - 1;
  //   while (leftIdx >= 0 && this.isNumeric(input[leftIdx]))
  //     leftIdx--;
  //   if (leftIdx >= 0) {
  //     let leftLen = 1;
  //     while (((leftIdx + leftLen) < idx) && this.isNumeric(input[leftIdx + leftLen]))
  //       leftLen++;

  //   }
  //   return input;
  // }

  // splitCount(input: string, idx: number) {
  //   let endIdx = idx;
  //   while (endIdx < input.length && this.isNumeric(input[endIdx]))
  //     endIdx++;
  //   return endIdx - idx;
  // }

  // splitNumber(input: string, idx: number, numChars: number) {
  //   const val = Number(input.substr(idx, numChars));
  //   const newPair = `[${Math.floor(val / 2)},${Math.ceil(val / 2)}]`;
  //   return input.substr(0, idx) + newPair + input.substr(idx + numChars);
  // }

  // reduceSingle(input: string) {
  //   let depth = 0;
  //   for (let idx = 0; idx < input.length; ++idx) {
  //     if (input[idx] === ",") {
  //       // do nothing
  //     } else if (input[idx] === "[") {
  //       depth += 1;
  //     } else if (input[idx] === "]") {
  //       depth -= 1;
  //     } else if (depth >= 5) {
  //       return this.explodePair(input, idx);
  //     } else {
  //       const splitCount = this.splitCount(input, idx);
  //       if (splitCount >= 2)
  //         return this.splitNumber(input, idx, splitCount);
  //     }
  //   }
  //   return undefined;
  // }

  // reduce(input: string) {
  //   let prevVal = input;
  //   do {
  //     const newVal = this.reduceSingle(prevVal);
  //     if (newVal === undefined || newVal.length === prevVal.length)
  //       return prevVal;
  //     prevVal = newVal;
  //   } while (true);
  // }

  loadData(fileName: string) {
    const contents = readFileSync(fileName, "utf8") as string;
    this.data.length = 0;
    this.data.push(...contents.split("\n"));
  }

  traverse(data: PairType, parents: Array<number> = []): Array<number> {
    const a0 = Array.isArray(data[0]);
    const a1 = Array.isArray(data[1]);
    const gt0 = data[0] > 9;
    const gt1 = data[1] > 9;

    if (parents.length === 4 && !a0 && !a1)
      return parents;

    if (gt0 || gt1)
      return parents;

    let result: Array<number> | undefined;
    if (a0)
      result = this.traverse(data[0] as PairType, [...parents, 0]);

    if (a1 && (result === undefined || result.length === 0))
      result = this.traverse(data[1] as PairType, [...parents, 1]);

    return result ?? [];
  }

  splitValue(currData: PairType, idx: number) {
    const currVal = currData[idx];
    if (currVal && typeof (currVal) === "number" && currVal > 9) {
      currData[idx] = [Math.floor(currVal / 2), Math.ceil(currVal / 2)];
      return true;
    }
    return false;
  }

  addToFirstValue(data: PairType, value: number, left: boolean) {
    let currData = data;
    const idx = left ? 0 : 1;
    while (Array.isArray(currData[idx]))
      currData = currData[idx] as Array<number>;
    currData[idx] = (currData[idx] as number) + value;
  }

  explode(data: PairType, reduction: Array<number>, left: boolean) {
    const currVal = reduction.reduce((pair, val) => pair[val] as Array<number>, data);
    const incr = currVal[left ? 0 : 1] as number;
    const currRed = [...reduction];
    while (currRed[currRed.length - 1] === (left ? 0 : 1))
      currRed.pop();
    if (currRed.length === 0)
      return;
    currRed.pop();
    const pair = currRed.reduce((pair, val) => pair[val] as Array<number>, data);
    const destVal = pair[left ? 0 : 1];
    if (typeof destVal === "number") {
      pair[left ? 0 : 1] = incr + destVal;
    } else {
      this.addToFirstValue(destVal, incr, !left);
    }
  }

  reduce(data: PairType) {
    do {
      const reduction = this.traverse(data);
      if (reduction.length === 0)
        return;

      console.log(` reduce: ${JSON.stringify(reduction)}`);
      let currData = data;
      let parentData = data;
      for (let idx = 0; idx < reduction.length; ++idx) {
        parentData = currData;
        currData = currData[reduction[idx]] as PairType;
      }
      if (!this.splitValue(currData, 0) && !this.splitValue(currData, 1)) {
        const explodeIdx = typeof (parentData[0]) === "number" ? 1 : 0;
        this.explode(data, reduction, false);
        this.explode(data, reduction, true);
        parentData[explodeIdx] = 0;
      }
    } while (true);
  }

  partOne() {
    const data = JSON.parse("[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]");
    console.log(` before: ${JSON.stringify(data)}`);
    this.reduce(data);
    console.log(`  after: ${JSON.stringify(data)}`);
  }

  static go() {
    const d = new Day18();
    d.partOne();
  }
}

Day18.go();
