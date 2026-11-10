const availabilityModel = require("../models/availability.model");
const villaModel = require("../models/villa.model");

exports.list = (req, res) => {
  const villa = villaModel.findById(req.query.villaId, { includeHidden: true });
  if (!villa) return res.status(404).json({ message: "Villa not found." });
  return res.json(availabilityModel.listForVilla(villa.id));
};

exports.create = (req, res) => {
  const villa = villaModel.findById(req.body.villaId, { includeHidden: true });
  if (!villa) return res.status(404).json({ message: "Villa not found." });
  const block = availabilityModel.create({
    villaId: villa.id,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason,
  });
  res.status(201).json(block);
};

exports.remove = (req, res) => {
  const removed = availabilityModel.remove(req.params.id);
  if (!removed) return res.status(404).json({ message: "Blocked dates were not found." });
  return res.status(204).send();
};
