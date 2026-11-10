module.exports = (handler) => (req, res, next) => {
  try {
    Promise.resolve(handler(req, res, next)).catch(next);
  } catch (error) {
    next(error);
  }
};
