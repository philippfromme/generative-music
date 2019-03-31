import { isNumber } from 'lodash';

export function chance(probability = 0.5) {
  return Math.random() < probability;
}

export function randomChoice(choices) {
  return choices[randomInteger(choices.length - 1)];
}

export function randomInteger(min, max) {
  if (!isNumber(min)) {
    min = 0;
    max = 100;
  } else if (!isNumber(max)) {
    max = min;
    min = 0;
  }

  return Math.round(Math.random() * (max - min)) + min;
}

export function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}
