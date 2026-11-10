const express = require("express");
const villa = require("../controllers/villa.controller");
const requireHost = require("../middleware/requireHost");

const router = express.Router();

router.get("/", requireHost, villa.manageList);

module.exports = router;
