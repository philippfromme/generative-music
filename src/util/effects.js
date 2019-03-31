import Tone from 'tone';

export async function createReverb(decay = 7.5) {
  const reverb = new Tone.Reverb({
    decay,
    preDelay: 0.1,
  });

  reverb.wet.value = 0.7;

  await reverb.generate();

  return reverb;
}

export function createDelay() {
  const delay = new Tone.PingPongDelay('8.', 0.2);

  delay.wet.value = 0.5;

  return delay;
}

export function createMultiband() {
  return new Tone.MultibandCompressor({
    lowFrequency: 200,
    highFrequency: 1300,
    low: {
      threshold: -12,
    },
    mid: {
      threshold: -12,
    },
    high: {
      threshold: -12,
    },
  });
}

export function createCompressor() {
  return new Tone.Compressor({
    ratio: 5,
    threshold: -24,
    release: 0.05,
    attack: 0.005,
    knee: 6,
  });
}
