import { readFileSync } from "fs";

class Day10 {
  data: string[] = [];
  keyMap: Map<string, string>;
  terminators = ")]}>";

  constructor() {
    this.data = readFileSync("day10_ex.txt", "utf8").split("\n");
    this.keyMap = new Map([[")", "("], ["]", "["], ["}", "{"], [">", "<"]]);
  }

  removeMatching(line: string) {
    let newVal = line;
    let prevLength = 0;
    do {
      prevLength = newVal.length;
      newVal = newVal.replace("()", "").replace("[]", "").replace("{}", "").replace("<>", "");
    } while (newVal.length < prevLength);
    return newVal;
  }

  getFirstIllegalChar(line: string) {
    return Array.from(line).find((ch, index, chars) => {
      return this.terminators.includes(ch) && (index === 0 || chars[index-1] !== this.keyMap.get(ch));
    });
  }

  partOne() {
    console.log("Part 1");
    const p1ScoreMap = new Map([[")", 3], ["]", 57], ["}", 1197], [">", 25137]]);
    let score = 0;
    this.data.forEach((line, index) => {
      const replaced = this.removeMatching(line);
      const illegal = this.getFirstIllegalChar(replaced);
      if (illegal) {
        // console.log(`Replaced: ${replaced}`);
        score += p1ScoreMap.get(illegal) ?? 0;
        console.log(`Index: ${index} Illegal: ${illegal}`);
      }
    });
    console.log(`score: ${score}`);
  }

  partTwo() {
    console.log("Part 2");
    const p2ScoreMap = new Map([["(", 1], ["[", 2], ["{", 3], ["<", 4]]);
    const scores: number[] = [];
    this.data.forEach((line) => {
      const replaced = this.removeMatching(line);
      const illegal = this.getFirstIllegalChar(replaced);
      if (!illegal) {
        const score = Array.from(replaced).reverse().reduce((sum, ch) => sum * 5 + (p2ScoreMap.get(ch) ?? 0), 0);
        console.log(`replaced: ${replaced} score: ${score}`);
        scores.push(score);
      }
    });
    const median = scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
    console.log(`median: ${median}`);
  }

  static go() {
    const d = new Day10();
    d.partOne();
    d.partTwo();
  }
}

Day10.go();
