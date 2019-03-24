import { midi } from 'tonal';

function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const MAX_PROGRESS = 750;

export default class Renderer {
  constructor() {
    this.running = false;

    this.notes = [];

    this.canvas = document.createElement('canvas');

    this.ctx = this.canvas.getContext('2d');

    this.resize();

    document.body.appendChild(this.canvas);

    window.addEventListener('resize', this.resize);
  }

  resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  start() {
    if (this.running) {
      return;
    }

    this.running = true;

    const run = () => {
      this.update();

      this.render();

      if (this.running) {
        requestAnimationFrame(run);
      }
    };

    run();
  }

  stop() {
    this.running = false;
  }

  note(note, instrument = 0) {
    this.notes.push({
      progress: 0,
      midi: midi(note),
      instrument,
    });
  }

  update() {
    const remove = [];

    this.notes.forEach((note) => {
      note.progress++;

      if (note.progress > MAX_PROGRESS) {
        remove.push(note);
      }
    });

    this.notes = this.notes.filter(note => !remove.includes(note));
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.notes.forEach((note) => {
      this.renderNote(note);
    });
  }

  renderNote(note) {
    const alpha = map(note.progress, 0, MAX_PROGRESS - (MAX_PROGRESS / 5), 1, 0);

    if (note.instrument > 0) {
      this.ctx.fillStyle = `rgba(209, 0, 41, ${alpha})`;
    } else {
      this.ctx.fillStyle = `rgba(230, 175, 46, ${alpha})`;
    }

    const x = map(note.progress, 0, MAX_PROGRESS, -this.canvas.height, this.canvas.width);

    const y = map(note.midi, 0, 127, 0, this.canvas.height);

    const radius = map(
      note.progress,
      0,
      this.canvas.width,
      this.canvas.height,
      this.canvas.height / 2,
    );

    // console.log(x, y, radius);

    this.ctx.beginPath();
    this.ctx.arc(x, this.canvas.height - y, Math.max(0, radius), 0, 360);
    this.ctx.fill();
  }
}
