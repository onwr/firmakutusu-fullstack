const express = require("express");
const router = express.Router();
const KampanyalarController = require("../../controllers/firma/KampanyalarController");
const authMiddleware = require("../../middleware/authMiddleware");

// Tüm kampanyaları getir
router.get("/:firmaId", KampanyalarController.getKampanyalar);

// Yeni kampanya oluştur
router.post("/", authMiddleware, KampanyalarController.createKampanya);

// Kampanya güncelle
router.put(
  "/:kampanyaId",
  authMiddleware,
  KampanyalarController.updateKampanya
);

// Sil
router.delete(
  "/:kampanyaId",
  authMiddleware,
  KampanyalarController.deleteKampanya
);

// Kampanyalar ayarlarını getir
router.get("/ayarlar/:firmaId", KampanyalarController.getKampanyalarAyarlar);

// Kampanyalar ayarlarını güncelle
router.put(
  "/guncelle/ayarlar",
  authMiddleware,
  KampanyalarController.updateKampanyalarAyarlar
);

module.exports = router;
