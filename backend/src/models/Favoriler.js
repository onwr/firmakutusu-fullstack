const db = require("../config/db");

const Favoriler = {
  // Kullanıcının favori firmalarını getir
  getFavorilerByUserId: async (userId) => {
    const [rows] = await db.query(
      `SELECT f.id as favori_id, f.firma_id, firma.firma_unvani, firma.profil_resmi_url, firma.sektor, firma.merkez_adresi, firma.iletisim_telefonu
       FROM favoriler f
       JOIN firmalar firma ON f.firma_id = firma.id
       WHERE f.user_id = ?`,
      [userId]
    );
    return rows;
  },

  // Favori ekle
  addFavori: async (userId, firmaId) => {
    await db.query("INSERT INTO favoriler (user_id, firma_id) VALUES (?, ?)", [
      userId,
      firmaId,
    ]);
  },

  // Favori sil
  removeFavori: async (userId, firmaId) => {
    await db.query("DELETE FROM favoriler WHERE user_id = ? AND firma_id = ?", [
      userId,
      firmaId,
    ]);
  },

  // Favori durumunu kontrol et
  checkFavori: async (userId, firmaId) => {
    const [rows] = await db.query(
      "SELECT * FROM favoriler WHERE user_id = ? AND firma_id = ?",
      [userId, firmaId]
    );
    return rows.length > 0;
  },
};

module.exports = Favoriler;
