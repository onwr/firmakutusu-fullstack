const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const redisClient = require("../config/redis");
const { sendWelcomeEmail } = require("../config/email");
const YetkiliKisi = require("../models/YetkiliKisi");
const SMSService = require("../middleware/smsService");

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, kvkk_onay } = req.body;

      const existingUser = await User.findByEmail(email);

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Bu e-posta adresiyle daha önce kayıt yapılmış",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        email,
        password_hash: passwordHash,
        kvkk_onay,
      });

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          is_admin: user.admin,
          yetkili_kisi_id: null,
          firma_id: null,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      await sendWelcomeEmail(email, email.split("@")[0]);

      res.status(201).json({
        success: true,
        message: "Kullanıcı başarıyla kaydedildi",
        token,
      });
    } catch (error) {
      console.error("Kullanıcı kayıt hatası:", error);
      res.status(500).json({
        success: false,
        message: "Kullanıcı kayıt hatası",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz e-posta adresi veya şifre",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz e-posta adresi veya şifre",
        });
      }

      const yetkiliKisi = await YetkiliKisi.findByUserId(user.user_id);

      const token = jwt.sign(
        {
          userId: user.user_id,
          email: user.email,
          yetkili_kisi_id: user.yetkili_kisi_id,
          firma_id: yetkiliKisi ? yetkiliKisi.firma_id : null,
          is_admin: user.admin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "48h" }
      );

      if (process.env.NODE_ENV === "production") {
        await redisClient.set(`auth_${user.id}`, token, {
          EX: 86400,
        });
      }

      res.json({
        success: true,
        message: "Giriş başarılı",
        token,
      });
    } catch (error) {
      console.error("Giriş hatası:", error);
      res.status(500).json({
        success: false,
        message: "Giriş hatası",
      });
    }
  },

  me: async (req, res) => {
    try {
      const { userId } = req.user;

      const user = await User.me(userId);

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Kullanıcı durum hatası:", error);
      res.status(500).json({
        success: false,
        message: "Kullanıcı durum hatası",
      });
    }
  },

  // Şifre sıfırlama controller'ları
  sendResetCode: async (req, res) => {
    try {
      const { phoneNumber } = req.body;

      // Telefon numarasına sahip kullanıcıyı bul
      const user = await User.findByPhoneNumber(phoneNumber);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Bu telefon numarasına kayıtlı kullanıcı bulunamadı",
        });
      }

      // Doğrulama kodu oluştur ve gönder
      const code = SMSService.generateVerificationCode();
      const message = `FirmaKutusu şifre sıfırlama kodunuz: ${code}`;

      const smsSent = await SMSService.sendSMS(phoneNumber, message);
      if (!smsSent) {
        return res.status(500).json({
          success: false,
          message: "SMS gönderilemedi",
        });
      }

      // Kodu Redis'e kaydet
      await SMSService.saveVerificationCode(user.user_id, code);

      res.json({
        success: true,
        message: "Doğrulama kodu gönderildi",
      });
    } catch (error) {
      console.error("Şifre sıfırlama kodu gönderme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Şifre sıfırlama kodu gönderilemedi",
      });
    }
  },

  verifyResetCode: async (req, res) => {
    try {
      const { phoneNumber, code } = req.body;

      console.log(phoneNumber, code);

      // Telefon numarasına sahip kullanıcıyı bul
      const user = await User.findByPhoneNumber(phoneNumber);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Bu telefon numarasına kayıtlı kullanıcı bulunamadı",
        });
      }

      console.log(user);

      // Kodu doğrula
      const isValid = await SMSService.verifyCode(user.user_id, code);
      console.log(isValid);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz doğrulama kodu",
        });
      }

      res.json({
        success: true,
        message: "Kod doğrulandı",
      });
    } catch (error) {
      console.error("Kod doğrulama hatası:", error);
      res.status(500).json({
        success: false,
        message: "Kod doğrulanamadı",
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { phoneNumber, code, newPassword } = req.body;

      // Telefon numarasına sahip kullanıcıyı bul
      const user = await User.findByPhoneNumber(phoneNumber);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Bu telefon numarasına kayıtlı kullanıcı bulunamadı",
        });
      }

      // Kodu doğrula
      const isValid = await SMSService.verifyCode(user.user_id, code);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz doğrulama kodu",
        });
      }

      // Yeni şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      // Şifreyi güncelle
      await User.updatePassword(user.user_id, passwordHash);

      // Kullanılan kodu Redis'ten sil
      await SMSService.deleteVerificationCode(user.user_id);

      res.json({
        success: true,
        message: "Şifre başarıyla güncellendi",
      });
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
      res.status(500).json({
        success: false,
        message: "Şifre sıfırlama işlemi başarısız oldu",
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const { userId } = req.user;

      // Kullanıcıyı bul
      const user = await User.me(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Kullanıcı bulunamadı",
        });
      }

      // Mevcut şifreyi kontrol et
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Geçerli şifreniz yanlış.",
        });
      }

      // Yeni şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      // Şifreyi güncelle
      await User.updatePassword(userId, passwordHash);

      res.json({
        success: true,
        message: "Şifre başarıyla güncellendi",
      });
    } catch (error) {
      console.error("Şifre güncelleme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Şifre güncellenemedi",
      });
    }
  },

  // Hesap silme için doğrulama kodu gönder
  sendDeleteCode: async (req, res) => {
    try {
      const { userId } = req.user;

      // Kullanıcıyı bul
      const user = await User.me(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Kullanıcı bulunamadı",
        });
      }

      // Yetkili kişi bilgilerini kontrol et
      if (!user.yetkiliKisi || !user.yetkiliKisi.telefon_no) {
        return res.status(400).json({
          success: false,
          message: "Telefon numaranız sistemde kayıtlı değil",
        });
      }

      // Doğrulama kodu oluştur ve gönder
      const code = SMSService.generateVerificationCode();
      const message = `FirmaKutusu hesap silme doğrulama kodunuz: ${code}`;

      const smsSent = await SMSService.sendSMS(
        user.yetkiliKisi.telefon_no,
        message
      );
      if (!smsSent.success) {
        return res.status(500).json({
          success: false,
          message: "SMS gönderilemedi",
        });
      }

      // Kodu Redis'e kaydet (hesap silme için özel key)
      await SMSService.saveVerificationCode(userId, code, "delete");

      res.json({
        success: true,
        message: "Hesap silme doğrulama kodu gönderildi",
      });
    } catch (error) {
      console.error("Hesap silme kodu gönderme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Doğrulama kodu gönderilemedi",
      });
    }
  },

  // Hesap silme
  deleteAccount: async (req, res) => {
    try {
      const { verificationCode } = req.body;
      const { userId } = req.user;

      // Kullanıcıyı bul
      const user = await User.me(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Kullanıcı bulunamadı",
        });
      }

      // Doğrulama kodunu kontrol et
      const isValid = await SMSService.verifyCode(
        userId,
        verificationCode,
        "delete"
      );
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz doğrulama kodu",
        });
      }

      // Kullanıcıyı ve ilişkili verileri sil
      await User.deleteById(userId);
      await SMSService.deleteVerificationCode(userId, "delete");

      res.json({
        success: true,
        message: "Hesap ve tüm veriler başarıyla silindi.",
      });
    } catch (error) {
      console.error("Hesap silme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Hesap silinemedi.",
      });
    }
  },
};

module.exports = authController;
