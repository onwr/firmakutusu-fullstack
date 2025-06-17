require("dotenv").config();

module.exports = {
  paytr: {
    merchant_id: process.env.PAYTR_MERCHANT_ID,
    merchant_key: process.env.PAYTR_MERCHANT_KEY,
    merchant_salt: process.env.PAYTR_MERCHANT_SALT,
    debug_mode: process.env.NODE_ENV !== "production",
    test_mode: process.env.NODE_ENV !== "production",
  },

  frontend_url: process.env.FRONTEND_URL || "http://localhost:5173",
};
