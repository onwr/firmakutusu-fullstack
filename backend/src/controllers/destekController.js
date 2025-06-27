const Destek = require("../models/Destek");

const destekController = {
  // Public destek formu gönderimi (kimlik doğrulama gerektirmez)
  submitPublicForm: async (req, res) => {
    try {
      const { basvuruTuru, adSoyad, email, telefon, mesaj } = req.body;

      // Validasyon
      if (!basvuruTuru || !adSoyad || !email || !telefon || !mesaj) {
        return res.status(400).json({
          success: false,
          message: "Tüm alanlar zorunludur",
        });
      }

      // Email formatı kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Geçerli bir email adresi giriniz",
        });
      }

      // Telefon formatı kontrolü (sadece rakamlar)
      const phoneRegex = /^\d{10}$/;
      const cleanPhone = telefon.replace(/\D/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        return res.status(400).json({
          success: false,
          message: "Geçerli bir telefon numarası giriniz (10 haneli)",
        });
      }

      // Destek talebi oluştur (user_id null olacak çünkü giriş yapmamış kullanıcı)
      const ticketNumber = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const result = await Destek.createPublicTicket(
        ticketNumber,
        basvuruTuru,
        adSoyad,
        email,
        cleanPhone,
        mesaj
      );

      res.status(201).json({
        success: true,
        message: "Destek talebiniz başarıyla gönderildi",
        data: {
          ticketNumber,
          id: result.insertId,
        },
      });
    } catch (error) {
      console.error("Public destek formu hatası:", error);
      res.status(500).json({
        success: false,
        message: "Destek talebi gönderilirken bir hata oluştu",
        error: error.message,
      });
    }
  },

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
      const { content, image_url } = req.body;
      const is_admin = req.user.is_admin;

      const messageId = await Destek.addMessage(
        ticketId,
        content,
        is_admin,
        image_url
      );

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

  // Destek talebine resim ekle
  addImageMessage: async (req, res) => {
    try {
      const { ticketId } = req.params;
      if (!req.files || !req.files.image) {
        return res
          .status(400)
          .json({ success: false, message: "Resim dosyası gerekli" });
      }
      const imageFile = req.files.image;

      // CDN'e yükle
      const axios = require("axios");
      const FormData = require("form-data");
      const formData = new FormData();
      formData.append("file", imageFile.data, {
        filename: imageFile.name,
        contentType: imageFile.mimetype,
      });

      const cdnRes = await axios.post(
        "https://cdn.api.heda.tr/index.php",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      if (!cdnRes.data.success) {
        return res
          .status(500)
          .json({ success: false, message: "Resim CDN yüklenemedi" });
      }
      const imageUrl = cdnRes.data.url;

      // Mesaj olarak kaydet
      const is_admin = req.user.is_admin;
      const Destek = require("../models/Destek");
      const messageId = await Destek.addMessage(
        ticketId,
        "",
        is_admin,
        imageUrl
      );

      res.status(201).json({
        success: true,
        data: { id: messageId, image_url: imageUrl },
      });
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Resim eklenirken bir hata oluştu",
        error: error.message,
      });
    }
  },
};

module.exports = destekController;
