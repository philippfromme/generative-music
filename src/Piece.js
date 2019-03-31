import Tone from 'tone';

import {
  Chord,
  scale,
  transpose,
} from 'tonal';

import { createSampler } from './util/instruments';

import {
  createCompressor,
  createDelay,
  createReverb,
} from './util/effects';

import { randomNote } from './util/tonal';

import {
  chance,
  randomInteger,
  randomChoice,
  shuffle
} from './util/random';

async function createInstruments() {

  // create effects
  const delay = createDelay();

  const reverbLong = await createReverb();

  const reverbShort = await createReverb(1);
  reverbShort.wet.value = 0.25;

  const compressor = createCompressor();

  const gain = new Tone.Gain(6, Tone.Type.Decibel);

  reverbShort.connect(gain);
  delay.chain(reverbLong, gain, compressor, Tone.Master);

  // create instruments
  const violins = await createSampler('noisy-violins'),
        piano = await createSampler('noisy-piano'),
        basses = await createSampler('noisy-basses');

  [ violins, piano, basses ].forEach(instrument => instrument.connect(delay));

  const hit = await createSampler('noisy-hit'),
        hitDistorted = await createSampler('noisy-hit-distorted');

  [ hit, hitDistorted ].forEach(instrument => instrument.connect(reverbLong));

  const modernDrumKit = await createSampler('modern-drum-kit');

  modernDrumKit.connect(reverbShort);

  return {
    violins,
    piano,
    basses,
    hit,
    hitDistorted,
    modernDrumKit
  };
}

class Piece {
  constructor(options = {}) {
    const {
      instruments,
      renderer
    } = options;

    this.instruments = instruments;
    this.renderer = renderer;

    Tone.Transport.bpm.value = 90;

    this.key = randomNote('C2', 'B2');
  }

  start = () => {
    if (this.scheduled) {
      return;
    }

    const scheduleNotes = (lookahead = 0) => {
      console.groupEnd();

      const position = Tone.Transport.position;

      // schedule ahead of time
      const bars = parseInt(position.split(':')[0]) + lookahead;

      console.groupCollapsed(`[ ${ position } ] schedule notes for [ ${ [ bars, 0, 0 ].join(':') } ]`);

      // console.log(position, bars);

      // kick
      this.scheduleNotes([ 0, 8, 10 ].map((sixteents) => {
        return {
          instrument: 'modernDrumKit',
          length: '4n',
          time: [ bars, 0, sixteents ].join(':'),
          velocity: 0.5
        };
      }));

      // snare
      this.scheduleNotes([ 4, 7, 12 ].map((sixteents) => {
        return {
          instrument: 'modernDrumKit',
          length: '4n',
          note: 'D#3',
          time: [ bars, 0, sixteents ].join(':'),
          velocity: 0.5
        };
      }));

      if (chance()) {
        this.scheduleNote({
          instrument: 'modernDrumKit',
          length: '4n',
          note: 'D#3',
          time: [ bars, 0, 15 ].join(':'),
          velocity: 0.5
        });
      }

      // hihat
      this.scheduleNotes([ 0, 2, 4, 6, 8, 10, 12, 14 ].map((sixteents) => {
        return {
          instrument: 'modernDrumKit',
          length: '4n',
          note: 'F#5',
          time: [ bars, 0, sixteents ].join(':'),
          velocity: 0.5
        };
      }));

      // cymbal
      this.scheduleNote({
        instrument: 'modernDrumKit',
        length: '4n',
        note: 'A#4',
        time: [ bars, 0, 0 ].join(':'),
        velocity: 0.5
      });


      if (chance()) {

        this.scheduleNotes([
          { note: 'C4', sixteenths: 0 },
          { note: 'D#4', sixteenths: 7 }
        ].map(({ note, sixteenths }) => {
          return {
            instrument: 'violins',
            length: '2n',
            note: note,
            time: [ bars, 0, sixteenths ].join(':'),
            velocity: 0.7
          };
        }));

        // basses
        this.scheduleNotes([ 'C2', 'D#2', 'G2' ].map(note => {
          return {
            instrument: 'basses',
            length: '4n',
            note: note,
            time: [ bars, 0, randomChoice([ 0, 6 ]) ].join(':'),
            velocity: 0.7
          };
        }));
      }
    };

    Tone.Transport.scheduleRepeat(() => scheduleNotes(1), '1m');

    // schedule 1 bar ahead
    scheduleNotes();

    Tone.Transport.start();
  }

  stop = () => {
    if (this.isStarted()) {
      Tone.Transport.stop();

      Tone.Transport.cancel();

      this.scheduled = null;
    }
  }

  isStarted() {
    return Tone.Transport.state === 'started';
  }

  scheduleNotes = (notes) => {
    notes.forEach(this.scheduleNote);
  }

  scheduleNote = (options = {}) => {
    options = {
      instrument: 'violins',
      length: '4n',
      note: 'C3',
      velocity: 0.5,
      ...options
    };

    const {
      instrument,
      note,
      time
    } = options;

    console.log('schedule note', Object.values(options).join(', '));

    Tone.Transport.scheduleOnce((sampleAccurateTime) => {
      this.playNote({
        ...options,
        sampleAccurateTime
      });

      Tone.Draw.schedule(() => {
        if (this.renderer) {
          const index = Object.keys(this.instruments).indexOf(instrument);

          this.renderer.renderNote({
            instrument: index,
            note
          });
        }
      }, sampleAccurateTime);
    }, time);
  }

  playNote(options = {}) {
    const {
      length,
      instrument,
      note,
      sampleAccurateTime,
      velocity
    } = options;

    console.log('play note', Object.values(options).join(', '));

    this.instruments[ instrument ].triggerAttackRelease(note, length, sampleAccurateTime, velocity);
  }
}

export async function createPiece(renderer) {
  const instruments = await createInstruments();

  const piece = new Piece({
    instruments,
    renderer
  });

  return piece;
}