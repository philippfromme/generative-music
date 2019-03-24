import Tone from 'tone';

export default class Scheduler {
  constructor(options = {}) {
    const {
      bpm,
      generator,
      instruments,
      renderer,
    } = options;

    this.bpm = bpm;

    if (!generator) {
      return new Error('no generator found');
    }

    this.generator = generator;

    if (!instruments || !instruments.length) {
      return new Error('no instruments found');
    }

    this.instruments = instruments;

    this.renderer = renderer || null;

    this.eventId = null;
  }

  start() {
    let events = this.generator.nextBar();

    events.forEach(this.scheduleEvent);

    this.eventId = Tone.Transport.scheduleRepeat(() => {
      events = this.generator.nextBar();

      events.forEach(this.scheduleEvent);
    }, '1m');

    Tone.Transport.bpm.value = this.bpm || 120;
  }

  stop() {
    if (this.eventId) {
      Tone.Transport.clear(this.eventId);

      this.eventId = null;
    }
  }

  scheduleEvent = ({
    length, instrument, note, time, velocity,
  }) => {
    Tone.Transport.scheduleOnce((t) => {

      if (process.env.NODE_ENV === 'development') {
        console.log(`[instrument ${instrument}] note: ${note}, length: ${length}, velocity: ${velocity}`);
      }

      // note, duration, time, velocity
      this.instruments[instrument].triggerAttackRelease(note, length, t, velocity);

      if (this.renderer) {
        Tone.Draw.schedule(() => {
          this.renderer.note(note, instrument);
        }, t);
      }
    }, time);
  };
}
