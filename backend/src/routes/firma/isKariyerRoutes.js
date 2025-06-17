const express = require("express");
const router = express.Router();
const IsKariyerController = require("../../controllers/firma/IsKariyerController");
const authMiddleware = require("../../middleware/authMiddleware");

// Ayarlar
router.get("/ayarlar/:firmaId", IsKariyerController.getAyarlar);
router.post("/ayarlar", authMiddleware, IsKariyerController.createAyarlar);
router.put("/ayarlar", authMiddleware, IsKariyerController.updateAyarlar);

// Sorular
router.get("/sorular/:firmaId", IsKariyerController.getSorular);
router.post("/sorular", authMiddleware, IsKariyerController.createSoru);
router.put("/sorular/:id", authMiddleware, IsKariyerController.updateSoru);
router.delete("/sorular/:id", authMiddleware, IsKariyerController.deleteSoru);

// Başvuru (public)
router.post("/basvuru/:firmaId", IsKariyerController.createBasvuru);

module.exports = router;
