import { readFileSync } from "fs";

interface Point {
  x: number;
  y: number;
}

class Day20 {
  algorithm: number[] = [];
  image: number[][] = [];

  constructor(fileName: string) {
    this.loadData(fileName);
  }

  loadData(fileName: string) {
    const contents = readFileSync(fileName, "utf8") as string;
    const data = contents.split("\n");
    this.algorithm = Array.from(data.shift()!).map(ch => ch === "#" ? 1 : 0);
    data.shift();
    this.image = data.map(line => Array.from(line).map(ch => ch === "#" ? 1 : 0));
  }

  getAdjacentPixels(image: number[][], pt: Point, fill: number) {
    const maxX = image[0].length;
    const maxY = image.length;
    const adjacents: number[] = [];
    for (const [currX, currY] of [
      [pt.x - 1, pt.y - 1], [pt.x, pt.y - 1], [pt.x + 1, pt.y - 1],
      [pt.x - 1, pt.y], [pt.x, pt.y], [pt.x + 1, pt.y],
      [pt.x - 1, pt.y + 1], [pt.x, pt.y + 1], [pt.x + 1, pt.y + 1],
    ]) {
      if (currX >= 0 && currX < maxX && currY >= 0 && currY < maxY)
        adjacents.push(image[currY][currX]);
      else
        adjacents.push(fill);
    }
    return adjacents;
  }

  applyAlgorithm(image: number[][], row: number[], rowIdx: number, fill: number) {
    return row.map((_val, col) => {
      const strLookupVal = this.getAdjacentPixels(image, { x: col, y: rowIdx }, fill).map(String).join("");
      const lookupVal = Number.parseInt(strLookupVal, 2);
      const newVal = this.algorithm[lookupVal];
      return newVal;
    });
  }

  expandImage(image: number[][], fill: number, extras = 1) {
    const newImage: number[][] = [];
    const width = image[0].length;
    for (let idx = 0; idx < extras; ++idx)
      newImage.push((new Array(width + (2 * extras))).fill(fill));

    const padding = (new Array(extras)).fill(fill);
    image.forEach(row => newImage.push([...padding, ...row, ...padding]));

    for (let idx = 0; idx < extras; ++idx)
      newImage.push((new Array(width + (2 * extras))).fill(fill));
    return newImage;
  }

  iterate(iterations: number) {
    let newImage = this.image;
    let fill = 0;
    for (let idx = 0; idx < iterations; ++idx) {
      newImage = this.expandImage(newImage, fill).map((row, idx, image) => this.applyAlgorithm(image, row, idx, fill));
      fill = this.algorithm[0] === 0 ? 0 : (fill + 1) % 2; //assumes this.algorithm[511] === 0, otherwise we can't do the puzzle
    }
    return newImage;
  }

  sumAll(newImage: number[][]) {
    return newImage.reduce((acc, row) => acc + row.reduce((rowCount, val) => rowCount + val, 0), 0);
  }

  partOne() {
    console.log(`Part 1 count: ${this.sumAll(this.iterate(2))}`);
  }

  partTwo() {
    console.log(`Part 2 count: ${this.sumAll(this.iterate(50))}`);
  }

  static go() {
    const d = new Day20("day20/day20_ex.txt");
    d.partOne();
    d.partTwo();
  }
}

Day20.go();
