const port = Number(process.env.PORT) || 5001;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  console.warn("SESSION_SECRET is not set. Using a development-only secret.");
}

module.exports = {
  port,
  clientOrigin,
  sessionSecret: sessionSecret || "royal-city-dev-session-secret",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleCallbackUrl:
    process.env.GOOGLE_CALLBACK_URL ||
    `http://localhost:${port}/api/auth/google/callback`,
};
