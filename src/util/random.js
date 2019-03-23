import { isNumber } from 'lodash';

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

export function randomChoice(choices) {
  return choices[randomInteger(choices.length - 1)];
}

export function chance(probability) {
  return Math.random() < probability;
}
