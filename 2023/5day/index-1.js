const fs = require('fs');

const filename = 'input.txt';

const lines = fs.readFileSync(filename, 'utf8');
/*
  * get seeds
  * group each entity
  * create range map for each entity
  * check one-by-one if in map return number if no return the same number
*/

function parseInputData(data) {
  const sections = data.trim().split('\n\n');
  const seeds = sections[0].split(': ')[1].split(' ').map(Number);
  const seedToSoilMap = parseMap(sections[1]);
  const soilToFertilizerMap = parseMap(sections[2]);
  const fertilizerToWater = parseMap(sections[3]);
  const waterToLight = parseMap(sections[4]);
  const lightToTemperature = parseMap(sections[5]);
  const temperatureToHumidity = parseMap(sections[6]);
  const humidityToLocation = parseMap(sections[7]);

  return {
    seeds,
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation,
  };
}

function parseMap(section) {
  console.log('section', section)
  const lines = section.split('\n').slice(1);
  let map = {};
  lines.forEach(line => {
    const [key, ...values] = line.split(' ').map(Number);
    map[key] = values;
  });
  return map;
}

function isNumberInRange(seed, sourceRangeStart, range) {
  const lowerBound = sourceRangeStart;
  const upperBound = sourceRangeStart + range;
  return seed >= lowerBound && seed <= upperBound;
}

function findPath(seed, entity) {
  for (const [key, value] of Object.entries(entity)) {
    if (isNumberInRange(seed, value[0], value[1] - 1)) {
      const shift = key - value[0]
      return seed + shift
    }
  }
  return seed;
}

function findLowestLocation(data) {
  let lowest = null;
  let lowestLocation = Number.MAX_VALUE;

  for (const key in data) {
    if (data[key].location < lowestLocation) {
      lowestLocation = data[key].location;
      lowest = data[key];
    }
  }

  return lowest;
}

function getLocation(input) {
  const data = parseInputData(input)
  console.log('data', data)
  let seedLocation = {}
  data.seeds.map((seed) => {
    const soil = findPath(seed, data.seedToSoilMap)
    const fertilizer = findPath(soil, data.soilToFertilizerMap)
    const water = findPath(fertilizer, data.fertilizerToWater)
    const light = findPath(water, data.waterToLight)
    const temperature = findPath(light, data.lightToTemperature)
    const humidity = findPath(temperature, data.temperatureToHumidity)
    const location = findPath(humidity, data.humidityToLocation)
    seedLocation = {
      ...seedLocation,
      [seed]: {
        ...seedLocation[seed],
        location,
      }
    }
  })
  return findLowestLocation(seedLocation).location
}

const part1 = getLocation(lines, 'part1')

console.log('part1', part1)
