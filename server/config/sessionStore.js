const fs = require("fs");
const path = require("path");
const { Store } = require("express-session");

const file = path.join(__dirname, "../data/sessions.json");

class FileSessionStore extends Store {
  constructor() {
    super();
    this.sessions = this.read();
  }

  read() {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return {};
    }
  }

  write() {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(this.sessions));
  }

  get(sid, callback) {
    const session = this.sessions[sid];
    if (!session) return callback(null, null);
    const expires = session.cookie?.expires;
    if (expires && new Date(expires).getTime() <= Date.now()) {
      delete this.sessions[sid];
      this.write();
      return callback(null, null);
    }
    return callback(null, session);
  }

  set(sid, session, callback) {
    this.sessions[sid] = session;
    this.write();
    callback(null);
  }

  destroy(sid, callback) {
    delete this.sessions[sid];
    this.write();
    callback(null);
  }
}

module.exports = FileSessionStore;
