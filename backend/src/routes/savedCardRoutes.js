const express = require("express");
const router = express.Router();
const savedCardController = require("../controllers/savedCardController");
const auth = require("../middleware/authMiddleware");
router.use(auth);

// Kartları getir
router.get("/", savedCardController.getSavedCards);

// Yeni kart ekle
router.post("/", savedCardController.addCard);

// Kart güncelle
router.put("/:id", savedCardController.updateCard);

// Kart sil
router.delete("/:id", savedCardController.deleteCard);

// Varsayılan kartı ayarla
router.put("/:id/default", savedCardController.setDefaultCard);

module.exports = router;
