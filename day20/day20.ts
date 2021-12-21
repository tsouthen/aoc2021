import { readFileSync } from "fs";

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

  getAdjacentPixels(image: number[][], x: number, y: number, fill: number) {
    const adjacents: number[] = [];
    for (let currY = y - 1; currY <= y + 1; ++currY) {
      for (let currX = x - 1; currX <= x + 1; ++currX) {
        adjacents.push(image[currY]?.[currX] ?? fill);
      }
    }
    return adjacents;
  }

  applyAlgorithm(image: number[][], row: number[], rowIdx: number, fill: number) {
    return row.map((_val, colIdx) => {
      const strLookupVal = this.getAdjacentPixels(image, colIdx, rowIdx, fill).map(String).join("");
      return this.algorithm[Number.parseInt(strLookupVal, 2)];
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
      if (fill === 0 && this.algorithm[0] === 1)
        fill = 1;
      else if (fill === 1 && this.algorithm[511] === 0)
        fill = 0;
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
