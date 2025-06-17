const express = require("express");
const router = express.Router();
const FavorilerController = require("../controllers/favoriController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, FavorilerController.getFavoriler);
router.post("/", authMiddleware, FavorilerController.addFavori);
router.delete("/", authMiddleware, FavorilerController.removeFavori);

module.exports = router;
