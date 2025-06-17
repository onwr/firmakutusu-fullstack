const express = require("express");
const router = express.Router();
const faaliyetController = require("../../controllers/firma/faaliyetController");
const authMiddleware = require("../../middleware/authMiddleware");

// GET - /api/firma/faaliyet Faaliyet Alanlarını Getir
router.get("/:firma_id", faaliyetController.getFaaliyetAlanlari);

// POST - /api/firma/faaliyet Faaliyet Alanı Oluştur
router.post("/", authMiddleware, faaliyetController.createFaaliyetAlanlari);

// PUT - /api/firma/faaliyet/:id Faaliyet Alanını Güncelle
router.put("/:id", authMiddleware, faaliyetController.updateFaaliyetAlani);

// DELETE - /api/firma/faaliyet/:id Faaliyet Alanını Sil
router.delete("/:id", authMiddleware, faaliyetController.deleteFaaliyetAlani);

module.exports = router;
