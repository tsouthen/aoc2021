import { readFileSync } from "fs";

interface Point {
  x: number;
  y: number;
}

class Day9 {
  data: number[][] = [];
  maxX: number;
  maxY: number;

  constructor() {
    this.loadData("day9.txt");
    this.maxX = this.data[0].length;
    this.maxY = this.data.length;
  }

  loadData(fileName: string) {
    const lines: string[] = readFileSync(fileName, "utf8").split("\n");
    lines.forEach((line) => this.data.push(Array.from(line).map(Number)));
  }

  getAdjacentCoords(pt: Point) {
    const adjacents: Point[] = [];
    for (const [currX, currY] of [[pt.x-1, pt.y], [pt.x+1, pt.y], [pt.x, pt.y-1], [pt.x, pt.y+1]]) {
      if (currX >= 0 && currX < this.maxX && currY >= 0 && currY < this.maxY)
        adjacents.push({x: currX, y: currY});
    }
    return adjacents;
  }

  getPointValue(pt: Point) {
    return this.data[pt.y][pt.x];
  }

  isPointInList(pt: Point, list: Point[]) {
    return list.some(v => v.x === pt.x && v.y === pt.y);
  }

  printPointList(list: Point[]) {
    console.log(list.map(pt => `${pt.x},${pt.y}:${this.getPointValue(pt)}`).join("|"));
  }

  partOne() {
    let score = 0;
    for (let x = 0; x < this.maxX; ++x) {
      for (let y = 0; y < this.maxY; ++y) {
        const currVal = this.getPointValue({x, y});
        const adjacents = this.getAdjacentCoords({x, y}).map(pt => this.getPointValue(pt));
        if (!adjacents.some(v => v <= currVal)) {
          score += currVal + 1;
        }
      }
    }
    console.log(score);
  }

  getBasin(pt: Point, seen: Point[]) {
    if (this.getPointValue(pt) === 9 || this.isPointInList(pt, seen))
      return seen;
    seen.push(pt);
    this.getAdjacentCoords(pt)
      .filter(v => (this.getPointValue(v) !== 9) && !this.isPointInList(v, seen))
      .forEach(v => this.getBasin(v, seen));
  }

  partTwo() {
    const basins: Point[][] = [];
    for (let x = 0; x < this.maxX; ++x) {
      for (let y = 0; y < this.maxY; ++y) {
        const pt = {x, y};
        if (!basins.some(b => this.isPointInList(pt, b))) {
          const basin: Point[] = [];
          this.getBasin(pt, basin);
          if (basin.length > 1) {
            basins.push(basin);
          }
        }
      }
    }
    const score = basins.map(b => b.length).sort((a, b) => a - b).slice(-3).reduce((acc, curr) => acc * curr, 1);
    console.log(score);
  }

  static go() {
    const d6 = new Day9();
    console.log("Part 1");
    d6.partOne();
    console.log("Part 2");
    d6.partTwo();
  }
}

Day9.go();
