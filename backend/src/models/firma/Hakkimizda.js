const pool = require("../../config/db");
const Firma = require("../Firma");

class Hakkimizda {
  static async getHakkimizda({ firmaId }) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM hakkimizda WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0];
    } catch (error) {
      console.error("Hakkımızda bilgileri alınamadı", error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { firma_id, baslik, ceo_adi, ceo_mesaji, ceo_resmi_url } = data;

      // Firma ID'nin geçerli olup olmadığını kontrol et
      const firma = await Firma.getById(firma_id);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      // Firma için zaten bir kayıt var mı kontrol et
      const mevcutKayit = await this.getHakkimizda({ firmaId: firma_id });
      if (mevcutKayit) {
        throw new Error("Bu firma için zaten bir hakkımızda kaydı mevcut");
      }

      const [result] = await pool.query(
        "INSERT INTO hakkimizda (firma_id, baslik, ceo_adi, ceo_mesaji, ceo_resmi_url) VALUES (?, ?, ?, ?, ?)",
        [firma_id, baslik, ceo_adi, ceo_mesaji, ceo_resmi_url]
      );
      return {
        success: true,
        id: result.insertId,
        message: "Hakkımızda bilgileri oluşturuldu",
        ...data,
      };
    } catch (error) {
      console.error("Hakkımızda bilgileri oluşturulamadı", error);
      throw error;
    }
  }

  static async update(firmaId, data) {
    try {
      const { baslik, ceo_adi, ceo_mesaji, ceo_resmi_url } = data;

      // Firma ID'nin geçerli olup olmadığını kontrol et
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      // Güncellenecek kaydın var olup olmadığını kontrol et
      const mevcutKayit = await this.getHakkimizda({ firmaId });
      if (!mevcutKayit) {
        throw new Error("Güncellenecek hakkımızda kaydı bulunamadı");
      }

      await pool.query(
        "UPDATE hakkimizda SET baslik = ?, ceo_adi = ?, ceo_mesaji = ?, ceo_resmi_url = ? WHERE firma_id = ?",
        [baslik, ceo_adi, ceo_mesaji, ceo_resmi_url, firmaId]
      );
      return {
        success: true,
        message: "Hakkımızda bilgileri güncellendi",
        ...data,
      };
    } catch (error) {
      console.error("Hakkımızda bilgileri güncellenemedi", error);
      throw error;
    }
  }
}

module.exports = Hakkimizda;
