const express = require("express");
const router = express.Router();
const PaketController = require("../controllers/paketController");
const authMiddleware = require("../middleware/authMiddleware");

// Tüm paketleri getir
router.get("/", PaketController.getAllPakets);

// Paket detayını getir
router.get("/:id", PaketController.getPaketById);

// Firma paket geçmişini getir (Sadece giriş yapmış kullanıcılar)
router.get(
  "/firma/gecmis",
  authMiddleware,
  PaketController.getFirmaPaketGecmisi
);

// Paket satın alma işlemi başlat (Sadece giriş yapmış kullanıcılar)
router.post("/satin-al", authMiddleware, PaketController.satinAl);

// PayTR callback endpoint
router.post("/paytr-callback", PaketController.paytrCallback);

// Otomatik yenileme ayarını güncelle
router.put(
  "/otomatik-yenileme",
  authMiddleware,
  PaketController.updateOtomatikYenileme
);

// Kayıtlı kart bilgisini güncelle
router.put("/kayitli-kart", authMiddleware, PaketController.updateKayitliKart);

module.exports = router;
