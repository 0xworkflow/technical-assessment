const crypto = require("crypto");
const store = require("./store");
const villaModel = require("./villa.model");

function all() {
  return store.get("favorites");
}

function listForUser(userId) {
  return all()
    .filter((favorite) => favorite.userId === userId)
    .map((favorite) => ({
      id: favorite.id,
      villaId: favorite.villaId,
      createdAt: favorite.createdAt,
      villa: villaModel.findById(favorite.villaId),
    }))
    .filter((favorite) => favorite.villa);
}

function add(userId, villaId) {
  const villa = villaModel.findById(villaId, { includeHidden: false });
  if (!villa) {
    const error = new Error("Villa not found.");
    error.status = 404;
    throw error;
  }

  const existing = all().find(
    (favorite) => favorite.userId === userId && String(favorite.villaId) === String(villa.id)
  );
  if (existing) return { created: false, favorite: existing };

  const favorite = {
    id: crypto.randomUUID(),
    userId,
    villaId: villa.id,
    createdAt: new Date().toISOString(),
  };
  store.set("favorites", [...all(), favorite]);
  return { created: true, favorite };
}

function remove(userId, villaId) {
  const current = all();
  const next = current.filter(
    (favorite) => !(favorite.userId === userId && String(favorite.villaId) === String(villaId))
  );
  if (next.length === current.length) return false;
  store.set("favorites", next);
  return true;
}

module.exports = { listForUser, add, remove };
