const store = require("./store");
const seed = require("../data/villas");
const reviewModel = require("./review.model");

function all() {
  const saved = store.get("villas");
  if (Array.isArray(saved)) return saved;

  const now = new Date().toISOString();
  const seeded = seed.map((villa) => ({
    ...villa,
    description: "",
    status: "published",
    hostId: null,
    createdAt: now,
    updatedAt: now,
  }));
  store.set("villas", seeded);
  return seeded;
}

function save(villas) {
  store.set("villas", villas);
}

function isDraft(villa) {
  return villa.status === "draft";
}

function present(villa, manage) {
  const summary = reviewModel.summary(villa.id);
  const base = manage ? { ...villa } : (({ hostId, ...publicVilla }) => publicVilla)(villa);
  if (!summary.count) return { ...base, reviewCount: 0 };
  return {
    ...base,
    rating: manage ? base.rating : summary.average,
    reviewCount: summary.count,
  };
}

function matchesQuery(villa, { place, category, q }) {
  if (place && villa.location !== place) return false;
  if (category && villa.category !== category) return false;
  if (q) {
    const haystack = [villa.name, villa.location, villa.category, villa.description]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q.toLowerCase())) return false;
  }
  return true;
}

function sortVillas(items, sort) {
  const next = [...items];
  if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "rating") next.sort((a, b) => Number(b.rating) - Number(a.rating));
  else if (sort === "price") next.sort((a, b) => Number(a.dailyRent) - Number(b.dailyRent));
  else if (sort === "newest") next.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  return next;
}

function list(options = {}) {
  const items = all().filter((villa) => (options.includeHidden || !isDraft(villa)) && matchesQuery(villa, options));
  return sortVillas(items, options.sort).map((villa) => present(villa, options.includeHidden));
}

function findById(id, { includeHidden = true } = {}) {
  const villa = all().find((item) => String(item.id) === String(id)) || null;
  if (!villa || (!includeHidden && isDraft(villa))) return null;
  return present(villa, includeHidden);
}

function create(input, hostId) {
  const villas = all();
  const id = villas.reduce((max, villa) => Math.max(max, Number(villa.id) || 0), 0) + 1;
  const now = new Date().toISOString();
  const villa = {
    ...input,
    id,
    hostId: hostId || null,
    createdAt: now,
    updatedAt: now,
  };
  save([...villas, villa]);
  return present(villa, true);
}

function update(id, input) {
  const villas = all();
  const index = villas.findIndex((villa) => String(villa.id) === String(id));
  if (index < 0) return null;

  const current = villas[index];
  const villa = {
    ...current,
    ...input,
    id: current.id,
    hostId: current.hostId,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };
  villas[index] = villa;
  save(villas);
  return present(villa, true);
}

function remove(id) {
  const villas = all();
  const next = villas.filter((villa) => String(villa.id) !== String(id));
  if (next.length === villas.length) return false;
  save(next);
  ["favorites", "bookings", "blocks", "reviews"].forEach((key) => {
    const items = store.get(key) || [];
    store.set(
      key,
      items.filter((item) => String(item.villaId) !== String(id))
    );
  });
  return true;
}

module.exports = { list, findById, create, update, remove };
