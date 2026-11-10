const crypto = require("crypto");
const env = require("../config/env");
const userModel = require("../models/user.model");
const google = require("../services/google");

function regenerate(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => (error ? reject(error) : resolve()));
  });
}

function clientError(code) {
  return `${env.clientOrigin}/login?error=${code}`;
}

exports.register = async (req, res) => {
  const user = await userModel.createLocal(req.body);
  await regenerate(req);
  req.session.userId = user.id;
  await saveSession(req);
  res.status(201).json({ user: userModel.toPublic(user) });
};

exports.login = async (req, res) => {
  const user = await userModel.authenticate(req.body.email, req.body.password);
  await regenerate(req);
  req.session.userId = user.id;
  await saveSession(req);
  res.json({ user: userModel.toPublic(user) });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("royalcity.sid");
    res.status(204).send();
  });
};

exports.me = (req, res) => {
  const user = req.session?.userId ? userModel.findById(req.session.userId) : null;
  res.json({ user: userModel.toPublic(user) });
};

exports.googleStart = async (req, res) => {
  if (!google.isConfigured()) {
    return res.redirect(clientError("google_not_configured"));
  }

  req.session.googleState = crypto.randomBytes(16).toString("hex");
  await saveSession(req);
  return res.redirect(google.authorizationUrl(req.session.googleState));
};

exports.googleCallback = async (req, res) => {
  if (req.query.error) {
    return res.redirect(clientError("google_denied"));
  }

  const { code, state } = req.query;
  if (!code || !state || state !== req.session.googleState) {
    return res.redirect(clientError("google_state"));
  }

  try {
    const profile = await google.exchangeCode(code);
    const user = await userModel.upsertGoogle(profile);
    await regenerate(req);
    req.session.userId = user.id;
    await saveSession(req);
    return res.redirect(`${env.clientOrigin}/profile`);
  } catch (error) {
    console.error(error);
    return res.redirect(clientError("google_failed"));
  }
};
