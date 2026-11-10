const express = require("express");
const villa = require("../controllers/villa.controller");
const requireHost = require("../middleware/requireHost");
const { uploadImage } = require("../middleware/upload");
const { uploadLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/", requireHost, uploadLimiter, uploadImage, villa.uploadImage);

module.exports = router;
