let notes = [];
let nextId = 1;

function findById(id) {
  return notes.find((note) => note.id === id) || null;
}

function create({ title, content }) {
  const timestamp = new Date().toISOString();
  const note = {
    id: String(nextId++),
    title,
    content,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  notes.push(note);
  return note;
}

function list() {
  return notes;
}

function update(id, { title, content }) {
  const note = findById(id);
  if (!note) return null;
  note.title = title;
  note.content = content;
  note.updatedAt = new Date().toISOString();
  return note;
}

function remove(id) {
  const note = findById(id);
  if (!note) return false;
  notes = notes.filter((item) => item.id !== id);
  return true;
}

module.exports = { findById, create, list, update, remove };
