const FaturaModel = require("../models/Fatura");

// Fatura No üretici (örnek, random 10 haneli)
function generateFaturaNo() {
  return "FT" + Math.floor(1000000000 + Math.random() * 9000000000);
}

const FaturaController = {
  // Fatura oluştur (ödeme başarılı olduğunda çağrılır)
  async createFaturaForOdeme(req, res) {
    try {
      const { firma_paket_gecmisi_id, odeme_tutari, urun_hizmet } = req.body;
      const fatura_no = generateFaturaNo();
      const odeme_tarihi = new Date();

      const id = await FaturaModel.createFatura({
        firma_paket_gecmisi_id,
        fatura_no,
        odeme_tutari,
        odeme_tarihi,
        urun_hizmet,
      });

      res.json({ success: true, id, fatura_no });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Firma id ile tüm faturalar
  async getFaturalarByFirma(req, res) {
    try {
      const { firma_id } = req.user;
      const faturalar = await FaturaModel.getFaturalarByFirmaId(firma_id);
      res.json({ success: true, data: faturalar });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Tekil fatura
  async getFaturaById(req, res) {
    try {
      const { id } = req.params;
      const fatura = await FaturaModel.getFaturaById(id);
      res.json({ success: true, data: fatura });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Fatura resmini güncelle (GİB'den gelen)
  async updateFaturaResim(req, res) {
    try {
      const { id } = req.params;
      const { fatura_resim } = req.body;
      const ok = await FaturaModel.updateFaturaResim(id, fatura_resim);

      res.json({ success: ok });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = FaturaController;
