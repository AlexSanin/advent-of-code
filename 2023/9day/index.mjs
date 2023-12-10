import { readFileSync } from 'node:fs'

const filename = 'input.txt'

const input = readFileSync(filename, 'utf8').trim().split('\n')

function parseLines(input) {
  return input.map(str => str.split(' ').map(Number));
}

function calculateNextValue(history) {
  const sequences = generateSequences(history);
  return extrapolateNextValue(sequences);
}

function generateSequences(sequence) {
  if (sequence.every(val => val === 0)) {
    return [sequence];
  }

  const newSequence = [];
  for (let i = 1; i < sequence.length; i++) {
    newSequence.push(sequence[i] - sequence[i - 1]);
  }

  return [sequence, ...generateSequences(newSequence)];
}

function extrapolateNextValue(sequences, index = sequences.length - 2) {
  if (index < 0) {
    return sequences[0][sequences[0].length - 1];
  }

  const lastValue = sequences[index][sequences[index].length - 1];
  const diff = sequences[index + 1][sequences[index + 1].length - 1];
  sequences[index].push(lastValue + diff);

  return extrapolateNextValue(sequences, index - 1);
}


function predictNextValues(histories) {
  return histories.map(calculateNextValue);
}

const histories = parseLines(input);

const nextValues = predictNextValues(histories);

const sum = nextValues.reduce((acc, val) => acc + val, 0);
console.log(sum); 
