const db = require("../config/db");

class PaketModel {
  // Tüm paketleri getir
  static async getAllPakets() {
    try {
      const [paketler] = await db.query(`
                SELECT p.*, 
                    GROUP_CONCAT(CONCAT(po.ozellik_adi, ':', po.ozellik_degeri) SEPARATOR '||') as ozellikler
                FROM paketler p
                LEFT JOIN paket_ozellikleri po ON p.id = po.paket_id
                WHERE p.aktif = true
                GROUP BY p.id
            `);
      return paketler;
    } catch (error) {
      throw error;
    }
  }

  static async getPaketSatisById(satisId) {
    try {
      const [satis] = await db.query(
        `SELECT * FROM firma_paket_gecmisi WHERE id = ?`,
        [satisId]
      );
      return satis[0];
    } catch (error) {
      throw error;
    }
  }

  // Paket detayını getir
  static async getPaketById(id) {
    try {
      const [paket] = await db.query(
        `
                SELECT p.*, 
                    GROUP_CONCAT(CONCAT(po.ozellik_adi, ':', po.ozellik_degeri) SEPARATOR '||') as ozellikler
                FROM paketler p
                LEFT JOIN paket_ozellikleri po ON p.id = po.paket_id
                WHERE p.id = ? AND p.aktif = true
                GROUP BY p.id
            `,
        [id]
      );
      return paket[0];
    } catch (error) {
      throw error;
    }
  }

  // Firma paket geçmişini getir
  static async getFirmaPaketGecmisi(firmaId) {
    try {
      const [gecmis] = await db.query(
        `
                SELECT fpg.*, p.ad as paket_adi, p.aciklama as paket_aciklama
                FROM firma_paket_gecmisi fpg
                JOIN paketler p ON fpg.paket_id = p.id
                WHERE fpg.firma_id = ?
                ORDER BY fpg.baslangic_tarihi DESC
            `,
        [firmaId]
      );
      return gecmis;
    } catch (error) {
      throw error;
    }
  }

  // Firma aktif paketini getir
  static async getFirmaAktifPaket(firmaId) {
    try {
      const [paket] = await db.query(
        `
                SELECT fpg.*, p.*
                FROM firma_paket_gecmisi fpg
                JOIN paketler p ON fpg.paket_id = p.id
                WHERE fpg.firma_id = ?
                AND fpg.bitis_tarihi > NOW()
                AND fpg.odeme_durumu = 'odendi'
                ORDER BY fpg.baslangic_tarihi DESC
                LIMIT 1
            `,
        [firmaId]
      );
      return paket[0];
    } catch (error) {
      throw error;
    }
  }

  // Yeni paket satın alma kaydı oluştur
  static async createPaketSatis(
    firmaId,
    paketId,
    baslangicTarihi,
    bitisTarihi
  ) {
    try {
      const [result] = await db.query(
        `
                INSERT INTO firma_paket_gecmisi 
                (firma_id, paket_id, baslangic_tarihi, bitis_tarihi, odeme_durumu)
                VALUES (?, ?, ?, ?, 'beklemede')
            `,
        [firmaId, paketId, baslangicTarihi, bitisTarihi]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Ödeme durumunu güncelle
  static async updateOdemeDurumu(satisId, durum) {
    try {
      const [result] = await db.query(
        `
                UPDATE firma_paket_gecmisi 
                SET odeme_durumu = ?, odeme_tarihi = CASE WHEN ? = 'odendi' THEN NOW() ELSE NULL END
                WHERE id = ?
            `,
        [durum, durum, satisId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Firma aktif paketini güncelle
  static async updateFirmaAktifPaket(
    firmaId,
    paketId,
    baslangicTarihi,
    bitisTarihi
  ) {
    try {
      const [result] = await db.query(
        `
                UPDATE firmalar 
                SET aktif_paket_id = ?,
                    paket_baslangic_tarihi = ?,
                    paket_bitis_tarihi = ?
                WHERE id = ?
            `,
        [paketId, baslangicTarihi, bitisTarihi, firmaId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Otomatik yenileme ayarını güncelle
  static async updateOtomatikYenileme(paketId, otomatikYenileme) {
    try {
      const [result] = await db.query(
        `UPDATE firma_paket_gecmisi 
         SET otomatik_yenileme = ?
         WHERE id = ?`,
        [otomatikYenileme, paketId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Kayıtlı kart bilgisini güncelle
  static async updateKayitliKart(paketId, kartId) {
    try {
      const [result] = await db.query(
        `UPDATE firma_paket_gecmisi 
         SET kayitli_kart_id = ?
         WHERE id = ?`,
        [kartId, paketId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PaketModel;
