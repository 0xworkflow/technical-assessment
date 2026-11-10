const express = require("express");
const { body } = require("express-validator");
const review = require("../controllers/review.controller");
const asyncHandler = require("../middleware/asyncHandler");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");
const { writeLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  writeLimiter,
  [
    body("bookingId").isUUID().withMessage("Choose the stay you want to review."),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be a whole number from 1 to 5.").toInt(),
    body("comment").trim().isLength({ min: 2, max: 400 }).withMessage("Comment must be 2 to 400 characters."),
  ],
  validate,
  asyncHandler(review.create)
);

module.exports = router;
