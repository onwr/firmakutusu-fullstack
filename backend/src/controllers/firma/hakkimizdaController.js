const Hakkimizda = require("../../models/firma/Hakkimizda");

const hakkimizdaController = {
  getHakkimizda: async (req, res) => {
    try {
      const { firmaId } = req.params;
      const hakkimizda = await Hakkimizda.getHakkimizda({ firmaId });

      if (!hakkimizda) {
        return res.status(404).json({
          success: false,
          message: "Hakkımızda bilgileri bulunamadı",
        });
      }

      res.status(200).json({
        success: true,
        data: hakkimizda,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Hakkımızda bilgileri alınamadı",
        error: error.message,
      });
    }
  },

  createHakkimizda: async (req, res) => {
    try {
      const { firma_id } = req.user; // JWT'den gelen firma ID'sini kullan
      const { baslik, ceo_adi, ceo_mesaji, ceo_resmi_url } = req.body;

      const hakkimizda = await Hakkimizda.create({
        firma_id,
        baslik,
        ceo_adi,
        ceo_mesaji,
        ceo_resmi_url,
      });

      res.status(201).json({
        success: true,
        message: "Hakkımızda bilgileri başarıyla oluşturuldu",
        data: hakkimizda,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Hakkımızda bilgileri oluşturulamadı",
        error: error.message,
      });
    }
  },

  updateHakkimizda: async (req, res) => {
    try {
      const { firma_id } = req.user; // JWT'den gelen firma ID'sini kullan
      const { baslik, ceo_adi, ceo_mesaji, ceo_resmi_url } = req.body;

      const hakkimizda = await Hakkimizda.update(firma_id, {
        baslik,
        ceo_adi,
        ceo_mesaji,
        ceo_resmi_url,
      });

      res.status(200).json({
        success: true,
        message: "Hakkımızda bilgileri başarıyla güncellendi",
        data: hakkimizda,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Hakkımızda bilgileri güncellenemedi",
        error: error.message,
      });
    }
  },
};

module.exports = hakkimizdaController;
