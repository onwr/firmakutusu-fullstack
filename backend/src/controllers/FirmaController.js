const Firma = require("../models/Firma");
const YetkiliKisi = require("../models/YetkiliKisi");

const firmaController = {
  // firma oluştur
  createFirma: async (req, res) => {
    try {
      const {
        uyelik_turu,
        marka_adi,
        firma_unvani,
        vergi_kimlik_no,
        sektor,
        resmi_bilgiler,
        bireysel,
      } = req.body;
      const { userId } = req.user;

      if (bireysel) {
        await YetkiliKisi.updateBireysel(userId, {
          bireysel: true,
        });
        return res.status(200).json({
          success: true,
          message: "Bireysel üyelik başarıyla oluşturuldu",
        });
      }

      // Zorunlu alanları kontrol et
      if (!marka_adi || !firma_unvani || !vergi_kimlik_no || !sektor) {
        return res.status(400).json({
          success: false,
          message: "Lütfen tüm zorunlu alanları doldurun",
        });
      }

      // Vergi no doğrulama
      const isValidVKN = await Firma.verifyVKN(vergi_kimlik_no);
      if (!isValidVKN) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz vergi kimlik numarası",
        });
      }

      // Vergi numarasının benzersiz olduğunu kontrol et
      const existingFirma = await Firma.findByVKN(vergi_kimlik_no);
      if (existingFirma) {
        return res.status(400).json({
          success: false,
          message: "Bu vergi numarası ile kayıtlı bir firma zaten mevcut",
        });
      }

      // Yeni firma oluştur
      const firmaData = {
        uyelik_turu,
        marka_adi,
        firma_unvani,
        vergi_kimlik_no,
        sektor,
        hizmet_alani: "-",
        profil_resmi_url: "/images/default-company.png",
        kurulus_tarihi: "-",
        kurulus_sehri: "-",
        merkez_adresi: "-",
        kep_adresi: "-",
        email: "-",
        web_sitesi: "-",
        iletisim_telefonu: "-",
        aktif: true,
      };

      // Resmi bilgiler varsa ekle
      if (resmi_bilgiler) {
        firmaData.resmi_bilgiler = {
          faaliyet_alani: resmi_bilgiler.faaliyet_alani || "-",
          vergi_dairesi_adi: resmi_bilgiler.vergi_dairesi_adi || "-",
          mersis_no: resmi_bilgiler.mersis_no || "-",
          faaliyet_durumu: true,
          e_fatura_kullanimi: false,
          e_arsiv_kullanimi: false,
          e_irsaliye_kullanimi: false,
          e_defter_kullanimi: false,
          fax_numarasi: "-",
          banka_iban: "-",
          banka_adi: "-",
        };
      }

      const firmaId = await Firma.create({
        uyelikTuru: firmaData.uyelik_turu,
        sektor: firmaData.sektor,
        markaAdi: firmaData.marka_adi,
        vkn: firmaData.vergi_kimlik_no,
        firmaUnvani: firmaData.firma_unvani,
        userId,
      });

      res.status(201).json({
        success: true,
        message: "Firma başarıyla oluşturuldu",
        data: {
          firmaId,
          ...firmaData,
        },
      });
    } catch (error) {
      console.error("Firma oluşturma hatası:", error);
      res.status(500).json({
        success: false,
        message: "Firma oluşturulurken bir hata oluştu",
      });
    }
  },

  // bilgileri güncelle
  updateFirma: async (req, res) => {
    try {
      const { firma_id } = req.user;
      const updateData = req.body;

      console.log("Güncellenecek firma ID:", firma_id);
      console.log("Güncellenecek veriler:", updateData);

      // Vergi no doğrulama
      if (updateData.vergi_kimlik_no) {
        const isValidVKN = await Firma.verifyVKN(updateData.vergi_kimlik_no);
        if (!isValidVKN) {
          return res.status(400).json({
            success: false,
            message: "Geçersiz vergi kimlik numarası",
          });
        }
      }

      const result = await Firma.update(firma_id, updateData);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Firma bulunamadı",
        });
      }

      // Güncellenmiş firma bilgilerini getir
      const updatedFirma = await Firma.getById(firma_id);
      console.log("Güncellenmiş firma bilgileri:", updatedFirma);

      res.json({
        success: true,
        message: "Firma bilgileri başarıyla güncellendi",
        data: updatedFirma,
      });
    } catch (error) {
      console.error("Firma güncelleme hatası:", error);
      res.status(500).json({
        success: false,
        message:
          error.message || "Firma bilgileri güncellenirken bir hata oluştu",
      });
    }
  },

  // Firma bilgilerini getir
  getFirma: async (req, res) => {
    try {
      const { firma_id } = req.user;
      const firma = await Firma.getById(firma_id);

      if (!firma) {
        return res.status(404).json({
          success: false,
          message: "Firma bulunamadı",
        });
      }

      res.json({
        success: true,
        data: firma,
      });
    } catch (error) {
      console.error("Firma bilgileri getirme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Firma bilgileri alınırken bir hata oluştu",
      });
    }
  },

  // firma bilgilerini getir
  getFirmaById: async (req, res) => {
    try {
      const { firma_id } = req.params;
      const firma = await Firma.getById(firma_id);

      if (!firma) {
        return res.status(404).json({
          success: false,
          message: "Firma bulunamadı",
        });
      }

      res.json({
        success: true,
        data: firma,
      });
    } catch (error) {
      console.error("Firma bilgileri getirme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Firma bilgileri alınırken bir hata oluştu",
      });
    }
  },

  // firma bilgilerini getir vkn ile
  getFirmaByVKN: async (req, res) => {
    try {
      const { vkn } = req.params;
      const firma = await Firma.getByVKN(vkn);

      if (!firma) {
        return res.status(404).json({
          success: false,
          message: "Firma bulunamadı",
        });
      }

      res.json({
        success: true,
        data: firma,
      });
    } catch (error) {
      console.error("Firma bilgileri getirme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Firma bilgileri alınırken bir hata oluştu",
      });
    }
  },

  // Vergi no doğrulama
  verifyVKN: async (req, res) => {
    try {
      const { vergiNo } = req.body;
      const isValid = await Firma.verifyVKN(vergiNo);

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz vergi kimlik numarası",
        });
      }

      // Burada gerçek bir VKN sorgulama servisi entegre edilebilir
      // Şimdilik örnek bir yanıt dönüyoruz
      res.json({
        success: true,
        message: "Vergi kimlik numarası doğrulandı",
        data: {
          vergiNo,
          firmaUnvani: "Örnek Firma A.Ş.",
          vergiDairesi: "Örnek Vergi Dairesi",
        },
      });
    } catch (error) {
      console.error("VKN doğrulama hatası:", error);
      res.status(500).json({
        success: false,
        message: "Vergi no doğrulanırken bir hata oluştu",
      });
    }
  },

  // Firma arama
  searchFirmalar: async (req, res) => {
    try {
      // Query parametreleri dizi olarak alınır
      let { sektor, il, ilce, keyword } = req.query;
      // Tekli ise diziye çevir
      if (sektor && !Array.isArray(sektor)) sektor = [sektor];
      if (il && !Array.isArray(il)) il = [il];
      if (ilce && !Array.isArray(ilce)) ilce = [ilce];

      const firmalar = await Firma.search({
        sektor,
        il,
        ilce,
        keyword,
      });

      res.json({
        success: true,
        data: firmalar,
        total: firmalar.length,
      });
    } catch (error) {
      console.error("Firma arama hatası:", error);
      res.status(500).json({
        success: false,
        message: "Firma arama sırasında bir hata oluştu",
      });
    }
  },

  // Vitrin firmaları getir
  getVitrinFirmalar: async (req, res) => {
    try {
      const firmalar = await Firma.getVitrinFirmalar();
      res.json({
        success: true,
        data: firmalar,
      });
    } catch (error) {
      console.error("Vitrin firmaları getirme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Vitrin firmaları alınırken bir hata oluştu",
      });
    }
  },
};

module.exports = firmaController;
