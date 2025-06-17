const Referanslar = require("../../models/firma/Referanslar");
const SMSService = require("../../middleware/smsService");
const YetkiliKisi = require("../../models/YetkiliKisi");
const Bildirim = require("../../models/firma/Bildirim");
const pool = require("../../config/db");

class ReferanslarController {
  static async getReferanslar(req, res) {
    try {
      const { firmaId } = req.params;
      const referanslar = await Referanslar.getReferanslar(firmaId);

      res.status(200).json({
        success: true,
        data: referanslar,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async createReferans(req, res) {
    try {
      const { firma_id } = req.user;
      const referansData = req.body;

      const result = await Referanslar.createReferans(firma_id, referansData);

      if (!result.status) {
        return res.status(400).json({
          success: false,
          error: result.message,
        });
      }

      await Bildirim.create({
        firma_id: referansData.ilgili_firma_id,
        tip: "Bağlantı",
        konu: "Referans Talebi Oluşturuldu",
        icerik: `${referansData.firma_adi} firması bir referans talebi oluşturulmuştur. Talebi görüntülemek ve onaylamak için lütfen Profil > Referanslar bölümünü ziyaret ediniz.`,
        tip_renk: "#80cc28",
        tip_icon: "/images/bildirim/baglanti.svg",
      });

      // Eğer referans oluşturma başarılıysa, SMS gönder
      const firma = await YetkiliKisi.findByFirmaId(
        referansData.ilgili_firma_id
      );
      if (firma && firma.telefon_no) {
        try {
          const smsMessage = `Sayın Yetkili,\n\n${referansData.firma_adi} firması bir referans talebi oluşturulmuştur. Talebi görüntülemek ve onaylamak için lütfen firmakutusu.com adresine giriş yaparak Profil > Referanslar bölümünü ziyaret ediniz.\n\nİlginiz için teşekkür eder, iyi çalışmalar dileriz.\n\nSaygılarımızla,\nFirma Kutusu`;

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
        console.log(firma);

        console.warn("SMS gönderilemedi: Yetkili telefon numarası bulunamadı");
      }

      res.status(201).json({
        success: true,
        data: result.data,
        message: "Referans başarıyla oluşturuldu",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateReferans(req, res) {
    try {
      const { firma_id } = req.user;
      const { referansId } = req.params;
      const referansData = req.body;

      const success = await Referanslar.updateReferans(
        firma_id,
        referansId,
        referansData
      );

      if (success) {
        // Referans onaylandı veya reddedildi ise SMS gönder
        if (
          referansData.durum === "onaylandi" ||
          referansData.durum === "reddedildi"
        ) {
          try {
            // Referans bilgilerini al
            const [referans] = await pool.query(
              "SELECT * FROM referanslar WHERE id = ?",
              [referansId]
            );

            if (referans[0]) {
              // Talep eden firmanın yetkilisini bul
              const firma = await YetkiliKisi.findByFirmaId(
                referans[0].firma_id
              );

              if (firma && firma.telefon_no) {
                const durumMesaji =
                  referansData.durum === "onaylandi"
                    ? "onaylanmıştır"
                    : "reddedilmiştir";
                const smsMessage = `Sayın Yetkili,\n\n${referans[0].ilgili_firma_adi} firmasına gönderdiğiniz referans talebi ${durumMesaji}. Detayları görüntülemek için lütfen firmakutusu.com adresine giriş yaparak Profil > Referanslar bölümünü ziyaret ediniz.\n\nİlginiz için teşekkür eder, iyi çalışmalar dileriz.\n\nSaygılarımızla,\nFirma Kutusu`;

                const smsResult = await SMSService.sendSMS(
                  firma.telefon_no,
                  smsMessage
                );
                if (!smsResult.success) {
                  console.error("SMS gönderimi başarısız:", smsResult.error);
                } else {
                  console.log("SMS başarıyla gönderildi");
                }
              }

              // Bildirim oluştur
              await Bildirim.create({
                firma_id: referans[0].firma_id,
                tip: "Bağlantı",
                konu: `Referans Talebi ${
                  referansData.durum === "onaylandi"
                    ? "Onaylandı"
                    : "Reddedildi"
                }`,
                icerik: `${
                  referans[0].ilgili_firma_adi
                } firmasına gönderdiğiniz referans talebi ${
                  referansData.durum === "onaylandi"
                    ? "onaylanmıştır"
                    : "reddedilmiştir"
                }.`,
                tip_renk: "#80cc28",
                tip_icon: "/images/bildirim/baglanti.svg",
              });
            }
          } catch (error) {
            console.error("SMS veya bildirim gönderimi sırasında hata:", error);
            // SMS veya bildirim hatası olsa bile işleme devam et
          }
        }

        res.status(200).json({
          success: true,
          message: "Referans başarıyla güncellendi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Referans bulunamadı",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getReferanslarAyarlar(req, res) {
    try {
      const { firmaId } = req.params;
      const ayarlar = await Referanslar.getReferanslarAyarlar(firmaId);

      res.status(200).json({
        success: true,
        data: ayarlar,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateReferanslarAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const ayarlarData = req.body;

      await Referanslar.updateReferanslarAyarlar(firma_id, ayarlarData);

      res.status(200).json({
        success: true,
        message: "Referanslar ayarları başarıyla güncellendi",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getGelenReferanslar(req, res) {
    try {
      const { firmaId } = req.params;
      const referanslar = await Referanslar.getGelenReferanslar(firmaId);

      res.status(200).json({
        success: true,
        data: referanslar,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = ReferanslarController;
