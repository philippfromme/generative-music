import Tone from 'tone';

import { createSampler } from './util/instruments';

import {
  createCompressor,
  createDelay,
  createReverb,
} from './util/effects';

import { initDebug } from './debug';

import Scheduler from './Scheduler';
import SimpleGenerator from './generators/SimpleGenerator';

import Renderer from './Renderer';

const getElementById = document.getElementById.bind(document);

async function sleep(ms = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const buttonEnableAudio = getElementById('button-enable-audio');
const buttonInfo = getElementById('button-info');
const buttonPlayPause = getElementById('button-play-pause');

const info = getElementById('info');
const loader = getElementById('loader');

async function initTone() {
  Tone.context.resume();

  // create effects
  const delay = createDelay();

  const reverb = await createReverb();

  const compressor = createCompressor();

  const gain = new Tone.Gain(12, Tone.Type.Decibel);

  delay.chain(reverb, gain, compressor);

  if (process.env.NODE_ENV === 'development') {

    // setup debugging
    const meter = initDebug();
    compressor.fan(Tone.Master, meter);
  } else {
    compressor.connect(Tone.Master);
  }

  // create instruments
  const violinHarmonics = await createSampler('violin-harmonics');
  violinHarmonics.connect(delay);

  const violinStaccato = await createSampler('violin-staccato');
  violinStaccato.connect(delay);

  const bassHarmonics = await createSampler('bass-harmonics');
  bassHarmonics.connect(delay);

  // create generator
  const generator = new SimpleGenerator();

  // create renderer
  const renderer = new Renderer();

  // create scheduler
  const scheduler = new Scheduler({
    bpm: 110,
    generator,
    instruments: [
      violinHarmonics,
      bassHarmonics,
      violinStaccato,
    ],
    renderer,
  });

  return {
    renderer,
    scheduler,
  };
}

async function initControls(scheduler, renderer) {
  buttonPlayPause.addEventListener('click', () => {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause();

      buttonPlayPause.textContent = 'Play';
    } else {
      scheduler.start();
      renderer.start();

      Tone.Transport.start();

      buttonPlayPause.textContent = 'Pause';

      buttonPlayPause.classList.remove('animation-pulse');
    }
  });

  buttonInfo.addEventListener('click', (event) => {
    info.classList.remove('hidden');

    buttonInfo.classList.add('inactive');
    buttonPlayPause.classList.add('inactive');

    function hideInfo(e) {
      if (e.target === info || info.contains(e.target)) {
        return;
      }

      buttonInfo.classList.remove('inactive');
      buttonPlayPause.classList.remove('inactive');

      info.classList.add('hidden');

      window.removeEventListener('click', hideInfo);
    }

    event.stopPropagation();

    window.addEventListener('click', hideInfo);
  });

  await sleep(500);

  loader.textContent = 'Ready';
  loader.classList.add('ready');

  await sleep(1000);

  loader.classList.add('hidden');

  await sleep(1000);

  buttonInfo.classList.remove('inactive');
  buttonPlayPause.classList.remove('inactive');
  buttonPlayPause.classList.add('animation-pulse');
}

buttonEnableAudio.addEventListener('click', async () => {
  buttonEnableAudio.classList.add('hidden');

  await sleep(500);

  loader.classList.remove('hidden');

  const result = await initTone();

  const {
    renderer,
    scheduler,
  } = result;

  initControls(scheduler, renderer);
});
