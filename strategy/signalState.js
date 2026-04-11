let lastSignal = null;

function filterSignal(signal) {
  if (!signal) return null;

  if (signal === lastSignal) {
    return null; // skip spam
  }

  lastSignal = signal;
  return signal;
}

module.exports = { filterSignal };
