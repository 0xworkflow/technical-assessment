const express = require("express");
const { body } = require("express-validator");
const inbox = require("../controllers/inbox.controller");
const asyncHandler = require("../middleware/asyncHandler");
const requireHost = require("../middleware/requireHost");
const validate = require("../middleware/validate");
const { writeLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.use(requireHost);
router.get("/", inbox.list);
router.post("/:id/read", inbox.markRead);
router.post(
  "/:id/reply",
  writeLimiter,
  [body("reply").trim().isLength({ min: 2, max: 1000 }).withMessage("Reply must be 2 to 1000 characters.")],
  validate,
  asyncHandler(inbox.reply)
);

module.exports = router;
