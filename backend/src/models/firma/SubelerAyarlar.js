const pool = require("../../config/db");
const Firma = require("../Firma");

class SubelerAyarlar {
  static async getSubelerAyarlar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM subeler_ayarlar WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Şube ayarları alınamadı", error);
      throw error;
    }
  }

  static async createSubelerAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { baslik, metin } = ayarlarData;

      const [result] = await pool.query(
        `INSERT INTO subeler_ayarlar 
        (firma_id, baslik, metin) 
        VALUES (?, ?, ?)`,
        [firmaId, baslik, metin]
      );

      return result.insertId;
    } catch (error) {
      console.error("Şube ayarları oluşturulamadı", error);
      throw error;
    }
  }

  static async updateSubelerAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { baslik, metin } = ayarlarData;

      // Önce mevcut ayarları kontrol et
      const [existing] = await pool.query(
        "SELECT * FROM subeler_ayarlar WHERE firma_id = ?",
        [firmaId]
      );

      if (existing && existing.length > 0) {
        // Güncelle
        const [result] = await pool.query(
          `UPDATE subeler_ayarlar 
          SET baslik = ?, metin = ?
          WHERE firma_id = ?`,
          [baslik, metin, firmaId]
        );

        return result.affectedRows > 0;
      } else {
        // Yeni kayıt oluştur
        return await this.createSubelerAyarlar(firmaId, ayarlarData);
      }
    } catch (error) {
      console.error("Şube ayarları güncellenemedi", error);
      throw error;
    }
  }
}

module.exports = SubelerAyarlar;
