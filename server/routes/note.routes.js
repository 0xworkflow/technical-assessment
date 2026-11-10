const express = require("express");
const note = require("../controllers/note.controller");

const router = express.Router();

router.post("/", note.createNote);
router.get("/", note.getAllNotes);
router.get("/:id", note.getNoteById);
router.put("/:id", note.updateNote);
router.delete("/:id", note.deleteNote);

module.exports = router;
