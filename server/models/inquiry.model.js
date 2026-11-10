const crypto = require("crypto");
const store = require("./store");

function list() {
  return store.get("inquiries");
}

function create({ name, email, message, userId }) {
  const inquiry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    userId: userId || null,
    read: false,
    reply: "",
    repliedAt: null,
    createdAt: new Date().toISOString(),
  };
  store.set("inquiries", [...list(), inquiry]);
  return inquiry;
}

function listForUser(userId) {
  return list().filter((inquiry) => inquiry.userId === userId);
}

function toPublic(inquiry) {
  return {
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    message: inquiry.message,
    reply: inquiry.reply || "",
    repliedAt: inquiry.repliedAt || null,
    createdAt: inquiry.createdAt,
  };
}

function toHost(inquiry) {
  return {
    ...toPublic(inquiry),
    read: Boolean(inquiry.read),
  };
}

function listForHost() {
  return list()
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toHost);
}

function find(id) {
  return list().find((inquiry) => inquiry.id === id) || null;
}

function markRead(id) {
  const inquiry = find(id);
  if (!inquiry) return null;
  inquiry.read = true;
  store.set("inquiries", list());
  return toHost(inquiry);
}

function reply(id, message) {
  const inquiry = find(id);
  if (!inquiry) return null;
  inquiry.reply = message.trim();
  inquiry.repliedAt = new Date().toISOString();
  inquiry.read = true;
  store.set("inquiries", list());
  return toHost(inquiry);
}

module.exports = { create, listForUser, listForHost, markRead, reply, toPublic };
