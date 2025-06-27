const db = require("../config/db");

const BildirimTercihleri = {
  getByUserId: async (kullanici_id) => {
    const [rows] = await db.query(
      "SELECT * FROM BildirimTercihleri WHERE kullanici_id = ?",
      [kullanici_id]
    );
    return rows[0];
  },

  createOrUpdate: async (kullanici_id, tercihler) => {
    const [result] = await db.query(
      `INSERT INTO BildirimTercihleri
        (kullanici_id, eposta_izin, sms_izin, arama_izin, sistem_bildirim)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          eposta_izin = VALUES(eposta_izin),
          sms_izin = VALUES(sms_izin),
          arama_izin = VALUES(arama_izin),
          sistem_bildirim = VALUES(sistem_bildirim),
          guncellenme_tarihi = CURRENT_TIMESTAMP
      `,
      [
        kullanici_id,
        !!tercihler.eposta_izin,
        !!tercihler.sms_izin,
        !!tercihler.arama_izin,
        !!tercihler.sistem_bildirim,
      ]
    );
    return result;
  },
};

module.exports = BildirimTercihleri;
