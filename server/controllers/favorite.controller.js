const favoriteModel = require("../models/favorite.model");

exports.list = (req, res) => {
  res.json(favoriteModel.listForUser(req.user.id));
};

exports.add = (req, res) => {
  const { created, favorite } = favoriteModel.add(req.user.id, req.params.villaId);
  const saved = favoriteModel.listForUser(req.user.id).find((item) => item.id === favorite.id);
  res.status(created ? 201 : 200).json(saved);
};

exports.remove = (req, res) => {
  favoriteModel.remove(req.user.id, req.params.villaId);
  res.status(204).send();
};
