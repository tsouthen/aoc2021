import { readFileSync } from "fs";

class Point {
  x: number;
  y: number;

  constructor(x = -1, y = -1) {
    this.x = x;
    this.y = y;
  }

  equals(other: Point) {
    return this.x === other.x && this.y === other.y;
  }

  compareXY(other: Point) {
    const xDiff = this.x - other.x;
    if (xDiff !== 0)
      return xDiff;

    return this.y - other.y;
  }

  compareYX(other: Point) {
    const yDiff = this.y - other.y;
    if (yDiff !== 0)
      return yDiff;

    return this.x - other.x;
  }

  compare(other: Point, xFirst = true) {
    if (xFirst)
      return this.compareXY(other);
    return this.compareYX(other);
  }

  static parse(input: string) {
    const pt = new Point();
    const vals = input.trim().split(",").map(Number);
    if (vals.length === 2) {
      pt.x = vals[0];
      pt.y = vals[1];
    } else {
      throw `Point doesn't have 2 vals: ${input}`;
    }
    if (pt.x === -1 || pt.y === -1)
      throw `Point didn't parse: ${input}`;
    return pt;
  }
}

class Day13 {
  points = new Array<Point>();
  folds = new Array<Point>();

  loadData(fileName: string) {
    this.points.length = 0;
    this.folds.length = 0;
    const lines: string[] = readFileSync(fileName, "utf8").split("\n");
    lines.forEach((line) => {
      if (line.startsWith("fold along ")) {
        const val = Number(line.substring(13));
        if (line[11] === "y")
          this.folds.push(new Point(-1, val));
        else
          this.folds.push(new Point(val, -1));
      } else if (line.length) {
        this.points.push(Point.parse(line));
      }
    });
    // console.log(`points (${this.points.length}): ${this.points.map(pt => `[${pt.x},${pt.y}]`).join(", ")}`);
    // console.log(`folds: ${this.folds.map(pt => `[${pt.x},${pt.y}]`).join(", ")}`);
  }

  processFolds() {
    this.folds.forEach(fold => {
      const isXFold = fold.x >= 0;
      this.points.sort((a, b) => a.compare(b, isXFold));
      const first = this.points.findIndex(pt => isXFold ? pt.x > fold.x: pt.y > fold.y);
      if (first !== -1) {
        const ptsToFold = this.points.splice(first);
        ptsToFold.forEach(oldPt => {
          const newPt = isXFold ?  new Point(fold.x - (oldPt.x - fold.x), oldPt.y): new Point(oldPt.x, fold.y - (oldPt.y - fold.y));
          if (!this.points.find(pt => pt.compare(newPt) === 0)) {
            this.points.push(newPt);
          }
        });
      }
    });
  }

  partOne() {
    console.log("Part 1");
    this.loadData("day13.txt");
    this.folds.length = 1;
    this.processFolds();
    console.log(`num points: ${this.points.length}`);
  }

  partTwo() {
    console.log("Part 2");
    this.loadData("day13.txt");
    this.processFolds();
    // console.log(`num points: ${this.points.length}`);
    const max = this.points.reduce((acc, pt) => {
      acc.x = Math.max(acc.x, pt.x);
      acc.y = Math.max(acc.y, pt.y);
      return acc;
    }, new Point(0, 0));
    // console.log(`maxX: ${max.x} maxY: ${max.y}`);
    const output: string[][] = [];
    for (let y=0; y <= max.y; ++y) {
      output.push((new Array(max.x+1)).fill(" "));
    }
    this.points.forEach(pt => output[pt.y][pt.x] = "#");
    console.log(output.map(row => row.join("")).join("\n"));
  }

  static go() {
    const d = new Day13();
    d.partOne();
    d.partTwo();
  }
}

Day13.go();
