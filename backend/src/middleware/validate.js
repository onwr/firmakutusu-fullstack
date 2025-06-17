const { body, validationResult } = require("express-validator");

const authValidation = {
  register: [
    body("email").isEmail().withMessage("Geçersiz e-posta adresi"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Şifre en az 8 karakter olmalı"),
    body("kvkk_onay").isBoolean().withMessage("KVKK onayı gereklidir"),
  ],

  login: [
    body("email").isEmail().withMessage("Geçersiz e-posta adresi"),
    body("password").notEmpty().withMessage("Şifre gereklidir"),
  ],

  sendResetCode: [
    body("phoneNumber")
      .matches(/^[0-9]{10}$/)
      .withMessage("Geçerli bir telefon numarası giriniz (5XX XXX XX XX)"),
  ],

  verifyResetCode: [
    body("phoneNumber")
      .matches(/^[0-9]{10}$/)
      .withMessage("Geçerli bir telefon numarası giriniz (5XX XXX XX XX)"),
    body("code")
      .isLength({ min: 6, max: 6 })
      .withMessage("Doğrulama kodu 6 haneli olmalıdır"),
  ],

  resetPassword: [
    body("phoneNumber")
      .matches(/^[0-9]{10}$/)
      .withMessage("Geçerli bir telefon numarası giriniz (5XX XXX XX XX)"),
    body("code")
      .isLength({ min: 6, max: 6 })
      .withMessage("Doğrulama kodu 6 haneli olmalıdır"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Şifre en az 6 karakter olmalıdır"),
  ],
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  authValidation,
  validate,
};
