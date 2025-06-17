const pool = require("../../config/db");
const Firma = require("../Firma");

class Subeler {
  static async getSubeler(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM subeler WHERE firma_id = ?",
        [firmaId]
      );
      return rows;
    } catch (error) {
      console.error("Şubeler alınamadı", error);
      throw error;
    }
  }

  static async getSubeById(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM subeler WHERE id = ?", [
        id,
      ]);
      return rows[0] || null;
    } catch (error) {
      console.error("Şube bilgileri alınamadı", error);
      throw error;
    }
  }

  static async createSube(firmaId, subeData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const {
        kapak_resmi_url,
        sube_adi,
        sube_adresi,
        mail_adresi,
        telefon_numarasi,
      } = subeData;

      const [result] = await pool.query(
        `INSERT INTO subeler 
        (firma_id, kapak_resmi_url, sube_adi, sube_adresi, mail_adresi, telefon_numarasi) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          firmaId,
          kapak_resmi_url,
          sube_adi,
          sube_adresi,
          mail_adresi,
          telefon_numarasi,
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error("Şube oluşturulamadı", error);
      throw error;
    }
  }

  static async updateSube(id, subeData) {
    try {
      const {
        kapak_resmi_url,
        sube_adi,
        sube_adresi,
        mail_adresi,
        telefon_numarasi,
      } = subeData;

      const [result] = await pool.query(
        `UPDATE subeler 
        SET kapak_resmi_url = ?, sube_adi = ?, sube_adresi = ?, 
            mail_adresi = ?, telefon_numarasi = ?
        WHERE id = ?`,
        [
          kapak_resmi_url,
          sube_adi,
          sube_adresi,
          mail_adresi,
          telefon_numarasi,
          id,
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Şube güncellenemedi", error);
      throw error;
    }
  }

  static async deleteSube(id) {
    try {
      const [result] = await pool.query("DELETE FROM subeler WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Şube silinemedi", error);
      throw error;
    }
  }
}

module.exports = Subeler;
