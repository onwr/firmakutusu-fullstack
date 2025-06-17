const db = require("../../config/db");

class Bildirim {
  static async getAll(firma_id) {
    try {
      const [results] = await db.query(
        "SELECT * FROM bildirimler WHERE firma_id = ? OR firma_id IS NULL ORDER BY olusturma_tarihi DESC LIMIT 10",
        [firma_id]
      );
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async create(bildirimData) {
    try {
      const [result] = await db.query(
        "INSERT INTO bildirimler SET ?",
        bildirimData
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async markAsRead(id, firma_id) {
    try {
      const [result] = await db.query(
        "UPDATE bildirimler SET okundu = true WHERE id = ? AND firma_id = ?",
        [id, firma_id]
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async delete(id, firma_id) {
    try {
      const [result] = await db.query(
        "DELETE FROM bildirimler WHERE id = ? AND firma_id = ?",
        [id, firma_id]
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async getAllForFirma(firma_id) {
    try {
      const [results] = await db.query(
        `SELECT * FROM bildirimler 
         WHERE (firma_id = ? OR hedef_tur = 'tum') 
         ORDER BY olusturma_tarihi DESC`,
        [firma_id]
      );
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async createSystemNotification(bildirimData) {
    try {
      const data = {
        ...bildirimData,
        hedef_tur: "tum",
        firma_id: null,
      };
      const [result] = await db.query("INSERT INTO bildirimler SET ?", data);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Bildirim;
