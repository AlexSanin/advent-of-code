import { readFileSync } from 'node:fs';

const filename = 'input1.txt';
const input = readFileSync(filename, 'utf8').trim().split('\n');

const expandUniverse = (scale = 2) => {
  const rowExpansionMap = new Set();
  const columnOffsets = new Array(input[0].length).fill(0);
  const galaxies = [];

  input.forEach((line, rowIndex) => {
    if (line.includes('#')) {
      [...line.matchAll(/#/g)].forEach(match => {
        const expandedRow = rowIndex + rowExpansionMap.size * (scale - 1);
        galaxies.push({ row: expandedRow, col: match.index });
      });
    } 
    else {
      rowExpansionMap.add(rowIndex);
    }
  });

  let additionalColumns = 0;
  columnOffsets.forEach((_, index) => {
    if (!input.some(row => row[index] === '#')) {
      additionalColumns += scale - 1;
    }
    columnOffsets[index] = additionalColumns;
  });

  galaxies.forEach(galaxy => {
    galaxy.col += columnOffsets[galaxy.col];
  });

  return galaxies;
};

const calculateDistance = (point1, point2) => {
  return Math.abs(point1.row - point2.row) + Math.abs(point1.col - point2.col);
};

const sumOfAllDistances = (galaxies) => {
  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      sum += calculateDistance(galaxies[i], galaxies[j]);
    }
  }
  return sum;
};


const galaxies = expandUniverse();
const totalDistance = sumOfAllDistances(galaxies);
console.log(totalDistance);

//const galaxies2 = expandUniverse(1_000_001);
//const totalDistance2 = sumOfAllDistances(galaxies2);
//console.log(totalDistance2);
