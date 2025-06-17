require("dotenv").config();
const path = require("path");
const express = require("express");
const dbPool = require("./config/db");
const redisClient = require("./config/redis");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const dogrulamaRoutes = require("./routes/dogrulamaRoutes");
const firmaRoutes = require("./routes/firmaRoutes");
const hakkimizdaRoutes = require("./routes/firma/hakkimizdaRoutes");
const faaliyetRoutes = require("./routes/firma/faaliyetRoutes");
const kaliteRoutes = require("./routes/firma/kaliteBelgeleri");
const kampanyaRoutes = require("./routes/firma/kampanyalar");
const resimGalerisiRoutes = require("./routes/firma/resimGalerisi");
const videoGalerisiRoutes = require("./routes/firma/videoGalerisi");
const resmiBilgilerRoutes = require("./routes/firma/resmiBilgiler");
const subelerRoutes = require("./routes/firma/subeler");
const subelerAyarlarRoutes = require("./routes/firma/subelerAyarlar");
const calismaSaatleriRoutes = require("./routes/firma/calismaSaatleri");
const isKariyerRoutes = require("./routes/firma/isKariyerRoutes");
const urunHizmetlerRoutes = require("./routes/firma/urunHizmetlerRoutes");
const referanslarRoutes = require("./routes/firma/referanslar");
const paketRoutes = require("./routes/paketRoutes");
const destekRoutes = require("./routes/destekRoutes");
const bildirimRoutes = require("./routes/firma/bildirimRoutes");
const favoriRoutes = require("./routes/favorilerRoutes");
const faturaRoutes = require("./routes/faturaRoutes");
const savedCardRoutes = require("./routes/savedCardRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/dogrulama", dogrulamaRoutes);
app.use("/api/firma", firmaRoutes);
app.use("/api/firma/hakkimizda", hakkimizdaRoutes);
app.use("/api/firma/faaliyet", faaliyetRoutes);
app.use("/api/firma/kalite-belgeleri", kaliteRoutes);
app.use("/api/firma/kampanyalar", kampanyaRoutes);
app.use("/api/firma/resim-galerisi", resimGalerisiRoutes);
app.use("/api/firma/video-galerisi", videoGalerisiRoutes);
app.use("/api/firma/resmi-bilgiler", resmiBilgilerRoutes);
app.use("/api/firma/subeler", subelerRoutes);
app.use("/api/firma/subeler-ayarlar", subelerAyarlarRoutes);
app.use("/api/firma/calisma-saatleri", calismaSaatleriRoutes);
app.use("/api/firma/is-kariyer", isKariyerRoutes);
app.use("/api/firma/urun-hizmetler", urunHizmetlerRoutes);
app.use("/api/firma/referanslar", referanslarRoutes);
app.use("/api/paket", paketRoutes);
app.use("/api/destek", destekRoutes);
app.use("/api/bildirim", bildirimRoutes);
app.use("/api/favoriler", favoriRoutes);
app.use("/api/fatura", faturaRoutes);
app.use("/api/saved-cards", savedCardRoutes);

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});

process.on("SIGINT", async () => {
  console.log("Sunucu kapatılıyor...");
  try {
    await dbPool.end();
    console.log("MySQL bağlantı havuzu kapatıldı.");
    await redisClient.quit();
    console.log("Redis istemcisi kapatıldı.");
    process.exit(0);
  } catch (err) {
    console.error("Kapatma sırasında hata:", err);
    process.exit(1);
  }
});
