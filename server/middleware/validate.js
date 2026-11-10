const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array();
  return res.status(400).json({
    message: errors[0].msg,
    errors: errors.map((error) => ({ field: error.path, message: error.msg })),
  });
};
