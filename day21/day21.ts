import { readFileSync } from "fs";

class Day21 {
  getStartingPositions(fileName: string) {
    const contents = readFileSync(fileName, "utf8") as string;
    return contents.split("\n").map(line => Number(line.substr(28)));
  }

  getNextRoll(roll: number) {
    let total = 0;
    for (let idx = 0; idx < 3; ++idx) {
      roll++;
      if (roll > 100)
        roll = 1;
      total += roll;
    }
    return { roll, total };
  }

  movePosition(pos: number, total: number) {
    let newPos = pos + total;
    if (newPos > 10) {
      if (newPos % 10 === 0)
        newPos = 10;
      else
        newPos = newPos % 10;
    }
    return newPos;
  }

  partOne() {
    let [p1, p2] = this.getStartingPositions("day21/day21.txt");
    let s1 = 0;
    let s2 = 0;
    let roll = 100;
    let rolls = 0;
    while (s1 < 1000 && s2 < 1000) {
      const nextRoll = this.getNextRoll(roll);
      rolls++;
      roll = nextRoll.roll;
      p1 = this.movePosition(p1, nextRoll.total);
      s1 += p1;
      console.log(`roll: ${roll} p1: ${p1} s1:${s1}`);

      if (s1 < 1000) {
        const nextRoll = this.getNextRoll(roll);
        rolls++;
        roll = nextRoll.roll;
        p2 = this.movePosition(p2, nextRoll.total);
        s2 += p2;
        console.log(`roll: ${roll} p2: ${p2} s2:${s2}`);
      }
    }
    console.log(`rolls:${rolls * 3} * min score: ${Math.min(s1, s2)} = ${rolls * 3 * Math.min(s1, s2)}`);
  }

  partTwo() {
  }

  static go() {
    const d = new Day21();
    d.partOne();
    d.partTwo();
  }
}

Day21.go();
