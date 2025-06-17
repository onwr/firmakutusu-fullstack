-- Veritabanı Şeması (MySQL)

-- firma_kutusu_db adında bir veritabanı oluşturduğunuzu varsayıyoruz.
-- USE firma_kutusu_db;

-- Yetkili Kişiler Tablosu
CREATE TABLE IF NOT EXISTS yetkili_kisiler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    soyad VARCHAR(100) NOT NULL,
    tc_kimlik_no VARCHAR(11) UNIQUE, -- TC Kimlik No benzersiz olmalı
    telefon_no VARCHAR(20) UNIQUE, -- Telefon No benzersiz olmalı
    telefon_dogrulandi BOOLEAN DEFAULT FALSE,
    dogrulama_tarihi DATETIME
);

-- Firmalar Tablosu
CREATE TABLE IF NOT EXISTS firmalar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uyelik_turu VARCHAR(50) COMMENT 'Örn: Kurumsal, Bireysel',
    marka_adi VARCHAR(255) NOT NULL,
    firma_unvani VARCHAR(500) NOT NULL,
    vergi_kimlik_no VARCHAR(20) UNIQUE, -- VKN/TCKN benzersiz olmalı
    sektor VARCHAR(100),
    hizmet_alani VARCHAR(255),
    profil_resmi_url VARCHAR(2048),
    kurulus_tarihi DATE,
    kurulus_sehri VARCHAR(100),
    merkez_adresi TEXT,
    kep_adresi VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE, -- Firma iletişim e-postası
    web_sitesi VARCHAR(255),
    iletisim_telefonu VARCHAR(20),
    olusturulma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    aktif BOOLEAN DEFAULT TRUE
);

-- Kullanıcılar Tablosu
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL, -- Kullanıcı giriş e-postası
    password_hash VARCHAR(255) NOT NULL, -- Güvenli hashlenmiş şifre
    kvkk_onayi BOOLEAN DEFAULT FALSE,
    kayit_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    aktif BOOLEAN DEFAULT TRUE,
    yetkili_kisi_id INT,
    firma_id INT,
    FOREIGN KEY (yetkili_kisi_id) REFERENCES yetkili_kisiler(id) ON DELETE SET NULL,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE -- Firma silinirse ilişkili kullanıcılar da silinebilir veya SET NULL yapılabilir
);

-- Resmi Bilgiler Tablosu (Firmalar ile 1-1 ilişki)
CREATE TABLE IF NOT EXISTS resmi_bilgiler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT UNIQUE NOT NULL, -- 1-1 ilişki için UNIQUE
    faaliyet_alani TEXT,
    faaliyet_durumu BOOLEAN,
    vergi_dairesi_adi VARCHAR(100),
    mersis_no VARCHAR(20) UNIQUE,
    e_fatura_kullanimi BOOLEAN,
    e_arsiv_kullanimi BOOLEAN,
    e_irsaliye_kullanimi BOOLEAN,
    e_defter_kullanimi BOOLEAN,
    fax_numarasi VARCHAR(20),
    banka_iban VARCHAR(34), -- TR IBAN formatı
    banka_adi VARCHAR(100),
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Hakkımızda Bölümü (Firmalar ile 1-1 ilişki)
CREATE TABLE IF NOT EXISTS hakkimizda (
     id INT AUTO_INCREMENT PRIMARY KEY,
     firma_id INT UNIQUE NOT NULL,
     ceo_resmi_url VARCHAR(2048),
     baslik VARCHAR(255),
     ceo_adi VARCHAR(200),
     ceo_mesaji TEXT,
     FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Ürün & Hizmetler Ayarları (Firmalar ile 1-1 ilişki)
CREATE TABLE IF NOT EXISTS urun_hizmetler_ayarlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT UNIQUE NOT NULL,
    baslik VARCHAR(255),
    metin TEXT,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Ürünler Tablosu (Firmalar ile 1-N ilişki)
CREATE TABLE IF NOT EXISTS urunler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT NOT NULL,
    belge_adi VARCHAR(255) NOT NULL,
    gecerlilik_baslangic DATE,
    gecerlilik_bitis DATE,
    acilis_katalogu BOOLEAN DEFAULT FALSE,
    pdf_url VARCHAR(2048),
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Şubeler Ayarları (Firmalar ile 1-1 ilişki)
CREATE TABLE IF NOT EXISTS subeler_ayarlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT UNIQUE NOT NULL,
    baslik VARCHAR(255),
    metin TEXT,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Şubeler Tablosu (Firmalar ile 1-N ilişki)
CREATE TABLE IF NOT EXISTS subeler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT NOT NULL,
    kapak_resmi_url VARCHAR(2048),
    sube_adi VARCHAR(255) NOT NULL,
    sube_adresi TEXT,
    mail_adresi VARCHAR(255),
    telefon_numarasi VARCHAR(20),
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Çalışma Saatleri Tablosu (Şubeler ile 1-N ilişki)
CREATE TABLE IF NOT EXISTS calisma_saatleri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sube_id INT NOT NULL,
    gun VARCHAR(20) NOT NULL, -- Pazartesi, Salı vb.
    acilis_saati TIME,
    kapanis_saati TIME,
    kapali BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sube_id) REFERENCES subeler(id) ON DELETE CASCADE,
    UNIQUE (sube_id, gun) -- Bir şubenin her günü için tek kayıt olmalı
);

-- Kalite Belgeleri Ayarları (Firmalar ile 1-1 ilişki)
CREATE TABLE IF NOT EXISTS kalite_belgeleri_ayarlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT UNIQUE NOT NULL,
    baslik VARCHAR(255),
    metin TEXT,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Kalite Belgeleri Tablosu (Firmalar ile 1-N ilişki)
CREATE TABLE IF NOT EXISTS kalite_belgeleri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT NOT NULL,
    belge_resmi_url VARCHAR(2048),
    belge_adi VARCHAR(255) NOT NULL,
    sertifika_no VARCHAR(100),
    verilis_tarihi DATE,
    gecerlilik_bitis DATE,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Referanslar Ayarları (Firmalar ile 1-1 ilişki)
CREATE TABLE IF NOT EXISTS referanslar_ayarlar (
     id INT AUTO_INCREMENT PRIMARY KEY,
     firma_id INT UNIQUE NOT NULL,
     baslik VARCHAR(255),
     metin TEXT,
     FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Referanslar Tablosu (Firmalar ile 1-N ilişki)
CREATE TABLE IF NOT EXISTS referanslar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT NOT NULL COMMENT 'Bu referansın sahibi olan firma',
    tip VARCHAR(50) NOT NULL COMMENT 'Bana Verilen, Benim Verdiğim, Gönderilen Talep, Gelen Talep', -- Bunu kaldıralım 
    ilgili_firma_id INT COMMENT 'Referansı veren/alan/istenen/talep eden firma ID',
    ilgili_firma_adi VARCHAR(255) NOT NULL COMMENT 'Referansı veren/alan/istenen/talep eden firma adı',
    referans_mesaji TEXT,
    durum VARCHAR(50) COMMENT 'onaylandi, beklemede, reddedildi', 
    talep_tarihi DATETIME,
    islem_tarihi DATETIME,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
    -- ilgili_firma_id için foreign key eklemek isterseniz, tüm firmaların sistemde olması gerekir.
    -- FOREIGN KEY (ilgili_firma_id) REFERENCES firmalar(id)
);

-- Kampanyalar Ayarları (Firmalar ile 1-1 ilişki)
CREATE TABLE IF NOT EXISTS kampanyalar_ayarlar (
     id INT AUTO_INCREMENT PRIMARY KEY,
     firma_id INT UNIQUE NOT NULL,
     baslik VARCHAR(255),
     metin TEXT,
     FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Kampanyalar Tablosu (Firmalar ile 1-N ilişki)
CREATE TABLE IF NOT EXISTS kampanyalar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT NOT NULL,
    kapak_resmi_url VARCHAR(2048),
    aciklama TEXT,
    baslangic_tarihi DATE,
    bitis_tarihi DATE,
    acilis_katalogu BOOLEAN DEFAULT FALSE,
    katalog_pdf_url VARCHAR(2048),
    aktif BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS paketler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(50) NOT NULL,
    aciklama TEXT,
    fiyat DECIMAL(10,2) NOT NULL,
    sure_gun INT NOT NULL COMMENT 'Paketin geçerlilik süresi (gün)',
    vitrin_gorunurluk BOOLEAN DEFAULT FALSE COMMENT 'Anasayfada vitrin görünürlüğü',
    aktif BOOLEAN DEFAULT TRUE,
    olusturulma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paket_ozellikleri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paket_id INT NOT NULL,
    ozellik_adi VARCHAR(100) NOT NULL,
    ozellik_degeri VARCHAR(255),
    FOREIGN KEY (paket_id) REFERENCES paketler(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS firma_paket_gecmisi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT NOT NULL,
    paket_id INT NOT NULL,
    baslangic_tarihi DATETIME NOT NULL,
    bitis_tarihi DATETIME NOT NULL,
    odeme_durumu VARCHAR(20) DEFAULT 'beklemede' COMMENT 'beklemede, odendi, iptal',
    odeme_tarihi DATETIME,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE,
    FOREIGN KEY (paket_id) REFERENCES paketler(id)
);

-- İş Kariyer Ayarları (Firmalar ile 1-1 ilişki)
CREATE TABLE IF NOT EXISTS is_kariyer_ayarlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT UNIQUE NOT NULL,
    baslik VARCHAR(255),
    metin TEXT,
    email_adresi VARCHAR(255) COMMENT 'Başvuruların gönderileceği e-posta',
    aydinlatma_metni TEXT,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- İş Kariyer Soruları (Firmalar ile 1-N ilişki)
CREATE TABLE IF NOT EXISTS is_kariyer_sorular (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT NOT NULL,
    soru_metni VARCHAR(500) NOT NULL,
    sira INT DEFAULT 0,
    sabit BOOLEAN DEFAULT FALSE COMMENT 'Sabit sorular silinemez/düzenlenemez',
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Resim Galerisi Ayarları (Firmalar ile 1-1 ilişki)
CREATE TABLE IF NOT EXISTS resim_galerisi_ayarlar (
     id INT AUTO_INCREMENT PRIMARY KEY,
     firma_id INT UNIQUE NOT NULL,
     baslik VARCHAR(255),
     FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Resim Galerisi Tablosu (Firmalar ile 1-N ilişki)
CREATE TABLE IF NOT EXISTS resim_galerisi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT NOT NULL,
    resim_url VARCHAR(2048) NOT NULL,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Video Galerisi Ayarları (Firmalar ile 1-1 ilişki)
CREATE TABLE IF NOT EXISTS video_galerisi_ayarlar (
     id INT AUTO_INCREMENT PRIMARY KEY,
     firma_id INT UNIQUE NOT NULL,
     baslik VARCHAR(255),
     FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Video Galerisi Tablosu (Firmalar ile 1-N ilişki)
CREATE TABLE IF NOT EXISTS video_galerisi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT NOT NULL,
    video_url VARCHAR(2048) NOT NULL,
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);

-- Faaliyet Alanları Tablosu (Firmalar ile 1-N ilişki)
CREATE TABLE IF NOT EXISTS faaliyet_alanlari (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firma_id INT NOT NULL,
    tur VARCHAR(50) COMMENT 'Ana Faaliyet, Ek Faaliyet',
    alan TEXT,
    nace_kodu VARCHAR(10),
    FOREIGN KEY (firma_id) REFERENCES firmalar(id) ON DELETE CASCADE
);


-- Örnek Veri Girişleri

-- Yetkili Kişi Ekle
INSERT INTO yetkili_kisiler (id, ad, soyad, tc_kimlik_no, telefon_no, telefon_dogrulandi, dogrulama_tarihi)
VALUES (1, 'Ali', 'ATALAN', '12345678901', '+90 555 123 45 67', TRUE, '2023-09-15 11:15:22');

-- Firma Ekle
INSERT INTO firmalar (id, uyelik_turu, marka_adi, firma_unvani, vergi_kimlik_no, sektor, hizmet_alani, profil_resmi_url, kurulus_tarihi, kurulus_sehri, merkez_adresi, kep_adresi, email, web_sitesi, iletisim_telefonu, olusturulma_tarihi, aktif)
VALUES (1, 'Kurumsal', 'Ayyıldız', 'Ayyıldız Tünel Ekipmanları İmalatı Mühendislik San. ve Tic. A.Ş.', '1234567890', 'İnşaat', 'Tünel Ekipmanları', '/images/icons/firma-profil/firma-logo.svg', '2022-09-05', 'İstanbul', 'Atatürk Mah. Turgut Özal Cad. No: 123 Ümraniye/İstanbul', 'ayyildiz@hs01.kep.tr', 'info@ayyildiz.com.tr', 'https://www.ayyildiz.com.tr', '+90 216 555 67 89', '2023-09-15 11:30:45', TRUE);

-- Kullanıcı Ekle (Şifre hash'lenmeli, burada örnek olarak 'password_placeholder' kullanıldı)
INSERT INTO users (id, email, password_hash, kvkk_onayi, kayit_tarihi, aktif, yetkili_kisi_id, firma_id)
VALUES (1, 'ali.atalan@ayyildiz.com.tr', '$2b$10$examplehashplaceholder12345', TRUE, '2023-09-15 10:30:45', TRUE, 1, 1); -- password_hash kısmını bcrypt gibi bir kütüphane ile oluşturmalısınız

-- Resmi Bilgiler Ekle
INSERT INTO resmi_bilgiler (firma_id, faaliyet_alani, faaliyet_durumu, vergi_dairesi_adi, mersis_no, e_fatura_kullanimi, e_arsiv_kullanimi, e_irsaliye_kullanimi, e_defter_kullanimi, fax_numarasi, banka_iban, banka_adi)
VALUES (1, 'Tünel Ekipmanları İmalatı ve Mühendislik Hizmetleri', TRUE, 'Ümraniye Vergi Dairesi', '0123456789000015', TRUE, TRUE, TRUE, TRUE, '+90 216 555 67 90', 'TR12 0001 2345 6789 0123 4567 89', 'Türkiye İş Bankası');

-- Hakkımızda Ekle
INSERT INTO hakkimizda (firma_id, ceo_resmi_url, baslik, ceo_adi, ceo_mesaji)
VALUES (1, '/images/ceo.jpg', 'CEO Mesajı', 'Ali ATALAN', 'Ayyıldız olarak, Türkiye''nin önde gelen tünel ekipmanları üreticisi olarak 10 yılı aşkın süredir hizmet vermekteyiz. Müşteri memnuniyeti ve kalite anlayışımızla sektörde lider konuma gelmeyi başardık.');

-- Ürün Hizmetler Ayarları Ekle
INSERT INTO urun_hizmetler_ayarlar (firma_id, baslik, metin)
VALUES (1, 'Ürün & Hizmetlerimiz', 'Ayyıldız olarak, tünel ekipmanları konusunda geniş bir ürün yelpazesi sunmaktayız. Müşterilerimizin ihtiyaçlarına uygun çözümler üretiyoruz.');

-- Ürünler Ekle
INSERT INTO urunler (firma_id, id, belge_adi, gecerlilik_baslangic, gecerlilik_bitis, acilis_katalogu, pdf_url)
VALUES
(1, 1, 'Tünel Delme Ekipmanları Kataloğu', '2023-01-01', '2023-12-31', TRUE, '/documents/catalog-2023.pdf'),
(1, 2, 'Tünel Kaplama Sistemleri', '2023-01-01', '2023-12-31', FALSE, '/documents/tunel-kaplama-2023.pdf');

-- Şubeler Ayarları Ekle
INSERT INTO subeler_ayarlar (firma_id, baslik, metin)
VALUES (1, 'Şubelerimiz Başlık', 'Şubelerimiz Metin'); -- Başlık ve Metin frontend'den farklı olabilir, güncelledim.

-- Şubeler Ekle
INSERT INTO subeler (firma_id, id, kapak_resmi_url, sube_adi, sube_adresi, mail_adresi, telefon_numarasi)
VALUES
(1, 1, '/images/icons/firma-profil/icons/sube-resim.svg', 'İstanbul Merkez', 'Atatürk Mah. Turgut Özal Cad. No: 123 Ümraniye/İstanbul', 'istanbul@ayyildiz.com.tr', '+90 216 555 67 89'),
(1, 2, '/images/icons/firma-profil/icons/sube-resim.svg', 'Ankara Şube', 'Çankaya Cad. No: 45 Kızılay/Ankara', 'ankara@ayyildiz.com.tr', '+90 312 555 67 89');

-- Çalışma Saatleri Ekle (Şube 1 - İstanbul Merkez)
INSERT INTO calisma_saatleri (sube_id, gun, acilis_saati, kapanis_saati, kapali) VALUES
(1, 'Pazartesi', '09:00:00', '18:00:00', FALSE),
(1, 'Salı', '09:00:00', '18:00:00', FALSE),
(1, 'Çarşamba', '09:00:00', '18:00:00', FALSE),
(1, 'Perşembe', '09:00:00', '18:00:00', FALSE),
(1, 'Cuma', '09:00:00', '18:00:00', FALSE),
(1, 'Cumartesi', '10:00:00', '14:00:00', FALSE),
(1, 'Pazar', NULL, NULL, TRUE); -- Kapalı günler için saat NULL olabilir

-- Çalışma Saatleri Ekle (Şube 2 - Ankara Şube)
INSERT INTO calisma_saatleri (sube_id, gun, acilis_saati, kapanis_saati, kapali) VALUES
(2, 'Pazartesi', '09:00:00', '18:00:00', FALSE),
(2, 'Salı', '09:00:00', '18:00:00', FALSE),
(2, 'Çarşamba', '09:00:00', '18:00:00', FALSE),
(2, 'Perşembe', '09:00:00', '18:00:00', FALSE),
(2, 'Cuma', '09:00:00', '18:00:00', FALSE),
(2, 'Cumartesi', NULL, NULL, TRUE),
(2, 'Pazar', NULL, NULL, TRUE);

-- Kalite Belgeleri Ayarları Ekle
INSERT INTO kalite_belgeleri_ayarlar (firma_id, baslik, metin)
VALUES (1, 'Kalite Belgelerimiz', 'Ayyıldız olarak, kalite ve müşteri memnuniyeti odaklı çalışma prensibimizle ISO 9001 ve ISO 14001 belgelerine sahibiz.');

-- Kalite Belgeleri Ekle
INSERT INTO kalite_belgeleri (firma_id, id, belge_resmi_url, belge_adi, sertifika_no, verilis_tarihi, gecerlilik_bitis)
VALUES
(1, 1, '/images/icons/firma-profil/icons/kalite-sertifika.svg', 'ISO 9001:2015', 'ISO9001-2023-12345', '2023-01-15', '2026-01-14'),
(1, 2, '/images/icons/firma-profil/icons/kalite-sertifika.svg', 'ISO 14001:2015', 'ISO14001-2023-67890', '2023-01-15', '2026-01-14');

-- Referanslar Ayarları Ekle
INSERT INTO referanslar_ayarlar (firma_id, baslik, metin)
VALUES (1, 'Referanslarımız', 'Ayyıldız olarak iş ortaklarımızla kurduğumuz güvenilir ilişkilerle sektörde fark yaratıyoruz. İşte referanslarımız:');

-- Referanslar Ekle
INSERT INTO referanslar (firma_id, id, tip, ilgili_firma_id, ilgili_firma_adi, referans_mesaji, durum, talep_tarihi, islem_tarihi)
VALUES
(1, 1, 'Bana Verilen Referanslar', 2, 'Mega Yapı A.Ş.', 'Ayyıldız ile yaptığımız işbirliğinden çok memnun kaldık. Kaliteli ürünleri ve zamanında teslimat anlayışlarıyla projemize büyük katkı sağladılar.', 'Onaylandı', '2023-05-10 14:30:00', '2023-05-12 10:15:00'),
(1, 2, 'Bana Verilen Referanslar', 3, 'Yıldız İnşaat Ltd. Şti.', 'Marmaray Projesi''nde Ayyıldız''ın tünel ekipmanlarını kullandık. Teknik destek ve ürün kalitesi açısından tam not alıyorlar.', 'Onaylandı', '2023-06-20 11:45:00', '2023-06-21 09:30:00'),
(1, 3, 'Benim Verdiğim Referanslar', 4, 'Doğu İnşaat A.Ş.', 'Doğu İnşaat ile çalışmak bir zevkti. Projelerinde profesyonel bir yaklaşım sergilediler.', 'Onaylandı', '2023-07-15 09:00:00', '2023-07-16 14:20:00'), -- Tip düzeltildi
(1, 4, 'Benim Gönderdiğim Talepler', 5, 'Batı Mühendislik Ltd. Şti.', 'Referans talebi gönderildi.', 'Beklemede', '2023-08-01 13:10:00', NULL),
(1, 5, 'Bana Gelen Referans Talepleri', 6, 'Güney Yapı A.Ş.', 'Referans talebi bekliyor.', 'Beklemede', '2023-09-05 16:45:00', NULL);

-- Kampanyalar Ayarları Ekle
INSERT INTO kampanyalar_ayarlar (firma_id, baslik, metin)
VALUES (1, 'Bi daha Evlendiren Düğün Kampanyalarımız =)', 'Düğün, Toplantı veya düzenleyeceğiniz kongrelerde siz ve misafirlerinizi yüksek kalitede ağırlayabilme misyonu ile hizmet vermeyi amaç ediniyor ve sizi kendi davetinize davet ediyoruz.');

-- Kampanyalar Ekle
INSERT INTO kampanyalar (firma_id, id, kapak_resmi_url, aciklama, baslangic_tarihi, bitis_tarihi, acilis_katalogu, katalog_pdf_url, aktif)
VALUES (1, 1, '/images/icons/firma-profil/icons/kampanya-afis.svg', 'Yaz Kampanyası: Tüm tünel delme ekipmanlarında %15 indirim fırsatı. 30 Ağustos''a kadar geçerlidir.', '2023-06-01', '2023-08-30', TRUE, '/documents/yaz-kampanyasi-2023.pdf', TRUE);

-- İş Kariyer Ayarları Ekle
INSERT INTO is_kariyer_ayarlar (firma_id, baslik, metin, email_adresi, aydinlatma_metni)
VALUES (1, 'Kariyer Başlık', 'Kariyer Metin', 'email@gmail.com', 'Başvurunuz, 6698 sayılı KVKK kapsamında değerlendirilecektir.');

-- İş Kariyer Soruları Ekle
INSERT INTO is_kariyer_sorular (firma_id, id, soru_metni, sira, sabit)
VALUES
(1, 1, 'Adınız', 1, TRUE),
(1, 2, 'Soyadınız', 2, TRUE),
(1, 3, 'Telefon numaranız', 3, TRUE),
(1, 4, 'E-Mail adresiniz', 4, TRUE),
(1, 5, 'Mezun olduğunuz üniversite', 5, FALSE),
(1, 6, 'Toplam iş deneyiminiz (yıl)', 6, FALSE),
(1, 7, 'Yabancı dil bilginiz', 7, FALSE),
(1, 8, 'Eklemek istedikleriniz (Ön Yazı)', 8, FALSE), -- 'Boş kalsın' yerine daha anlamlı bir soru
(1, 9, 'Referanslarınız', 9, FALSE), -- 'Boş kalsın' yerine daha anlamlı bir soru
(1, 10, 'Beklenen Ücret Aralığı', 10, FALSE); -- 'Boş kalsın' yerine daha anlamlı bir soru

-- Resim Galerisi Ayarları Ekle
INSERT INTO resim_galerisi_ayarlar (firma_id, baslik)
VALUES (1, 'Bize Katılmak İstermisiniz');

-- Resim Galerisi Ekle
INSERT INTO resim_galerisi (firma_id, id, resim_url)
VALUES (1, 1, '/images/videobaslik.png');

-- Video Galerisi Ayarları Ekle
INSERT INTO video_galerisi_ayarlar (firma_id, baslik)
VALUES (1, 'Videolarımız');

-- Video Galerisi Ekle
INSERT INTO video_galerisi (firma_id, id, video_url)
VALUES (1, 1, '/video.mp4');

-- Faaliyet Alanları Ekle
INSERT INTO faaliyet_alanlari (firma_id, tur, alan, nace_kodu)
VALUES
(1, 'Ana Faaliyet', 'Metallerin Makinede İşlenmesi (Torna Tesfiye İşleri, Metal Parçaları Delme, Tornalama, Frezeleme, Rendeleme, Parlatma, Oluk Açma, Perdahlama, Birleştirme, Kaynak Yapma Vb. Faaliyetler) (Metallerin Lazerle Kesilmesi Hariç)', '25.62.02'),
(1, 'Ek Faaliyet - 1', 'Demir/Çelikten Haddelenmiş/Soğuk Çekilmiş Yassı Ürünlerin Toptan Ticareti', '46.72.08');







