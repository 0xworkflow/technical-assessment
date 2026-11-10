const express = require("express");
const availability = require("../controllers/availability.controller");
const asyncHandler = require("../middleware/asyncHandler");
const requireHost = require("../middleware/requireHost");
const validate = require("../middleware/validate");
const { blockBody } = require("../middleware/stayRules");
const { writeLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.use(requireHost);
router.get("/", availability.list);
router.post("/", writeLimiter, blockBody, validate, asyncHandler(availability.create));
router.delete("/:id", writeLimiter, availability.remove);

module.exports = router;
