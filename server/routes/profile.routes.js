const express = require("express");
const { body } = require("express-validator");
const profile = require("../controllers/profile.controller");
const asyncHandler = require("../middleware/asyncHandler");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(requireAuth);

router.get("/", profile.getProfile);
router.get("/inquiries", profile.listInquiries);
router.post("/host", profile.becomeHost);

router.patch(
  "/",
  [
    body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2 to 80 characters."),
    body("phone").optional({ values: "falsy" }).trim().isLength({ max: 30 }).withMessage("Phone must be 30 characters or fewer."),
    body("bio").optional({ values: "falsy" }).trim().isLength({ max: 280 }).withMessage("Bio must be 280 characters or fewer."),
  ],
  validate,
  profile.updateProfile
);

router.post(
  "/password",
  [
    body("currentPassword").optional({ values: "falsy" }),
    body("newPassword")
      .isLength({ min: 8, max: 72 })
      .withMessage("Password must be 8 to 72 characters.")
      .matches(/[A-Za-z]/)
      .withMessage("Password must include a letter.")
      .matches(/[0-9]/)
      .withMessage("Password must include a number."),
  ],
  validate,
  asyncHandler(profile.changePassword)
);

module.exports = router;
