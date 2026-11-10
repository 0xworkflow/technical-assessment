const userModel = require("../models/user.model");
const inquiryModel = require("../models/inquiry.model");

exports.getProfile = (req, res) => {
  res.json({ user: userModel.toPublic(req.user) });
};

exports.updateProfile = (req, res) => {
  const user = userModel.updateProfile(req.user.id, req.body);
  res.json({ user: userModel.toPublic(user) });
};

exports.changePassword = async (req, res) => {
  const user = await userModel.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  res.json({ user: userModel.toPublic(user) });
};

exports.becomeHost = (req, res) => {
  const user = userModel.becomeHost(req.user.id);
  res.json({ user: userModel.toPublic(user) });
};

exports.listInquiries = (req, res) => {
  const inquiries = inquiryModel.listForUser(req.user.id).map(inquiryModel.toPublic);
  res.json(inquiries);
};
