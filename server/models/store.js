const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/db.json");

const empty = () => ({
  users: [],
  inquiries: [],
  favorites: [],
});

function read() {
  try {
    return { ...empty(), ...JSON.parse(fs.readFileSync(file, "utf8")) };
  } catch {
    return empty();
  }
}

let data = read();

function get(key) {
  return data[key];
}

function set(key, value) {
  data[key] = value;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = { get, set };
