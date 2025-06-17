const express = require("express");
const router = express.Router();
const KaliteBelgeleriController = require("../../controllers/firma/KaliteBelgeleriController");
const authMiddleware = require("../../middleware/authMiddleware");

// Tüm kalite belgelerini getir
router.get("/:firmaId", KaliteBelgeleriController.getKaliteBelgeleri);

// Yeni kalite belgesi oluştur
router.post("/", authMiddleware, KaliteBelgeleriController.createKaliteBelgesi);

// Kalite belgesi güncelle
router.put(
  "/:belgeId",
  authMiddleware,
  KaliteBelgeleriController.updateKaliteBelgesi
);

// Kalite belgeleri ayarlarını getir
router.get(
  "/ayarlar/:firmaId",
  KaliteBelgeleriController.getKaliteBelgeleriAyarlar
);

// Kalite belgeleri ayarlarını güncelle
router.put(
  "/guncelle/ayarlar",
  authMiddleware,
  KaliteBelgeleriController.updateKaliteBelgeleriAyarlar
);

module.exports = router;
