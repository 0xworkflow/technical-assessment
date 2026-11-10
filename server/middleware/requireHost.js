const requireAuth = require("./requireAuth");

module.exports = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== "host") {
      return res.status(403).json({ message: "Only hosts can manage villas." });
    }
    return next();
  });
};
