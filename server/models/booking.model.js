const crypto = require("crypto");
const store = require("./store");
const villaModel = require("./villa.model");
const availabilityModel = require("./availability.model");
const userModel = require("./user.model");
const { nights, overlaps, httpError } = require("../services/dates");

const MAX_NIGHTS = 30;

function all() {
  const saved = store.get("bookings");
  return Array.isArray(saved) ? saved : [];
}

function save(bookings) {
  store.set("bookings", bookings);
}

function activeForVilla(villaId) {
  return all().filter(
    (booking) => String(booking.villaId) === String(villaId) && booking.status === "confirmed"
  );
}

function quote(villa, startDate, endDate, guests) {
  const stayNights = nights(startDate, endDate);
  if (stayNights < 1) throw httpError(400, "Check-out must be after check-in.");
  if (stayNights > MAX_NIGHTS) throw httpError(400, `A stay can be at most ${MAX_NIGHTS} nights.`);
  if (guests > Number(villa.guests)) {
    throw httpError(400, `This villa sleeps at most ${villa.guests} guests.`);
  }
  const nightly = Number(villa.dailyRent);
  if (!Number.isFinite(nightly) || nightly < 0) throw httpError(400, "This villa has no valid nightly price.");
  return { nights: stayNights, total: nightly * stayNights };
}

function explainConflict(villaId, startDate, endDate) {
  if (availabilityModel.conflicts(villaId, startDate, endDate)) {
    return "Those dates are blocked by the host.";
  }
  const booked = activeForVilla(villaId).some((booking) =>
    overlaps(startDate, endDate, booking.startDate, booking.endDate)
  );
  if (booked) return "Those dates are already booked.";
  return "";
}

function present(booking, { includeGuest = false, own = false } = {}) {
  const villa = villaModel.findById(booking.villaId, { includeHidden: true });
  const guest = includeGuest ? userModel.findById(booking.userId) : null;
  return {
    id: booking.id,
    villaId: booking.villaId,
    villaName: villa?.name || "Removed villa",
    startDate: booking.startDate,
    endDate: booking.endDate,
    guests: booking.guests,
    nights: booking.nights,
    total: booking.total,
    status: booking.status,
    createdAt: booking.createdAt,
    ...(own ? { own: true } : {}),
    ...(includeGuest
      ? { guestName: guest?.name || "Guest", guestEmail: guest?.email || "" }
      : {}),
  };
}

function listForUser(userId) {
  return all()
    .filter((booking) => booking.userId === userId)
    .map((booking) => present(booking, { own: true }));
}

function listForHost(userId) {
  return all().map((booking) =>
    present(booking, { includeGuest: true, own: booking.userId === userId })
  );
}

function findOwned(id, userId) {
  return all().find((booking) => booking.id === id && booking.userId === userId) || null;
}

function check({ villaId, startDate, endDate, guests }) {
  const villa = villaModel.findById(villaId, { includeHidden: false });
  if (!villa) throw httpError(404, "Villa not found.");
  const price = quote(villa, startDate, endDate, guests);
  const reason = explainConflict(villaId, startDate, endDate);
  return { available: !reason, reason, ...price, villaId: villa.id };
}

function create({ userId, villaId, startDate, endDate, guests }) {
  const preview = check({ villaId, startDate, endDate, guests });
  if (!preview.available) throw httpError(409, preview.reason);
  const booking = {
    id: crypto.randomUUID(),
    userId,
    villaId: preview.villaId,
    startDate,
    endDate,
    guests,
    nights: preview.nights,
    total: preview.total,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  save([...all(), booking]);
  return present(booking);
}

function cancel(id, actor) {
  const bookings = all();
  const booking = bookings.find((item) => item.id === id);
  if (!booking) throw httpError(404, "Booking not found.");
  const isOwner = booking.userId === actor.id;
  if (!isOwner && actor.role !== "host") throw httpError(403, "You cannot change this booking.");
  if (booking.status !== "confirmed") throw httpError(409, "This booking is already cancelled.");
  if (isOwner && actor.role !== "host" && booking.startDate <= new Date().toISOString().slice(0, 10)) {
    throw httpError(409, "A stay that has started cannot be cancelled.");
  }
  booking.status = "cancelled";
  booking.cancelledAt = new Date().toISOString();
  save(bookings);
  return present(booking, { includeGuest: actor.role === "host" });
}

module.exports = { listForUser, listForHost, findOwned, check, create, cancel };
