const UrunHizmetlerAyarlar = require("../../models/firma/UrunHizmetlerAyarlar");
const Urunler = require("../../models/firma/Urunler");

class UrunHizmetlerController {
  // Ayarlar
  static async getAyarlar(req, res) {
    try {
      const { firmaId } = req.params;
      const ayarlar = await UrunHizmetlerAyarlar.getAyarlar(firmaId);
      res.json(ayarlar);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const ayarlar = await UrunHizmetlerAyarlar.createAyarlar(
        firma_id,
        req.body
      );
      res.status(201).json({
        success: true,
        message: "Ürün ayarları başarıyla oluşturuldu",
        data: ayarlar,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateAyarlar(req, res) {
    try {
      const { firma_id } = req.user;
      const updated = await UrunHizmetlerAyarlar.updateAyarlar(
        firma_id,
        req.body
      );
      res.json({ success: updated });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Ürünler
  static async getUrunler(req, res) {
    try {
      const { firmaId } = req.params;
      const urunler = await Urunler.getUrunler(firmaId);
      res.json(urunler);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createUrun(req, res) {
    try {
      const { firma_id } = req.user;
      const urun = await Urunler.createUrun(firma_id, req.body);
      res.status(201).json({
        success: true,
        message: "Ürün başarıyla oluşturuldu",
        data: urun,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUrun(req, res) {
    try {
      const { firma_id } = req.user;
      const urunId = req.params.id;
      const updated = await Urunler.updateUrun(firma_id, urunId, req.body);
      res.json({ success: updated });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUrun(req, res) {
    try {
      const { firma_id } = req.user;
      const urunId = req.params.id;
      const deleted = await Urunler.deleteUrun(firma_id, urunId);
      res.json({ success: deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UrunHizmetlerController;
