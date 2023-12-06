const fs = require('fs');

const filename = 'input.txt';

function parseLine(line) {
  const [, winNumbers, pickedNumbers] = line.trim().split(/[:|]/);
  const draw = winNumbers.trim().split(/\s+/).map(Number);
  const card = pickedNumbers.trim().split(/\s+/).map(Number);
  return { draw, card, count: 1, wins: 0 };
}

function processData(input) {
  const data = input.split("\n").map(parseLine);

  data.forEach((entry, i) => {
    entry.draw.forEach(drawNumber => {
      if (entry.card.includes(drawNumber)) {
        entry.wins++;
      }
    });

    for (let j = 1; j <= entry.wins && i + j < data.length; j++) {
      data[i + j].count += entry.count;
    }
  });

  return data;
}

function part1(data) {
  return data.filter(e => e.wins).reduce((acc, { wins }) => acc + 2 ** (wins - 1), 0);
}

function part2(data) {
  return data.reduce((acc, { count }) => acc + count, 0);
}

function readFileAndProcess(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8').trim();
    return processData(data);
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return null;
  }
}

const processedData = readFileAndProcess(filename);
console.log('Part 1:', part1(processedData));
console.log('Part 2:', part2(processedData));
