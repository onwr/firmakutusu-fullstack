const express = require("express");
const router = express.Router();
const firmaController = require("../controllers/FirmaController");
const authMiddleware = require("../middleware/authMiddleware");

// Yeni firma oluştur
router.post("/", authMiddleware, firmaController.createFirma);

// Firma bilgilerini güncelle
router.put("/", authMiddleware, firmaController.updateFirma);

// Firma bilgilerini getir
router.get("/", authMiddleware, firmaController.getFirma);

// Firma bilgilerini getir id ile
router.get("/:firma_id", firmaController.getFirmaById);

// Vergi no doğrula
router.post("/verify-vkn", authMiddleware, firmaController.verifyVKN);

// Firma arama
router.get("/search/query", firmaController.searchFirmalar);

// Firma bilgilerini getir vkn ile
router.get("/vkn/:vkn", firmaController.getFirmaByVKN);

// Vitrin firmaları getir
router.get("/vitrin/firmalar", firmaController.getVitrinFirmalar);

module.exports = router;
