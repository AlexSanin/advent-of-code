const fs = require('fs');

const filename = 'input.txt';

const input = fs.readFileSync(filename, 'utf8').trim().split('\n');

const parseDataLine = (line) => {
  return line.split(':')[1]
    .trim()
    .split(' ')
    .filter(item => item)
    .map(Number);
};

const parseDataLinePart2 = (line) => {
  return parseInt(
    line
      .split(":")[1]
      .trim()
      .split(" ")
      .filter((item) => item)
      .reduce((acc, val) => acc + val)
  );
};

const computeDistance = (timePressed, maxTime) => {
  return timePressed * (maxTime - timePressed);
};

const calculateWinCounts = (timeValues, distanceRecords) => {
  return timeValues.map((time, index) => {
    const recordDistance = distanceRecords[index];
    let winCount = 0;

    for (let currentTime = 0; currentTime <= time; currentTime++) {
      const distance = computeDistance(currentTime, time);
      if (distance > recordDistance) {
        winCount++;
      }
    }

    return winCount;
  });
};

const calculateResult = (winCounts) => {
  return winCounts.reduce((product, count) => product * count, 1);
};

function part1(input) {
  const [timesLine, distancesLine] = input;
  const timeValues = parseDataLine(timesLine);
  const distanceRecords = parseDataLine(distancesLine);

  const winCounts = calculateWinCounts(timeValues, distanceRecords);
  const result = calculateResult(winCounts);
  return result
};


function part2(input) {
  const [times, distances] = input;
  const time = parseDataLinePart2(times);
  const recordDistance = parseDataLinePart2(distances);

  let raceWinCount = 0;

  for (let i = 0; i <= time; i++) {
    const distance = computeDistance(i, time);

    if (distance > recordDistance) {
      raceWinCount++;
    }
  }
  return raceWinCount
}

console.log("Part 1 result: ", part1(input));
console.log("Part 2 result: ", part2(input));
