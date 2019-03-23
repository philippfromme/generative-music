import * as Range from 'tonal-range';

import { randomChoice } from './random';

export function randomNote(lowest = 'C3', highest = 'B5') {
  if (lowest && !highest) {
    return new Error('highest note required');
  }

  const notes = Range.chromatic([lowest, highest]);

  return randomChoice(notes);
}
