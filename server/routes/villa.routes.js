const express = require("express");
const { body } = require("express-validator");
const villa = require("../controllers/villa.controller");
const booking = require("../controllers/booking.controller");
const review = require("../controllers/review.controller");
const asyncHandler = require("../middleware/asyncHandler");
const requireHost = require("../middleware/requireHost");
const validate = require("../middleware/validate");
const { stayQuery } = require("../middleware/stayRules");

const router = express.Router();

const imageRule = body("image")
  .trim()
  .custom((value) => value.startsWith("/") || /^https?:\/\/\S+$/i.test(value))
  .withMessage("Image must be a site path or an http(s) URL.");

const villaRules = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2 to 80 characters."),
  body("location").trim().isLength({ min: 2, max: 40 }).withMessage("Location must be 2 to 40 characters."),
  body("category").trim().isLength({ min: 2, max: 40 }).withMessage("Category must be 2 to 40 characters."),
  body("guests").isInt({ min: 1, max: 40 }).withMessage("Guests must be between 1 and 40."),
  body("bedrooms").isInt({ min: 1, max: 30 }).withMessage("Bedrooms must be between 1 and 30."),
  body("bathrooms").isInt({ min: 1, max: 30 }).withMessage("Bathrooms must be between 1 and 30."),
  body("squareMeter").trim().matches(/^\d{2,5}$/).withMessage("Size must be a whole number of square meters."),
  body("rating").isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5."),
  body("dailyRent").trim().matches(/^\d{1,6}$/).withMessage("Daily rent must be a whole number."),
  body("description").optional({ values: "falsy" }).trim().isLength({ max: 500 }).withMessage("Description must be 500 characters or fewer."),
  body("status").optional({ values: "falsy" }).isIn(["published", "draft"]).withMessage("Status must be published or draft."),
  imageRule,
];

router.get("/", villa.getVillas);
router.get("/:id/availability", stayQuery, validate, asyncHandler(booking.check));
router.get("/:id/reviews", review.list);
router.get("/:id", villa.getVilla);
router.post("/", requireHost, villaRules, validate, asyncHandler(villa.createVilla));
router.put("/:id", requireHost, villaRules, validate, asyncHandler(villa.updateVilla));
router.delete("/:id", requireHost, villa.deleteVilla);

module.exports = router;
