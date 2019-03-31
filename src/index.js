import Tone from 'tone';

import Renderer from './Renderer';

import { createPiece } from './Piece';

const getElementById = document.getElementById.bind(document);

const buttonEnableAudio = getElementById('button-enable-audio'),
      buttonStartStop = getElementById('button-start-stop'),
      loader = getElementById('loader');

let piece = null;

function ifSpace(callback) {
  return function(event) {
    if (event.keyCode === 32) {
      callback();
    }
  }
}

function toggleStartStop() {
  if (!piece) {
    return;
  }

  if (piece.isStarted()) {
    piece.stop();

    buttonStartStop.textContent = 'Start';
  } else {
    piece.start();

    buttonStartStop.textContent = 'Stop';
  }
}

async function init() {
  Tone.context.resume();

  // create renderer
  const renderer = new Renderer();

  // create piece
  piece = await createPiece(renderer);

  buttonStartStop.addEventListener('click', toggleStartStop);

  window.addEventListener('keydown', ifSpace(toggleStartStop));

  loader.classList.add('hidden');

  buttonStartStop.classList.remove('inactive');
  buttonStartStop.classList.add('animated', 'pulse');
}

function enableAudioAndInit() {
  window.removeEventListener('keydown', enableAudioAndInitIfSpace);

  buttonEnableAudio.classList.add('hidden');

  loader.classList.remove('hidden');

  init();
}

const enableAudioAndInitIfSpace = ifSpace(enableAudioAndInit);

buttonEnableAudio.addEventListener('click', enableAudioAndInit);

window.addEventListener('keydown', enableAudioAndInitIfSpace);
