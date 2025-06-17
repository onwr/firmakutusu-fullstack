const pool = require("../config/db");

class YetkiliKisi {
  static async create({
    user_id,
    ad,
    soyad,
    tc_kimlik_no,
    telefon_no,
    bireysel = false,
  }) {
    try {
      const [result] = await pool.query(
        "INSERT INTO yetkili_kisiler (ad, soyad, tc_kimlik_no, telefon_no, telefon_dogrulandi, dogrulama_tarihi, user_id, bireysel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [ad, soyad, tc_kimlik_no, telefon_no, 0, null, user_id, bireysel]
      );
      return result.insertId;
    } catch (error) {
      console.error("Yetkili kisi oluşturma hatasi", error);
      throw error;
    }
  }

  static async updateBireysel(userId, data) {
    try {
      await pool.query("UPDATE yetkili_kisiler SET ? WHERE user_id = ?", [
        data,
        userId,
      ]);
    } catch (error) {
      console.error("Yetkili kisi güncelleme hatasi", error);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM yetkili_kisiler WHERE user_id = ?",
        [userId]
      );
      return rows[0];
    } catch (error) {
      console.error("Yetkili kişi bulma hatası:", error);
      throw error;
    }
  }

  static async updatePhoneVerification(user_id) {
    try {
      await pool.query(
        "UPDATE yetkili_kisiler SET telefon_dogrulandi = 1, dogrulama_tarihi = NOW() WHERE user_id = ?",
        [user_id]
      );
      return true;
    } catch (error) {
      console.error("Telefon doğrulama hatası:", error);
      throw error;
    }
  }

  static async updateFirmaId(user_id, firma_id) {
    try {
      await pool.query(
        "UPDATE yetkili_kisiler SET firma_id = ? WHERE user_id = ?",
        [firma_id, user_id]
      );
      return true;
    } catch (error) {
      console.error("Firma ID güncelleme hatası:", error);
      throw error;
    }
  }

  static async validateTCKN(tc_kimlik_no) {
    if (tc_kimlik_no.length !== 11) return false;
    if (!/^\d+$/.test(tc_kimlik_no)) return false;
    if (tc_kimlik_no[0] === "0") return false;

    let sumOdd =
      parseInt(tc_kimlik_no[0]) +
      parseInt(tc_kimlik_no[2]) +
      parseInt(tc_kimlik_no[4]) +
      parseInt(tc_kimlik_no[6]) +
      parseInt(tc_kimlik_no[8]);
    let sumEven =
      parseInt(tc_kimlik_no[1]) +
      parseInt(tc_kimlik_no[3]) +
      parseInt(tc_kimlik_no[5]) +
      parseInt(tc_kimlik_no[7]);

    let digit10 = (sumOdd * 7 - sumEven) % 10;
    if (digit10 < 0) digit10 += 10;
    if (digit10 !== parseInt(tc_kimlik_no[9])) return false;

    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(tc_kimlik_no[i]);
    }
    let digit11 = sum % 10;
    if (digit11 !== parseInt(tc_kimlik_no[10])) return false;

    return true;
  }

  static async findByFirmaId(firmaId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM yetkili_kisiler WHERE firma_id = ?",
        [firmaId]
      );
      return rows[0];
    } catch (error) {
      console.error("Firma ID'ye göre yetkili kişi bulma hatası:", error);
      throw error;
    }
  }
}

module.exports = YetkiliKisi;
