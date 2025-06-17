const express = require("express");
const router = express.Router();
const ReferanslarController = require("../../controllers/firma/ReferanslarController");
const authMiddleware = require("../../middleware/authMiddleware");

// Tüm referansları getir
router.get("/:firmaId", ReferanslarController.getReferanslar);

// Gelen referans taleplerini getir
router.get(
  "/gelen/:firmaId",
  authMiddleware,
  ReferanslarController.getGelenReferanslar
);

// Yeni referans oluştur
router.post("/", authMiddleware, ReferanslarController.createReferans);

// Referans güncelle
router.put(
  "/:referansId",
  authMiddleware,
  ReferanslarController.updateReferans
);

// Referanslar ayarlarını getir
router.get("/ayarlar/:firmaId", ReferanslarController.getReferanslarAyarlar);

// Referanslar ayarlarını güncelle
router.put(
  "/guncelle/ayarlar",
  authMiddleware,
  ReferanslarController.updateReferanslarAyarlar
);

module.exports = router;
