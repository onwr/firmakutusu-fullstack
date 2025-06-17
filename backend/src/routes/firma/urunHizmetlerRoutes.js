const express = require("express");
const router = express.Router();
const UrunHizmetlerController = require("../../controllers/firma/UrunHizmetlerController");
const authMiddleware = require("../../middleware/authMiddleware");

// Ayarlar
router.get("/:firmaId/ayarlar", UrunHizmetlerController.getAyarlar);
router.post("/ayarlar", authMiddleware, UrunHizmetlerController.createAyarlar);
router.put("/ayarlar", authMiddleware, UrunHizmetlerController.updateAyarlar);

// Ürünler
router.get("/:firmaId/urunler", UrunHizmetlerController.getUrunler);
router.post("/urunler", authMiddleware, UrunHizmetlerController.createUrun);
router.put("/urunler/:id", authMiddleware, UrunHizmetlerController.updateUrun);
router.delete(
  "/urunler/:id",
  authMiddleware,
  UrunHizmetlerController.deleteUrun
);

module.exports = router;
