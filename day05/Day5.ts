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

class Line {
  from = new Point();
  to = new Point();

  static parse(input: string) {
    const line = new Line();
    const vals = input.trim().split("->");
    if (vals.length === 2) {
      line.from = Point.parse(vals[0]);
      line.to = Point.parse(vals[1]);
    } else {
      throw `Line doesn't have 2 vals: ${input}`;
    }
    return line;
  }

  getPoints(allowDiagonal = false): Point[] {
    const xIncr = this.to.x === this.from.x ? 0 : this.to.x > this.from.x ? 1: -1;
    const yIncr = this.to.y === this.from.y ? 0 : this.to.y > this.from.y ? 1: -1;

    if (!allowDiagonal && xIncr !== 0 && yIncr !== 0)
      return [];

    const pts: Point[] = [];
    let currPt = new Point(this.from.x, this.from.y);
    pts.push(currPt);
    while (!currPt.equals(this.to)) {
      currPt = new Point(currPt.x + xIncr, currPt.y + yIncr);
      pts.push(currPt);
    }
    return pts;
  }
}

class Day5 {
    lines: Line[] = [];
    diagram: number[][] = [];

    constructor() {
      this.loadData("day5_ex.txt");
    }

    initDiagram() {
      const max = new Point();
      this.lines.forEach((line) => {
        max.x = Math.max(max.x, line.from.x, line.to.x);
        max.y = Math.max(max.y, line.from.y, line.to.y);
      });
      this.diagram = [];
      for (let ii=0; ii <= max.y; ii++) {
        this.diagram.push(new Array<number>(max.x + 1).fill(0));
      }
    }

    loadData(fileName: string) {      
      const data = readFileSync(fileName, "utf8").split("\n");
      data.forEach((dataStr) => {
        if (dataStr.length > 0)
          this.lines.push(Line.parse(dataStr));
      });
    }

    printDiagram() {
      this.diagram.forEach((row) => {
        const output = row.map(val => val ? val.toString() : ".").join("");
        console.log(output);
      })
    }

    countGreaterThan(input: number) {
      let count = 0;
      this.diagram.forEach((row) => {
        row.forEach((val) => {
          if (val > input)
            count += 1;
        });
      });
      return count;
    }

    doIt(allowDiagonal: boolean) {
      this.initDiagram();
      this.lines.forEach((line) => {       
        // increment diagram values for each line
        line.getPoints(allowDiagonal).forEach((pt) => {
          this.diagram[pt.y][pt.x] = this.diagram[pt.y][pt.x] + 1;
        });
      });
      // this.printDiagram();
      console.log(`count >= 2: ${this.countGreaterThan(1)}`);
    }

    static go() {
      const d5 = new Day5();
      console.log("Part 1");
      d5.doIt(false);
      console.log("Part 2");
      d5.doIt(true);
    }
}

Day5.go();