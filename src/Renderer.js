import p5 from 'p5';

import { midi } from 'tonal';

function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const NOTE_WIDTH = 50,
      NOTE_HEIGHT = 16;

export default class Renderer {
  constructor() {

    const notes = this.notes = [];

    function s(sketch) {
      sketch.setup = () => {
        const canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

        canvas.parent('canvas');

        sketch.strokeWeight(2);
        sketch.strokeCap(sketch.ROUND);
      };

      sketch.draw = () => {
        sketch.clear();

        notes.forEach((note) => {

          // console.log(note)
          if (note.instrument < 1) {
            sketch.fill('blue');
            sketch.noStroke();
          } else {
            sketch.fill('white');
            sketch.stroke('blue');
          }

          const y = map(midi(note.note), midi('C0'), midi('B6'), 0, sketch.height);

          sketch.rect(sketch.width - note.x, sketch.height - y, NOTE_WIDTH, NOTE_HEIGHT, 8);

          note.x += 4;
        });
      };

      sketch.windowResized = () => {
        sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
      };
    }

    new p5(s);
  }

  renderNote = (note) => {
    this.notes.push({
      ...note,
      x: 0
    });
  }
}
