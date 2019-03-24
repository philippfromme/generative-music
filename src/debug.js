import Tone from 'tone';

function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export function initDebug() {
  const meter = new Tone.Meter(0.9);

  const canvas = document.createElement('canvas');

  canvas.id = 'debug-meter';

  canvas.width = 20;
  canvas.height = 120;

  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff';

  function render() {
    const level = Math.max(-36, meter.getLevel());

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const height = map(level, -36, 0, 0, canvas.height);

    ctx.fillRect(0, canvas.height - height, canvas.width, height);

    requestAnimationFrame(render);
  }

  render();

  return meter;
}
