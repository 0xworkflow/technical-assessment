const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const env = require("./config/env");
const session = require("./config/session");
const errorHandler = require("./middleware/errorHandler");
const noteRoutes = require("./routes/note.routes");
const villaRoutes = require("./routes/villa.routes");
const contactRoutes = require("./routes/contact.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const villaAdminRoutes = require("./routes/villaAdmin.routes");
const bookingRoutes = require("./routes/booking.routes");
const availabilityRoutes = require("./routes/availability.routes");
const reviewRoutes = require("./routes/review.routes");
const inboxRoutes = require("./routes/inbox.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: [
      env.clientOrigin,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    index: false,
    dotfiles: "deny",
    fallthrough: false,
    setHeaders(res) {
      res.set("X-Content-Type-Options", "nosniff");
      res.set("Cache-Control", "public, max-age=86400");
    },
  })
);
app.use(session);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/notes", noteRoutes);
app.use("/villas", villaRoutes);
app.use("/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/villas", villaAdminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/inquiries", inboxRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found." });
});
app.use(errorHandler);

module.exports = app;
