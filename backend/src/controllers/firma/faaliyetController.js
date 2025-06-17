const Firma = require("../../models/Firma");
const FaaliyetAlanlari = require("../../models/firma/FaaliyetAlanlari");

const faaliyetController = {
  getFaaliyetAlanlari: async (req, res) => {
    try {
      const { firma_id } = req.params;
      const faaliyetAlanlari = await FaaliyetAlanlari.getFaaliyetAlanlari({
        firmaId: firma_id,
      });

      if (!faaliyetAlanlari) {
        return res.status(404).json({
          success: false,
          message: "Faaliyet alanları bulunamadı",
        });
      }

      res.status(200).json({
        success: true,
        data: faaliyetAlanlari,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Faaliyet alanları alınamadı",
        error: error.message,
      });
    }
  },

  createFaaliyetAlanlari: async (req, res) => {
    try {
      const { firma_id } = req.user;
      const { tur, alan, nace_kodu } = req.body;

      const faaliyetAlani = await FaaliyetAlanlari.create({
        firma_id,
        tur,
        alan,
        nace_kodu,
      });

      res.status(201).json({
        success: true,
        message: "Faaliyet alanı başarıyla oluşturuldu",
        data: faaliyetAlani,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Faaliyet alanı oluşturulamadı",
        error: error.message,
      });
    }
  },

  updateFaaliyetAlani: async (req, res) => {
    try {
      const { id } = req.params;
      const { firma_id } = req.user;
      const { tur, alan, nace_kodu } = req.body;

      const faaliyetAlani = await FaaliyetAlanlari.update(id, firma_id, {
        tur,
        alan,
        nace_kodu,
      });

      res.status(200).json({
        success: true,
        message: "Faaliyet alanı başarıyla güncellendi",
        data: faaliyetAlani,
      });
    } catch (error) {
      if (
        error.message ===
        "Bu faaliyet alanı üzerinde işlem yapma yetkiniz bulunmamaktadır"
      ) {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Faaliyet alanı güncellenemedi",
        error: error.message,
      });
    }
  },

  deleteFaaliyetAlani: async (req, res) => {
    try {
      const { id } = req.params;
      const { firma_id } = req.user;

      const result = await FaaliyetAlanlari.delete(id, firma_id);

      res.status(200).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Faaliyet alanı silinemedi",
        error: error.message,
      });
    }
  },
};

module.exports = faaliyetController;
