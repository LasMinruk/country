const Favorite = require("../models/Favorite");

exports.addFavorite = async (req, res) => {
  const { email, country } = req.body;
  try {
    const exists = await Favorite.findOne({ email, "country.cca3": country.cca3 });
    if (exists) return res.status(409).json({ message: "Already in favorites" });

    const favorite = new Favorite({ email, country });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ email: req.params.email });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  const { email, code } = req.params;
  try {
    await Favorite.deleteOne({ email, "country.cca3": code });
    res.status(200).json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
