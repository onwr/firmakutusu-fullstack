const Subeler = require("../../models/firma/Subeler");

class SubelerController {
  static async getSubeler(req, res) {
    try {
      const { firmaId } = req.params;
      const subeler = await Subeler.getSubeler(firmaId);

      res.status(200).json({
        success: true,
        data: subeler,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getSubeById(req, res) {
    try {
      const { id } = req.params;
      const sube = await Subeler.getSubeById(id);

      if (!sube) {
        return res.status(404).json({
          success: false,
          error: "Şube bulunamadı",
        });
      }

      res.status(200).json({
        success: true,
        data: sube,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async createSube(req, res) {
    try {
      const { firma_id } = req.user;
      const subeData = req.body;

      const subeId = await Subeler.createSube(firma_id, subeData);

      res.status(201).json({
        success: true,
        data: { id: subeId },
        message: "Şube başarıyla oluşturuldu",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateSube(req, res) {
    try {
      const { id } = req.params;
      const subeData = req.body;

      const success = await Subeler.updateSube(id, subeData);

      if (success) {
        res.status(200).json({
          success: true,
          message: "Şube başarıyla güncellendi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Şube bulunamadı",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async deleteSube(req, res) {
    try {
      const { id } = req.params;

      const success = await Subeler.deleteSube(id);

      if (success) {
        res.status(200).json({
          success: true,
          message: "Şube başarıyla silindi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Şube bulunamadı",
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

module.exports = SubelerController;
