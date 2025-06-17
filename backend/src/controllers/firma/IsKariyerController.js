const IsKariyerAyarlar = require("../../models/firma/IsKariyerAyarlar");
const IsKariyerSorular = require("../../models/firma/IsKariyerSorular");
const { sendBasvuruEmail } = require("../../config/email");
const SMSService = require("../../middleware/smsService");
const Firma = require("../../models/Firma");
const YetkiliKisi = require("../../models/YetkiliKisi");

class IsKariyerController {
  // Ayarlar
  static async getAyarlar(req, res) {
    try {
      const { firmaId } = req.params;
      const ayarlar = await IsKariyerAyarlar.getAyarlar(firmaId);
      res.json(ayarlar);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const ayarlar = await IsKariyerAyarlar.createAyarlar(firma_id, req.body);
      res.status(201).json({
        success: true,
        message: "Kariyer ayarları başarıyla oluşturuldu",
        data: ayarlar,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const updated = await IsKariyerAyarlar.updateAyarlar(firma_id, req.body);

      if (updated) {
        res.json({
          success: true,
          message: "Kariyer ayarları başarıyla güncellendi",
        });
      } else {
        throw new Error("Kariyer ayarları güncellenemedi");
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Sorular
  static async getSorular(req, res) {
    try {
      const { firmaId } = req.params;
      const sorular = await IsKariyerSorular.getSorular(firmaId);
      res.json(sorular);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createSoru(req, res) {
    try {
      const { firma_id } = req.user;
      const soru = await IsKariyerSorular.createSoru(firma_id, req.body);
      res.json(soru);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateSoru(req, res) {
    try {
      const { firma_id } = req.user;
      const soruId = req.params.id;
      const updated = await IsKariyerSorular.updateSoru(
        firma_id,
        soruId,
        req.body
      );
      res.json({ success: updated });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteSoru(req, res) {
    try {
      const { firma_id } = req.user;
      const soruId = req.params.id;
      const deleted = await IsKariyerSorular.deleteSoru(firma_id, soruId);
      res.json({ success: deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Başvuru
  static async createBasvuru(req, res) {
    try {
      const firmaId = req.params.firmaId;
      const { ad_soyad, email, telefon, tc_kimlik, meslek, cv, cevaplar } =
        req.body;

      // Firma ayarlarını al
      const ayarlar = await IsKariyerAyarlar.getAyarlar(firmaId);
      if (!ayarlar) {
        throw new Error("Firma kariyer ayarları bulunamadı");
      }

      if (!ayarlar.email_adresi) {
        throw new Error("Firma e-posta adresi bulunamadı");
      }

      // Firma yetkili kişisini al
      const firma = await YetkiliKisi.findByFirmaId(firmaId);
      if (!firma || !firma.telefon_no) {
        console.warn("Firma yetkili telefon numarası bulunamadı");
      }
      console.log(firma);

      // Temel bilgileri ekle
      const temelBilgiler = [
        {
          soru: "Ad Soyad",
          cevap: ad_soyad,
        },
        {
          soru: "T.C. Kimlik No",
          cevap: tc_kimlik || "Belirtilmemiş",
        },
        {
          soru: "Telefon",
          cevap: telefon,
        },
        {
          soru: "E-posta",
          cevap: email,
        },
        {
          soru: "Meslek",
          cevap: meslek || "Belirtilmemiş",
        },
      ];

      // Özel soruları filtrele ve ekle
      const ozelCevaplar = cevaplar
        .filter((cevap) => cevap && cevap.soru_metni && cevap.cevap) // undefined ve boş değerleri filtrele
        .map((cevap) => ({
          soru: cevap.soru_metni,
          cevap: cevap.cevap,
        }));

      // Tüm cevapları birleştir
      const tumCevaplar = [...temelBilgiler, ...ozelCevaplar];

      console.log("E-posta gönderiliyor:", {
        to: ayarlar.email_adresi,
        ad_soyad,
        telefon,
        email,
        tc_kimlik,
        meslek,
        cevaplar: tumCevaplar.length,
      });

      // E-posta gönder
      const emailSent = await sendBasvuruEmail(
        ayarlar.email_adresi,
        ad_soyad,
        telefon,
        tumCevaplar,
        cv
      );

      if (!emailSent) {
        throw new Error("E-posta gönderilemedi");
      }

      // Yetkili kişiye SMS gönder
      if (firma && firma.telefon_no) {
        try {
          const smsMessage = `Sayın Yetkili,\n\n${ad_soyad} adlı kişi firmanıza iş başvurusu yapmıştır. Başvuru detaylarını görmek için lütfen e-posta adresinizi kontrol ediniz.\n\nSaygılarımızla,\nFirma Kutusu`;

          console.log("SMS gönderiliyor:", {
            telefon: firma.telefon_no,
            mesaj: smsMessage,
          });

          const smsResult = await SMSService.sendSMS(
            firma.telefon_no,
            smsMessage
          );
          if (!smsResult.success) {
            console.error("SMS gönderimi başarısız:", smsResult.error);
          } else {
            console.log("SMS başarıyla gönderildi");
          }
        } catch (smsError) {
          console.error("SMS gönderimi sırasında hata:", smsError);
        }
      } else {
        console.warn("SMS gönderilemedi: Yetkili telefon numarası bulunamadı");
      }

      res.json({ success: true, message: "Başvurunuz başarıyla gönderildi" });
    } catch (error) {
      console.error("Başvuru hatası:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.stack,
      });
    }
  }
}

module.exports = IsKariyerController;
