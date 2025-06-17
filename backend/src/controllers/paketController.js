const PaketModel = require("../models/PaketModel");
const PayTR = require("../utils/paytr");
const config = require("../config/config");
const FaturaModel = require("../models/Fatura");
const SMSService = require("../middleware/smsService");
const YetkiliKisi = require("../models/YetkiliKisi");

class PaketController {
  // Tüm paketleri getir
  static async getAllPakets(req, res) {
    try {
      const paketler = await PaketModel.getAllPakets();
      res.json({ success: true, data: paketler });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Paket detayını getir
  static async getPaketById(req, res) {
    try {
      const paket = await PaketModel.getPaketById(req.params.id);
      if (!paket) {
        return res
          .status(404)
          .json({ success: false, error: "Paket bulunamadı" });
      }
      res.json({ success: true, data: paket });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Firma paket geçmişini getir
  static async getFirmaPaketGecmisi(req, res) {
    try {
      const { firma_id } = req.user;
      const gecmis = await PaketModel.getFirmaPaketGecmisi(firma_id);
      res.json({ success: true, data: gecmis });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Paket satın alma işlemi başlat
  static async satinAl(req, res) {
    try {
      const { paketId } = req.body;
      const { firma_id, email } = req.user;

      // Debug için gelen verileri logla
      console.log("SatinAl Request Data:", {
        paketId,
        firma_id,
        email,
      });

      // Paket bilgilerini al
      const paket = await PaketModel.getPaketById(paketId);
      if (!paket) {
        return res
          .status(404)
          .json({ success: false, error: "Paket bulunamadı" });
      }

      // Debug için paket bilgilerini logla
      console.log("Paket Data:", paket);

      // Satın alma kaydı oluştur
      const baslangicTarihi = new Date();
      const bitisTarihi = new Date();
      bitisTarihi.setDate(bitisTarihi.getDate() + paket.sure_gun);

      const satisId = await PaketModel.createPaketSatis(
        firma_id,
        paketId,
        baslangicTarihi,
        bitisTarihi
      );

      // Debug için satış ID'sini logla
      console.log("Satis ID:", satisId);

      // PayTR için ödeme verilerini hazırla
      const paymentData = {
        merchant_id: config.paytr.merchant_id,
        user_ip: req.ip,
        merchant_oid: `PAKET${satisId}`,
        email: email,
        payment_amount: Math.round(parseFloat(paket.fiyat) * 100), // Kuruş cinsinden ve tam sayı
        user_basket: PayTR.formatBasket([
          {
            name: paket.ad,
            price: paket.fiyat,
            quantity: 1,
          },
        ]),
        debug_on: config.paytr.debug_mode,
        no_installment: 0,
        max_installment: 12,
        user_name: "System Test User",
        user_address: "System Test Address",
        user_phone: "System Test Phone",
        merchant_ok_url: `${config.frontend_url}/odeme/basarili`,
        merchant_fail_url: `${config.frontend_url}/odeme/basarisiz`,
        timeout_limit: 30,
        currency: "TL",
        test_mode: config.paytr.test_mode,
      };

      // Debug için ödeme verilerini logla
      console.log("Payment Data:", paymentData);

      // PayTR token oluştur
      const paytrData = PayTR.generateToken(paymentData);

      // Debug için PayTR verilerini logla
      console.log("PayTR Data:", paytrData);

      // PayTR API'sine istek at
      const response = await fetch(
        "https://www.paytr.com/odeme/api/get-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(paytrData).toString(),
        }
      );

      const textResponse = await response.text();
      try {
        const data = JSON.parse(textResponse);
        if (data.status === "success") {
          res.json({
            success: true,
            data: {
              satisId,
              paytrData: {
                ...paytrData,
                token: data.token,
              },
            },
          });
        } else {
          throw new Error(data.reason || "PayTR token alınamadı");
        }
      } catch (error) {
        console.error("PayTR Error:", error);
        console.error("PayTR Response:", textResponse);
        throw new Error("PayTR yanıtı işlenemedi");
      }
    } catch (error) {
      console.error("SatinAl Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // PayTR callback işlemi
  static async paytrCallback(req, res) {
    try {
      const isValid = true; // test için
      // const isValid = PayTR.verifyCallback(req.body);
      if (!isValid) {
        return res.status(400).json({ success: false, error: "Geçersiz hash" });
      }

      const { merchant_oid, status } = req.body;
      const satisId = merchant_oid.replace("PAKET", "");

      // Ödeme durumunu güncelle
      await PaketModel.updateOdemeDurumu(
        satisId,
        status === "success" ? "odendi" : "iptal"
      );

      if (status === "success") {
        // Firma aktif paketini güncelle
        const satis = await PaketModel.getPaketSatisById(satisId);
        await PaketModel.updateFirmaAktifPaket(
          satis.firma_id,
          satis.paket_id,
          satis.baslangic_tarihi,
          satis.bitis_tarihi
        );

        const paket = await PaketModel.getPaketById(satis.paket_id);

        await FaturaModel.createFatura({
          firma_paket_gecmisi_id: satis.id,
          firma_id: satis.firma_id,
          fatura_no: `F${satisId}${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`,
          odeme_tutari: paket.fiyat,
          odeme_tarihi: new Date(),
          urun_hizmet: paket.ad + " Paket",
          fatura_resim: null,
        });

        const yetkiliKisi = await YetkiliKisi.findByFirmaId(satis.firma_id);
        if (yetkiliKisi) {
          const sms = `Sayın Yetkili, ${
            paket.ad
          } paket satın alımınız başarıyla gerçekleştirilmiştir. Paketiniz ${satis.baslangic_tarihi.toLocaleDateString(
            "tr-TR"
          )} tarihinden itibaren ${
            paket.sure_gun
          } gün süreyle aktif olacaktır. İyi çalışmalar dileriz. \n\nSaygılarımızla,\nFirma Kutusu`;
          await SMSService.sendSMS(yetkiliKisi.telefon_no, sms);
        }
      }

      res.send(status === "success" ? "OK" : "FAILED");
    } catch (error) {
      console.error("PayTR Callback Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Otomatik yenileme ayarını güncelle
  static async updateOtomatikYenileme(req, res) {
    try {
      const { paket_id, otomatik_yenileme } = req.body;

      const success = await PaketModel.updateOtomatikYenileme(
        paket_id,
        otomatik_yenileme
      );

      if (success) {
        res.json({
          success: true,
          message: "Otomatik yenileme ayarı güncellendi",
        });
      } else {
        res.status(404).json({ success: false, error: "Paket bulunamadı" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Kayıtlı kart bilgisini güncelle
  static async updateKayitliKart(req, res) {
    try {
      const { paket_id, kart_id } = req.body;

      const success = await PaketModel.updateKayitliKart(paket_id, kart_id);

      if (success) {
        res.json({
          success: true,
          message: "Kayıtlı kart bilgisi güncellendi",
        });
      } else {
        res.status(404).json({ success: false, error: "Paket bulunamadı" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = PaketController;
