const express = require("express");
const router = express.Router();
const hakkimizdaController = require("../../controllers/firma/hakkimizdaController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/:firmaId", hakkimizdaController.getHakkimizda);
router.post("/", authMiddleware, hakkimizdaController.createHakkimizda);
router.put("/", authMiddleware, hakkimizdaController.updateHakkimizda);

module.exports = router;
