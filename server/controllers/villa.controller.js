const villaModel = require("../models/villa.model");

const SORTS = new Set(["name", "rating", "price", "newest"]);

function filters(query, includeHidden) {
  return {
    place: String(query.place || "").trim(),
    category: String(query.category || "").trim(),
    q: String(query.q || "").trim(),
    sort: SORTS.has(query.sort) ? query.sort : "",
    includeHidden,
  };
}

function fromBody(body) {
  return {
    name: body.name.trim(),
    location: body.location.trim(),
    category: body.category.trim(),
    guests: Number(body.guests),
    bedrooms: Number(body.bedrooms),
    bathrooms: Number(body.bathrooms),
    squareMeter: String(body.squareMeter).trim(),
    rating: Number(body.rating),
    image: body.image.trim(),
    dailyRent: String(body.dailyRent).trim(),
    description: (body.description || "").trim(),
    status: body.status === "draft" ? "draft" : "published",
  };
}

exports.getVillas = (req, res) => {
  res.json(villaModel.list(filters(req.query, false)));
};

exports.getVilla = (req, res) => {
  const villa = villaModel.findById(req.params.id, { includeHidden: false });
  if (!villa) {
    return res.status(404).json({ message: "Villa not found." });
  }
  return res.json(villa);
};

exports.manageList = (req, res) => {
  res.json(villaModel.list(filters(req.query, true)));
};

exports.createVilla = (req, res) => {
  const villa = villaModel.create(fromBody(req.body), req.user.id);
  res.status(201).json(villa);
};

exports.updateVilla = (req, res) => {
  const villa = villaModel.update(req.params.id, fromBody(req.body));
  if (!villa) {
    return res.status(404).json({ message: "Villa not found." });
  }
  return res.json(villa);
};

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Choose an image to upload." });
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  return res.status(201).json({ url });
};

exports.deleteVilla = (req, res) => {
  const removed = villaModel.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: "Villa not found." });
  }
  return res.status(204).send();
};
