const SavedCard = require("../models/SavedCard");

exports.getSavedCards = async (req, res) => {
  try {
    const cards = await SavedCard.findByUserId(req.user.userId);
    res.json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error("Error in getSavedCards:", error);
    res.status(500).json({
      success: false,
      message: "Kartlar getirilirken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.addCard = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı kimliği bulunamadı",
      });
    }

    const cardData = {
      ...req.body,
      user_id: req.user.userId,
    };

    const cardId = await SavedCard.create(cardData);
    res.json({
      success: true,
      message: "Kart başarıyla kaydedildi",
      data: { id: cardId },
    });
  } catch (error) {
    console.error("Error in addCard:", error);
    res.status(500).json({
      success: false,
      message: "Kart kaydedilirken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.updateCard = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı kimliği bulunamadı",
      });
    }

    const cardData = {
      ...req.body,
      user_id: req.user.userId,
    };

    const success = await SavedCard.update(req.params.id, cardData);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Kart bulunamadı",
      });
    }

    res.json({
      success: true,
      message: "Kart başarıyla güncellendi",
    });
  } catch (error) {
    console.error("Error in updateCard:", error);
    res.status(500).json({
      success: false,
      message: "Kart güncellenirken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı kimliği bulunamadı",
      });
    }

    const success = await SavedCard.delete(req.params.id, req.user.userId);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Kart bulunamadı",
      });
    }

    res.json({
      success: true,
      message: "Kart başarıyla silindi",
    });
  } catch (error) {
    console.error("Error in deleteCard:", error);
    res.status(500).json({
      success: false,
      message: "Kart silinirken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.setDefaultCard = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı kimliği bulunamadı",
      });
    }

    const success = await SavedCard.setDefault(req.params.id, req.user.userId);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Kart bulunamadı",
      });
    }

    res.json({
      success: true,
      message: "Varsayılan kart başarıyla güncellendi",
    });
  } catch (error) {
    console.error("Error in setDefaultCard:", error);
    res.status(500).json({
      success: false,
      message: "Varsayılan kart güncellenirken bir hata oluştu",
      error: error.message,
    });
  }
};
