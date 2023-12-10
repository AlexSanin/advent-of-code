import { readFileSync } from 'node:fs'

const filename = 'input.txt'

const input = readFileSync(filename, 'utf8').trim().split('\n')

function parseLines(input) {
  return input.map(str => str.split(' ').map(Number));
}

function generateSequences(sequence) {
    if (sequence.length <= 1 || sequence.every(val => val === sequence[0])) {
        return [sequence];
    }

    const newSequence = [];
    for (let i = 1; i < sequence.length; i++) {
        newSequence.push(sequence[i] - sequence[i - 1]);
    }

    return [sequence, ...generateSequences(newSequence)];
}

function extrapolatePreviousValue(sequences) {
    for (let i = sequences.length - 1; i > 0; i--) {
        const diff = sequences[i][0];
        const newFirstValue = sequences[i - 1][0] - diff;
        sequences[i - 1].unshift(newFirstValue);
    }

    return sequences[0][0];
}

function calculatePreviousValue(history) {
    const sequences = generateSequences(history);
    return extrapolatePreviousValue(sequences);
}

function predictPreviousValues(histories) {
    return histories.map(calculatePreviousValue);
}

const histories = parseLines(input);

const previousValues = predictPreviousValues(histories);
const sum = previousValues.reduce((acc, val) => acc + val, 0);
console.log(sum);
