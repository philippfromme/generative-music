import Tone from 'tone';

function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function px(value) {
  return `${value}px`;
}

function createSlider(options = {}) {
  let {
    width,
    height,
    onChange,
    initialValue,
  } = options;

  width = width || 20;
  height = height || 120;

  initialValue = initialValue || 0.5;

  const initialHeight = map(initialValue, 0, 1, 0, height);

  const outer = document.createElement('div');

  outer.classList.add('slider-outer');

  outer.style.width = px(width);
  outer.style.height = px(height);

  const inner = document.createElement('div');

  inner.classList.add('slider-inner');

  inner.style.width = px(width);
  inner.style.height = px(initialHeight);

  outer.appendChild(inner);

  let clientY;

  let lastHeight = initialHeight;

  function onMousemove(event) {
    const deltaY = event.clientY - clientY;

    const newHeight = clamp(lastHeight - deltaY, 0, height);

    inner.style.height = px(newHeight);

    if (onChange) {
      onChange(map(newHeight, 0, height, 0, 1));
    }
  }

  function onMouseup() {
    window.removeEventListener('mousemove', onMousemove);
    window.removeEventListener('mouseup', onMouseup);
  }

  outer.addEventListener('mousedown', (event) => {
    clientY = event.clientY;

    window.addEventListener('mousemove', onMousemove);

    window.addEventListener('mouseup', onMouseup);

    if (onChange) {
      const { bottom } = outer.getBoundingClientRect();

      const newHeight = bottom - clientY;

      inner.style.height = px(newHeight);

      lastHeight = newHeight;

      onChange(map(newHeight, 0, height, 0, 1));
    }
  });

  return outer;
}

export function initDebug(options = {}) {
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

  const { listeners } = options;

  if (listeners && listeners.length) {
    const sliders = document.createElement('div');

    sliders.id = 'sliders';

    document.body.appendChild(sliders);

    listeners.forEach(({ initialValue, onChange }) => {
      const slider = createSlider({
        initialValue,
        onChange,
      });

      sliders.appendChild(slider);
    });
  }

  return meter;
}
