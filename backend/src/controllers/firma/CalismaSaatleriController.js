const CalismaSaatleri = require("../../models/firma/CalismaSaatleri");

class CalismaSaatleriController {
  static async getCalismaSaatleri(req, res) {
    try {
      const { subeId } = req.params;
      const saatler = await CalismaSaatleri.getCalismaSaatleri(subeId);

      res.status(200).json({
        success: true,
        data: saatler,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async createCalismaSaatleri(req, res) {
    try {
      const { subeId } = req.params;
      const saatlerData = req.body;

      const saatId = await CalismaSaatleri.createCalismaSaatleri(
        subeId,
        saatlerData
      );

      res.status(201).json({
        success: true,
        data: { id: saatId },
        message: "Çalışma saatleri başarıyla oluşturuldu",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateCalismaSaatleri(req, res) {
    try {
      const { id } = req.params;
      const saatlerData = req.body;

      const success = await CalismaSaatleri.updateCalismaSaatleri(
        id,
        saatlerData
      );

      if (success) {
        res.status(200).json({
          success: true,
          message: "Çalışma saatleri başarıyla güncellendi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Çalışma saatleri bulunamadı",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async deleteCalismaSaatleri(req, res) {
    try {
      const { id } = req.params;

      const success = await CalismaSaatleri.deleteCalismaSaatleri(id);

      if (success) {
        res.status(200).json({
          success: true,
          message: "Çalışma saatleri başarıyla silindi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Çalışma saatleri bulunamadı",
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

module.exports = CalismaSaatleriController;
