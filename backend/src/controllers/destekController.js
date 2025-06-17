const Destek = require("../models/Destek");

const destekController = {
  // Yeni destek talebi oluştur
  createTicket: async (req, res) => {
    try {
      const { subject } = req.body;
      const userId = req.user.userId; // JWT'den gelen firma ID'si

      const ticket = await Destek.createTicket(userId, subject);
      res.status(201).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Destek talebi oluşturulurken bir hata oluştu",
        error: error.message,
      });
    }
  },

  // Destek taleplerini listele
  getTickets: async (req, res) => {
    try {
      const userId = req.user.userId;
      const tickets = await Destek.getTicketsByUser(userId);

      res.status(200).json({
        success: true,
        data: tickets,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Destek talepleri alınırken bir hata oluştu",
        error: error.message,
      });
    }
  },

  // Destek talebi detaylarını getir
  getTicketDetails: async (req, res) => {
    try {
      const { ticketId } = req.params;
      const ticket = await Destek.getTicketDetails(ticketId);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: "Destek talebi bulunamadı",
        });
      }

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Destek talebi detayları alınırken bir hata oluştu",
        error: error.message,
      });
    }
  },

  // Destek talebine mesaj ekle
  addMessage: async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { content } = req.body;
      const is_admin = req.user.is_admin;

      const messageId = await Destek.addMessage(ticketId, content, is_admin);

      res.status(201).json({
        success: true,
        data: { id: messageId },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Mesaj eklenirken bir hata oluştu",
        error: error.message,
      });
    }
  },

  // Destek talebi durumunu güncelle
  updateTicketStatus: async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { status } = req.body;

      await Destek.updateTicketStatus(ticketId, status);

      res.status(200).json({
        success: true,
        message: "Destek talebi durumu güncellendi",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Destek talebi durumu güncellenirken bir hata oluştu",
        error: error.message,
      });
    }
  },
};

module.exports = destekController;
