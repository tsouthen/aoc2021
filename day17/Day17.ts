import { readFileSync } from "fs";

class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Range {
  min: Point;
  max: Point;

  constructor(min: Point = new Point(), max: Point = new Point()) {
    this.min = min;
    this.max = max;
  }

  contains(pt: Point) {
    return pt.x >= this.min.x && pt.x <= this.max.x && pt.y >= this.min.y && pt.y <= this.max.y;
  }
}

class Vector {
  position = new Point();
  velocity = new Point();

  constructor(position = new Point(), velocity = new Point()) {
    this.position = position;
    this.velocity = velocity;
  }

  step() {
    this.position.x = this.position.x + this.velocity.x;
    this.position.y = this.position.y + this.velocity.y;
    this.velocity.x = this.velocity.x + (this.velocity.x > 0 ? -1 : this.velocity.x < 0 ? 1 : 0);
    this.velocity.y = this.velocity.y - 1;
  }
}

class Day17 {
  range = new Range();

  constructor() {
    this.loadData("day17/day17_ex.txt");
  }

  loadData(fileName: string) {
    const contents = readFileSync(fileName, "utf8") as string;
    const data = contents.substr(contents.indexOf("x=") + 2).split(", y=").map(data => data.split("..").map(Number));
    this.range.min.x = data[0][0];
    this.range.max.x = data[0][1];
    this.range.min.y = data[1][0];
    this.range.max.y = data[1][1];
  }

  testTrajectory(initVel: Point) {
    let maxHeight = 0;
    const vec = new Vector(new Point(), initVel);
    do {
      vec.step();
      maxHeight = Math.max(maxHeight, vec.position.y);
      if (this.range.contains(vec.position))
        return maxHeight;
      if (vec.position.y < this.range.min.y)
        return undefined;
    } while (true);
  }

  partOneAndTwo() {
    let maxHeight = 0;
    let count = 0;
    for (let y = this.range.min.y * 2; y <= Math.abs(this.range.max.y) * 2; ++y) {
      for (let x = 1; x < this.range.max.x * 2; ++x) {
        const currHeight = this.testTrajectory(new Point(x, y));
        maxHeight = Math.max(maxHeight, currHeight ?? 0);
        if (currHeight !== undefined)
          count += 1;
      }
    }
    console.log(`Part 1 - maxHeight: ${maxHeight}`);
    console.log(`Part 2 - count: ${count}`);
  }

  static go() {
    const d = new Day17();
    d.partOneAndTwo();
  }
}

Day17.go();
