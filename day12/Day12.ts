import { readFileSync } from "fs";

class Node {
  name: string;
  connections: string[];

  constructor(name: string) {
    this.name = name;
    this.connections = [];
  }
}

class Day12 {
  graph = new Map<string, Node>();
  numPaths = 0;

  constructor() {
    this.loadData("day12_ex1.txt");
  }

  addNode(name: string, connection: string) {
    let node = this.graph.get(name);
    if (!node) {
      node = new Node(name);
      this.graph.set(name, node);
    }
    if (connection !== "start" && name !== "end")
      node.connections.push(connection);
      node.connections.sort();
  }

  loadData(fileName: string) {
    this.graph.clear();
    const lines: string[] = readFileSync(fileName, "utf8").split("\n");
    lines.forEach((line) => {
      const [name1, name2] = line.split("-");
      this.addNode(name1, name2);
      this.addNode(name2, name1);
    });
    // this.graph.forEach(node => console.log(`node: ${node.name} => [${node.connections.join(",")}]`));
  }

  isLowercase(name: string) {
    return name === name.toLowerCase();
  }

  traverseNode(node: Node | undefined, seen: Node[], part1: boolean) {
    if (!node)
      return;

    if (node.name === "end") {
      // console.log(`${seen.map(n => n.name).join(",")},end`);
      this.numPaths += 1;
      return;
    }

    if (this.isLowercase(node.name)) {
      if (part1) {
        if (seen.includes(node))
          return;
      } else {
        //return if seen already has a repeated lowercase path and (this name matches it or this name already in seen)
        const counts = new Map<string, number>();
        const lowercases = seen.map(node => node.name).filter(name => this.isLowercase(name)).sort();
        lowercases.forEach(name => counts.set(name, (counts.get(name) ?? 0) + 1));
        const hasRepeated = Array.from(counts.values()).includes(2);
        if ((counts.get(node.name) === 2) || (hasRepeated && counts.get(node.name) === 1))
          return;
      }
    }

    node.connections.forEach(connection => this.traverseNode(this.graph.get(connection), [...seen, node], part1));
  }

  partOne() {
    console.log("Part 1");
    this.numPaths = 0;
    this.traverseNode(this.graph.get("start"), [], true);
    console.log(`num paths: ${this.numPaths}`);
  }

  partTwo() {
    console.log("Part 2");
    this.numPaths = 0;
    this.traverseNode(this.graph.get("start"), [], false);
    console.log(`num paths: ${this.numPaths}`);
  }

  static go() {
    const d = new Day12();
    d.partOne();
    d.partTwo();
  }
}

Day12.go();
