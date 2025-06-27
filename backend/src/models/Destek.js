const dbPool = require("../config/db");

class Destek {
  static async createPublicTicket(
    ticketNumber,
    basvuruTuru,
    adSoyad,
    email,
    telefon,
    mesaj
  ) {
    const [result] = await dbPool.query(
      "INSERT INTO destek_talepleri (ticket_number, user_id, subject, contact_name, contact_email, contact_phone, contact_message) VALUES (?, NULL, ?, ?, ?, ?, ?)",
      [ticketNumber, basvuruTuru, adSoyad, email, telefon, mesaj]
    );
    return result;
  }

  static async createTicket(userId, subject) {
    const ticketNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const [result] = await dbPool.query(
      "INSERT INTO destek_talepleri (ticket_number, user_id, subject) VALUES (?, ?, ?)",
      [ticketNumber, userId, subject]
    );
    return { id: result.insertId, ticketNumber };
  }

  static async addMessage(ticketId, content, isAdmin = false, imageUrl = null) {
    const [result] = await dbPool.query(
      "INSERT INTO destek_mesajlari (destek_talebi_id, content, is_admin, image_url) VALUES (?, ?, ?, ?)",
      [ticketId, content, isAdmin, imageUrl]
    );
    return result.insertId;
  }

  static async getTicketsByUser(userId) {
    const [tickets] = await dbPool.query(
      `SELECT dt.*, 
                (SELECT COUNT(*) FROM destek_mesajlari dm WHERE dm.destek_talebi_id = dt.id) as message_count
             FROM destek_talepleri dt
             WHERE dt.user_id = ? OR dt.user_id IS NULL
             ORDER BY dt.created_at DESC`,
      [userId]
    );
    return tickets;
  }

  static async getAllTickets() {
    const [tickets] = await dbPool.query(
      `SELECT dt.*, 
                (SELECT COUNT(*) FROM destek_mesajlari dm WHERE dm.destek_talebi_id = dt.id) as message_count
             FROM destek_talepleri dt
             ORDER BY dt.created_at DESC`
    );
    return tickets;
  }

  static async getTicketDetails(ticketId) {
    const [ticket] = await dbPool.query(
      "SELECT * FROM destek_talepleri WHERE id = ?",
      [ticketId]
    );

    if (!ticket.length) return null;

    const [messages] = await dbPool.query(
      "SELECT * FROM destek_mesajlari WHERE destek_talebi_id = ? ORDER BY created_at ASC",
      [ticketId]
    );

    return {
      ...ticket[0],
      messages,
      contactInfo: ticket[0].contact_name
        ? {
            name: ticket[0].contact_name,
            email: ticket[0].contact_email,
            phone: ticket[0].contact_phone,
            message: ticket[0].contact_message,
          }
        : null,
    };
  }

  static async updateTicketStatus(ticketId, status) {
    await dbPool.query("UPDATE destek_talepleri SET status = ? WHERE id = ?", [
      status,
      ticketId,
    ]);
  }
}

module.exports = Destek;
