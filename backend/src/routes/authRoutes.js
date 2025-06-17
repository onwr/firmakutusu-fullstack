const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validate, authValidation } = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/auth/register - Kayit
router.post(
  "/register",
  authValidation.register,
  validate,
  authController.register
);

// POST /api/auth/login - Giris
router.post("/login", authValidation.login, validate, authController.login);

// GET /api/auth/me - Kullanici bilgileri
router.get("/me", authMiddleware, authController.me);

// Şifre sıfırlama route'ları
router.post(
  "/send-reset-code",
  authValidation.sendResetCode,
  validate,
  authController.sendResetCode
);
router.post(
  "/verify-reset-code",
  authValidation.verifyResetCode,
  validate,
  authController.verifyResetCode
);
router.post(
  "/reset-password",
  authValidation.resetPassword,
  validate,
  authController.resetPassword
);

module.exports = router;
