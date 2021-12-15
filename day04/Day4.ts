type NumberInfo = {
  value: number
  row: number
  col: number
}

class Board {
  public numbers: number[][]
  public won = false
  public winValue?: number
  public boardIdx: number

  private numberLookup: {[key: number]: NumberInfo} = {}
  private markedNumbers = new Set<NumberInfo>()
  private unmarkedNumbers = new Set<NumberInfo>()

  constructor(numbers: number[][], boardIdx: number) {
      this.numbers = numbers
      this.boardIdx = boardIdx
      numbers.forEach((row, rowIdx) => {
          row.forEach((num, colIdx) => {
              const numInfo = {value: num, row: rowIdx, col: colIdx}
              this.numberLookup[num] = numInfo
              this.unmarkedNumbers.add(numInfo)
          })
      })
  }

  public mark(num: number) {
      if (this.numberLookup[num] == null) return false

      this.unmarkedNumbers.delete(this.numberLookup[num])
      this.markedNumbers.add(this.numberLookup[num])
      this.won = this.didWin()
      if (this.won && this.winValue == null) {
          this.winValue = this.calculateWinValue(num)
      }
      return this.won
  }

  public toString() {
      return this.numbers.map(it => it.join(", ")).join("\n")
  }

  private calculateWinValue(lastCalled: number) {
      let unmarkedTotal = 0
      this.unmarkedNumbers.forEach(it => unmarkedTotal += it.value)
      return unmarkedTotal * lastCalled
  }

  private didWin() {
      const rowLookup = Array(5)
      const colLookup = Array(5)
      this.markedNumbers.forEach(it => {
          rowLookup[it.row] = (rowLookup[it.row] ?? 0) + 1
          colLookup[it.col] = (colLookup[it.col] ?? 0) + 1
      })
      return rowLookup.includes(5) || colLookup.includes(5)
  }
}

class Day4 {
  numbers: number[] = [];
  boards: Board[] = [];

  constructor() {
    const data: string = Deno.readTextFileSync('day4.txt');
    const lines = data.split("\n\n");
    const nums = lines.shift();
    if (nums) {
      this.numbers = nums.split(",").map(Number);
    }
    lines.forEach((boardStr: string) => {
      const board: number[][] = [];
      const rows = boardStr.split("\n");
      rows.forEach((row: string) => {
        const vals = row.trim().replaceAll("  ", " ").split(" ").map(Number);
        if (vals.length === 5) {
          board.push(vals);
        }
      });
      this.boards.push(new Board(board, this.boards.length));
    });
    console.log(`numbers: ${this.numbers.length}`);
    console.log(`boards: ${this.boards.length}`);
  }

  partOne() {
    let winnerFound = false;
    this.numbers.forEach((currNumber) => {
      if (!winnerFound)
        this.boards.forEach((board) => {
          if (!board.won && board.mark(currNumber)) {
            console.log(`Part One winner! board:${board.boardIdx} winValue: ${board.winValue}`);
            winnerFound = true;
          }
      });
    });
  }

  partTwo() {
    let lastIdx = -1;
    this.numbers.forEach((currNumber) => {
      this.boards.forEach((board) => {
        if (!board.won && board.mark(currNumber)) {
          lastIdx = board.boardIdx;
        }
      });
    });

    if (lastIdx !== -1) {
      const winner = this.boards[lastIdx];
      console.log(`Part Two winner! board:${winner.boardIdx} winValue: ${winner.winValue}`);
    }
  }

  static go() {
    const day4 = new Day4();
    day4.partOne();
    day4.partTwo();
  }
}

Day4.go();