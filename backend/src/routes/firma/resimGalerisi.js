const express = require("express");
const router = express.Router();
const ResimGalerisiController = require("../../controllers/firma/ResimGalerisiController");
const authMiddleware = require("../../middleware/authMiddleware");

// Tüm resimleri getir
router.get("/:firmaId", ResimGalerisiController.getResimler);

// Yeni resim ekle
router.post("/", authMiddleware, ResimGalerisiController.createResim);

// Resim sil
router.delete("/:resimId", authMiddleware, ResimGalerisiController.deleteResim);

// Resim galerisi ayarlarını getir
router.get(
  "/ayarlar/:firmaId",
  ResimGalerisiController.getResimGalerisiAyarlar
);

// Resim galerisi ayarlarını güncelle
router.put(
  "/guncelle/ayarlar",
  authMiddleware,
  ResimGalerisiController.updateResimGalerisiAyarlar
);

module.exports = router;
