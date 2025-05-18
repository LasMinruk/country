const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const favoriteRoutes = require("./routes/favoriteRoutes");
app.use("/api/favorites", favoriteRoutes);

const PORT = process.env.PORT || 5000;

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("DB connection error:", err));
}

module.exports = app;
