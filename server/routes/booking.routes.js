const express = require("express");
const booking = require("../controllers/booking.controller");
const asyncHandler = require("../middleware/asyncHandler");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");
const { stayBody } = require("../middleware/stayRules");
const { writeLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.use(requireAuth);
router.get("/", booking.list);
router.post("/", writeLimiter, stayBody, validate, asyncHandler(booking.create));
router.post("/:id/cancel", writeLimiter, asyncHandler(booking.cancel));

module.exports = router;
