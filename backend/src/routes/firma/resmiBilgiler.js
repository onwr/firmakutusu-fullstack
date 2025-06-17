const express = require("express");
const router = express.Router();
const ResmiBilgilerController = require("../../controllers/firma/ResmiBilgilerController");
const authMiddleware = require("../../middleware/authMiddleware");

// Resmi bilgileri getir
router.get("/:firmaId", ResmiBilgilerController.getResmiBilgiler);

// Yeni resmi bilgiler oluştur
router.post("/", authMiddleware, ResmiBilgilerController.createResmiBilgiler);

// Resmi bilgileri güncelle
router.put("/", authMiddleware, ResmiBilgilerController.updateResmiBilgiler);

module.exports = router;
