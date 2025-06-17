const pool = require("../../config/db");
const Firma = require("../Firma");

class KaliteBelgeleri {
  static async getKaliteBelgeleri(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM kalite_belgeleri WHERE firma_id = ?",
        [firmaId]
      );
      return rows;
    } catch (error) {
      console.error("Kalite belgeleri alınamadı", error);
      throw error;
    }
  }

  static async createKaliteBelgesi(firmaId, belgeData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const {
        belge_resmi_url,
        belge_adi,
        sertifika_no,
        verilis_tarihi,
        gecerlilik_bitis,
      } = belgeData;

      const [result] = await pool.query(
        `INSERT INTO kalite_belgeleri 
        (firma_id, belge_resmi_url, belge_adi, sertifika_no, verilis_tarihi, gecerlilik_bitis) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          firmaId,
          belge_resmi_url,
          belge_adi,
          sertifika_no,
          verilis_tarihi,
          gecerlilik_bitis,
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error("Kalite belgesi oluşturulamadı", error);
      throw error;
    }
  }

  static async updateKaliteBelgesi(firmaId, belgeId, belgeData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [existing] = await pool.query(
        "SELECT * FROM kalite_belgeleri WHERE id = ?",
        [belgeId]
      );

      if (!existing || existing.length === 0) {
        throw new Error("Güncellenecek kalite belgesi bulunamadı");
      }

      // Kalite belgesinin ilgili firmaya ait olup olmadığını kontrol et
      if (existing[0].firma_id !== firmaId) {
        throw new Error(
          "Bu kalite belgesi üzerinde işlem yapma yetkiniz bulunmamaktadır"
        );
      }

      const {
        belge_resmi_url,
        belge_adi,
        sertifika_no,
        verilis_tarihi,
        gecerlilik_bitis,
      } = belgeData;

      const [result] = await pool.query(
        `UPDATE kalite_belgeleri 
        SET belge_resmi_url = ?, belge_adi = ?, sertifika_no = ?, verilis_tarihi = ?, gecerlilik_bitis = ?
        WHERE id = ? AND firma_id = ?`,
        [
          belge_resmi_url,
          belge_adi,
          sertifika_no,
          verilis_tarihi,
          gecerlilik_bitis,
          belgeId,
          firmaId,
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Kalite belgesi güncellenemedi", error);
      throw error;
    }
  }

  static async getKaliteBelgeleriAyarlar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM kalite_belgeleri_ayarlar WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Kalite belgeleri ayarları alınamadı", error);
      throw error;
    }
  }

  static async updateKaliteBelgeleriAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { baslik, metin } = ayarlarData;

      // Önce mevcut ayarları kontrol et
      const [existing] = await pool.query(
        "SELECT * FROM kalite_belgeleri_ayarlar WHERE firma_id = ?",
        [firmaId]
      );

      if (existing && existing.length > 0) {
        // Güncelle
        await pool.query(
          `UPDATE kalite_belgeleri_ayarlar 
          SET baslik = ?, metin = ?
          WHERE firma_id = ?`,
          [baslik, metin, firmaId]
        );
      } else {
        // Yeni kayıt oluştur
        await pool.query(
          `INSERT INTO kalite_belgeleri_ayarlar 
          (firma_id, baslik, metin) 
          VALUES (?, ?, ?)`,
          [firmaId, baslik, metin]
        );
      }

      return true;
    } catch (error) {
      console.error("Kalite belgeleri ayarları güncellenemedi", error);
      throw error;
    }
  }
}

module.exports = KaliteBelgeleri;
