/*
  * CARDS: A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, 2
  * STRENGTH: 
      - Five of a kind: AAAAA => 5 same chars
      - Four of a kind: AA8AA => 4 same chars
      - Full house: 23332 => 3 same with 2 same chars
      - Three of a kind: TTT98 => 3 same chars of 5
      - Two pair: 23432 => 2 pair of 2 same chars
      - One pair: A23A4 => 2 same chars 
      - High card: 23456 => 1 highest card
  *
  * Algorithm: 
  * sort each item by strength, and assign rank from 1 to N
  * multiply each item strength by rank.
  * Summ all results
*/

import { readFileSync } from 'node:fs';

const filename = 'input.txt';
const input = readFileSync(filename, 'utf8').trim().split('\n');

const PICT_CARD_VALS = { T: 10, J: 11, Q: 12, K: 13, A: 14, };
const CARD_COUNTS = { FIVE: 5, FOUR: 4, THREE: 3, TWO: 2, ONE: 1 };
const HAND_TYPES = { FIVE_OF_A_KIND: 7, FOUR_OF_A_KIND: 6, FULL_HOUSE: 5, THREE_OF_A_KIND: 4, TWO_PAIR: 3, ONE_PAIR: 2, HIGH_CARD: 1 };

function determineHandValue(hand) {
  const handMap = getHandMap(hand);
  let hasPair = false;
  let hasThreeOfAKind = false;

  for (let key in handMap) {
    const val = handMap[key];
    if (val === CARD_COUNTS.FIVE) return HAND_TYPES.FIVE_OF_A_KIND;
    else if (val === CARD_COUNTS.FOUR) return HAND_TYPES.FOUR_OF_A_KIND;
    else if ((val === CARD_COUNTS.THREE && hasPair) || (val === 2 && hasThreeOfAKind)) return HAND_TYPES.FULL_HOUSE;
    else if (val === CARD_COUNTS.THREE ) hasThreeOfAKind = true;
    else if (val === CARD_COUNTS.TWO && hasPair) return HAND_TYPES.TWO_PAIR;
    else if (val === CARD_COUNTS.TWO) hasPair = true;
  }

  if (hasThreeOfAKind) return HAND_TYPES.THREE_OF_A_KIND;
  if (hasPair) return HAND_TYPES.ONE_PAIR;
  return HAND_TYPES.HIGH_CARD;
}

function getHandMap(hand) {
  const handMap= {};
  for (let i = 0; i < hand.length; i++) {
    handMap[hand[i]] = (handMap[hand[i]] || 0) + 1;
  }
  return handMap;
}

function compareHands(handA, handB) {
  const handValueA = determineHandValue(handA);
  const handValueB = determineHandValue(handB);
  if (handValueA !== handValueB) return handValueB - handValueA;

  return determineTieBreaker(handA, handB);
}

function determineTieBreaker(handA, handB) {
  for (let i = 0; i < handA.length; i++) {
    const cardA = handA[i];
    const cardB = handB[i];
    const handAVal = isNaN(+cardA) ? PICT_CARD_VALS[cardA] : +cardA;
    const handBVal = isNaN(+cardB) ? PICT_CARD_VALS[cardB] : +cardB;

    if (handAVal !== handBVal) return handBVal - handAVal;
  }
  return 0;
}

function parseLine(line) {
  const [hand, bid] = line.split(' ');
  return { hand, bid: parseInt(bid) };
}

let hands = input.map(parseLine);
hands.sort((a, b) => compareHands(a.hand, b.hand));

let totalWinnings = hands.reduce((acc, hand, index) => acc + hand.bid * (hands.length - index), 0);

console.log(totalWinnings);
