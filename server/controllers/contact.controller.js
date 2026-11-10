const inquiryModel = require("../models/inquiry.model");

exports.createInquiry = (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }

  const inquiry = inquiryModel.create({
    name,
    email,
    message,
    userId: req.session?.userId || null,
  });

  return res.status(201).json(inquiryModel.toPublic(inquiry));
};
