import {
  FMSynth,
  PolySynth,
  Synth,
  Sampler,
} from 'tone';

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

const OCTAVES = {
  piano: ['1', '2', '3', '4', '5'],
  'violin-harmonics': ['3', '4', '5'],
  'violin-staccato': ['3', '4', '5'],
  'bass-harmonics': ['1', '2', '3'],
  'bass-staccato': ['1', '2', '3'],
};

export async function createSampler(preset = 'piano') {
  const notes = ['C', 'D#', 'F#', 'A'];
  const octaves = OCTAVES[preset];

  let samples = {};

  notes.forEach((note) => {
    octaves.forEach((octave) => {
      samples = {
        ...samples,
        [`${note}${octave}`]: `samples/${preset}/${note.replace('#', 'sharp')}${octave}.mp3`,
      };
    });
  });

  return new Promise((resolve) => {
    const sampler = new Sampler(samples, {
      release: 1,
      onload: () => {
        resolve(sampler);
      },
    });
  });
}
