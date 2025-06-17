const pool = require("../../config/db");
const Firma = require("../Firma");

class Kampanyalar {
  static async getKampanyalar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM kampanyalar WHERE firma_id = ?",
        [firmaId]
      );
      return rows;
    } catch (error) {
      console.error("Kampanyalar alınamadı", error);
      throw error;
    }
  }

  static async createKampanya(firmaId, kampanyaData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const {
        kapak_resmi_url,
        aciklama,
        baslangic_tarihi,
        bitis_tarihi,
        acilis_katalogu,
        katalog_pdf_url,
        aktif,
      } = kampanyaData;

      const [result] = await pool.query(
        `INSERT INTO kampanyalar 
        (firma_id, kapak_resmi_url, aciklama, baslangic_tarihi, bitis_tarihi, acilis_katalogu, katalog_pdf_url, aktif) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          firmaId,
          kapak_resmi_url,
          aciklama,
          baslangic_tarihi,
          bitis_tarihi,
          acilis_katalogu,
          katalog_pdf_url,
          aktif,
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error("Kampanya oluşturulamadı", error);
      throw error;
    }
  }

  static async updateKampanya(firmaId, kampanyaId, kampanyaData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [existingKampanya] = await pool.query(
        "SELECT * FROM kampanyalar WHERE id = ? AND firma_id = ?",
        [kampanyaId, firmaId]
      );

      if (!existingKampanya[0]) {
        throw new Error("Kampanya bulunamadı");
      }

      if (firmaId !== existingKampanya[0].firma_id) {
        throw new Error("Bu kampanyayı güncellemek için yeterli yetki yok");
      }

      const {
        kapak_resmi_url,
        aciklama,
        baslangic_tarihi,
        bitis_tarihi,
        acilis_katalogu,
        katalog_pdf_url,
        aktif,
      } = kampanyaData;

      const [result] = await pool.query(
        `UPDATE kampanyalar 
        SET kapak_resmi_url = ?, aciklama = ?, baslangic_tarihi = ?, bitis_tarihi = ?, 
            acilis_katalogu = ?, katalog_pdf_url = ?, aktif = ?
        WHERE id = ? AND firma_id = ?`,
        [
          kapak_resmi_url,
          aciklama,
          baslangic_tarihi,
          bitis_tarihi,
          acilis_katalogu,
          katalog_pdf_url,
          aktif,
          kampanyaId,
          firmaId,
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Kampanya güncellenemedi", error);
      throw error;
    }
  }

  static async getKampanyalarAyarlar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM kampanyalar_ayarlar WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Kampanyalar ayarları alınamadı", error);
      throw error;
    }
  }

  static async updateKampanyalarAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { baslik, metin } = ayarlarData;

      // Önce mevcut ayarları kontrol et
      const [existing] = await pool.query(
        "SELECT * FROM kampanyalar_ayarlar WHERE firma_id = ?",
        [firmaId]
      );

      if (firmaId !== existing[0].firma_id) {
        throw new Error("Bu kampanyayı güncellemek için yeterli yetki yok");
      }

      if (existing && existing[0]) {
        // Güncelle
        await pool.query(
          `UPDATE kampanyalar_ayarlar 
          SET baslik = ?, metin = ?
          WHERE firma_id = ?`,
          [baslik, metin, firmaId]
        );
      } else {
        // Yeni kayıt oluştur
        await pool.query(
          `INSERT INTO kampanyalar_ayarlar 
          (firma_id, baslik, metin) 
          VALUES (?, ?, ?)`,
          [firmaId, baslik, metin]
        );
      }

      return true;
    } catch (error) {
      console.error("Kampanyalar ayarları güncellenemedi", error);
      throw error;
    }
  }

  static async deleteKampanya(firmaId, kampanyaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [existingKampanya] = await pool.query(
        "SELECT * FROM kampanyalar WHERE id = ? AND firma_id = ?",
        [kampanyaId, firmaId]
      );

      if (!existingKampanya[0]) {
        return false;
      }

      const [result] = await pool.query(
        "DELETE FROM kampanyalar WHERE id = ? AND firma_id = ?",
        [kampanyaId, firmaId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Kampanya silinemedi", error);
      throw error;
    }
  }
}

module.exports = Kampanyalar;
