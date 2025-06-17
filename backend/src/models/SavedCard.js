const db = require("../config/db");
const crypto = require("crypto");

class SavedCard {
  static getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error("Encryption key is not configured");
    }
    // Use PBKDF2 to derive a 32-byte key from the provided key
    return crypto.pbkdf2Sync(key, "salt", 100000, 32, "sha256");
  }

  static async create(cardData) {
    try {
      const encryptedCardNumber = this.encrypt(cardData.card_number);
      const encryptedCardHolder = this.encrypt(cardData.card_holder_name);

      const [result] = await db.query(
        "INSERT INTO saved_cards (user_id, card_number, card_holder_name, expiry_month, expiry_year, card_type, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          cardData.user_id,
          encryptedCardNumber,
          encryptedCardHolder,
          cardData.expiry_month,
          cardData.expiry_year,
          cardData.card_type,
          cardData.is_default || false,
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error("Error in SavedCard.create:", error);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [cards] = await db.query(
        "SELECT * FROM saved_cards WHERE user_id = ?",
        [userId]
      );

      return cards.map((card) => ({
        ...card,
        card_number: this.decrypt(card.card_number),
        card_holder_name: this.decrypt(card.card_holder_name),
      }));
    } catch (error) {
      console.error("Error in SavedCard.findByUserId:", error);
      throw error;
    }
  }

  static async update(id, cardData) {
    try {
      const encryptedCardNumber = this.encrypt(cardData.card_number);
      const encryptedCardHolder = this.encrypt(cardData.card_holder_name);

      const [result] = await db.query(
        "UPDATE saved_cards SET card_number = ?, card_holder_name = ?, expiry_month = ?, expiry_year = ?, card_type = ?, is_default = ? WHERE id = ? AND user_id = ?",
        [
          encryptedCardNumber,
          encryptedCardHolder,
          cardData.expiry_month,
          cardData.expiry_year,
          cardData.card_type,
          cardData.is_default || false,
          id,
          cardData.user_id,
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in SavedCard.update:", error);
      throw error;
    }
  }

  static async delete(id, userId) {
    try {
      const [result] = await db.query(
        "DELETE FROM saved_cards WHERE id = ? AND user_id = ?",
        [id, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in SavedCard.delete:", error);
      throw error;
    }
  }

  static async setDefault(id, userId) {
    try {
      await db.query(
        "UPDATE saved_cards SET is_default = false WHERE user_id = ?",
        [userId]
      );

      const [result] = await db.query(
        "UPDATE saved_cards SET is_default = true WHERE id = ? AND user_id = ?",
        [id, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in SavedCard.setDefault:", error);
      throw error;
    }
  }

  static encrypt(text) {
    try {
      if (!text) {
        throw new Error("Text to encrypt is required");
      }

      const key = this.getEncryptionKey();
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return iv.toString("hex") + ":" + encrypted.toString("hex");
    } catch (error) {
      console.error("Error in SavedCard.encrypt:", error);
      throw error;
    }
  }

  static decrypt(text) {
    try {
      if (!text) {
        throw new Error("Text to decrypt is required");
      }

      const key = this.getEncryptionKey();
      const textParts = text.split(":");
      const iv = Buffer.from(textParts.shift(), "hex");
      const encryptedText = Buffer.from(textParts.join(":"), "hex");
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      console.error("Error in SavedCard.decrypt:", error);
      throw error;
    }
  }
}

module.exports = SavedCard;
