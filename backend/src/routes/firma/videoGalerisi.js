const express = require("express");
const router = express.Router();
const VideoGalerisiController = require("../../controllers/firma/VideoGalerisiController");
const authMiddleware = require("../../middleware/authMiddleware");

// Tüm videoları getir
router.get("/:firmaId", VideoGalerisiController.getVideolar);

// Yeni video ekle
router.post("/", authMiddleware, VideoGalerisiController.createVideo);

// Video sil
router.delete("/:videoId", authMiddleware, VideoGalerisiController.deleteVideo);

// Video galerisi ayarlarını getir
router.get(
  "/ayarlar/:firmaId",
  VideoGalerisiController.getVideoGalerisiAyarlar
);

// Video galerisi ayarlarını güncelle
router.put(
  "/guncelle/ayarlar",
  authMiddleware,
  VideoGalerisiController.updateVideoGalerisiAyarlar
);

module.exports = router;
