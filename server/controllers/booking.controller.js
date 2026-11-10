const bookingModel = require("../models/booking.model");

exports.check = (req, res) => {
  const result = bookingModel.check({
    villaId: req.params.id,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    guests: Number(req.query.guests || 1),
  });
  res.json(result);
};

exports.create = (req, res) => {
  const booking = bookingModel.create({
    userId: req.user.id,
    villaId: req.body.villaId,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    guests: Number(req.body.guests),
  });
  res.status(201).json(booking);
};

exports.list = (req, res) => {
  const bookings = req.user.role === "host" ? bookingModel.listForHost(req.user.id) : bookingModel.listForUser(req.user.id);
  res.json(bookings);
};

exports.cancel = (req, res) => {
  res.json(bookingModel.cancel(req.params.id, req.user));
};
