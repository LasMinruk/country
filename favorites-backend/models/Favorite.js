const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  country: { type: Object, required: true },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
