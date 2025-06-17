const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

const bildirimController = require("../../controllers/firma/BildirimController");

router.get("/", authMiddleware, bildirimController.getBildirimler);
router.post("/", authMiddleware, bildirimController.createBildirim);
router.put("/:id/read", authMiddleware, bildirimController.markAsRead);
router.delete("/:id", authMiddleware, bildirimController.deleteBildirim);
router.post(
  "/system",
  authMiddleware,
  bildirimController.createSystemNotification
);

module.exports = router;
