import { readFileSync } from "fs";
const Graph = require('node-dijkstra');

class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  keyString() {
    return `${this.x},${this.y}`;
  }
}

class Day15 {
  costs = new Array<Array<number>>();
  nodes = new Map<string, Map<string, number>>(); // map keyed off coordinates, with each value being a Map to connected nodes with cost
  maxX = 0;
  maxY = 0;

  getAdjacentCoords(pt: Point) {
    const adjacents: Point[] = [];
    for (const [currX, currY] of [[pt.x-1, pt.y], [pt.x+1, pt.y], [pt.x, pt.y-1], [pt.x, pt.y+1]]) {
      if (currX >= 0 && currX < this.maxX && currY >= 0 && currY < this.maxY)
        adjacents.push(new Point(currX, currY));
    }
    return adjacents;
  }

  loadData(fileName: string) {
    this.costs.length = 0;
    this.nodes.clear();

    const lines: string[] = readFileSync(fileName, "utf8").split("\n");
    lines.forEach((line) => {
      this.costs.push(Array.from(line).map(Number));
    });

    this.maxX = this.costs[0].length;
    this.maxY = this.costs.length;
  }

  loadNodes() {
    for (let y=0; y < this.maxY; ++y) {
      for (let x=0; x < this.maxX; ++x) {
        const pt = new Point(x, y);
        const adjacents = this.getAdjacentCoords(pt);
        const connections = new Map<string, number>();
        adjacents.forEach(adj => {
          const key = adj.keyString();
          const cost = this.costs[adj.y][adj.x];
          connections.set(key, cost);
        });
        this.nodes.set(pt.keyString(), connections);
      }
    }
  }

  findPath() {
    this.loadNodes();
    const graph = new Graph(this.nodes);
    const {path, cost} = graph.path("0,0", `${this.maxY-1},${this.maxX-1}`, {cost: true});
    if (path)
      console.log(`results: ${path.length}, cost: ${cost}`);
  }

  incrementRow(row: number[]) {
    return row.map(val => val === 9 ? 1 : val + 1);
  }

  incrementCosts(costs: number[][]) {
    return costs.map(row => this.incrementRow(row));
  }

  expandMap() {
    let newCosts: number[][] = [];
    for (let idx = 0; idx < 4; ++idx) {
      newCosts = this.incrementCosts(newCosts.length ? newCosts : this.costs);
      newCosts.forEach(row => this.costs.push(row));
    }
    for (let rowIdx = 0; rowIdx < this.costs.length; rowIdx++) {
      const row = this.costs[rowIdx];
      let newRow: number[] = [];
      for (let idx = 0; idx < 4; ++idx) {
        newRow = this.incrementRow(newRow.length ? newRow : row);
        row.push(...newRow);
      }
    }
    this.maxX = this.costs[0].length;
    this.maxY = this.costs.length;
  }

  partOne() {
    console.log("Part 1");
    this.loadData("day15/day15.txt");
    this.findPath();
  }

  partTwo() {
    console.log("Part 2");
    this.loadData("day15/day15.txt");
    this.expandMap();
    this.findPath();
  }

  static go() {
    const d = new Day15();
    d.partOne();
    d.partTwo();
  }
}

Day15.go();
