import { readFileSync } from 'node:fs'

const filename = 'input2.txt';
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

function isInsideGrid(x, y, lines) {
  return y >= 0 && y < lines.length && x >= 0 && x < lines[y].length;
}

function findStart(lines) {
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    const x = line.indexOf('S');
    if (x !== -1) {
      return { x, y };
    }
  }
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

function tracePathAndMarkLoop(lines, start) {
  let { x, y, direction } = determineInitialDirection(lines, start);
  const loopTiles = new Set([`${start.x},${start.y}`]);
  let currentPos = `${x},${y}`;

  while (!loopTiles.has(currentPos) || loopTiles.size === 1) {
    loopTiles.add(currentPos);
    const char = lines[y][x];
    ({ x, y, direction } = getNextPosition(char, direction, x, y));
    currentPos = `${x},${y}`;
  }

  return loopTiles;
}

function floodFillOutsideArea(lines, loopTiles) {
  const visited = new Set();
  const queue = [{ x: 0, y: 0 }];
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Right, Left, Down, Up

  while (queue.length > 0) {
    const { x, y } = queue.shift();
    const posKey = `${x},${y}`;
    if (!isInsideGrid(x, y, lines) || visited.has(posKey) || loopTiles.has(posKey)) {
      continue;
    }

    visited.add(posKey);
    for (const [dx, dy] of directions) {
      queue.push({ x: x + dx, y: y + dy });
    }
  }

  return visited;
}

function countEnclosedTiles(lines, loopTiles) {
  const outsideTiles = floodFillOutsideArea(lines, loopTiles);

  let enclosedCount = 0;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const posKey = `${x},${y}`;
      if (lines[y][x] === '.' && !outsideTiles.has(posKey) && !loopTiles.has(posKey)) {
        enclosedCount++;
      }
    }
  }

  return enclosedCount;
}

const start = findStart(lines);
const loopTiles = tracePathAndMarkLoop(lines, start);
const enclosedTiles = countEnclosedTiles(lines, loopTiles);
console.log('Enclosed Tiles:', enclosedTiles);
