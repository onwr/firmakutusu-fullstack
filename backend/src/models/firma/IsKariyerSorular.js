const pool = require("../../config/db");
const Firma = require("../Firma");

class IsKariyerSorular {
  static async getSorular(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      // Sabit soruları tanımla
      const sabitSorular = [
        {
          soru_metni: "Adınız Soyadınız",
          sira: 1,
          sabit: 1,
        },
        {
          soru_metni: "T.C. Kimlik Numaranız",
          sira: 2,
          sabit: 1,
        },
        {
          soru_metni: "Telefon Numaranız",
          sira: 3,
          sabit: 1,
        },
        {
          soru_metni: "E-Mail Adresiniz",
          sira: 4,
          sabit: 1,
        },
      ];

      // Mevcut soruları al
      const [rows] = await pool.query(
        "SELECT * FROM is_kariyer_sorular WHERE firma_id = ? ORDER BY sira ASC",
        [firmaId]
      );

      // Sabit soruları kontrol et ve eksik olanları ekle
      for (const sabitSoru of sabitSorular) {
        const exists = rows.some(
          (row) => row.soru_metni === sabitSoru.soru_metni
        );
        if (!exists) {
          const [result] = await pool.query(
            "INSERT INTO is_kariyer_sorular (firma_id, soru_metni, sira, sabit) VALUES (?, ?, ?, ?)",
            [firmaId, sabitSoru.soru_metni, sabitSoru.sira, sabitSoru.sabit]
          );
          rows.push({
            id: result.insertId,
            firma_id: firmaId,
            soru_metni: sabitSoru.soru_metni,
            sira: sabitSoru.sira,
            sabit: sabitSoru.sabit,
          });
        }
      }

      // Tüm soruları sıraya göre sırala
      return rows.sort((a, b) => a.sira - b.sira);
    } catch (error) {
      console.error("Kariyer soruları alınamadı", error);
      throw error;
    }
  }

  static async createSoru(firmaId, soruData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const { soru_metni, sira, sabit } = soruData;

      const [result] = await pool.query(
        `INSERT INTO is_kariyer_sorular 
        (firma_id, soru_metni, sira, sabit) 
        VALUES (?, ?, ?, ?)`,
        [firmaId, soru_metni, sira, sabit]
      );

      return {
        success: true,
        insertId: result.insertId,
      };
    } catch (error) {
      console.error("Kariyer sorusu oluşturulamadı", error);
      throw error;
    }
  }

  static async updateSoru(firmaId, soruId, soruData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [existing] = await pool.query(
        "SELECT * FROM is_kariyer_sorular WHERE id = ?",
        [soruId]
      );

      if (!existing || existing.length === 0) {
        throw new Error("Güncellenecek soru bulunamadı");
      }

      if (existing[0].firma_id !== firmaId) {
        throw new Error(
          "Bu soru üzerinde işlem yapma yetkiniz bulunmamaktadır"
        );
      }

      if (existing[0].sabit) {
        throw new Error("Sabit sorular düzenlenemez");
      }

      const { soru_metni, sira } = soruData;

      const [result] = await pool.query(
        `UPDATE is_kariyer_sorular 
        SET soru_metni = ?, sira = ?
        WHERE id = ? AND firma_id = ?`,
        [soru_metni, sira, soruId, firmaId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Kariyer sorusu güncellenemedi", error);
      throw error;
    }
  }

  static async deleteSoru(firmaId, soruId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [existing] = await pool.query(
        "SELECT * FROM is_kariyer_sorular WHERE id = ?",
        [soruId]
      );

      if (!existing || existing.length === 0) {
        throw new Error("Silinecek soru bulunamadı");
      }

      if (existing[0].firma_id !== firmaId) {
        throw new Error(
          "Bu soru üzerinde işlem yapma yetkiniz bulunmamaktadır"
        );
      }

      if (existing[0].sabit) {
        throw new Error("Sabit sorular silinemez");
      }

      const [result] = await pool.query(
        "DELETE FROM is_kariyer_sorular WHERE id = ? AND firma_id = ?",
        [soruId, firmaId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Kariyer sorusu silinemedi", error);
      throw error;
    }
  }
}

module.exports = IsKariyerSorular;
