const Favoriler = require("../models/Favoriler");
const Bildirim = require("../models/firma/Bildirim");
const Firma = require("../models/Firma");

const FavorilerController = {
  getFavoriler: async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id;
      const favoriler = await Favoriler.getFavorilerByUserId(userId);
      res.json({ success: true, data: favoriler });
    } catch (err) {
      console.log(err);

      res.status(500).json({ success: false, message: "Favoriler alınamadı." });
    }
  },

  addFavori: async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id;
      const ekleyenFirmaId = req.user.firma_id;
      const { firmaId } = req.body;

      // Favori durumunu kontrol et
      const isFavori = await Favoriler.checkFavori(userId, firmaId);
      if (isFavori) {
        return res.status(400).json({
          success: false,
          message: "Bu firma zaten favorilerinizde.",
        });
      }

      await Favoriler.addFavori(userId, firmaId);

      const firma = await Firma.getById(ekleyenFirmaId);
      const firmaAdi = firma.firma_unvani;

      await Bildirim.create({
        firma_id: firmaId,
        tip: "Favori",
        konu: "Favori Eklendi",
        icerik: `${firmaAdi} firması sizi favorilere ekledi.`,
        tip_renk: "#80cc28",
        tip_icon: "/images/bildirim/baglanti.svg",
      });
      res.json({ success: true, message: "Favori eklendi." });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Favori eklenemedi.", error: err });
    }
  },

  removeFavori: async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id;
      const { firmaId } = req.body;
      await Favoriler.removeFavori(userId, firmaId);
      res.json({ success: true, message: "Favori silindi." });
    } catch (err) {
      res.status(500).json({ success: false, message: "Favori silinemedi." });
    }
  },
};

module.exports = FavorilerController;
