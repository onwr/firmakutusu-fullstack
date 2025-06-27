const express = require("express");
const router = express.Router();
const controller = require("../controllers/bildirimTercihleriController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, controller.getTercihler);
router.post("/", auth, controller.updateTercihler);

module.exports = router;
