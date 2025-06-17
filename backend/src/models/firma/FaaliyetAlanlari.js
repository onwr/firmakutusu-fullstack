const pool = require("../../config/db");
const Firma = require("../Firma");

class FaaliyetAlanlari {
  static async getFaaliyetAlanlari({ firmaId }) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM faaliyet_alanlari WHERE firma_id = ?",
        [firmaId]
      );
      return rows;
    } catch (error) {
      console.error("Faaliyet alanları alınamadı", error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { firma_id, tur, alan, nace_kodu } = data;

      const firma = await Firma.getById(firma_id);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [result] = await pool.query(
        "INSERT INTO faaliyet_alanlari (firma_id, tur, alan, nace_kodu) VALUES (?, ?, ?, ?)",
        [firma_id, tur, alan, nace_kodu]
      );

      return {
        success: true,
        id: result.insertId,
        message: "Faaliyet alanı başarıyla oluşturuldu",
        data: {
          firma_id,
          tur,
          alan,
          nace_kodu,
        },
      };
    } catch (error) {
      console.error("Faaliyet alanı oluşturulamadı", error);
      throw error;
    }
  }

  static async update(id, firma_id, data) {
    try {
      const { tur, alan, nace_kodu } = data;

      // Önce faaliyet alanının var olduğunu kontrol et
      const [existing] = await pool.query(
        "SELECT * FROM faaliyet_alanlari WHERE id = ?",
        [id]
      );

      if (!existing || existing.length === 0) {
        throw new Error("Güncellenecek faaliyet alanı bulunamadı");
      }

      // Faaliyet alanının ilgili firmaya ait olup olmadığını kontrol et
      if (existing[0].firma_id !== firma_id) {
        throw new Error(
          "Bu faaliyet alanı üzerinde işlem yapma yetkiniz bulunmamaktadır"
        );
      }

      await pool.query(
        "UPDATE faaliyet_alanlari SET tur = ?, alan = ?, nace_kodu = ? WHERE id = ?",
        [tur, alan, nace_kodu, id]
      );

      return {
        success: true,
        message: "Faaliyet alanı başarıyla güncellendi",
        data: {
          id,
          tur,
          alan,
          nace_kodu,
          firma_id: existing[0].firma_id,
        },
      };
    } catch (error) {
      console.error("Faaliyet alanı güncellenemedi", error);
      throw error;
    }
  }

  static async delete(id, firma_id) {
    try {
      const [result] = await pool.query(
        "DELETE FROM faaliyet_alanlari WHERE id = ? AND firma_id = ?",
        [id, firma_id]
      );

      if (result.affectedRows === 0) {
        throw new Error("Faaliyet alanı bulunamadı veya silinemedi");
      }

      return {
        success: true,
        message: "Faaliyet alanı başarıyla silindi",
      };
    } catch (error) {
      console.error("Faaliyet alanı silinemedi", error);
      throw error;
    }
  }
}

module.exports = FaaliyetAlanlari;
