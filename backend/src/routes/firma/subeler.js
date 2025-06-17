const express = require("express");
const router = express.Router();
const SubelerController = require("../../controllers/firma/SubelerController");
const authMiddleware = require("../../middleware/authMiddleware");

// Tüm şubeleri getir
router.get("/:firmaId", SubelerController.getSubeler);

// Belirli bir şubeyi getir
router.get("/sube/:id", SubelerController.getSubeById);

// Yeni şube oluştur
router.post("/", authMiddleware, SubelerController.createSube);

// Şube güncelle
router.put("/:id", authMiddleware, SubelerController.updateSube);

// Şube sil
router.delete("/:id", authMiddleware, SubelerController.deleteSube);

module.exports = router;
