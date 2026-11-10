const reviewModel = require("../models/review.model");
const bookingModel = require("../models/booking.model");
const villaModel = require("../models/villa.model");

exports.list = (req, res) => {
  const villa = villaModel.findById(req.params.id, { includeHidden: false });
  if (!villa) return res.status(404).json({ message: "Villa not found." });
  return res.json(reviewModel.listForVilla(villa.id));
};

exports.create = (req, res) => {
  const booking = bookingModel.findOwned(req.body.bookingId, req.user.id);
  if (!booking) return res.status(404).json({ message: "Booking not found." });
  const review = reviewModel.create({
    userId: req.user.id,
    booking,
    rating: Number(req.body.rating),
    comment: req.body.comment,
  });
  res.status(201).json(review);
};
