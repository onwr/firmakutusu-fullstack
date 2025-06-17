const SubelerAyarlar = require("../../models/firma/SubelerAyarlar");

class SubelerAyarlarController {
  static async getSubelerAyarlar(req, res) {
    try {
      const { firmaId } = req.params;
      const ayarlar = await SubelerAyarlar.getSubelerAyarlar(firmaId);

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

  static async createSubelerAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const ayarlarData = req.body;

      const ayarlarId = await SubelerAyarlar.createSubelerAyarlar(
        firma_id,
        ayarlarData
      );

      res.status(201).json({
        success: true,
        data: { id: ayarlarId },
        message: "Şube ayarları başarıyla oluşturuldu",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateSubelerAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const ayarlarData = req.body;

      const success = await SubelerAyarlar.updateSubelerAyarlar(
        firma_id,
        ayarlarData
      );

      if (success) {
        res.status(200).json({
          success: true,
          message: "Şube ayarları başarıyla güncellendi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Şube ayarları bulunamadı",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = SubelerAyarlarController;
