const nodemailer = require("nodemailer");

// SMTP ayarları
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// E-posta gönderme fonksiyonu
const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: `"Firma Kutusu" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Firma Kutusu'na Hoş Geldiniz!",
      html: `
       <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

      body {
        margin: 0;
        padding: 0;
        font-family: "Poppins", Arial, sans-serif;
        background-color: #f5f5f5;
        color: #333333;
        line-height: 1.6;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .header {
        background-color: #1c554027;
        padding: 25px 30px;
        text-align: center;
      }

      .logo {
        width: 180px;
        height: auto;
      }

      .content {
        padding: 30px;
      }

      h2 {
        color: #1c5540;
        margin-top: 0;
        font-weight: 600;
        font-size: 22px;
      }

      p {
        margin-bottom: 20px;
        color: #555555;
      }

      .features {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 25px;
        margin-bottom: 25px;
      }

      .features h3 {
        color: #1c5540;
        margin-top: 0;
        font-size: 18px;
        font-weight: 500;
      }

      ul {
        padding-left: 20px;
        margin-bottom: 0;
      }

      li {
        margin-bottom: 10px;
        color: #555555;
      }

      .button {
        display: inline-block;
        background-color: #1c5540;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 30px;
        border-radius: 6px;
        font-weight: 500;
        margin-top: 10px;
        text-align: center;
      }

      .signature {
        margin-top: 30px;
      }

      .footer {
        background-color: #f9f9f9;
        padding: 20px 30px;
        text-align: center;
        color: #999999;
        font-size: 13px;
        border-top: 1px solid #eeeeee;
      }

      .social {
        margin-top: 15px;
      }

      .social a {
        display: inline-block;
        margin: 0 8px;
      }

      @media only screen and (max-width: 600px) {
        .content {
          padding: 20px;
        }

        .features {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="https://i.ibb.co/XZZhYrD6/Logo-Yatay-1-1.png"
          alt="Firma Kutusu"
          class="logo"
        />
      </div>

      <div class="content">
        <h2>Firma Kutusu'na Hoş Geldiniz!</h2>

        <p>Sayın <strong>${name}</strong>,</p>

        <p>
          Firma Kutusu platformuna kayıt olduğunuz için teşekkür ederiz. Artık
          işletmenizi tanıtmak ve büyütmek için ihtiyacınız olan tüm araçlara
          erişiminiz var.
        </p>

        <div class="features">
          <h3>Platformumuzda şunları yapabilirsiniz:</h3>
          <ul>
            <li><strong>Firma profilinizi</strong> oluşturun ve yönetin</li>
            <li><strong>Ürün ve hizmetlerinizi</strong> tanıtın</li>
            <li><strong>Referanslarınızı</strong> paylaşın</li>
            <li><strong>İş fırsatlarını</strong> değerlendirin</li>
          </ul>
        </div>

        <div class="signature">
          <p>
            Herhangi bir sorunuz olursa, bizimle iletişime geçmekten çekinmeyin.
          </p>
          <p>Saygılarımızla,<br /><strong>Firma Kutusu Ekibi</strong></p>
        </div>
      </div>

      <div class="footer">
        <p>© 2025 Firma Kutusu. Tüm hakları saklıdır.</p>
        <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.</p>
      </div>
    </div>
  </body>
</html>
      `,
    });

    console.log("Hoş geldiniz e-postası gönderildi:", info.messageId);
    return true;
  } catch (error) {
    console.error("E-posta gönderme hatası:", error);
    return false;
  }
};

// Başvuru e-postası gönderme fonksiyonu
const sendBasvuruEmail = async (email, ad_soyad, telefon, cevaplar, cv) => {
  try {
    // Cevapları filtrele ve düzenle
    const filteredCevaplar = cevaplar.filter(
      (cevap) =>
        cevap && cevap.soru && cevap.cevap && cevap.cevap !== "undefined"
    );

    const info = await transporter.sendMail({
      from: `"Firma Kutusu" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Yeni İş Başvurusu",
      attachments: [
        {
          filename: "cv.pdf",
          content: cv,
          encoding: "base64",
        },
      ],
      html: `
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

      body {
        margin: 0;
        padding: 0;
        font-family: "Poppins", Arial, sans-serif;
        background-color: #f5f5f5;
        color: #333333;
        line-height: 1.6;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .header {
        background-color: #1c554027;
        padding: 25px 30px;
        text-align: center;
      }

      .logo {
        width: 180px;
        height: auto;
      }

      .content {
        padding: 30px;
      }

      h2 {
        color: #1c5540;
        margin-top: 0;
        font-weight: 600;
        font-size: 22px;
      }

      p {
        margin-bottom: 20px;
        color: #555555;
      }

      .info-section {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 25px;
        margin-bottom: 25px;
      }

      .info-section h3 {
        color: #1c5540;
        margin-top: 0;
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 15px;
      }

      .info-item {
        margin-bottom: 15px;
      }

      .info-label {
        font-weight: 600;
        color: #1c5540;
        margin-bottom: 5px;
      }

      .info-value {
        color: #555555;
      }

      .answers-section {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 25px;
        margin-bottom: 25px;
      }

      .answer-item {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eeeeee;
      }

      .answer-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .answer-question {
        font-weight: 600;
        color: #1c5540;
        margin-bottom: 8px;
      }

      .answer-text {
        color: #555555;
        white-space: pre-wrap;
      }

      .cv-note {
        background-color: #1c554027;
        padding: 15px;
        border-radius: 6px;
        margin-top: 20px;
        text-align: center;
        color: #1c5540;
        font-weight: 500;
      }

      .footer {
        background-color: #f9f9f9;
        padding: 20px 30px;
        text-align: center;
        color: #999999;
        font-size: 13px;
        border-top: 1px solid #eeeeee;
      }

      @media only screen and (max-width: 600px) {
        .content {
          padding: 20px;
        }

        .info-section,
        .answers-section {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="https://i.ibb.co/XZZhYrD6/Logo-Yatay-1-1.png"
          alt="Firma Kutusu"
          class="logo"
        />
      </div>

      <div class="content">
        <h2>Yeni İş Başvurusu</h2>

        <div class="info-section">
          <h3>Başvuru Bilgileri</h3>
          <div class="info-item">
            <div class="info-label">Ad Soyad</div>
            <div class="info-value">${ad_soyad}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Telefon</div>
            <div class="info-value">${telefon}</div>
          </div>
        </div>

        <div class="answers-section">
          <h3>Başvuru Cevapları</h3>
          ${filteredCevaplar
            .map(
              (cevap) => `
          <div class="answer-item">
            <div class="answer-question">${cevap.soru}</div>
            <div class="answer-text">${cevap.cevap}</div>
          </div>
          `
            )
            .join("")}
        </div>

        <div class="cv-note">
          CV dosyası e-postaya ekli olarak gönderilmiştir.
        </div>
      </div>

      <div class="footer">
        <p>© 2025 Firma Kutusu. Tüm hakları saklıdır.</p>
        <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.</p>
      </div>
    </div>
  </body>
</html>
      `,
    });

    console.log("Başvuru e-postası gönderildi:", info.messageId, email);
    return true;
  } catch (error) {
    console.error("Başvuru e-postası gönderme hatası:", error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendBasvuruEmail,
};
