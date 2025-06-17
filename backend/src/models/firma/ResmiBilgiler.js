const pool = require("../../config/db");
const Firma = require("../Firma");

class ResmiBilgiler {
  static async getResmiBilgiler(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM resmi_bilgiler WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Resmi bilgiler alınamadı", error);
      throw error;
    }
  }

  static async createResmiBilgiler(firmaId, bilgilerData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [result] = await pool.query(
        `INSERT INTO resmi_bilgiler 
        (firma_id, faaliyet_alani, faaliyet_durumu, vergi_dairesi_adi, mersis_no, 
         e_fatura_kullanimi, e_arsiv_kullanimi, e_irsaliye_kullanimi, e_defter_kullanimi,
         fax_numarasi, banka_iban, banka_adi) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          firmaId,
          bilgilerData.faaliyet_alani,
          bilgilerData.faaliyet_durumu,
          bilgilerData.vergi_dairesi_adi,
          bilgilerData.mersis_no,
          bilgilerData.e_fatura_kullanimi,
          bilgilerData.e_arsiv_kullanimi,
          bilgilerData.e_irsaliye_kullanimi,
          bilgilerData.e_defter_kullanimi,
          bilgilerData.fax_numarasi,
          bilgilerData.banka_iban,
          bilgilerData.banka_adi,
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error("Resmi bilgiler oluşturulamadı", error);
      throw error;
    }
  }

  static async updateResmiBilgiler(firmaId, bilgilerData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      // Önce mevcut bilgileri kontrol et
      const [existing] = await pool.query(
        "SELECT * FROM resmi_bilgiler WHERE firma_id = ?",
        [firmaId]
      );

      if (existing && existing.length > 0) {
        // Güncelleme işlemi
        const [result] = await pool.query(
          `UPDATE resmi_bilgiler SET 
          faaliyet_alani = ?,
          faaliyet_durumu = ?,
          vergi_dairesi_adi = ?,
          mersis_no = ?,
          e_fatura_kullanimi = ?,
          e_arsiv_kullanimi = ?,
          e_irsaliye_kullanimi = ?,
          e_defter_kullanimi = ?,
          fax_numarasi = ?,
          banka_iban = ?,
          banka_adi = ?
          WHERE firma_id = ?`,
          [
            bilgilerData.faaliyet_alani,
            bilgilerData.faaliyet_durumu,
            bilgilerData.vergi_dairesi_adi,
            bilgilerData.mersis_no,
            bilgilerData.e_fatura_kullanimi,
            bilgilerData.e_arsiv_kullanimi,
            bilgilerData.e_irsaliye_kullanimi,
            bilgilerData.e_defter_kullanimi,
            bilgilerData.fax_numarasi,
            bilgilerData.banka_iban,
            bilgilerData.banka_adi,
            firmaId,
          ]
        );
        return result.affectedRows > 0;
      } else {
        // Yeni kayıt oluştur
        return await this.createResmiBilgiler(firmaId, bilgilerData);
      }
    } catch (error) {
      console.error("Resmi bilgiler güncellenemedi", error);
      throw error;
    }
  }
}

module.exports = ResmiBilgiler;
