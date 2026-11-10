const DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value) {
  if (typeof value !== "string" || !DATE.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return value;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nights(start, end) {
  const startMs = Date.parse(`${start}T00:00:00Z`);
  const endMs = Date.parse(`${end}T00:00:00Z`);
  return Math.round((endMs - startMs) / 86400000);
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = { parseDate, today, nights, overlaps, httpError };
