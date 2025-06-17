const YetkiliKisi = require("../models/YetkiliKisi");
const User = require("../models/User");
const SMSService = require("../middleware/smsService");
const jwt = require("jsonwebtoken");

const dogrulamaController = {
  saveYetkiliKisi: async (req, res) => {
    try {
      const { ad, soyad, tc_kimlik_no, telefon_no, bireysel } = req.body;
      const { userId } = req.user;

      console.log("USER ID", userId);

      if (!YetkiliKisi.validateTCKN(tc_kimlik_no)) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz TC Kimlik Numarası",
        });
      }

      const phoneRegex = /^\+90\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}$/;
      if (!phoneRegex.test(telefon_no)) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz Telefon Numarası Formatı",
        });
      }

      const yetkiliId = await YetkiliKisi.create({
        user_id: userId,
        ad,
        soyad,
        tc_kimlik_no,
        telefon_no,
        bireysel,
      });

      await User.update({ yetkili_kisi_id: yetkiliId }, userId);

      const updatedUser = await User.findByEmail(req.user.email);
      const newToken = jwt.sign(
        {
          userId: updatedUser.user_id,
          email: updatedUser.email,
          yetkili_kisi_id: yetkiliId, // Yeni yetkili_kisi_id eklendi
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      req.user = {
        ...req.user,
        yetkili_kisi_id: yetkiliId,
      };

      res.status(201).json({
        success: true,
        message: "Yetkili kişi başarıyla kaydedildi",
        data: {
          yetkiliId,
          token: newToken,
        },
      });
    } catch (error) {
      console.error("Yetkili kişi kayıt hatası:", error);
      res.status(500).json({
        success: false,
        message: "Yetkili kişi kayıt hatası",
      });
    }
  },

  sendVerificationCode: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { telefon_no } = req.body;
      console.log("Original Phone:", telefon_no);

      // Telefon numarasını formatla - NetGSM formatı için
      let formattedPhone = telefon_no
        .replace(/\D/g, "") // Tüm rakam olmayan karakterleri kaldır
        .replace(/^90/, "") // 90 ile başlıyorsa kaldır
        .replace(/^\+90/, "") // +90 ile başlıyorsa kaldır
        .replace(/^0/, ""); // Baştaki 0'ı kaldır

      // Eğer 10 haneden kısa ise, başına 0 ekle
      if (formattedPhone.length === 10) {
        formattedPhone = "0" + formattedPhone;
      }

      console.log("Formatted Phone for NetGSM:", formattedPhone);

      const verificationCode = SMSService.generateVerificationCode();
      const message = `Firma Kutusu Doğrulama Kodunuz: ${verificationCode}
Üyelik işleminizi tamamlamak için bu kodu ilgili alana giriniz.
Firma Kutusu, HEDA TEKNOLOJİ BİLİŞİM A.Ş. tarafından sunulan kurumsal bir çözümdür.
Kişisel veri güvenliğiniz için bu kodu kimseyle paylaşmayınız.`;

      console.log("Sending SMS to:", formattedPhone);
      console.log("Message:", message);

      const smsResult = await SMSService.sendSMS(formattedPhone, message);
      console.log("SMS Send Result:", smsResult);

      if (!smsResult.success) {
        return res.status(500).json({
          success: false,
          message: smsResult.message || "SMS gönderilemedi",
          error: smsResult.error || smsResult.errorCode,
        });
      }

      await SMSService.saveVerificationCode(userId, verificationCode);

      res.json({
        success: true,
        message: "Doğrulama kodu gönderildi",
        debug: {
          originalPhone: telefon_no,
          formattedPhone: formattedPhone,
          smsResult: smsResult,
        },
      });
    } catch (error) {
      console.error("SMS gönderme hatası", error);
      res.status(500).json({
        success: false,
        message: "SMS gönderme hatası",
        error: error.message,
      });
    }
  },

  verifyCode: async (req, res) => {
    try {
      const { code } = req.body;
      const userId = req.user.userId;

      const isValid = await SMSService.verifyCode(userId, code);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz doğrulama kodu",
        });
      }

      await YetkiliKisi.updatePhoneVerification(userId);

      res.json({
        success: true,
        message: "Telefon numarası doğrulandı",
      });
    } catch (error) {
      console.error("Kod doğrulama hatası", error);
      res.status(500).json({
        success: false,
        message: "Kod doğrulama sırasında bir hata oluştu",
      });
    }
  },

  // yetkili kişi bilgilerini getir
  getYetkiliKisi: async (req, res) => {
    try {
      const { userId } = req.user;

      console.log("USER", req.user);

      console.log("YETKİLİ KİŞİ ID", userId);

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Kullanıcı bulunamadı",
        });
      }

      const yetkiliKisi = await YetkiliKisi.findByUserId(userId);

      if (!yetkiliKisi) {
        return res.status(404).json({
          success: false,
          message: "Yetkili kişi bulunamadı",
        });
      }

      res.json({
        success: true,
        message: "Yetkili kişi bilgileri getirildi",
        data: yetkiliKisi,
      });
    } catch (error) {
      console.error("Yetkili kişi bilgileri getirme hatası", error);
      res.status(500).json({
        success: false,
        message: "Yetkili kişi bilgileri getirme hatası",
      });
    }
  },
};

module.exports = dogrulamaController;
