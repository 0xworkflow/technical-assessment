const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../uploads");
const extensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination(req, file, callback) {
    fs.mkdirSync(uploadDir, { recursive: true });
    callback(null, uploadDir);
  },
  filename(req, file, callback) {
    callback(null, `${crypto.randomBytes(16).toString("hex")}${extensions[file.mimetype]}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    if (!extensions[file.mimetype]) {
      const error = new Error("Only JPEG, PNG, and WebP images are allowed.");
      error.status = 400;
      callback(error);
      return;
    }
    callback(null, true);
  },
});

function uploadImage(req, res, next) {
  upload.single("image")(req, res, (error) => {
    if (!error) return next();
    if (error.code === "LIMIT_FILE_SIZE") {
      error.status = 400;
      error.message = "Image must be 2 MB or smaller.";
    }
    if (!error.status) error.status = 400;
    return next(error);
  });
}

module.exports = { uploadImage };
