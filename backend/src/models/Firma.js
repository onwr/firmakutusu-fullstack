const pool = require("../config/db");
const YetkiliKisi = require("./YetkiliKisi");

class Firma {
  static async create({
    uyelikTuru,
    sektor,
    markaAdi,
    vkn,
    firmaUnvani,
    userId,
  }) {
    const connection = await pool.getConnection();

    console.log("DÖNEN DATA", uyelikTuru, sektor, markaAdi, vkn, firmaUnvani);

    try {
      // Ana firma kaydını oluştur
      const [firmaResult] = await connection.query(
        `INSERT INTO firmalar (
          uyelik_turu, marka_adi, firma_unvani, vergi_kimlik_no,
          sektor, hizmet_alani, profil_resmi_url, kurulus_tarihi,
          kurulus_sehri, merkez_adresi, kep_adresi, email,
          web_sitesi, iletisim_telefonu, olusturulma_tarihi, aktif
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), true)`,
        [
          uyelikTuru,
          markaAdi,
          firmaUnvani,
          vkn,
          sektor,
          null, // hizmet_alani
          "/images/default-company.png",
          null, // kurulus_tarihi
          null, // kurulus_sehri
          null, // merkez_adresi
          null, // kep_adresi
          null, // email
          null, // web_sitesi
          null, // iletisim_telefonu
        ]
      );

      const firmaId = firmaResult.insertId;

      // Yetkili kişi firma ID'sini güncelle
      await YetkiliKisi.updateFirmaId(userId, firmaId);

      // Temel tabloları oluştur
      await this.createBasicTables(firmaId, sektor);

      // İkincil tabloları oluştur
      await this.createSecondaryTables(firmaId);

      return firmaId;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  // Temel tabloları oluştur
  static async createBasicTables(firmaId, sektor) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Resmi bilgiler
      await connection.query(
        `INSERT INTO resmi_bilgiler (
          firma_id, faaliyet_alani, faaliyet_durumu, vergi_dairesi_adi,
          mersis_no, e_fatura_kullanimi, e_arsiv_kullanimi, e_irsaliye_kullanimi, 
          e_defter_kullanimi, fax_numarasi, banka_iban, banka_adi
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          firmaId,
          null, // faaliyet_alani
          true,
          null, // vergi_dairesi_adi
          null, // mersis_no
          false,
          false,
          false,
          false,
          null, // fax_numarasi
          null, // banka_iban
          null, // banka_adi
        ]
      );

      // Hakkımızda
      await connection.query(
        `INSERT INTO hakkimizda (
          firma_id, ceo_resmi_url, baslik, ceo_adi, ceo_mesaji
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          firmaId,
          "/images/default-ceo.png",
          null, // baslik
          null, // ceo_adi
          null, // ceo_mesaji
        ]
      );

      // Faaliyet alanı
      await connection.query(
        `INSERT INTO faaliyet_alanlari (
          firma_id, tur, alan, nace_kodu
        ) VALUES (?, ?, ?, ?)`,
        [
          firmaId,
          "Ana Faaliyet",
          sektor,
          null, // nace_kodu
        ]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // İkincil tabloları oluştur
  static async createSecondaryTables(firmaId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Ürün & Hizmetler
      await connection.query(
        `INSERT INTO urun_hizmetler_ayarlar (firma_id, baslik, metin)
        VALUES (?, ?, ?)`,
        [firmaId, "Ürün & Hizmetlerimiz", "-"]
      );

      // Şubeler
      const [subeResult] = await connection.query(
        `INSERT INTO subeler (firma_id, kapak_resmi_url, sube_adi, sube_adresi, mail_adresi, telefon_numarasi)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [firmaId, "/images/default-branch.png", "Merkez Şube", "-", "-", "-"]
      );

      // Çalışma saatleri
      const subeId = subeResult.insertId;
      const gunler = [
        "Pazartesi",
        "Salı",
        "Çarşamba",
        "Perşembe",
        "Cuma",
        "Cumartesi",
        "Pazar",
      ];
      for (const gun of gunler) {
        const kapali = gunler.indexOf(gun) >= 5;
        await connection.query(
          `INSERT INTO calisma_saatleri (sube_id, gun, acilis_saati, kapanis_saati, kapali)
          VALUES (?, ?, ?, ?, ?)`,
          [
            subeId,
            gun,
            kapali ? null : "09:00:00",
            kapali ? null : "18:00:00",
            kapali,
          ]
        );
      }

      // Diğer ayarlar ve varsayılan kayıtlar
      await this.createDefaultSettings(connection, firmaId);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Varsayılan ayarları oluştur
  static async createDefaultSettings(connection, firmaId) {
    try {
      // Kalite belgeleri ayarları
      await connection.query(
        `INSERT INTO kalite_belgeleri_ayarlar (firma_id, baslik) 
         VALUES (?, ?)`,
        [firmaId, "Kalite Belgelerimiz"]
      );

      // Referanslar ayarları
      await connection.query(
        `INSERT INTO referanslar_ayarlar (firma_id, baslik) 
         VALUES (?, ?)`,
        [firmaId, "Referanslarımız"]
      );

      // Kampanyalar ayarları
      await connection.query(
        `INSERT INTO kampanyalar_ayarlar (firma_id, baslik) 
         VALUES (?, ?)`,
        [firmaId, "Kampanyalarımız"]
      );

      // Resim galerisi ayarları
      await connection.query(
        `INSERT INTO resim_galerisi_ayarlar (firma_id, baslik) 
         VALUES (?, ?)`,
        [firmaId, "Resim Galerimiz"]
      );

      // Video galerisi ayarları
      await connection.query(
        `INSERT INTO video_galerisi_ayarlar (firma_id, baslik) 
         VALUES (?, ?)`,
        [firmaId, "Video Galerimiz"]
      );
    } catch (error) {
      throw error;
    }
  }

  static async update(firmaId, data) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `UPDATE firmalar SET
          firma_unvani = ?,
          marka_adi = ?,
          sektor = ?,
          merkez_adresi = ?,
          kep_adresi = ?,
          email = ?,
          web_sitesi = ?,
          iletisim_telefonu = ?,
          kurulus_tarihi = ?,
          kurulus_sehri = ?,
          vergi_kimlik_no = ?,
          profil_resmi_url = ?
        WHERE id = ?`,
        [
          data.firma_unvani,
          data.marka_adi,
          data.sektor,
          data.merkez_adresi,
          data.kep_adresi,
          data.email,
          data.web_sitesi,
          data.iletisim_telefonu,
          data.kurulus_tarihi,
          data.kurulus_sehri,
          data.vergi_kimlik_no,
          data.profil_resmi_url,
          firmaId,
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error("Firma bulunamadı");
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getVitrinFirmalar() {
    try {
      const [rows] = await pool.query(`
      SELECT 
        f.*,
        p.ad as paket_adi,
        p.fiyat as paket_fiyati,
        fpg.baslangic_tarihi,
        fpg.bitis_tarihi
      FROM firmalar f
      INNER JOIN firma_paket_gecmisi fpg ON f.id = fpg.firma_id
      INNER JOIN paketler p ON fpg.paket_id = p.id
      WHERE 
        p.vitrin_gorunurluk = 1 
        AND fpg.odeme_durumu = 'odendi'
        AND fpg.bitis_tarihi > NOW()
      ORDER BY 
        p.fiyat DESC,
        fpg.baslangic_tarihi DESC
    `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(firmaId) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          f.*,
          rb.faaliyet_alani,
          rb.faaliyet_durumu,
          rb.vergi_dairesi_adi,
          rb.mersis_no,
          rb.e_fatura_kullanimi,
          rb.e_arsiv_kullanimi,
          rb.e_irsaliye_kullanimi,
          rb.e_defter_kullanimi,
          rb.fax_numarasi,
          rb.banka_iban,
          rb.banka_adi,
          h.ceo_resmi_url,
          h.baslik,
          h.ceo_adi,
          h.ceo_mesaji
        FROM firmalar f
        LEFT JOIN resmi_bilgiler rb ON f.id = rb.firma_id
        LEFT JOIN hakkimizda h ON f.id = h.firma_id
        WHERE f.id = ?`,
        [firmaId]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async verifyVKN(vkn) {
    try {
      // BURDA APİDEN ÇEKİLECEK DOĞRU OLUP OLMADI

      return vkn.length === 10 && /^[0-9]+$/.test(vkn);
    } catch (error) {
      throw error;
    }
  }

  static async findByVKN(vergiNo) {
    try {
      const [firma] = await pool.query(
        "SELECT * FROM firmalar WHERE vergi_kimlik_no = ?",
        [vergiNo]
      );
      return firma[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByVKN(vkn) {
    try {
      const [firma] = await pool.query(
        "SELECT * FROM firmalar WHERE vergi_kimlik_no = ?",
        [vkn]
      );

      if (firma.length === 0) {
        return {
          status: false,
          message: "Firma bulunamadı",
        };
      }

      return {
        status: true,
        data: firma[0],
        message: "Firma bilgileri başarıyla alındı",
      };
    } catch (error) {
      return {
        status: false,
        message: "Firma bilgileri alınamadı",
      };
    }
  }

  static async search({ sektor, il, ilce, keyword }) {
    let sql = "SELECT * FROM firmalar WHERE 1=1";
    const params = [];

    if (sektor && sektor.length > 0) {
      sql += ` AND (${sektor
        .map(() => "LOWER(sektor) = LOWER(?)")
        .join(" OR ")})`;
      params.push(...sektor);
    }
    if (il && il.length > 0) {
      sql += ` AND (${il
        .map(() => "LOWER(kurulus_sehri) = LOWER(?)")
        .join(" OR ")})`;
      params.push(...il);
    }
    if (ilce && ilce.length > 0) {
      sql += ` AND (${ilce
        .map(() => "LOWER(merkez_adresi) LIKE LOWER(?)")
        .join(" OR ")})`;
      params.push(...ilce.map((i) => `%${i}%`));
    }
    if (keyword) {
      sql +=
        " AND (LOWER(firma_unvani) LIKE LOWER(?) OR LOWER(marka_adi) LIKE LOWER(?) OR LOWER(vergi_kimlik_no) LIKE LOWER(?))";
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    const [rows] = await pool.query(sql, params);
    return rows;
  }
}

module.exports = Firma;
