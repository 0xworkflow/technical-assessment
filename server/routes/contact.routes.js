const express = require("express");
const { body } = require("express-validator");
const contact = require("../controllers/contact.controller");
const validate = require("../middleware/validate");
const { writeLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post(
  "/",
  writeLimiter,
  [
    body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2 to 80 characters."),
    body("email").isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
    body("message").trim().isLength({ min: 2, max: 2000 }).withMessage("Message must be 2 to 2000 characters."),
  ],
  validate,
  contact.createInquiry
);

module.exports = router;
