import {
  FMSynth,
  PolySynth,
  Synth,
  Sampler,
} from 'tone';

import * as Range from 'tonal-range';

export function createFMSynth() {
  return new FMSynth({
    harmonicity: 3,
    modulationIndex: 10,
    detune: 0,
    // oscillator: {
    //   type: new Tone.Synth()
    // },
    envelope: {
      // attack: 0.01,
      attack: 0.1,
      decay: 0.01,
      sustain: 0.9,
      release: 1.5,
    },
    // modulation: {
    //  type: new Tone.Synth()
    // },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0,
      sustain: 1,
      release: 0.5,
    },
  });
}

const SYNTH_PRESETS = {
  xylophone: {
    portamento: 0,
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.2,
      release: 1.2,
    },
  },
};

export function createSynth() {
  return new Synth(SYNTH_PRESETS.xylophone);
}

export function createPolySynth() {
  return new PolySynth({
    polyphony: 16,
    volume: 0,
    detune: 0,
    voice: createSynth,
  });
}

function getNotes(octaves) {
  const notes = [];

  octaves.forEach((octave) => {
    [ 'C', 'D#', 'F#', 'A' ].forEach((note) => {
      notes.push(`${note}${octave}`);
    });
  });

  return notes;
}

const NOTES = {
  'piano': getNotes([ 1, 2, 3, 4, 5 ]),
  'violin-harmonics': getNotes([ 3, 4, 5 ]),
  'violin-staccato': getNotes([ 3, 4, 5 ]),
  'bass-harmonics': getNotes([ 1, 2, 3 ]),
  'bass-staccato': getNotes([ 1, 2, 3 ]),
  'moog-bass': getNotes([ 1, 2, 3 ]),
  'noisy-piano': getNotes([ 1, 2, 3, 4, 5 ]),
  'noisy-violins': getNotes([ 3, 4, 5 ]),
  'noisy-basses': getNotes([ 1, 2, 3 ]),
  'noisy-hit': [ 'C3' ],
  'noisy-hit-distorted': [ 'C3' ],
  'modern-drum-kit': Range.chromatic([ 'C3', 'G5' ], true) // use sharps
};

export async function createSampler(preset = 'piano') {
  const samples = {};

  NOTES[ preset ].forEach(note => {
    samples[ note ] = `samples/${ preset }/${ note.replace('#', 'sharp') }.mp3`;
  });

  return new Promise((resolve) => {
    const sampler = new Sampler(samples, {
      release: 1,
      onload: () => {
        resolve(sampler);
      }
    });
  });
}
