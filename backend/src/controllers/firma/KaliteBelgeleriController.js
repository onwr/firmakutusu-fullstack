const KaliteBelgeleri = require("../../models/firma/KaliteBelgeleri");

class KaliteBelgeleriController {
  static async getKaliteBelgeleri(req, res) {
    try {
      const firmaId = req.params.firmaId;
      const belgeler = await KaliteBelgeleri.getKaliteBelgeleri(firmaId);
      res.status(200).json({
        success: true,
        data: belgeler,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createKaliteBelgesi(req, res) {
    try {
      const { firma_id } = req.user;
      const belgeData = req.body;

      console.log("DATA CREATE", req.user);

      const belgeId = await KaliteBelgeleri.createKaliteBelgesi(
        firma_id,
        belgeData
      );
      res
        .status(201)
        .json({ id: belgeId, message: "Kalite belgesi başarıyla oluşturuldu" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateKaliteBelgesi(req, res) {
    try {
      const { firma_id } = req.user;
      const belgeId = req.params.belgeId;
      const belgeData = req.body;

      const success = await KaliteBelgeleri.updateKaliteBelgesi(
        firma_id,
        belgeId,
        belgeData
      );

      if (success) {
        res.status(200).json({
          success: true,
          message: "Kalite belgesi başarıyla güncellendi",
        });
      } else {
        res.status(404).json({ error: "Kalite belgesi bulunamadı" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getKaliteBelgeleriAyarlar(req, res) {
    try {
      const { firmaId } = req.params;
      const ayarlar = await KaliteBelgeleri.getKaliteBelgeleriAyarlar(firmaId);

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

  static async updateKaliteBelgeleriAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const ayarlarData = req.body;

      await KaliteBelgeleri.updateKaliteBelgeleriAyarlar(firma_id, ayarlarData);

      res.status(200).json({
        success: true,
        message: "Kalite belgeleri ayarları başarıyla güncellendi",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = KaliteBelgeleriController;
