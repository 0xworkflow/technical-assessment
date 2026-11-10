const crypto = require("crypto");
const store = require("./store");
const { overlaps, httpError } = require("../services/dates");

function all() {
  const saved = store.get("blocks");
  return Array.isArray(saved) ? saved : [];
}

function save(blocks) {
  store.set("blocks", blocks);
}

function listForVilla(villaId) {
  return all()
    .filter((block) => String(block.villaId) === String(villaId))
    .map(toPublic);
}

function toPublic(block) {
  return {
    id: block.id,
    villaId: block.villaId,
    startDate: block.startDate,
    endDate: block.endDate,
    reason: block.reason || "",
  };
}

function conflicts(villaId, startDate, endDate) {
  return all().some(
    (block) =>
      String(block.villaId) === String(villaId) &&
      overlaps(startDate, endDate, block.startDate, block.endDate)
  );
}

function create({ villaId, startDate, endDate, reason }) {
  if (conflicts(villaId, startDate, endDate)) {
    throw httpError(409, "Those dates are already blocked.");
  }
  const block = {
    id: crypto.randomUUID(),
    villaId: Number(villaId),
    startDate,
    endDate,
    reason: (reason || "").trim(),
    createdAt: new Date().toISOString(),
  };
  save([...all(), block]);
  return toPublic(block);
}

function remove(id) {
  const current = all();
  const next = current.filter((block) => block.id !== id);
  if (next.length === current.length) return false;
  save(next);
  return true;
}

module.exports = { listForVilla, conflicts, create, remove, toPublic };
