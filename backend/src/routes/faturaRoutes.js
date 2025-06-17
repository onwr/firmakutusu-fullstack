const express = require("express");
const router = express.Router();
const FaturaController = require("../controllers/faturaController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, FaturaController.createFaturaForOdeme);
router.get("/", authMiddleware, FaturaController.getFaturalarByFirma);
router.get("/:id", authMiddleware, FaturaController.getFaturaById);
router.patch("/:id/resim", authMiddleware, FaturaController.updateFaturaResim);

module.exports = router;
