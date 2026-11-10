const crypto = require("crypto");
const store = require("./store");
const userModel = require("./user.model");
const { today, httpError } = require("../services/dates");

function all() {
  const saved = store.get("reviews");
  return Array.isArray(saved) ? saved : [];
}

function save(reviews) {
  store.set("reviews", reviews);
}

function summary(villaId) {
  const reviews = all().filter((review) => String(review.villaId) === String(villaId));
  if (!reviews.length) return { count: 0, average: null };
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return { count: reviews.length, average: Math.round((total / reviews.length) * 10) / 10 };
}

function listForVilla(villaId) {
  return all()
    .filter((review) => String(review.villaId) === String(villaId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((review) => {
      const author = userModel.findById(review.userId);
      return {
        id: review.id,
        villaId: review.villaId,
        rating: review.rating,
        comment: review.comment,
        author: author?.name || "Guest",
        createdAt: review.createdAt,
      };
    });
}

function create({ userId, booking, rating, comment }) {
  if (booking.userId !== userId) throw httpError(403, "You can only review your own stay.");
  if (booking.status !== "confirmed") throw httpError(409, "Cancelled stays cannot be reviewed.");
  if (booking.endDate > today()) throw httpError(409, "You can review a stay after check-out.");
  if (all().some((review) => review.bookingId === booking.id)) {
    throw httpError(409, "This stay already has a review.");
  }
  const review = {
    id: crypto.randomUUID(),
    bookingId: booking.id,
    villaId: booking.villaId,
    userId,
    rating,
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };
  save([...all(), review]);
  return listForVilla(review.villaId).find((item) => item.id === review.id);
}

module.exports = { summary, listForVilla, create };
