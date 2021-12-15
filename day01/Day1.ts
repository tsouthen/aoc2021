async function readInput() {
  const data: String = await Deno.readTextFile('day1.txt');
  return data.split("\n").map((line) => Number(line));
}

async function partOne(values: number[]) {
  var increases = 0;
  var prevValue = 0;
  for (const val of values) {
    if (val > prevValue && prevValue !== 0)
      increases++;
    prevValue = val;
  }
  console.log(`Part 1: ${increases}`);
}

async function partOneAlternate(values: number[]) {
  var increases = 0;
  for (var idx = 0; idx < values.length - 1; idx++) {
    if (values[idx+1] > values[idx])
      increases++;
  }
  console.log(`Part 1: ${increases}`);
}

async function partOneAlternate2(values: number[]) {
  const increases = values.reduce((prevValue, currValue, index) => prevValue + (index !== 0 && currValue > values[index-1] ? 1 : 0), 0);
  console.log(`Part 1: ${increases}`);
}

async function partTwo(values: number[]) {
  var increases = 0;
  for (var idx = 0; idx < values.length - 3; idx++) {
    if (values[idx + 3] > values[idx]) {
      increases++;
    }
  }
  console.log(`Part 2: ${increases}`);
}

async function partTwoAlternate(values: number[]) {
  const increases = values.reduce((prevValue, currValue, index) => prevValue + (index < (values.length - 3) && currValue < values[index+3] ? 1 : 0), 0);
  console.log(`Part 2: ${increases}`);
}

readInput().then((values) => {
  partOne(values);
  partOneAlternate2(values);
  partTwo(values);
  partTwoAlternate(values);
})
