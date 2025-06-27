const BildirimTercihleri = require("../models/BildirimTercihleri");

exports.getTercihler = async (req, res) => {
  try {
    const { userId } = req.user;
    const tercihler = await BildirimTercihleri.getByUserId(userId);
    res.json(tercihler || {});
  } catch (err) {
    res.status(500).json({ message: "Bildirim tercihleri alınamadı." });
  }
};

exports.updateTercihler = async (req, res) => {
  try {
    const { userId } = req.user;
    const { eposta_izin, sms_izin, arama_izin, sistem_bildirim } = req.body;
    await BildirimTercihleri.createOrUpdate(userId, {
      eposta_izin,
      sms_izin,
      arama_izin,
      sistem_bildirim,
    });
    res.json({ message: "Bildirim tercihleri güncellendi." });
  } catch (err) {
    res.status(500).json({ message: "Bildirim tercihleri güncellenemedi." });
  }
};
