/*
  * | is a vertical pipe connecting north and south. => top, bottom
  * - is a horizontal pipe connecting east and west. => left, right
  * L is a 90-degree bend connecting north and east. => top, right
  * J is a 90-degree bend connecting north and west. => top, left
  * 7 is a 90-degree bend connecting south and west. => bottop, left
  * F is a 90-degree bend connecting south and east. => bottom, right
  * . is ground; there is no pipe in this tile. => ground do nothing
  * S is the starting position of the animal; 
    * there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
..F7. ['.', '.', 'bottom-right', 'bottom-left'] 
.FJ|. ['.', 'bottom-right','top-left', 'top-bottom'] 
SJ.L7
|F--J
LJ...
*/

import { readFileSync } from 'node:fs'

const filename = 'input.txt';
const lines = readFileSync(filename, 'utf8').trim().split('\n');

const MOVES = {
  '|DOWN': { deltaY: 1 },
  '|UP': { deltaY: -1 },
  '-RIGHT': { deltaX: 1 },
  '-LEFT': { deltaX: -1 },
  'LDOWN': { deltaX: 1 },
  'LLEFT': { deltaY: -1 },
  'JDOWN': { deltaX: -1 },
  'JRIGHT': { deltaY: -1 },
  '7UP': { deltaX: -1 },
  '7RIGHT': { deltaY: 1 },
  'FUP': { deltaX: 1 },
  'FLEFT': { deltaY: 1 },
};

function findStart(lines) {
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    const x = line.indexOf('S');
    if (x !== -1) {
      return { x, y };
    }
  }
}

function determineInitialDirection(lines, start) {
  const { x, y } = start;
  const below = lines[y + 1]?.[x];
  if (['|', 'L', 'J'].includes(below)) {
    return { direction: 'DOWN', x, y: y + 1 };
  }

  const above = lines[y - 1]?.[x];
  if (['|', 'F', '7'].includes(above)) {
    return { direction: 'UP', x, y: y - 1 };
  }

  // Default to RIGHT if no other direction is applicable
  return { direction: 'RIGHT', x: x + 1, y };
}

function getNextPosition(char, direction, x, y) {

  const move = MOVES[`${char}${direction}`];

  return {
    x: x + (move.deltaX || 0),
    y: y + (move.deltaY || 0),
    direction: getDirection(move.deltaX, move.deltaY)
  };
}

function getDirection(deltaX, deltaY) {
  if (deltaY === 1) return 'DOWN';
  if (deltaY === -1) return 'UP';
  if (deltaX === -1) return 'LEFT';
  return 'RIGHT'; // Default case
}

function tracePath(lines, start) {
  let { x, y, direction } = determineInitialDirection(lines, start);
  const path = [start, { x, y }];
  let steps = 1;

  while (x !== start.x || y !== start.y) {
    const char = lines[y][x];
    ({ x, y, direction } = getNextPosition(char, direction, x, y));
    steps++;
    path.push({ x, y });
  }

  console.log('Steps:', steps / 2);
}

const start = findStart(lines);
tracePath(lines, start);
