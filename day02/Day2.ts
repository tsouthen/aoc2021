async function readInput() {
  const data: String = await Deno.readTextFile('day2.txt');
  return data.split("\n");
}

function forEachCommand(data: string[], callbacks: { [key: string]: (distance: number) => void}) {
  for (const line of data) {
    const [command, distStr] = line.split(' ');
    const distance = Number(distStr);
    callbacks[command]?.(distance);
  }
}

async function partOne(data: string[]) {
  var depth = 0;
  var horizontal = 0;
  forEachCommand(data, {
    "forward": distance => horizontal += distance,
    "down": distance => depth += distance,
    "up": distance => depth -= distance,
  });
  console.log(`Part 1: Depth: ${depth} x Horizontal: ${horizontal} = ${depth * horizontal}`);
}

async function partTwo(data: string[]) {
  var depth = 0;
  var horizontal = 0;
  var aim = 0;
  forEachCommand(data, {
    "forward": (distance) => {
      horizontal += distance;
      depth += aim * distance;
    },
    "down": distance => aim += distance,
    "up": distance => aim -= distance,
  });
  console.log(`Part 1: Depth: ${depth} x Horizontal: ${horizontal} = ${depth * horizontal}`);
}

readInput().then((data) => {
  partOne(data);
  partTwo(data);
});
