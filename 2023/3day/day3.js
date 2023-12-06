const fs = require('fs');

const filename = 'input.txt';

// Read the file and split into lines
const lines = fs.readFileSync(filename, 'utf8').trim();

function parseEntities(inputString) {
  const entities = [];
  inputString.split('\n').forEach((line, y) => {
    [...line.matchAll(/\d+|[^0-9\.]/g)].forEach(match => {
      entities.push({
        type: /\d/.test(match[0]) ? 'number' : 'symbol',
        x: match.index,
        y,
        token: match[0],
        value: /\d/.test(match[0]) ? parseInt(match[0], 10) : null
      });
    });
  });
  return entities;
}

function isAdjacent(entity1, entity2) {
  const [minX, maxX] = [entity1.x - 1, entity1.x + (entity1.type === 'number' ? entity1.token.length : 1)];
  const [minY, maxY] = [entity1.y - 1, entity1.y + 1];
  return entity2.x >= minX && entity2.x <= maxX && entity2.y >= minY && entity2.y <= maxY;
}

function part1(inputString) {
  const entities = parseEntities(inputString);
  return entities
    .filter(e => e.type === 'number' && entities.some(s => s.type === 'symbol' && isAdjacent(e, s)))
    .reduce((sum, num) => sum + num.value, 0);
}

function part2(inputString) {
  const entities = parseEntities(inputString);
  return entities
    .filter(e => e.type === 'symbol' && e.token === '*')
    .map(symbol => {
      const adjacentNumbers = entities.filter(n => n.type === 'number' && isAdjacent(n, symbol)).map(n => n.value);
      return adjacentNumbers.length === 2 ? adjacentNumbers[0] * adjacentNumbers[1] : 0;
    })
    .reduce((sum, product) => sum + product, 0);
}
console.log('part2', part2(lines))
