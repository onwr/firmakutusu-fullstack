const db = require("../config/db");
const smsService = require("../middleware/smsService");
const YetkiliKisi = require("./YetkiliKisi");
const FaturaModel = {
  async createFatura({
    firma_paket_gecmisi_id,
    firma_id,
    fatura_no,
    odeme_tutari,
    odeme_tarihi,
    urun_hizmet,
    fatura_resim = null,
  }) {
    const [result] = await db.execute(
      `INSERT INTO faturalar (firma_paket_gecmisi_id, fatura_no, odeme_tutari, odeme_tarihi, urun_hizmet, fatura_resim)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        firma_paket_gecmisi_id,
        fatura_no,
        odeme_tutari,
        odeme_tarihi,
        urun_hizmet,
        fatura_resim,
      ]
    );
    const yetkiliKisi = await YetkiliKisi.findByFirmaId(firma_id);
    await smsService.sendSMS(
      yetkiliKisi.telefon_no,
      `Sayın Yetkili, ${urun_hizmet} Paket satın alımınız ile ilgili faturanız oluşturuldu. Fatura No: ${fatura_no} - ${odeme_tutari} TL + KDV \n\nSaygılarımızla,\nFirma Kutusu`
    );
    return result.insertId;
  },

  async getFaturalarByFirmaId(firma_id) {
    const [rows] = await db.execute(
      `SELECT f.*, g.firma_id
       FROM faturalar f
       JOIN firma_paket_gecmisi g ON f.firma_paket_gecmisi_id = g.id
       WHERE g.firma_id = ? ORDER BY f.odeme_tarihi DESC`,
      [firma_id]
    );
    return rows;
  },

  async getFaturaById(id) {
    const [rows] = await db.execute(`SELECT * FROM faturalar WHERE id = ?`, [
      id,
    ]);
    return rows[0];
  },

  async updateFaturaResim(id, fatura_resim) {
    const [result] = await db.execute(
      `UPDATE faturalar SET fatura_resim = ? WHERE id = ?`,
      [fatura_resim, id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = FaturaModel;
