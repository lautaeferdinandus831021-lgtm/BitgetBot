let lastSignal = null;

function filterSignal(signal) {
  if (!signal) return null;

  if (signal === lastSignal) {
    return null;
  }

  lastSignal = signal;
  return signal;
}

module.exports = { filterSignal };
