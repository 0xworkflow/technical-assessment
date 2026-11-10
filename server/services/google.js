const env = require("../config/env");

function isConfigured() {
  return Boolean(env.googleClientId && env.googleClientSecret);
}

function authorizationUrl(state) {
  const params = new URLSearchParams({
    client_id: env.googleClientId,
    redirect_uri: env.googleCallbackUrl,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function exchangeCode(code) {
  const body = new URLSearchParams({
    code,
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    redirect_uri: env.googleCallbackUrl,
    grant_type: "authorization_code",
  });

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!tokenResponse.ok) {
    const error = new Error("Google token exchange failed.");
    error.status = 502;
    throw error;
  }

  const token = await tokenResponse.json();
  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  if (!profileResponse.ok) {
    const error = new Error("Google profile request failed.");
    error.status = 502;
    throw error;
  }

  const profile = await profileResponse.json();
  if (!profile.sub || !profile.email) {
    const error = new Error("Google did not return an email address.");
    error.status = 502;
    throw error;
  }

  return {
    googleId: profile.sub,
    email: String(profile.email).toLowerCase(),
    name: profile.name || profile.email,
    avatarUrl: profile.picture || "",
  };
}

module.exports = { isConfigured, authorizationUrl, exchangeCode };
