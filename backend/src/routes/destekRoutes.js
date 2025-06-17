const express = require("express");
const router = express.Router();
const destekController = require("../controllers/destekController");
const authMiddleware = require("../middleware/authMiddleware");

// Tüm destek rotaları için kimlik doğrulama gerekli
router.use(authMiddleware);

// Destek talepleri listesi
router.get("/", destekController.getTickets);

// Yeni destek talebi oluştur
router.post("/", destekController.createTicket);

// Destek talebi detayları
router.get("/:ticketId", destekController.getTicketDetails);

// Destek talebine mesaj ekle
router.post("/:ticketId/messages", destekController.addMessage);

// Destek talebi durumunu güncelle
router.patch("/:ticketId/status", destekController.updateTicketStatus);

module.exports = router;
