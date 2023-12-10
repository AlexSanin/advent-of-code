
const fs = require('fs');

const filename = 'input.txt';

// Read the file and split into lines
const lines = fs.readFileSync(filename, 'utf8').trim().split('\n');
/*
  * iterate over each line
  * grab all numbers and their positions
  * grab all symbols and their positions
  * if I find number I do the following
    * check if prevChar or nextChar is symbol add to sum
    * check if in line above prevChar or nextChar is symbol add to sum
    * check if in line below prevChar or nextChar is symbol add to sum
*/

function part1(lines) {
  const numberPattern = /\d+/g;
  let sum = 0;

  lines.forEach((line, index) => {
    const numberMatches = [...line.matchAll(numberPattern)];
    const prevLine = lines[index - 1] || "";
    const nextLine = lines[index + 1] || "";

    numberMatches.forEach(match => {
      const number = parseInt(match[0]);
      const start_pos = match.index;
      const end_pos = start_pos + match[0].length;

      // Check for symbols adjacent to the number in the current line
      if (isSymbolAt(line, start_pos - 1) || isSymbolAt(line, end_pos)) {
        sum += number;
      } else {
        // Check for symbols in the same positions or adjacent in the previous and next lines
        for (let i = start_pos - 1; i <= end_pos; i++) {
          if ((prevLine && isSymbolAt(prevLine, i)) || (nextLine && isSymbolAt(nextLine, i))) {
            sum += number;
            break;
          }
        }
      }
    });
  });

  return sum;
}

function isSymbolAt(line, position) {
  return position >= 0 && position < line.length && /[^\d.]/.test(line[position]);
}

console.log('part1', part1())
