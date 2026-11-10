const express = require("express");
const { body } = require("express-validator");
const auth = require("../controllers/auth.controller");
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimit");

const router = express.Router();

const passwordRules = [
  body("password")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be 8 to 72 characters.")
    .matches(/[A-Za-z]/)
    .withMessage("Password must include a letter.")
    .matches(/[0-9]/)
    .withMessage("Password must include a number."),
];

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2 to 80 characters."),
    body("email").isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
    ...passwordRules,
  ],
  validate,
  asyncHandler(auth.register)
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  asyncHandler(auth.login)
);

router.post("/logout", auth.logout);
router.get("/me", auth.me);
router.get("/google", asyncHandler(auth.googleStart));
router.get("/google/callback", asyncHandler(auth.googleCallback));

module.exports = router;
