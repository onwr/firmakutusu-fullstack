const express = require("express");
const router = express.Router();
const CalismaSaatleriController = require("../../controllers/firma/CalismaSaatleriController");
const authMiddleware = require("../../middleware/authMiddleware");

// Şubenin çalışma saatlerini getir
router.get("/:subeId", CalismaSaatleriController.getCalismaSaatleri);

// Yeni çalışma saati oluştur
router.post(
  "/:subeId",
  authMiddleware,
  CalismaSaatleriController.createCalismaSaatleri
);

// Çalışma saati güncelle
router.put(
  "/:id",
  authMiddleware,
  CalismaSaatleriController.updateCalismaSaatleri
);

// Çalışma saati sil
router.delete(
  "/:id",
  authMiddleware,
  CalismaSaatleriController.deleteCalismaSaatleri
);

module.exports = router;
