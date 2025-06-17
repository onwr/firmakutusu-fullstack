const pool = require("../../config/db");
const Firma = require("../Firma");

class ResimGalerisi {
  static async getResimler(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM resim_galerisi WHERE firma_id = ?",
        [firmaId]
      );
      return rows;
    } catch (error) {
      console.error("Resimler alınamadı", error);
      throw error;
    }
  }

  static async createResim(firmaId, resimData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { resim_url } = resimData;

      const [result] = await pool.query(
        `INSERT INTO resim_galerisi 
        (firma_id, resim_url) 
        VALUES (?, ?)`,
        [firmaId, resim_url]
      );

      return result.insertId;
    } catch (error) {
      console.error("Resim eklenemedi", error);
      throw error;
    }
  }

  static async deleteResim(firmaId, resimId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [existingResim] = await pool.query(
        "SELECT * FROM resim_galerisi WHERE id = ? AND firma_id = ?",
        [resimId, firmaId]
      );

      if (!existingResim[0]) {
        throw new Error("Resim bulunamadı");
      }

      const [result] = await pool.query(
        "DELETE FROM resim_galerisi WHERE id = ? AND firma_id = ?",
        [resimId, firmaId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Resim silinemedi", error);
      throw error;
    }
  }

  static async getResimGalerisiAyarlar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM resim_galerisi_ayarlar WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Resim galerisi ayarları alınamadı", error);
      throw error;
    }
  }

  static async updateResimGalerisiAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { baslik } = ayarlarData;

      // Önce mevcut ayarları kontrol et
      const [existing] = await pool.query(
        "SELECT * FROM resim_galerisi_ayarlar WHERE firma_id = ?",
        [firmaId]
      );

      if (existing && existing.length > 0) {
        // Güncelle
        await pool.query(
          `UPDATE resim_galerisi_ayarlar 
          SET baslik = ?
          WHERE firma_id = ?`,
          [baslik, firmaId]
        );
      } else {
        // Yeni kayıt oluştur
        await pool.query(
          `INSERT INTO resim_galerisi_ayarlar 
          (firma_id, baslik) 
          VALUES (?, ?)`,
          [firmaId, baslik]
        );
      }

      return true;
    } catch (error) {
      console.error("Resim galerisi ayarları güncellenemedi", error);
      throw error;
    }
  }
}

module.exports = ResimGalerisi;
