const pool = require("../../config/db");
const Firma = require("../Firma");

class Urunler {
  static async getUrunler(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM urunler WHERE firma_id = ? ORDER BY id DESC",
        [firmaId]
      );
      return rows;
    } catch (error) {
      console.error("Ürünler alınamadı", error);
      throw error;
    }
  }

  static async createUrun(firmaId, urunData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const {
        belge_adi,
        gecerlilik_baslangic,
        gecerlilik_bitis,
        acilis_katalogu,
        pdf_url,
      } = urunData;

      const [result] = await pool.query(
        `INSERT INTO urunler 
        (firma_id, belge_adi, gecerlilik_baslangic, gecerlilik_bitis, acilis_katalogu, pdf_url) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          firmaId,
          belge_adi,
          gecerlilik_baslangic,
          gecerlilik_bitis,
          acilis_katalogu,
          pdf_url,
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error("Ürün oluşturulamadı", error);
      throw error;
    }
  }

  static async updateUrun(firmaId, urunId, urunData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [existing] = await pool.query(
        "SELECT * FROM urunler WHERE id = ?",
        [urunId]
      );

      if (!existing || existing.length === 0) {
        throw new Error("Güncellenecek ürün bulunamadı");
      }

      if (existing[0].firma_id !== firmaId) {
        throw new Error(
          "Bu ürün üzerinde işlem yapma yetkiniz bulunmamaktadır"
        );
      }

      const {
        belge_adi,
        gecerlilik_baslangic,
        gecerlilik_bitis,
        acilis_katalogu,
        pdf_url,
      } = urunData;

      const [result] = await pool.query(
        `UPDATE urunler 
        SET belge_adi = ?, gecerlilik_baslangic = ?, gecerlilik_bitis = ?, 
            acilis_katalogu = ?, pdf_url = ?
        WHERE id = ? AND firma_id = ?`,
        [
          belge_adi,
          gecerlilik_baslangic,
          gecerlilik_bitis,
          acilis_katalogu,
          pdf_url,
          urunId,
          firmaId,
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Ürün güncellenemedi", error);
      throw error;
    }
  }

  static async deleteUrun(firmaId, urunId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [existing] = await pool.query(
        "SELECT * FROM urunler WHERE id = ?",
        [urunId]
      );

      if (!existing || existing.length === 0) {
        throw new Error("Silinecek ürün bulunamadı");
      }

      if (existing[0].firma_id !== firmaId) {
        throw new Error(
          "Bu ürün üzerinde işlem yapma yetkiniz bulunmamaktadır"
        );
      }

      const [result] = await pool.query(
        "DELETE FROM urunler WHERE id = ? AND firma_id = ?",
        [urunId, firmaId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Ürün silinemedi", error);
      throw error;
    }
  }
}

module.exports = Urunler;
