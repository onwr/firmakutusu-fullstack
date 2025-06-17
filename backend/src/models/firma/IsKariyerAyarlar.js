const pool = require("../../config/db");
const Firma = require("../Firma");

class IsKariyerAyarlar {
  static async getAyarlar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM is_kariyer_ayarlar WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Kariyer ayarları alınamadı", error);
      throw error;
    }
  }

  static async createAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { baslik, metin, email_adresi, aydinlatma_metni } = ayarlarData;

      const [result] = await pool.query(
        `INSERT INTO is_kariyer_ayarlar 
        (firma_id, baslik, metin, email_adresi, aydinlatma_metni) 
        VALUES (?, ?, ?, ?, ?)`,
        [firmaId, baslik, metin, email_adresi, aydinlatma_metni]
      );

      return result.insertId;
    } catch (error) {
      console.error("Kariyer ayarları oluşturulamadı", error);
      throw error;
    }
  }

  static async updateAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { baslik, metin, email_adresi, aydinlatma_metni } = ayarlarData;

      // Önce mevcut ayarları kontrol et
      const [existing] = await pool.query(
        "SELECT * FROM is_kariyer_ayarlar WHERE firma_id = ?",
        [firmaId]
      );

      if (existing && existing.length > 0) {
        // Güncelle
        const [result] = await pool.query(
          `UPDATE is_kariyer_ayarlar 
          SET baslik = ?, metin = ?, email_adresi = ?, aydinlatma_metni = ?
          WHERE firma_id = ?`,
          [baslik, metin, email_adresi, aydinlatma_metni, firmaId]
        );

        return result.affectedRows > 0;
      } else {
        // Yeni kayıt oluştur
        const [result] = await pool.query(
          `INSERT INTO is_kariyer_ayarlar 
          (firma_id, baslik, metin, email_adresi, aydinlatma_metni) 
          VALUES (?, ?, ?, ?, ?)`,
          [firmaId, baslik, metin, email_adresi, aydinlatma_metni]
        );

        return result.insertId > 0;
      }
    } catch (error) {
      console.error("Kariyer ayarları güncellenemedi", error);
      throw error;
    }
  }
}

module.exports = IsKariyerAyarlar;
