const pool = require("../../config/db");

class CalismaSaatleri {
  static async getCalismaSaatleri(subeId) {
    try {
      // Şube varlığını kontrol et
      const [subeCheck] = await pool.query(
        "SELECT id FROM subeler WHERE id = ?",
        [subeId]
      );

      if (subeCheck.length === 0) {
        throw new Error("Geçersiz şube ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM calisma_saatleri WHERE sube_id = ? ORDER BY FIELD(gun, 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar')",
        [subeId]
      );
      return rows;
    } catch (error) {
      console.error("Çalışma saatleri alınamadı", error);
      throw error;
    }
  }

  static async createCalismaSaatleri(subeId, saatlerData) {
    try {
      // Şube varlığını kontrol et
      const [subeCheck] = await pool.query(
        "SELECT id FROM subeler WHERE id = ?",
        [subeId]
      );

      if (subeCheck.length === 0) {
        throw new Error("Geçersiz şube ID");
      }

      const { gun, acilis_saati, kapanis_saati, kapali } = saatlerData;

      const [result] = await pool.query(
        `INSERT INTO calisma_saatleri 
        (sube_id, gun, acilis_saati, kapanis_saati, kapali) 
        VALUES (?, ?, ?, ?, ?)`,
        [subeId, gun, acilis_saati, kapanis_saati, kapali]
      );

      return result.insertId;
    } catch (error) {
      console.error("Çalışma saatleri oluşturulamadı", error);
      throw error;
    }
  }

  static async updateCalismaSaatleri(id, saatlerData) {
    try {
      const { gun, acilis_saati, kapanis_saati, kapali } = saatlerData;

      const [result] = await pool.query(
        `UPDATE calisma_saatleri 
        SET gun = ?, acilis_saati = ?, kapanis_saati = ?, kapali = ?
        WHERE id = ?`,
        [gun, acilis_saati, kapanis_saati, kapali, id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Çalışma saatleri güncellenemedi", error);
      throw error;
    }
  }

  static async deleteCalismaSaatleri(id) {
    try {
      const [result] = await pool.query(
        "DELETE FROM calisma_saatleri WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Çalışma saatleri silinemedi", error);
      throw error;
    }
  }

  static async deleteCalismaSaatleriBySubeId(subeId) {
    try {
      const [result] = await pool.query(
        "DELETE FROM calisma_saatleri WHERE sube_id = ?",
        [subeId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Şube çalışma saatleri silinemedi", error);
      throw error;
    }
  }
}

module.exports = CalismaSaatleri;
