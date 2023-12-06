const fs = require('fs');

const filename = 'input-day2.txt';

// Read the file and split into lines
const lines = fs.readFileSync(filename, 'utf8').trim().split('\n');

const games = lines.map(line => {
  const parts = line.split(': ');
  return parts.length > 1 ? parts[1].split('; ') : [];
});

function part1(games) {
  let answer = 0;
  const bag = { "red": 12, "blue": 14, "green": 13 };
  const gameCounts = [];

  games.forEach((game, index) => {
    const counts = {};
    game.forEach(pulls => {
      pulls.split(', ').forEach(pull => {
        const [countStr, color] = pull.split(' ');
        const count = parseInt(countStr, 10);

        if (!counts[color] || counts[color] < count) {
          counts[color] = count;
        }
      });
    });

    const isValidGame = Object.keys(bag).every(k => !counts[k] || bag[k] >= counts[k]);
    if (isValidGame) {
      answer += index + 1;
    }

    gameCounts.push(counts);
  });

  return [answer, gameCounts];
}

function part2(games) {
  let answer = 0;

  games.forEach((game) => {
    const counts = {};
    let product = 1;
    game.forEach(pulls => {
      pulls.split(', ').forEach(pull => {
        const [countStr, color] = pull.split(' ');
        const count = parseInt(countStr, 10);

        if (!counts[color] || counts[color] < count) {
          counts[color] = count;
        }
      });
    });

    Object.values(counts).forEach((item) => product *= item)
    answer += product
  });

  return [answer];
}


const [part1Answer] = part1(games);
console.log("part1 answer is", part1Answer);

const [part2Answer] = part2(games);
console.log("part2 answer is", part2Answer);
