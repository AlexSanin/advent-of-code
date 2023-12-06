const fs = require('fs');

const filename = 'input1.txt';

const input = fs.readFileSync(filename, 'utf8').trim().split('\n\n');

const seedValues = input.shift().split(': ')[1].split(' ').map(Number);
const seeds = []

for (let i = 0; i < seedValues.length; i += 2) {
  seeds.push({
    start: +seedValues[i],
    length: +seedValues[i + 1]
  })
}

function parseInputData(line) {
  const [dest, src, range] = line.split(' ').map(Number)

  return { dest, src, range };
}

//function to create graph like data stucture.
function parseMap(section) {
  const lines = section.split('\n').filter(s => s);
  const [from, _, to] = lines.shift().split(' ')[0].split('-');
  return { from, to, map: lines.map(parseInputData) };
}

/*
  * here we use approach to get negative ranges
  * this will help us fill the gap between ranges and increase performance
  * start = 0
  * [{dest: 0, src: 0, range: 50}]
  * start = 98 
  * [{dest: 52, src: 50, range: 48}]
  *
  * ranges [ { dest: 52, src: 50, range: 48 }, { dest: 50, src: 98, range: 2 } ]
  * negativeRanges [
  *   { src: 0, dest: 0, range: 50 },
  *   { dest: 52, src: 50, range: 48 },
  *   { dest: 50, src: 98, range: 2 }
  * ]
  */
function createNegativeRanges(ranges) {
  ranges.sort((a, b) => a.src - b.src);
  let start = 0;
  ranges.forEach((range, index) => {
    if (range.src > start) {
      ranges.splice(index, 0, {
        src: start,
        dest: start,
        range: range.src - start,
      });
    }
    start = range.src + range.range;
  })

  return ranges;
}

function findPath(value, range, name, map) {
  if (!map[name]) {
    return [value, range]
  }

  const item = map[name]
  const rangeItem = item.map.find((i) => i.src <= value && value < i.src + i.range)
  if (rangeItem) {
    const diff = value - rangeItem.src
    const newValue = rangeItem.dest + diff
    return findPath(newValue, Math.min(range, rangeItem.range - diff), item.to, map)
  }
  return findPath(value, 1, item.to, map)
}


const parsed = input.map(section => parseMap(section))
parsed.forEach((p) => {
  p.map = createNegativeRanges(p.map)
})
const parsedMap = parsed.reduce((acc, item) => {
  acc[item.from] = item
  return acc
}, {})

let lowest = Infinity
for (const seed of seeds) {
  let remaining = seed.length
  let start = seed.start
  while (remaining > 0) {
    const [startLocation, consumed] = findPath(start, remaining, 'seed', parsedMap)
    remaining -= consumed
    start += consumed
    if (startLocation < lowest) {
      lowest = startLocation
    }
  }
}

console.log(lowest)

