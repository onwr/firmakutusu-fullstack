const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "firma_kutusu_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10, // İhtiyaca göre ayarlayın
  queueLimit: 0,
});

// Bağlantıyı test et (opsiyonel)
pool
  .getConnection()
  .then((connection) => {
    console.log("MySQL veritabanına başarıyla bağlanıldı.");
    connection.release(); // Havuza geri bırak
  })
  .catch((err) => {
    console.error("MySQL veritabanı bağlantı hatası:", err.message);
    // Hata yönetimi - belki uygulamayı durdurmak istersiniz?
    // process.exit(1);
  });

module.exports = pool;
