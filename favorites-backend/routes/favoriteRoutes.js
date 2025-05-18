const express = require("express");
const router = express.Router();
const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../controllers/favoriteController");

router.post("/", addFavorite);
router.get("/:email", getFavorites);
router.delete("/:email/:code", removeFavorite);

module.exports = router;
