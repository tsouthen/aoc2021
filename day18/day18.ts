import { readFileSync } from "fs";

type PairType = Array<number | Array<number>>;

class Day18 {
  nextExplode(data: PairType, parents: Array<number> = []): Array<number> {
    const a0 = Array.isArray(data[0]);
    const a1 = Array.isArray(data[1]);

    if (parents.length === 4 && !a0 && !a1)
      return parents;

    let result: Array<number> | undefined;
    if (a0)
      result = this.nextExplode(data[0] as PairType, [...parents, 0]);

    if (a1 && (result === undefined || result.length === 0))
      result = this.nextExplode(data[1] as PairType, [...parents, 1]);

    return result ?? [];
  }

  nextSplit(data: PairType, parents: Array<number> = []): Array<number> {
    if (data[0] > 9)
      return parents;

    if (Array.isArray(data[0])) {
      const result = this.nextSplit(data[0] as PairType, [...parents, 0]);
      if (result !== undefined && result.length > 0)
        return result;
    }

    if (data[1] > 9)
      return parents;

    if (Array.isArray(data[1])) {
      const result = this.nextSplit(data[1] as PairType, [...parents, 1]);
      if (result !== undefined && result.length > 0)
        return result;
    }

    return [];
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

  explode(data: PairType, path: Array<number>, left: boolean) {
    const currVal = path.reduce((pair, val) => pair[val] as Array<number>, data);
    const incr = currVal[left ? 0 : 1] as number;
    const currRed = [...path];
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
      let splits = false;
      let path = this.nextExplode(data);
      if (path.length === 0) {
        path = this.nextSplit(data);
        if (path.length === 0)
          return data;
        splits = true;
      }

      let currData = data;
      let parentData = data;
      for (let idx = 0; idx < path.length; ++idx) {
        parentData = currData;
        currData = currData[path[idx]] as PairType;
      }

      if (splits) {
        if (!this.splitValue(currData, 0))
          this.splitValue(currData, 1)
      } else {
        const explodeIdx = typeof (parentData[0]) === "number" ? 1 : 0;
        this.explode(data, path, false);
        this.explode(data, path, true);
        parentData[explodeIdx] = 0;
      }
    } while (true);
  }

  magnitude(data: PairType): number {
    const a0 = Array.isArray(data[0]);
    const a1 = Array.isArray(data[1]);

    return (3 * (a0 ? this.magnitude(data[0] as Array<number>) : data[0] as number)) +
      (2 * (a1 ? this.magnitude(data[1] as Array<number>) : data[1] as number));
  }

  partOne() {
    const contents = readFileSync("day18/day18_ex.txt", "utf8") as string;
    const data = contents.split("\n");
    let sum = JSON.parse(data.shift()!);
    while (data.length > 0) {
      const next = JSON.parse(data.shift()!);
      sum = [sum, next];
      this.reduce(sum);
    }
    console.log(`Part 1: sum: ${this.magnitude(sum)}`);
  }

  sum(p1: string, p2: string) {
    const pair = [JSON.parse(p1), JSON.parse(p2)];
    return this.magnitude(this.reduce(pair as PairType));
  }

  partTwo() {
    const contents = readFileSync("day18/day18_ex.txt", "utf8") as string;
    const data = contents.split("\n");
    let largest = 0;
    for (let ii = 0; ii < data.length; ++ii) {
      for (let jj = 0; jj < data.length; ++jj) {
        if (ii != jj)
          largest = Math.max(largest, this.sum(data[ii], data[jj]));
      }
    }
    console.log(`Part 2: largest sum: ${largest}`);
  }

  static go() {
    const d = new Day18();
    d.partOne();
    d.partTwo();
  }
}

Day18.go();
