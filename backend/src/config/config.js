require("dotenv").config();

module.exports = {
  paytr: {
    merchant_id: "570108",
    merchant_key: "J8K5XGCigMf1C4a3",
    merchant_salt: "RGh9PFrFjXpoAMME",
    debug_mode: 1,
    test_mode: 1,
  },

  frontend_url: process.env.FRONTEND_URL || "http://178.157.14.15",
  backend_url: process.env.BACKEND_URL || "http://178.157.14.15",
};
