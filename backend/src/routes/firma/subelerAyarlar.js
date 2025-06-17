const express = require("express");
const router = express.Router();
const SubelerAyarlarController = require("../../controllers/firma/SubelerAyarlarController");
const authMiddleware = require("../../middleware/authMiddleware");

// Şube ayarlarını getir
router.get("/:firmaId", SubelerAyarlarController.getSubelerAyarlar);

// Yeni şube ayarları oluştur
router.post("/", authMiddleware, SubelerAyarlarController.createSubelerAyarlar);

// Şube ayarlarını güncelle
router.put("/", authMiddleware, SubelerAyarlarController.updateSubelerAyarlar);

module.exports = router;
