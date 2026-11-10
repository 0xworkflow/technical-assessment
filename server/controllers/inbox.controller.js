const inquiryModel = require("../models/inquiry.model");

exports.list = (req, res) => {
  res.json(inquiryModel.listForHost());
};

exports.markRead = (req, res) => {
  const inquiry = inquiryModel.markRead(req.params.id);
  if (!inquiry) return res.status(404).json({ message: "Message not found." });
  return res.json(inquiry);
};

exports.reply = (req, res) => {
  const inquiry = inquiryModel.reply(req.params.id, req.body.reply);
  if (!inquiry) return res.status(404).json({ message: "Message not found." });
  return res.json(inquiry);
};
