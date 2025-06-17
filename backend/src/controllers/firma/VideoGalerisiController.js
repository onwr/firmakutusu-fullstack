const VideoGalerisi = require("../../models/firma/VideoGalerisi");

class VideoGalerisiController {
  static async getVideolar(req, res) {
    try {
      const { firmaId } = req.params;
      const videolar = await VideoGalerisi.getVideolar(firmaId);

      res.status(200).json({
        success: true,
        data: videolar,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async createVideo(req, res) {
    try {
      const { firma_id } = req.user;
      const videoData = req.body;

      const videoId = await VideoGalerisi.createVideo(firma_id, videoData);

      res.status(201).json({
        success: true,
        data: { id: videoId },
        message: "Video başarıyla eklendi",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async deleteVideo(req, res) {
    try {
      const { firma_id } = req.user;
      const { videoId } = req.params;

      const success = await VideoGalerisi.deleteVideo(firma_id, videoId);

      if (success) {
        res.status(200).json({
          success: true,
          message: "Video başarıyla silindi",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Video bulunamadı",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getVideoGalerisiAyarlar(req, res) {
    try {
      const { firmaId } = req.params;
      const ayarlar = await VideoGalerisi.getVideoGalerisiAyarlar(firmaId);

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

  static async updateVideoGalerisiAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const ayarlarData = req.body;

      await VideoGalerisi.updateVideoGalerisiAyarlar(firma_id, ayarlarData);

      res.status(200).json({
        success: true,
        message: "Video galerisi ayarları başarıyla güncellendi",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = VideoGalerisiController;
