const pool = require("../../config/db");
const Firma = require("../Firma");

class VideoGalerisi {
  static async getVideolar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM video_galerisi WHERE firma_id = ?",
        [firmaId]
      );
      return rows;
    } catch (error) {
      console.error("Videolar alınamadı", error);
      throw error;
    }
  }

  static async createVideo(firmaId, videoData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { video_url } = videoData;

      const [result] = await pool.query(
        `INSERT INTO video_galerisi 
        (firma_id, video_url) 
        VALUES (?, ?)`,
        [firmaId, video_url]
      );

      return result.insertId;
    } catch (error) {
      console.error("Video eklenemedi", error);
      throw error;
    }
  }

  static async deleteVideo(firmaId, videoId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [existingVideo] = await pool.query(
        "SELECT * FROM video_galerisi WHERE id = ? AND firma_id = ?",
        [videoId, firmaId]
      );

      if (!existingVideo[0]) {
        throw new Error("Video bulunamadı");
      }

      const [result] = await pool.query(
        "DELETE FROM video_galerisi WHERE id = ? AND firma_id = ?",
        [videoId, firmaId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Video silinemedi", error);
      throw error;
    }
  }

  static async getVideoGalerisiAyarlar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM video_galerisi_ayarlar WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Video galerisi ayarları alınamadı", error);
      throw error;
    }
  }

  static async updateVideoGalerisiAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { baslik } = ayarlarData;

      // Önce mevcut ayarları kontrol et
      const [existing] = await pool.query(
        "SELECT * FROM video_galerisi_ayarlar WHERE firma_id = ?",
        [firmaId]
      );

      if (existing && existing.length > 0) {
        // Güncelle
        await pool.query(
          `UPDATE video_galerisi_ayarlar 
          SET baslik = ?
          WHERE firma_id = ?`,
          [baslik, firmaId]
        );
      } else {
        // Yeni kayıt oluştur
        await pool.query(
          `INSERT INTO video_galerisi_ayarlar 
          (firma_id, baslik) 
          VALUES (?, ?)`,
          [firmaId, baslik]
        );
      }

      return true;
    } catch (error) {
      console.error("Video galerisi ayarları güncellenemedi", error);
      throw error;
    }
  }
}

module.exports = VideoGalerisi;
