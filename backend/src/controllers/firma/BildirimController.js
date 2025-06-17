const Bildirim = require("../../models/firma/Bildirim");

exports.getBildirimler = async (req, res) => {
  try {
    const { firma_id } = req.user;

    const bildirimler = await Bildirim.getAll(firma_id);

    res.status(200).json({
      success: true,
      data: bildirimler,
    });
  } catch (error) {
    console.error("Bildirimler alınırken hata:", error);
    res.status(500).json({
      success: false,
      message: "Bildirimler alınırken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.createBildirim = async (req, res) => {
  try {
    const { firma_id } = req.user;
    console.log("Creating notification for firma_id:", firma_id);

    const bildirimData = {
      firma_id: firma_id,
      ...req.body,
    };

    const result = await Bildirim.create(bildirimData);
    console.log("Created notification result:", result);

    res.status(201).json({
      success: true,
      message: "Bildirim başarıyla oluşturuldu",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Bildirim oluşturulurken hata:", error);
    res.status(500).json({
      success: false,
      message: "Bildirim oluşturulurken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { firma_id } = req.user;
    console.log("Marking notification as read:", { id, firma_id });

    const result = await Bildirim.markAsRead(id, firma_id);
    console.log("Mark as read result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Bildirim bulunamadı veya bu işlem için yetkiniz yok",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bildirim okundu olarak işaretlendi",
    });
  } catch (error) {
    console.error("Bildirim güncellenirken hata:", error);
    res.status(500).json({
      success: false,
      message: "Bildirim güncellenirken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.deleteBildirim = async (req, res) => {
  try {
    const { id } = req.params;
    const { firma_id } = req.user;
    console.log("Deleting notification:", { id, firma_id });

    const result = await Bildirim.delete(id, firma_id);
    console.log("Delete result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Bildirim bulunamadı veya bu işlem için yetkiniz yok",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bildirim başarıyla silindi",
    });
  } catch (error) {
    console.error("Bildirim silinirken hata:", error);
    res.status(500).json({
      success: false,
      message: "Bildirim silinirken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.createSystemNotification = async (req, res) => {
  try {
    console.log(req.user);

    // if (!req.user.is_admin) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Bu işlem için yetkiniz bulunmamaktadır",
    //   });
    // }

    const bildirimData = {
      tip: req.body.tip,
      konu: req.body.konu,
      icerik: req.body.icerik,
      tip_renk: req.body.tip_renk || "#FF0000",
      tip_icon: req.body.tip_icon || "/images/bildirim/teknik.svg",
    };

    console.log("Creating system notification:", bildirimData);
    const result = await Bildirim.createSystemNotification(bildirimData);
    console.log("System notification created:", result);

    res.status(201).json({
      success: true,
      message: "Sistem bildirimi başarıyla oluşturuldu",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Sistem bildirimi oluşturulurken hata:", error);
    res.status(500).json({
      success: false,
      message: "Sistem bildirimi oluşturulurken bir hata oluştu",
      error: error.message,
    });
  }
};
