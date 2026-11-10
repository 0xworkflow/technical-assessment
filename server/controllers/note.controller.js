const noteModel = require("../models/note.model");

exports.createNote = (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Both title and content are required." });
  }

  return res.status(201).json(noteModel.create({ title, content }));
};

exports.getAllNotes = (req, res) => {
  return res.json(noteModel.list());
};

exports.getNoteById = (req, res) => {
  const note = noteModel.findById(req.params.id);
  if (!note) {
    return res.status(404).json({ message: "Note not found." });
  }
  return res.json(note);
};

exports.updateNote = (req, res) => {
  const { title, content } = req.body;
  const existing = noteModel.findById(req.params.id);

  if (!existing) {
    return res.status(404).json({ message: "Note not found." });
  }

  if (!title || !content) {
    return res.status(400).json({ message: "Both title and content are required." });
  }

  return res.json(noteModel.update(req.params.id, { title, content }));
};

exports.deleteNote = (req, res) => {
  const removed = noteModel.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: "Note not found." });
  }
  return res.status(204).send();
};
