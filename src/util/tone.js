import Tone from 'tone';

/**
 * Parse Tone.Time to [ bars, beats, sixteenths ].
 *
 * @param {Tone.Time|String} time - Time as bars:beats:sixteenths.
 *
 * @returns {Array<number>}
 */
export function parseBarsBeatsSixteenths(time) {
  if (time instanceof Tone.Time) {
    time = time.toBarsBeatsSixteenths();
  }

  return time.split(':');
}

export function parseTime(bars, beats, sixteenths) {
  return new Tone.Time([bars, beats, sixteenths].join(':'));
}

export function getBars(time) {
  return parseBarsBeatsSixteenths(time)[0];
}

export function getBeats(time) {
  return parseBarsBeatsSixteenths(time)[1];
}

export function getSixteenths(time) {
  return parseBarsBeatsSixteenths(time)[2];
}

/**
 * Add time to another.
 *
 * @param {Tone.Time|String} a - Time a.
 * @param {Tone.Time|String} b - Time b.
 *
 * @returns {Tone.Time}
 */
export function addTime(a, b) {
  if (!(a instanceof Tone.Time)) {
    a = new Tone.Time(a);
  }

  if (!(b instanceof Tone.Time)) {
    b = new Tone.Time(b);
  }

  return new Tone.Time(a.valueOf() + b.valueOf());
}

/**
 * Subtract time from another.
 *
 * @param {Tone.Time|String} a - Time a.
 * @param {Tone.Time|String} b - Time b.
 *
 * @returns {Tone.Time}
 */
export function subtractTime(a, b) {
  if (!(a instanceof Tone.Time)) {
    a = new Tone.Time(a);
  }

  if (!(b instanceof Tone.Time)) {
    b = new Tone.Time(b);
  }

  return new Tone.Time(a.valueOf() - b.valueOf());
}
