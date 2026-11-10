const express = require("express");
const favorite = require("../controllers/favorite.controller");
const asyncHandler = require("../middleware/asyncHandler");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);
router.get("/", favorite.list);
router.post("/:villaId", asyncHandler(favorite.add));
router.delete("/:villaId", asyncHandler(favorite.remove));

module.exports = router;
