const pool = require("../config/db");
const Firma = require("./Firma");
const YetkiliKisi = require("./YetkiliKisi");

class User {
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        `SELECT 
        u.id as user_id,
        u.email,
        u.password_hash,
        u.kvkk_onayi,
        u.kayit_tarihi,
        u.aktif,
        u.yetkili_kisi_id,
        u.firma_id,
        yk.ad,
        yk.soyad,
        yk.tc_kimlik_no,
        yk.telefon_no,
        yk.telefon_dogrulandi,
        yk.dogrulama_tarihi,
        f.uyelik_turu,
        f.marka_adi,
        f.firma_unvani,
        f.vergi_kimlik_no,
        f.sektor,
        f.hizmet_alani,
        f.profil_resmi_url,
        f.kurulus_tarihi,
        f.kurulus_sehri,
        f.merkez_adresi,
        f.kep_adresi,
        f.web_sitesi,
        f.iletisim_telefonu,
        f.olusturulma_tarihi
      FROM users u 
      LEFT JOIN yetkili_kisiler yk ON u.yetkili_kisi_id = yk.id 
      LEFT JOIN firmalar f ON u.firma_id = f.id 
      WHERE u.email = ?`,
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error("Kullanıcı arama hatası:", error);
      throw error;
    }
  }

  // yeni kullanici
  static async create({ email, password_hash, kvkk_onay }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // ekle
      const [result] = await connection.query(
        "INSERT INTO users (email, password_hash, kvkk_onayi, kayit_tarihi, aktif, firma_id) VALUES (?, ?, ?, ?, ?, ?)",
        [email, password_hash, kvkk_onay, new Date(), 1, null]
      );

      // Eklenen kullanıcıyı tüm ilişkili tablolarla birlikte getir
      const [user] = await connection.query(
        `SELECT u.*, yk.*, f.* 
       FROM users u 
       LEFT JOIN yetkili_kisiler yk ON u.yetkili_kisi_id = yk.id 
       LEFT JOIN firmalar f ON u.firma_id = f.id 
       WHERE u.id = ?`,
        [result.insertId]
      );

      await connection.commit();
      return user[0];
    } catch (error) {
      await connection.rollback();
      console.error("Kullanıcı oluşturma hatası:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // yetkili kisi id ile kullaniciyi getir
  static async findByYetkiliKisiId(yetkiliKisiId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE yetkili_kisi_id = ?",
        [yetkiliKisiId]
      );
      return rows[0];
    } catch (error) {
      console.error("Kullanıcı arama hatası:", error);
      throw error;
    }
  }

  // yetkili kisi id ile kullaniciyi guncelle
  static async update(data, userId) {
    try {
      const [rows] = await pool.query("UPDATE users SET ? WHERE id = ?", [
        data,
        userId,
      ]);
      return rows[0];
    } catch (error) {
      console.error("Kullanıcı güncelleme hatası:", error);
      throw error;
    }
  }

  // kullanıcı durum
  static async me(userId) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);

      const yetkiliKisi = await YetkiliKisi.findByUserId(userId);

      return {
        ...rows[0],
        yetkiliKisi,
      };
    } catch (error) {
      console.error("Kullanıcı durum hatası:", error);
      throw error;
    }
  }

  // Telefon numarasına göre kullanıcı bul
  static async findByPhoneNumber(phoneNumber) {
    try {
      // Gelen telefon numarasını normalize et (sadece rakamları al)
      const normalizedInput = phoneNumber.replace(/\D/g, "");

      const [rows] = await pool.query(
        `SELECT 
          u.id as user_id,
          u.email,
          u.password_hash,
          u.kvkk_onayi,
          u.kayit_tarihi,
          u.aktif,
          u.yetkili_kisi_id,
          u.firma_id,
          yk.telefon_no
        FROM users u 
        LEFT JOIN yetkili_kisiler yk ON u.yetkili_kisi_id = yk.id 
        WHERE REPLACE(REPLACE(REPLACE(REPLACE(yk.telefon_no, '+90', ''), '(', ''), ')', ''), ' ', '') = ?`,
        [normalizedInput]
      );
      return rows[0];
    } catch (error) {
      console.error("Kullanıcı arama hatası:", error);
      throw error;
    }
  }

  // Şifre güncelleme
  static async updatePassword(userId, passwordHash) {
    try {
      const [result] = await pool.query(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [passwordHash, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Şifre güncelleme hatası:", error);
      throw error;
    }
  }

  // Kullanıcı ve ilişkili verileri sil
  static async deleteById(userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Kullanıcıya bağlı yetkili_kisiler kaydını bul
      const [userRows] = await connection.query(
        "SELECT yetkili_kisi_id, firma_id FROM users WHERE id = ?",
        [userId]
      );
      const yetkiliKisiId = userRows[0]?.yetkili_kisi_id;
      const firmaId = userRows[0]?.firma_id;

      // Yetkili kişiyi sil
      if (yetkiliKisiId) {
        await connection.query("DELETE FROM yetkili_kisiler WHERE id = ?", [
          yetkiliKisiId,
        ]);
      }
      // (İsteğe bağlı) Firmayı sil
      // if (firmaId) {
      //   await connection.query("DELETE FROM firmalar WHERE id = ?", [firmaId]);
      // }

      // Kullanıcıyı sil
      await connection.query("DELETE FROM users WHERE id = ?", [userId]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error("Kullanıcı silme hatası:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = User;
