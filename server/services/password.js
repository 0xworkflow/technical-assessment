const { scrypt, randomBytes, timingSafeEqual } = require("crypto");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, KEY_LENGTH);
  return { salt, hash: derived.toString("hex") };
}

async function verifyPassword(password, salt, hash) {
  const derived = await scryptAsync(password, salt, KEY_LENGTH);
  const actual = Buffer.from(hash, "hex");
  if (actual.length !== derived.length) {
    return false;
  }
  return timingSafeEqual(actual, derived);
}

module.exports = { hashPassword, verifyPassword };
