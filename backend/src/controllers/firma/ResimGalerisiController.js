const ResimGalerisi = require("../../models/firma/ResimGalerisi");

class ResimGalerisiController {
  static async getResimler(req, res) {
    try {
      const { firmaId } = req.params;
      const resimler = await ResimGalerisi.getResimler(firmaId);

      res.status(200).json({
        success: true,
        data: resimler,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async createResim(req, res) {
    try {
      const { firma_id } = req.user;
      const resimData = req.body;

      const resimId = await ResimGalerisi.createResim(firma_id, resimData);

      res.status(201).json({
        success: true,
        data: { id: resimId },
        message: "Resim başarıyla eklendi",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async deleteResim(req, res) {
    try {
      const { firma_id } = req.user;
      const { resimId } = req.params;

      const success = await ResimGalerisi.deleteResim(firma_id, resimId);

      if (success) {
        res.status(200).json({
          success: true,
          message: "Resim başarıyla silindi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Resim bulunamadı",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getResimGalerisiAyarlar(req, res) {
    try {
      const { firmaId } = req.params;
      const ayarlar = await ResimGalerisi.getResimGalerisiAyarlar(firmaId);

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

  static async updateResimGalerisiAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const ayarlarData = req.body;

      await ResimGalerisi.updateResimGalerisiAyarlar(firma_id, ayarlarData);

      res.status(200).json({
        success: true,
        message: "Resim galerisi ayarları başarıyla güncellendi",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = ResimGalerisiController;
