import { readFileSync } from "fs";

class CharCounts extends Map<string, number> {
  add(char: string, value: number) {
    this.set(char, value + (this.get(char) ?? 0));
  }
  
  increment(char: string) {
    this.add(char, 1);
  }

  addOther(counts: CharCounts) {
    counts.forEach((count, char) => this.add(char, count));
  }

  static combine(c1: CharCounts, c2: CharCounts) {
    const newCounts = new CharCounts(c1);
    newCounts.addOther(c2);
    return newCounts;
  }

  toString() {
    const keys = Array.from(this.keys()).sort();
    const keyVals = keys.map(key => `${key}:${this.get(key)??0}`);
    return keyVals.join(", ");
  }
}

class PairCountCache extends Map<number, Map<string, CharCounts>> {
  setCounts(depth: number, pair: string, counts: CharCounts) {
    let pairCounts = this.get(depth);
    if (!pairCounts) {
      pairCounts = new Map<string, CharCounts>();
      this.set(depth, pairCounts);
    }
    pairCounts.set(pair, counts);
  }

  getCounts(depth: number, pair: string) {
    const pairCounts = this.get(depth);
    if (pairCounts) {
      return pairCounts.get(pair);
    }
  }
}

class Day14 {
  template = "";
  insertionMap = new Map<string, string>();

  loadData(fileName: string) {
    this.template = "";
    this.insertionMap.clear();
    const lines: string[] = readFileSync(fileName, "utf8").split("\n");
    lines.forEach((line) => {
      if (line.length === 0)
        return;

      if (this.template.length === 0) {
        this.template = line;
        return;
      }
      const [pair, insert] = line.split(" -> ");
      this.insertionMap.set(pair, insert);
    });
    console.log(`template: ${this.template} num pairs: ${this.insertionMap.size}`);
  }

  getInsertions(current: string[]) {
    const insertions = new Array<string>();
    for (let idx = 0; idx < current.length - 1; ++idx) {
      const key = current[idx] + current[idx+1];
      const insert = this.insertionMap.get(key);
      if (insert !== undefined)
        insertions.push(insert);
    }
    return insertions;
  }

  combine(current: string[], insertions: string[]) {
    return current.map((char, index) => {
      if (index < insertions.length)
        return [char, insertions[index]];
      else
        return [char];
    }).flat();
  }

  addCounts(counts: Map<string, number>, insertions: string[]) {
    insertions.forEach(char => counts.set(char, 1 + (counts.get(char) ?? 0)));
  }

  partOne() {
    console.log("Part 1");
    this.loadData("day14_ex.txt");
    const counts = new Map<string, number>();
    let current = Array.from(this.template);
    this.addCounts(counts, current);

    for (let step = 0; step < 10; ++step) {
      const insertions = this.getInsertions(current);
      this.addCounts(counts, insertions);
      current = this.combine(current, insertions);
      // console.log(`${step+1}: ${current.join("")}`);
      // console.log(`${step+1}: ${Array.from(counts.entries()).map(entry => `${entry[0]}:${entry[1]}`).join(", ")}`);
    }
    const [min, max] = Array.from(counts.entries()).reduce((acc, entry) => [Math.min(acc[0], entry[1]), Math.max(acc[1], entry[1])], [current.length, 0]);
    console.log(`max:${max} - min:${min} = ${max - min}`);
  }

  processPair(pair: string, depth: number, maxDepth: number, pairCountCache: PairCountCache) {
    // see if we already have the counts for this pair cached
    const pairCounts = pairCountCache.getCounts(depth, pair);
    if (pairCounts) {
      return pairCounts;
    }

    if (depth < maxDepth) {
      const insert = this.insertionMap.get(pair);
      if (insert === undefined)
        throw new Error(`Insertion map lookup failed for pair: ${pair}`);
        
      const p1Counts = this.processPair(pair[0] + insert, depth + 1, maxDepth, pairCountCache);
      const p2Counts = this.processPair(insert + pair[1], depth + 1, maxDepth, pairCountCache,);

      //add the counts of the two pairs, and cache it
      const newCounts = CharCounts.combine(p1Counts, p2Counts);
      pairCountCache.setCounts(depth, pair, newCounts);
      return newCounts;
    }

    // set the counts for this leaf node to just the right hand part of the pair
    const charCounts = new CharCounts();
    charCounts.set(pair[1], 1);
    pairCountCache.setCounts(depth, pair, charCounts);
    return charCounts;
  }

  partTwo() {
    console.log("Part 2");
    this.loadData("day14_ex.txt");
    const pairCountCache = new PairCountCache();
    const totalCounts = new CharCounts();
    const template = Array.from(this.template);

    const start = Date.now();
    const pair = template.splice(0, 2);
    totalCounts.increment(pair[0]); // add first character to the totals, as each node in the cache has the right hand stuff
    do {
      const counts = this.processPair(pair.join(""), 0, 40, pairCountCache);
      totalCounts.addOther(counts);
      const next = template.shift();
      if (next !== undefined)
        pair.push(next);
      pair.shift();
    } while (pair.length === 2);
    console.log(`final: ${totalCounts.toString()}`);
    const [min, max] = Array.from(totalCounts.entries()).reduce((acc, entry) => [acc[0] < 0 ? entry[1] : Math.min(acc[0], entry[1]), Math.max(acc[1], entry[1])], [-1, 0]);
    console.log(`max:${max} - min:${min} = ${max - min}`);
    const end = Date.now();
    console.log(`elapsed: ${(end - start) / 1000}`);
  }

  static go() {
    const d = new Day14();
    d.partOne();
    d.partTwo();
  }
}

Day14.go();
