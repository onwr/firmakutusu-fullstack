const express = require("express");
const router = express.Router();
const dogrulamaController = require("../controllers/dogrulamaController");
const authMiddleware = require("../middleware/authMiddleware");

// Tüm rotalara tanımladım middleware'i
router.use(authMiddleware);

// POST /api/dogrulama/yetkili-kisi - Bilgileri kaydet
router.post("/yetkili-kisi", dogrulamaController.saveYetkiliKisi);

// POST /api/dogrulama/sms-gonder - SMS kodu gönder
router.post("/sms-gonder", dogrulamaController.sendVerificationCode);

// POST /api/dogrulama/dogrula - SMS kodu doğrula
router.post("/dogrula", dogrulamaController.verifyCode);

// GET /api/dogrulama/yetkili-kisi - Yetkili kişi bilgilerini getir
router.get("/yetkili-kisi", dogrulamaController.getYetkiliKisi);

module.exports = router;
