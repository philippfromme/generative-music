import {
  Chord,
  scale,
  transpose,
} from 'tonal';

import Generator from './Generator';

import {
  chance,
  randomInteger,
  randomChoice,
} from '../util/random';

import { parseTime } from '../util/tone';

import { randomNote } from '../util/tonal';

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

export default class SimpleGenerator extends Generator {
  constructor() {
    super();

    this.key = randomNote('C2', 'B2');

    this.notes = scale('minor').map(transpose(this.key));

    this.chords = this.notes.map(note => Chord.notes(note));

    this.lastChord = null;

    this.events = [];

    this.bars = 0;
  }

  /**
   * Return next bar.
   *
   * @returns {Array<Object>}
   */
  nextBar() {
    let chord;

    if (this.lastChord && chance(0.4)) {
      chord = this.lastChord;
    } else {
      chord = shuffle(this.chords[randomChoice([0, 3, 4, 6])]);

      this.lastChord = chord;
    }

    const events = [
      {
        instrument: 0,
        length: '2n',
        note: chord[0],
        time: parseTime(this.bars, 0, 0),
        velocity: randomInteger(10) / 12.5,
      },
      {
        instrument: 0,
        length: '2n',
        note: chord[randomInteger(2)],
        time: parseTime(this.bars, 1, 2),
        velocity: randomInteger(10) / 12.5,
      },
      {
        instrument: 0,
        length: '2n',
        note: chord[2],
        time: parseTime(this.bars, 2, 4),
        velocity: randomInteger(10) / 12.5,
      },
    ];

    if (chance(0.4)) {
      const time = parseTime(this.bars, randomChoice([0, 2]), 0);

      events.push({
        instrument: 1,
        length: '2n',
        note: transpose(chord[0], '-8M'),
        time,
        velocity: randomInteger(10) / 12.5,
      });
    }

    if (chance(0.2)) {
      const time = parseTime(this.bars, 2, 2);

      events.push({
        instrument: 2,
        length: '1n',
        note: transpose(chord[0], '8M'),
        time,
        velocity: randomInteger(10) / 12.5,
      });
    }

    this.bars++;

    if (chance(0.1)) {

      // skip a bar
      return [];
    }

    return events;
  }
}
