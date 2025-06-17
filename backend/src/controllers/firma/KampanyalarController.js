const Kampanyalar = require("../../models/firma/Kampanyalar");

class KampanyalarController {
  static async getKampanyalar(req, res) {
    try {
      const { firmaId } = req.params;
      const kampanyalar = await Kampanyalar.getKampanyalar(firmaId);

      res.status(200).json({
        success: true,
        data: kampanyalar,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async createKampanya(req, res) {
    try {
      const { firma_id } = req.user;
      const kampanyaData = req.body;

      const kampanyaId = await Kampanyalar.createKampanya(
        firma_id,
        kampanyaData
      );

      res.status(201).json({
        success: true,
        data: { id: kampanyaId },
        message: "Kampanya başarıyla oluşturuldu",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateKampanya(req, res) {
    try {
      const { firma_id } = req.user;
      const { kampanyaId } = req.params;
      const kampanyaData = req.body;

      const success = await Kampanyalar.updateKampanya(
        firma_id,
        kampanyaId,
        kampanyaData
      );

      if (success) {
        res.status(200).json({
          success: true,
          message: "Kampanya başarıyla güncellendi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Kampanya bulunamadı",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async deleteKampanya(req, res) {
    try {
      const { firma_id } = req.user;
      const { kampanyaId } = req.params;

      const success = await Kampanyalar.deleteKampanya(firma_id, kampanyaId);

      if (success) {
        res.status(200).json({
          success: true,
          message: "Kampanya başarıyla silindi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Kampanya bulunamadı",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getKampanyalarAyarlar(req, res) {
    try {
      const { firmaId } = req.params;
      const ayarlar = await Kampanyalar.getKampanyalarAyarlar(firmaId);

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

  static async updateKampanyalarAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const ayarlarData = req.body;

      await Kampanyalar.updateKampanyalarAyarlar(firma_id, ayarlarData);

      res.status(200).json({
        success: true,
        message: "Kampanyalar ayarları başarıyla güncellendi",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = KampanyalarController;
