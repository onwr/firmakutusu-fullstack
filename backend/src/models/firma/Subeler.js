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

      // Her şube için çalışma saatlerini getir
      const subelerWithSaatler = await Promise.all(
        rows.map(async (sube) => {
          const [saatler] = await pool.query(
            "SELECT * FROM calisma_saatleri WHERE sube_id = ? ORDER BY FIELD(gun, 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar')",
            [sube.id]
          );
          return {
            ...sube,
            calisma_saatleri: saatler,
          };
        })
      );

      return subelerWithSaatler;
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

      if (rows.length === 0) {
        return null;
      }

      const sube = rows[0];
      const [saatler] = await pool.query(
        "SELECT * FROM calisma_saatleri WHERE sube_id = ? ORDER BY FIELD(gun, 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar')",
        [id]
      );

      return {
        ...sube,
        calisma_saatleri: saatler,
      };
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
        calisma_saatleri,
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

      const subeId = result.insertId;

      // Çalışma saatlerini ekle
      if (calisma_saatleri && Array.isArray(calisma_saatleri)) {
        for (const saat of calisma_saatleri) {
          const { gun, acilis_saati, kapanis_saati, kapali } = saat;
          await pool.query(
            `INSERT INTO calisma_saatleri 
            (sube_id, gun, acilis_saati, kapanis_saati, kapali) 
            VALUES (?, ?, ?, ?, ?)`,
            [subeId, gun, acilis_saati, kapanis_saati, kapali]
          );
        }
      }

      return subeId;
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
        calisma_saatleri,
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

      // Çalışma saatlerini güncelle
      if (calisma_saatleri && Array.isArray(calisma_saatleri)) {
        // Önce mevcut çalışma saatlerini sil
        await pool.query("DELETE FROM calisma_saatleri WHERE sube_id = ?", [
          id,
        ]);

        // Yeni çalışma saatlerini ekle
        for (const saat of calisma_saatleri) {
          const { gun, acilis_saati, kapanis_saati, kapali } = saat;
          await pool.query(
            `INSERT INTO calisma_saatleri 
            (sube_id, gun, acilis_saati, kapanis_saati, kapali) 
            VALUES (?, ?, ?, ?, ?)`,
            [id, gun, acilis_saati, kapanis_saati, kapali]
          );
        }
      }

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Şube güncellenemedi", error);
      throw error;
    }
  }

  static async deleteSube(id) {
    try {
      // Önce çalışma saatlerini sil
      await pool.query("DELETE FROM calisma_saatleri WHERE sube_id = ?", [id]);

      // Sonra şubeyi sil
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
