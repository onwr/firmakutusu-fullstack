const ResmiBilgiler = require("../../models/firma/ResmiBilgiler");

class ResmiBilgilerController {
  static async getResmiBilgiler(req, res) {
    try {
      const { firmaId } = req.params;
      const bilgiler = await ResmiBilgiler.getResmiBilgiler(firmaId);

      res.status(200).json({
        success: true,
        data: bilgiler,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async createResmiBilgiler(req, res) {
    try {
      const { firma_id } = req.user;
      const bilgilerData = req.body;

      const bilgilerId = await ResmiBilgiler.createResmiBilgiler(
        firma_id,
        bilgilerData
      );

      res.status(201).json({
        success: true,
        data: { id: bilgilerId },
        message: "Resmi bilgiler başarıyla oluşturuldu",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateResmiBilgiler(req, res) {
    try {
      const { firma_id } = req.user;
      const bilgilerData = req.body;

      const success = await ResmiBilgiler.updateResmiBilgiler(
        firma_id,
        bilgilerData
      );

      if (success) {
        res.status(200).json({
          success: true,
          message: "Resmi bilgiler başarıyla güncellendi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Resmi bilgiler bulunamadı",
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

module.exports = ResmiBilgilerController;
