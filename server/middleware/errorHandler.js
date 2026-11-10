module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = Number(err.status) || 500;
  if (status >= 500) {
    console.error(err);
  }

  return res.status(status).json({
    message: status >= 500 ? "Internal Server Error" : err.message,
  });
};
