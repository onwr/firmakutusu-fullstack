const pool = require("../../config/db");
const Firma = require("../Firma");

class Referanslar {
  static async getReferanslar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM referanslar WHERE firma_id = ?",
        [firmaId]
      );
      return rows;
    } catch (error) {
      console.error("Referanslar alınamadı", error);
      throw error;
    }
  }

  static async createReferans(firmaId, referansData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        return {
          status: false,
          message: "Geçersiz firma ID",
        };
      }

      const { tip, ilgili_firma_vergi_no, referans_mesaji, durum } =
        referansData;

      const ilgiliFirma = await Firma.getByVKN(ilgili_firma_vergi_no);

      if (!ilgiliFirma.status) {
        return {
          status: false,
          message: "Geçersiz ilgili firma VKN",
        };
      }

      const [result] = await pool.query(
        `INSERT INTO referanslar 
        (firma_id, tip, ilgili_firma_id, ilgili_firma_adi, referans_mesaji, durum, talep_tarihi) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          firmaId,
          tip,
          ilgiliFirma.data.id,
          ilgiliFirma.data.firma_unvani,
          referans_mesaji,
          durum || "beklemede",
        ]
      );

      return {
        status: true,
        data: {
          id: result.insertId,
        },
      };
    } catch (error) {
      console.error("Referans oluşturulamadı", error);
      return {
        status: false,
        message: error.message,
      };
    }
  }

  static async updateReferans(firmaId, referansId, referansData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      // Durum kontrolü için where clause'u belirle
      let whereClause;
      let whereParams;

      if (
        referansData.durum === "onaylandi" ||
        referansData.durum === "reddedildi"
      ) {
        // Onaylama/reddetme durumunda ilgili_firma_id kontrolü
        whereClause = "id = ? AND ilgili_firma_id = ?";
        whereParams = [referansId, firmaId];
      } else if (referansData.durum === "iptal") {
        // İptal durumunda hem firma_id hem ilgili_firma_id kontrolü
        whereClause = "id = ? AND (firma_id = ? OR ilgili_firma_id = ?)";
        whereParams = [referansId, firmaId, firmaId];
      } else {
        // Diğer durumlar için firma_id kontrolü
        whereClause = "id = ? AND firma_id = ?";
        whereParams = [referansId, firmaId];
      }

      const [existingReferans] = await pool.query(
        `SELECT * FROM referanslar WHERE ${whereClause}`,
        whereParams
      );

      if (!existingReferans[0]) {
        throw new Error("Referans bulunamadı");
      }

      // Mevcut referans verilerini al
      const currentReferans = existingReferans[0];

      // Sadece durum güncelleniyorsa diğer alanları mevcut değerlerden al
      const updateData = {
        tip: referansData.tip || currentReferans.tip,
        ilgili_firma_id:
          referansData.ilgili_firma_id || currentReferans.ilgili_firma_id,
        ilgili_firma_adi:
          referansData.ilgili_firma_adi || currentReferans.ilgili_firma_adi,
        referans_mesaji:
          referansData.referans_mesaji || currentReferans.referans_mesaji,
        durum: referansData.durum,
      };

      const [result] = await pool.query(
        `UPDATE referanslar 
        SET tip = ?, ilgili_firma_id = ?, ilgili_firma_adi = ?, 
            referans_mesaji = ?, durum = ?, islem_tarihi = NOW()
        WHERE id = ? AND ${whereClause}`,
        [
          updateData.tip,
          updateData.ilgili_firma_id,
          updateData.ilgili_firma_adi,
          updateData.referans_mesaji,
          updateData.durum,
          referansId,
          ...whereParams,
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Referans güncellenemedi", error);
      throw error;
    }
  }

  static async getReferanslarAyarlar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        "SELECT * FROM referanslar_ayarlar WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Referanslar ayarları alınamadı", error);
      throw error;
    }
  }

  static async updateReferanslarAyarlar(firmaId, ayarlarData) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        return {
          status: false,
          message: "Geçersiz firma ID",
        };
      }

      const { baslik, metin } = ayarlarData;

      // Önce mevcut ayarları kontrol et
      const [existing] = await pool.query(
        "SELECT * FROM referanslar_ayarlar WHERE firma_id = ?",
        [firmaId]
      );

      if (existing && existing[0]) {
        // Güncelle
        await pool.query(
          `UPDATE referanslar_ayarlar 
          SET baslik = ?, metin = ?
          WHERE firma_id = ?`,
          [baslik, metin, firmaId]
        );
      } else {
        // Yeni kayıt oluştur
        await pool.query(
          `INSERT INTO referanslar_ayarlar 
          (firma_id, baslik, metin) 
          VALUES (?, ?, ?)`,
          [firmaId, baslik, metin]
        );
      }

      return true;
    } catch (error) {
      console.error("Referanslar ayarları güncellenemedi", error);
      throw error;
    }
  }

  static async getGelenReferanslar(firmaId) {
    try {
      const firma = await Firma.getById(firmaId);
      if (!firma) {
        throw new Error("Geçersiz firma ID");
      }

      const [rows] = await pool.query(
        `SELECT r.*, f.firma_unvani as talep_eden_firma_adi 
         FROM referanslar r 
         LEFT JOIN firmalar f ON r.firma_id = f.id 
         WHERE r.ilgili_firma_id = ? 
         ORDER BY r.talep_tarihi DESC`,
        [firmaId]
      );
      return rows;
    } catch (error) {
      console.error("Gelen referanslar alınamadı", error);
      throw error;
    }
  }
}

module.exports = Referanslar;
