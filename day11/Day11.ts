import { readFileSync } from "fs";

interface Point {
  x: number;
  y: number;
}

class Day11 {
  data: number[][] = [];
  maxX = 0;
  maxY = 0;

  loadData(fileName: string) {
    this.data = [];
    const lines: string[] = readFileSync(fileName, "utf8").split("\n");
    lines.forEach((line) => this.data.push(Array.from(line).map(Number)));
    this.maxX = this.data[0].length;
    this.maxY = this.data.length;
  }

  getAdjacentCoords(pt: Point) {
    const adjacents: Point[] = [];
    for (const [currX, currY] of [[pt.x-1, pt.y-1], [pt.x-1, pt.y], [pt.x-1, pt.y+1], [pt.x, pt.y-1], [pt.x, pt.y+1], [pt.x+1, pt.y-1], [pt.x+1, pt.y], [pt.x+1, pt.y+1]]) {
      if (currX >= 0 && currX < this.maxX && currY >= 0 && currY < this.maxY)
        adjacents.push({x: currX, y: currY});
    }
    return adjacents;
  }

  getPointValue(pt: Point) {
    return this.data[pt.y][pt.x];
  }

  setPointValue(pt: Point, value: number) {
    this.data[pt.y][pt.x] = value;
  }

  incrementPointValue(pt: Point) {
    this.setPointValue(pt, this.getPointValue(pt) + 1);
  }

  isPointInList(pt: Point, list: Point[]) {
    return list.some(v => v.x === pt.x && v.y === pt.y);
  }

  getFlashes() {
    const pts: Point[] = [];
    for (let x = 0; x < this.maxX; ++x) {
      for (let y = 0; y < this.maxY; ++y) {
        const pt = { x, y };
        if (this.getPointValue(pt) > 9) {
          pts.push(pt);
        }
      }
    }
    return pts;
  }

  incrementAll() {
    // increase energy by 1 for every entry
    for (let x = 0; x < this.maxX; ++x) {
      for (let y = 0; y < this.maxY; ++y) {
        const pt = {x, y};
        this.incrementPointValue(pt);
      }
    }
  }

  processFlashes() {
    let numFlashed = 0;
    // flash entries and adjacents
    let flashes = this.getFlashes();
    while (flashes.length > 0) {
      numFlashed += flashes.length;
      flashes.forEach(pt => this.setPointValue(pt, 0));
      const newFlashes : Point[] = [];
      flashes.forEach(pt => {
        const adjacents = this.getAdjacentCoords(pt).filter(pt => this.getPointValue(pt) !== 0);
        adjacents.forEach(pt => this.incrementPointValue(pt));
        const adjFlashes = adjacents.filter(pt => this.getPointValue(pt) > 9 && !this.isPointInList(pt, newFlashes));
        newFlashes.push(...adjFlashes);
      });
      flashes = newFlashes;
    }
    return numFlashed;
  }

  partOne() {
    console.log("Part 1");
    this.loadData("day11.txt");
    let totalFlashes = 0;

    for (let step = 0; step < 100; ++step) {
      this.incrementAll();
      totalFlashes += this.processFlashes();
    }
    console.log(`total flashes: ${totalFlashes}`);
  }

  partTwo() {
    console.log("Part 2");
    this.loadData("day11.txt");
    for (let step = 0; step < 2000; ++step) {
      this.incrementAll();
      const numFlashed = this.processFlashes();
      if (numFlashed === (this.maxX * this.maxY)) {
        console.log(`numFlashed: ${numFlashed} step: ${step + 1}`);
        break;
      }
    }    
  }

  static go() {
    const d = new Day11();
    d.partOne();
    d.partTwo();
  }
}

Day11.go();
