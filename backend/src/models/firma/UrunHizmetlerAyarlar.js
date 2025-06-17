const pool = require("../../config/db");
const Firma = require("../Firma");

class UrunHizmetlerAyarlar {
  static async getAyarlar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM urun_hizmetler_ayarlar WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Ürün ayarları alınamadı", error);
      throw error;
    }
  }

  static async createAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { baslik, metin } = ayarlarData;

      const [result] = await pool.query(
        `INSERT INTO urun_hizmetler_ayarlar 
        (firma_id, baslik, metin) 
        VALUES (?, ?, ?)`,
        [firmaId, baslik, metin]
      );

      return result.insertId;
    } catch (error) {
      console.error("Ürün ayarları oluşturulamadı", error);
      throw error;
    }
  }

  static async updateAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { baslik, metin } = ayarlarData;

      const [result] = await pool.query(
        `UPDATE urun_hizmetler_ayarlar 
        SET baslik = ?, metin = ?
        WHERE firma_id = ?`,
        [baslik, metin, firmaId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Ürün ayarları güncellenemedi", error);
      throw error;
    }
  }
}

module.exports = UrunHizmetlerAyarlar;
