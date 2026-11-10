const userModel = require("../models/user.model");

module.exports = (req, res, next) => {
  const user = req.session?.userId ? userModel.findById(req.session.userId) : null;
  if (!user) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }
  req.user = user;
  return next();
};
