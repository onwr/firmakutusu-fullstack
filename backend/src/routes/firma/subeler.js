const express = require("express");
const router = express.Router();
const SubelerController = require("../../controllers/firma/SubelerController");
const authMiddleware = require("../../middleware/authMiddleware");

// Belirli bir şubeyi getir (bu route'u önce tanımla)
router.get("/sube/:id", SubelerController.getSubeById);

// Tüm şubeleri getir
router.get("/:firmaId", SubelerController.getSubeler);

// Yeni şube oluştur
router.post("/", authMiddleware, SubelerController.createSube);

// Şube güncelle
router.put("/:id", authMiddleware, SubelerController.updateSube);

// Şube sil
router.delete("/:id", authMiddleware, SubelerController.deleteSube);

module.exports = router;
