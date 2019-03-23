import { midi } from 'tonal';

export default class Renderer {
  constructor(options = {}) {
    this.running = false;

    this.notes = [];

    const canvas = this.canvas = document.createElement('canvas');

    this.ctx = canvas.getContext('2d');

    this.resize();

    document.body.appendChild(canvas);

    window.addEventListener('resize', this.resize);
  }

  resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    if(this.running) {
      return;
    }

    this.running = true;

    const run = () => {
      this.update();

      this.render();

      this.running && requestAnimationFrame(run);
    }

    run();
  }

  stop() {
    this.running = false;
  }

  note(note, instrument = 0) {
    const y = map(midi(note), 0, 127, this.canvas.height, 0);

    this.notes.push({
      x: -this.canvas.height * 1.5,
      y,
      instrument
    });
  }

  update() {
    this.notes.forEach(note => {
      note.x += 2;
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.notes.forEach(note => {
      this.renderNote(note);
    });
  }

  renderNote(note) {
    const alpha = map(note.x, 0, this.canvas.width / 3 * 2, 1, 0);

    if (note.instrument > 0) {
      this.ctx.fillStyle = `rgba(209, 0, 41, ${ alpha })`;
    } else {
      this.ctx.fillStyle = `rgba(230, 175, 46, ${ alpha })`;
    }

    this.ctx.lineWidth = 0;

    const radius = map(note.x, 0, this.canvas.width, this.canvas.height, this.canvas.height / 2);

    this.ctx.beginPath();
    this.ctx.arc(note.x, note.y, Math.max(0, radius), 0, 360);
    this.ctx.fill();
  }
}


function map(value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}