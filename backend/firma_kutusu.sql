-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 15 Haz 2025, 15:18:04
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `fkdb`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `bildirimler`
--

CREATE TABLE `bildirimler` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) DEFAULT NULL COMMENT 'Tek firmaya özel bildirim ise firma ID',
  `tip` varchar(50) NOT NULL COMMENT 'Bağlantı, Abonelik, Kampanya, Teknik Bakım',
  `konu` varchar(255) NOT NULL,
  `icerik` text DEFAULT NULL,
  `tip_renk` varchar(20) DEFAULT NULL COMMENT 'HEX color code',
  `tip_icon` varchar(255) DEFAULT NULL COMMENT 'Icon path',
  `okundu` tinyint(1) DEFAULT 0,
  `olusturma_tarihi` datetime DEFAULT current_timestamp(),
  `hedef_tur` enum('tum','firma') DEFAULT 'firma' COMMENT 'Bildirimin hedef türü'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `bildirimler`
--

INSERT INTO `bildirimler` (`id`, `firma_id`, `tip`, `konu`, `icerik`, `tip_renk`, `tip_icon`, `okundu`, `olusturma_tarihi`, `hedef_tur`) VALUES
(2, 1, 'Abonelik', 'Premium Paketinizin Bitmesine 30 Gün Kaldı', NULL, '#7C3AED', '/images/bildirim/abonelik.svg', 0, '2025-06-14 14:30:00', 'firma'),
(3, 1, 'Kampanya', 'Nisan Ayına Özel Premium Paketlerde %15 İndirim Fırsatını Kaçırma', NULL, '#B6893C', '/images/bildirim/kampanya.svg', 0, '2025-06-14 14:30:00', 'firma'),
(8, NULL, 'Teknik Bakım', 'Yeni bir firma sizi favorilerine ekledi', 'ABC Şirketi sizi favorilerine ekledi', '#4CAF50', '/images/bildirim/teknikbakim.svg', 0, '2025-06-14 14:54:50', 'tum'),
(9, 22, 'Bağlantı', 'Referans Talebi Oluşturuldu', 'KÜRKAYA YAZILIM A.Ş', '#7C3AED', '/images/bildirim/baglanti.svg', 0, '2025-06-14 15:15:47', 'firma'),
(10, 21, 'Bağlantı', 'Referans Talebi Oluşturuldu', 'KRK EĞİTİM A.Ş firması bir referans talebi oluşturulmuştur. Talebi görüntülemek ve onaylamak için lütfen Profil > Referanslar bölümünü ziyaret ediniz.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-14 15:35:23', 'firma'),
(11, 22, 'Bağlantı', 'Referans Talebi Oluşturuldu', 'KÜRKAYA YAZILIM A.Ş firması bir referans talebi oluşturulmuştur. Talebi görüntülemek ve onaylamak için lütfen Profil > Referanslar bölümünü ziyaret ediniz.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-14 15:47:12', 'firma'),
(12, 22, 'Bağlantı', 'Referans Talebi Oluşturuldu', 'KÜRKAYA YAZILIM A.Ş firması bir referans talebi oluşturulmuştur. Talebi görüntülemek ve onaylamak için lütfen Profil > Referanslar bölümünü ziyaret ediniz.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-14 15:48:32', 'firma'),
(13, 22, 'Bağlantı', 'Referans Talebi Oluşturuldu', 'KÜRKAYA YAZILIM A.Ş firması bir referans talebi oluşturulmuştur. Talebi görüntülemek ve onaylamak için lütfen Profil > Referanslar bölümünü ziyaret ediniz.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-14 15:58:07', 'firma'),
(14, 21, 'Bağlantı', 'Referans Talebi Oluşturuldu', 'KRK EĞİTİM A.Ş firması bir referans talebi oluşturulmuştur. Talebi görüntülemek ve onaylamak için lütfen Profil > Referanslar bölümünü ziyaret ediniz.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-14 16:00:40', 'firma'),
(15, 22, 'Bağlantı', 'Referans Talebi Oluşturuldu', 'KÜRKAYA YAZILIM A.Ş firması bir referans talebi oluşturulmuştur. Talebi görüntülemek ve onaylamak için lütfen Profil > Referanslar bölümünü ziyaret ediniz.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-14 16:06:49', 'firma'),
(16, 21, 'Bağlantı', 'Referans Talebi Reddedildi', 'KRK EĞİTİM A.Ş firmasına gönderdiğiniz referans talebi reddedilmiştir.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-14 16:07:53', 'firma'),
(17, 22, 'Bağlantı', 'Referans Talebi Oluşturuldu', 'KÜRKAYA YAZILIM A.Ş firması bir referans talebi oluşturulmuştur. Talebi görüntülemek ve onaylamak için lütfen Profil > Referanslar bölümünü ziyaret ediniz.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-14 16:09:34', 'firma'),
(18, 21, 'Bağlantı', 'Referans Talebi Onaylandı', 'KRK EĞİTİM A.Ş firmasına gönderdiğiniz referans talebi onaylanmıştır.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-14 16:09:59', 'firma'),
(19, 1, 'Favori', 'Favori Eklendi', 'KRK EĞİTİM A.Ş firması sizi favorilere ekledi.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-15 12:03:19', 'firma'),
(20, 21, 'Favori', 'Favori Eklendi', 'KRK EĞİTİM A.Ş firması sizi favorilere ekledi.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-15 12:03:27', 'firma'),
(21, 21, 'Favori', 'Favori Eklendi', 'KRK EĞİTİM A.Ş firması sizi favorilere ekledi.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-15 12:06:55', 'firma'),
(22, 1, 'Favori', 'Favori Eklendi', 'KRK EĞİTİM A.Ş firması sizi favorilere ekledi.', '#80cc28', '/images/bildirim/baglanti.svg', 0, '2025-06-15 12:07:43', 'firma');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `calisma_saatleri`
--

CREATE TABLE `calisma_saatleri` (
  `id` int(11) NOT NULL,
  `sube_id` int(11) NOT NULL,
  `gun` varchar(20) NOT NULL,
  `acilis_saati` time DEFAULT NULL,
  `kapanis_saati` time DEFAULT NULL,
  `kapali` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `calisma_saatleri`
--

INSERT INTO `calisma_saatleri` (`id`, `sube_id`, `gun`, `acilis_saati`, `kapanis_saati`, `kapali`) VALUES
(1, 1, 'Pazartesi', '09:00:00', '18:00:00', 0),
(2, 1, 'Salı', '09:00:00', '18:00:00', 0),
(3, 1, 'Çarşamba', '09:00:00', '18:00:00', 0),
(4, 1, 'Perşembe', '09:00:00', '18:00:00', 0),
(5, 1, 'Cuma', '09:00:00', '18:00:00', 0),
(6, 1, 'Cumartesi', '10:00:00', '14:00:00', 0),
(7, 1, 'Pazar', NULL, NULL, 1),
(8, 2, 'Pazartesi', '09:00:00', '18:00:00', 0),
(9, 2, 'Salı', '09:00:00', '18:00:00', 0),
(10, 2, 'Çarşamba', '09:00:00', '18:00:00', 0),
(11, 2, 'Perşembe', '09:00:00', '18:00:00', 0),
(12, 2, 'Cuma', '09:00:00', '18:00:00', 0),
(13, 2, 'Cumartesi', NULL, NULL, 1),
(14, 2, 'Pazar', NULL, NULL, 1),
(71, 15, 'Pazartesi', '09:00:00', '18:00:00', 0),
(72, 15, 'Salı', '09:00:00', '18:00:00', 0),
(73, 15, 'Çarşamba', '09:00:00', '18:00:00', 0),
(74, 15, 'Perşembe', '09:00:00', '18:00:00', 0),
(75, 15, 'Cuma', '09:00:00', '18:00:00', 0),
(76, 15, 'Cumartesi', NULL, NULL, 1),
(77, 15, 'Pazar', NULL, NULL, 1),
(78, 16, 'Pazartesi', '09:00:00', '18:00:00', 0),
(79, 16, 'Salı', '09:00:00', '18:00:00', 0),
(80, 16, 'Çarşamba', '09:00:00', '18:00:00', 0),
(81, 16, 'Perşembe', '09:00:00', '18:00:00', 0),
(82, 16, 'Cuma', '09:00:00', '18:00:00', 0),
(83, 16, 'Cumartesi', NULL, NULL, 1),
(84, 16, 'Pazar', NULL, NULL, 1),
(85, 17, 'Pazartesi', '09:00:00', '18:00:00', 0),
(86, 17, 'Salı', '09:00:00', '18:00:00', 0),
(87, 17, 'Çarşamba', '09:00:00', '18:00:00', 0),
(88, 17, 'Perşembe', '09:00:00', '18:00:00', 0),
(89, 17, 'Cuma', '09:00:00', '18:00:00', 0),
(90, 17, 'Cumartesi', NULL, NULL, 1),
(91, 17, 'Pazar', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `destek_mesajlari`
--

CREATE TABLE `destek_mesajlari` (
  `id` int(11) NOT NULL,
  `destek_talebi_id` int(11) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `destek_talepleri`
--

CREATE TABLE `destek_talepleri` (
  `id` int(11) NOT NULL,
  `ticket_number` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `status` enum('open','closed','pending') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `faaliyet_alanlari`
--

CREATE TABLE `faaliyet_alanlari` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `tur` varchar(50) DEFAULT NULL COMMENT 'Ana Faaliyet, Ek Faaliyet',
  `alan` text DEFAULT NULL,
  `nace_kodu` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `faaliyet_alanlari`
--

INSERT INTO `faaliyet_alanlari` (`id`, `firma_id`, `tur`, `alan`, `nace_kodu`) VALUES
(1, 1, 'Ana Faaliyet', 'Metallerin Makinede İşlenmesi (Torna Tesfiye İşleri, Metal Parçaları Delme, Tornalama, Frezeleme, Rendeleme, Parlatma, Oluk Açma, Perdahlama, Birleştirme, Kaynak Yapma Vb. Faaliyetler) (Metallerin Lazerle Kesilmesi Hariç)', '25.62.02'),
(2, 1, 'Ana Faaliyet', 'Yazılım Geliştirme v4e Bilişim Hizmetleri', '62.01.01'),
(13, 20, 'Ana Faaliyet', 'Bilişim Teknolojileri', NULL),
(15, 21, 'TEST', 'GIDA', '1.44'),
(16, 22, 'Ana Faaliyet', 'Eğitim', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `favoriler`
--

CREATE TABLE `favoriler` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `favoriler`
--

INSERT INTO `favoriler` (`id`, `user_id`, `firma_id`, `created_at`) VALUES
(6, 21, 1, '2025-06-15 08:51:27'),
(7, 21, 21, '2025-06-15 08:51:35'),
(8, 21, 1, '2025-06-15 08:52:02');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `firmalar`
--

CREATE TABLE `firmalar` (
  `id` int(11) NOT NULL,
  `uyelik_turu` varchar(50) DEFAULT NULL COMMENT 'Örn: Kurumsal, Bireysel',
  `marka_adi` varchar(255) NOT NULL,
  `firma_unvani` varchar(500) NOT NULL,
  `vergi_kimlik_no` varchar(20) DEFAULT NULL,
  `sektor` varchar(100) DEFAULT NULL,
  `hizmet_alani` varchar(255) DEFAULT NULL,
  `profil_resmi_url` varchar(2048) DEFAULT NULL,
  `kurulus_tarihi` date DEFAULT NULL,
  `kurulus_sehri` varchar(100) DEFAULT NULL,
  `merkez_adresi` text DEFAULT NULL,
  `kep_adresi` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `web_sitesi` varchar(255) DEFAULT NULL,
  `iletisim_telefonu` varchar(20) DEFAULT NULL,
  `olusturulma_tarihi` datetime DEFAULT current_timestamp(),
  `aktif` tinyint(1) DEFAULT 1,
  `aktif_paket_id` int(11) DEFAULT NULL,
  `paket_baslangic_tarihi` datetime DEFAULT NULL,
  `paket_bitis_tarihi` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `firmalar`
--

INSERT INTO `firmalar` (`id`, `uyelik_turu`, `marka_adi`, `firma_unvani`, `vergi_kimlik_no`, `sektor`, `hizmet_alani`, `profil_resmi_url`, `kurulus_tarihi`, `kurulus_sehri`, `merkez_adresi`, `kep_adresi`, `email`, `web_sitesi`, `iletisim_telefonu`, `olusturulma_tarihi`, `aktif`, `aktif_paket_id`, `paket_baslangic_tarihi`, `paket_bitis_tarihi`) VALUES
(1, 'Kurumsal', 'Ayyıldız', 'Ayyıldız Tünel Ekipmanları İmalatı Mühendislik San. ve Tic. A.Ş.', '1234567891', 'İnşaat', 'Tünel Ekipmanları', '/images/icons/firma-profil/firma-logo.svg', '2022-09-05', 'İstanbul', 'Atatürk Mah. Turgut Özal Cad. No: 123 Ümraniye/İstanbul', 'ayyildiz@hs01.kep.tr', 'info@ayyildiz.com.tr', 'https://www.ayyildiz.com.tr', '+90 216 555 67 89', '2023-09-15 11:30:45', 1, NULL, NULL, NULL),
(20, 'kurumsal', 'KÜRKAYA BİLİŞİM VE YAZILI', 'KÜRKAYA YAZILIM A.Ş', '4124214124', 'Bilişim Teknolojileri', NULL, '/images/default-company.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-19 12:44:43', 1, NULL, NULL, NULL),
(21, 'kurumsal', 'KÜRKAYA UNLU MAMÜLLER', 'KÜRKAYA YAZILIM A.Ş', '1661421342', 'Gıda', NULL, 'https://mir-s3-cdn-cf.behance.net/projects/404/ffbef670485653.Y3JvcCwxNzcyLDEzODYsMCw2MQ.jpg', '2022-05-22', '', 'ANKARA', '', '', 'kurkayaunlumamuller.com', '+90 541 196 18 30', '2025-05-24 12:22:47', 1, NULL, NULL, NULL),
(22, 'kurumsal', 'KRK EĞİTİM', 'KRK EĞİTİM A.Ş', '4124214123', 'Eğitim', 'EĞİTİM', 'https://cdn.api.heda.tr/files/684e9ff0ddaf6-1749983216.png', '2005-06-19', 'ANKARA', 'ANKARA / .... ', 'krkegitim@hs01.kep.tr', 'krkegitim@gmail.com', 'krkegitim.com.tr', '+90 555 555 55 55', '2025-06-13 23:08:54', 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `firma_paket_gecmisi`
--

CREATE TABLE `firma_paket_gecmisi` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `paket_id` int(11) NOT NULL,
  `baslangic_tarihi` datetime NOT NULL,
  `bitis_tarihi` datetime NOT NULL,
  `odeme_durumu` varchar(20) DEFAULT 'beklemede' COMMENT 'beklemede, odendi, iptal',
  `odeme_tarihi` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `firma_paket_gecmisi`
--

INSERT INTO `firma_paket_gecmisi` (`id`, `firma_id`, `paket_id`, `baslangic_tarihi`, `bitis_tarihi`, `odeme_durumu`, `odeme_tarihi`) VALUES
(13, 21, 1, '2025-06-15 15:59:14', '2025-07-15 15:59:14', 'beklemede', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `hakkimizda`
--

CREATE TABLE `hakkimizda` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `ceo_resmi_url` varchar(2048) DEFAULT NULL,
  `baslik` varchar(255) DEFAULT NULL,
  `ceo_adi` varchar(200) DEFAULT NULL,
  `ceo_mesaji` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `hakkimizda`
--

INSERT INTO `hakkimizda` (`id`, `firma_id`, `ceo_resmi_url`, `baslik`, `ceo_adi`, `ceo_mesaji`) VALUES
(1, 1, '/images/ceo.jpg', 'CEO Mesajı', 'Ali ATALAN', 'Ayyıldız olarak, Türkiye\'nin önde gelen tünel ekipmanları üreticisi olarak 10 yılı aşkın süredir hizmet vermekteyiz. Müşteri memnuniyeti ve kalite anlayışımızla sektörde lider konuma gelmeyi başardık.'),
(10, 20, '/images/default-ceo.png', NULL, NULL, NULL),
(11, 21, 'https://cdn.api.heda.tr/files/68319046e8d3b-1748078662.jpg', 'UNLU MAMULLER', 'SALİH', 'LOREM IPSUM DOLOR'),
(12, 22, '/images/default-ceo.png', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `is_kariyer_ayarlar`
--

CREATE TABLE `is_kariyer_ayarlar` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `baslik` varchar(255) DEFAULT NULL,
  `metin` text DEFAULT NULL,
  `email_adresi` varchar(255) DEFAULT NULL COMMENT 'Başvuruların gönderileceği e-posta',
  `aydinlatma_metni` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `is_kariyer_ayarlar`
--

INSERT INTO `is_kariyer_ayarlar` (`id`, `firma_id`, `baslik`, `metin`, `email_adresi`, `aydinlatma_metni`) VALUES
(1, 1, 'Kariyer Başlık', 'Kariyer Metin', 'email@gmail.com', 'Başvurunuz, 6698 sayılı KVKK kapsamında değerlendirilecektir.'),
(4, 21, 'TEST23', 'TASDFASDASDF', 'onurkurkaya78@gmail.com', 'TEST ASDFASDFSADF  ASDF'),
(5, 22, 'TEST', '', '', '');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `is_kariyer_sorular`
--

CREATE TABLE `is_kariyer_sorular` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `soru_metni` varchar(500) NOT NULL,
  `sira` int(11) DEFAULT 0,
  `sabit` tinyint(1) DEFAULT 0 COMMENT 'Sabit sorular silinemez/düzenlenemez'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `is_kariyer_sorular`
--

INSERT INTO `is_kariyer_sorular` (`id`, `firma_id`, `soru_metni`, `sira`, `sabit`) VALUES
(1, 1, 'Adınız', 1, 1),
(2, 1, 'Soyadınız', 2, 1),
(3, 1, 'Telefon numaranız', 3, 1),
(4, 1, 'E-Mail adresiniz', 4, 1),
(5, 1, 'Mezun olduğunuz üniversite', 5, 0),
(6, 1, 'Toplam iş deneyiminiz (yıl)', 6, 0),
(7, 1, 'Yabancı dil bilginiz', 7, 0),
(8, 1, 'Eklemek istedikleriniz (Ön Yazı)', 8, 0),
(9, 1, 'Referanslarınız', 9, 0),
(10, 1, 'Beklenen Ücret Aralığı', 10, 0),
(33, 21, 'TEST ADRESİ2', 5, 0),
(34, 21, 'TEST ADRESİ23', 6, 0),
(35, 21, 'TEST ADRESİ24', 7, 0),
(36, 21, 'Adınız Soyadınız', 1, 1),
(37, 21, 'T.C. Kimlik Numaranız', 2, 1),
(38, 21, 'Telefon Numaranız', 3, 1),
(39, 21, 'E-Mail Adresiniz', 4, 1),
(40, 22, 'Adınız Soyadınız', 1, 1),
(41, 22, 'T.C. Kimlik Numaranız', 2, 1),
(42, 22, 'Telefon Numaranız', 3, 1),
(43, 22, 'E-Mail Adresiniz', 4, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kalite_belgeleri`
--

CREATE TABLE `kalite_belgeleri` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `belge_resmi_url` varchar(2048) DEFAULT NULL,
  `belge_adi` varchar(255) NOT NULL,
  `sertifika_no` varchar(100) DEFAULT NULL,
  `verilis_tarihi` date DEFAULT NULL,
  `gecerlilik_bitis` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `kalite_belgeleri`
--

INSERT INTO `kalite_belgeleri` (`id`, `firma_id`, `belge_resmi_url`, `belge_adi`, `sertifika_no`, `verilis_tarihi`, `gecerlilik_bitis`) VALUES
(1, 1, '/images/icons/firma-profil/icons/kalite-sertifika.svg', 'ISO 9001:2015', 'ISO9001-2023-12345', '2023-01-15', '2026-01-14'),
(2, 1, '/images/icons/firma-profil/icons/kalite-sertifika.svg', 'ISO 14001:2015', 'ISO14001-2023-67890', '2023-01-15', '2026-01-14'),
(5, 21, 'https://cdn.api.heda.tr/files/683de2727cfd8-1748886130.png', 'TEST', '41412414AGF', '2025-06-02', '2025-06-29');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kalite_belgeleri_ayarlar`
--

CREATE TABLE `kalite_belgeleri_ayarlar` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `baslik` varchar(255) DEFAULT NULL,
  `metin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `kalite_belgeleri_ayarlar`
--

INSERT INTO `kalite_belgeleri_ayarlar` (`id`, `firma_id`, `baslik`, `metin`) VALUES
(1, 1, 'Kalite Belgelerimiz', 'Ayyıldız olarak, kalite ve müşteri memnuniyeti odaklı çalışma prensibimizle ISO 9001 ve ISO 14001 belgelerine sahibiz.'),
(10, 20, 'Kalite Belgelerimiz', NULL),
(11, 21, 'Kalite Belgelerimiz', 'TEST'),
(12, 22, 'Kalite Belgelerimiz', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kampanyalar`
--

CREATE TABLE `kampanyalar` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `kapak_resmi_url` varchar(2048) DEFAULT NULL,
  `aciklama` text DEFAULT NULL,
  `baslangic_tarihi` date DEFAULT NULL,
  `bitis_tarihi` date DEFAULT NULL,
  `acilis_katalogu` tinyint(1) DEFAULT 0,
  `katalog_pdf_url` varchar(2048) DEFAULT NULL,
  `aktif` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `kampanyalar`
--

INSERT INTO `kampanyalar` (`id`, `firma_id`, `kapak_resmi_url`, `aciklama`, `baslangic_tarihi`, `bitis_tarihi`, `acilis_katalogu`, `katalog_pdf_url`, `aktif`) VALUES
(1, 1, '/images/icons/firma-profil/icons/kampanya-afis.svg', 'Yaz Kampanyası: Tüm tünel delme ekipmanlarında %15 indirim fırsatı. 30 Ağustos\'a kadar geçerlidir.', '2023-06-01', '2023-08-30', 1, '/documents/yaz-kampanyasi-2023.pdf', 1),
(3, 21, 'https://cdn.api.heda.tr/files/68485a5aa3f30-1749572186.png', 'TEST2', '2025-06-11', '2025-06-27', 1, 'https://cdn.api.heda.tr/files/68485a790a52e-1749572217.pdf', 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kampanyalar_ayarlar`
--

CREATE TABLE `kampanyalar_ayarlar` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `baslik` varchar(255) DEFAULT NULL,
  `metin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `kampanyalar_ayarlar`
--

INSERT INTO `kampanyalar_ayarlar` (`id`, `firma_id`, `baslik`, `metin`) VALUES
(1, 1, 'Bi daha Evlendiren Düğün Kampanyalarımız =)', 'Düğün, Toplantı veya düzenleyeceğiniz kongrelerde siz ve misafirlerinizi yüksek kalitede ağırlayabilme misyonu ile hizmet vermeyi amaç ediniyor ve sizi kendi davetinize davet ediyoruz.'),
(10, 20, 'Kampanyalarımız', NULL),
(11, 21, 'Kampanyalarımız2', 'test'),
(12, 22, 'Kampanyalarımız', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `paketler`
--

CREATE TABLE `paketler` (
  `id` int(11) NOT NULL,
  `ad` varchar(50) NOT NULL,
  `aciklama` text DEFAULT NULL,
  `fiyat` decimal(10,2) NOT NULL,
  `sure_gun` int(11) NOT NULL COMMENT 'Paketin geçerlilik süresi (gün)',
  `vitrin_gorunurluk` tinyint(1) DEFAULT 0 COMMENT 'Anasayfada vitrin görünürlüğü',
  `aktif` tinyint(1) DEFAULT 1,
  `olusturulma_tarihi` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `paketler`
--

INSERT INTO `paketler` (`id`, `ad`, `aciklama`, `fiyat`, `sure_gun`, `vitrin_gorunurluk`, `aktif`, `olusturulma_tarihi`) VALUES
(1, 'Standart', 'Temel firma profili özellikleri', 299.99, 30, 0, 1, '2025-06-15 13:56:59'),
(2, 'Profesyonel', 'Gelişmiş firma profili ve vitrin özellikleri', 599.99, 30, 1, 1, '2025-06-15 13:56:59'),
(3, 'Kurumsal VIP', 'Premium firma profili ve öncelikli vitrin özellikleri', 999.99, 30, 1, 1, '2025-06-15 13:56:59');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `paket_ozellikleri`
--

CREATE TABLE `paket_ozellikleri` (
  `id` int(11) NOT NULL,
  `paket_id` int(11) NOT NULL,
  `ozellik_adi` varchar(100) NOT NULL,
  `ozellik_degeri` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `paket_ozellikleri`
--

INSERT INTO `paket_ozellikleri` (`id`, `paket_id`, `ozellik_adi`, `ozellik_degeri`) VALUES
(1, 1, 'Profil Sayfası', 'Temel'),
(2, 1, 'Ürün/Hizmet Listesi', '5 adet'),
(3, 1, 'Şube Bilgileri', '1 şube'),
(4, 1, 'Kalite Belgeleri', '3 belge'),
(5, 1, 'Referanslar', '5 referans'),
(6, 1, 'Kampanyalar', '2 kampanya'),
(7, 1, 'Resim Galerisi', '10 resim'),
(8, 1, 'Video Galerisi', '2 video'),
(9, 2, 'Profil Sayfası', 'Gelişmiş'),
(10, 2, 'Ürün/Hizmet Listesi', 'Sınırsız'),
(11, 2, 'Şube Bilgileri', '5 şube'),
(12, 2, 'Kalite Belgeleri', 'Sınırsız'),
(13, 2, 'Referanslar', 'Sınırsız'),
(14, 2, 'Kampanyalar', 'Sınırsız'),
(15, 2, 'Resim Galerisi', '50 resim'),
(16, 2, 'Video Galerisi', '10 video'),
(17, 2, 'Vitrin Görünürlüğü', 'Var'),
(18, 2, 'Özel Tasarım', 'Var'),
(19, 3, 'Profil Sayfası', 'Premium'),
(20, 3, 'Ürün/Hizmet Listesi', 'Sınırsız'),
(21, 3, 'Şube Bilgileri', 'Sınırsız'),
(22, 3, 'Kalite Belgeleri', 'Sınırsız'),
(23, 3, 'Referanslar', 'Sınırsız'),
(24, 3, 'Kampanyalar', 'Sınırsız'),
(25, 3, 'Resim Galerisi', 'Sınırsız'),
(26, 3, 'Video Galerisi', 'Sınırsız'),
(27, 3, 'Vitrin Görünürlüğü', 'Öncelikli'),
(28, 3, 'Özel Tasarım', 'Var'),
(29, 3, '7/24 Destek', 'Var'),
(30, 3, 'SEO Optimizasyonu', 'Var'),
(31, 3, 'İstatistik Raporları', 'Var');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `referanslar`
--

CREATE TABLE `referanslar` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL COMMENT 'Bu referansın sahibi olan firma',
  `tip` varchar(50) NOT NULL COMMENT 'Bana Verilen, Benim Verdiğim, Gönderilen Talep, Gelen Talep',
  `ilgili_firma_id` int(11) DEFAULT NULL COMMENT 'Referansı veren/alan/istenen/talep eden firma ID',
  `ilgili_firma_adi` varchar(255) NOT NULL COMMENT 'Referansı veren/alan/istenen/talep eden firma adı',
  `referans_mesaji` text DEFAULT NULL,
  `durum` varchar(50) DEFAULT NULL COMMENT 'Onaylandı, Beklemede, Reddedildi',
  `talep_tarihi` datetime DEFAULT NULL,
  `islem_tarihi` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `referanslar`
--

INSERT INTO `referanslar` (`id`, `firma_id`, `tip`, `ilgili_firma_id`, `ilgili_firma_adi`, `referans_mesaji`, `durum`, `talep_tarihi`, `islem_tarihi`) VALUES
(42, 21, 'talep', 22, 'KRK EĞİTİM A.Ş', 'TEST2', 'onaylandi', '2025-06-14 16:09:34', '2025-06-14 16:09:59');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `referanslar_ayarlar`
--

CREATE TABLE `referanslar_ayarlar` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `baslik` varchar(255) DEFAULT NULL,
  `metin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `referanslar_ayarlar`
--

INSERT INTO `referanslar_ayarlar` (`id`, `firma_id`, `baslik`, `metin`) VALUES
(1, 1, 'Referanslarımız', 'Ayyıldız olarak iş ortaklarımızla kurduğumuz güvenilir ilişkilerle sektörde fark yaratıyoruz. İşte referanslarımız:'),
(10, 20, 'Referanslarımız', NULL),
(11, 21, 'Referanslarımız2', 'Test'),
(12, 22, 'Referanslarımız', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `resim_galerisi`
--

CREATE TABLE `resim_galerisi` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `resim_url` varchar(2048) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `resim_galerisi`
--

INSERT INTO `resim_galerisi` (`id`, `firma_id`, `resim_url`) VALUES
(1, 1, '/images/videobaslik.png'),
(7, 20, 'https://cdn.api.heda.tr/files/682afe368d47b-1747648054.jpg');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `resim_galerisi_ayarlar`
--

CREATE TABLE `resim_galerisi_ayarlar` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `baslik` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `resim_galerisi_ayarlar`
--

INSERT INTO `resim_galerisi_ayarlar` (`id`, `firma_id`, `baslik`) VALUES
(1, 1, 'Bize Katılmak İstermisiniz'),
(9, 20, 'Resim Galerimiz'),
(10, 21, 'Resim Galerimiz2'),
(11, 22, 'Resim Galerimiz');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `resmi_bilgiler`
--

CREATE TABLE `resmi_bilgiler` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `faaliyet_alani` text DEFAULT NULL,
  `faaliyet_durumu` tinyint(1) DEFAULT NULL,
  `vergi_dairesi_adi` varchar(100) DEFAULT NULL,
  `mersis_no` varchar(20) DEFAULT NULL,
  `e_fatura_kullanimi` tinyint(1) DEFAULT NULL,
  `e_arsiv_kullanimi` tinyint(1) DEFAULT NULL,
  `e_irsaliye_kullanimi` tinyint(1) DEFAULT NULL,
  `e_defter_kullanimi` tinyint(1) DEFAULT NULL,
  `fax_numarasi` varchar(20) DEFAULT NULL,
  `banka_iban` varchar(34) DEFAULT NULL,
  `banka_adi` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `resmi_bilgiler`
--

INSERT INTO `resmi_bilgiler` (`id`, `firma_id`, `faaliyet_alani`, `faaliyet_durumu`, `vergi_dairesi_adi`, `mersis_no`, `e_fatura_kullanimi`, `e_arsiv_kullanimi`, `e_irsaliye_kullanimi`, `e_defter_kullanimi`, `fax_numarasi`, `banka_iban`, `banka_adi`) VALUES
(1, 1, 'Tünel Ekipmanları İmalatı ve Mühendislik Hizmetleri', 1, 'Ümraniye Vergi Dairesi', '0123456789000015', 1, 1, 1, 1, '+90 216 555 67 90', 'TR12 0001 2345 6789 0123 4567 89', 'Türkiye İş Bankası'),
(12, 20, NULL, 1, NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL),
(13, 21, NULL, 1, '', '0123456789000017', 1, 1, 1, 1, '', '', ''),
(14, 22, NULL, 1, NULL, '4124124214', 0, 1, 1, 0, NULL, 'TR222', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `subeler`
--

CREATE TABLE `subeler` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `kapak_resmi_url` varchar(2048) DEFAULT NULL,
  `sube_adi` varchar(255) NOT NULL,
  `sube_adresi` text DEFAULT NULL,
  `mail_adresi` varchar(255) DEFAULT NULL,
  `telefon_numarasi` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `subeler`
--

INSERT INTO `subeler` (`id`, `firma_id`, `kapak_resmi_url`, `sube_adi`, `sube_adresi`, `mail_adresi`, `telefon_numarasi`) VALUES
(1, 1, '/images/icons/firma-profil/icons/sube-resim.svg', 'İstanbul Merkez', 'Atatürk Mah. Turgut Özal Cad. No: 123 Ümraniye/İstanbul', 'istanbul@ayyildiz.com.tr', '+90 216 555 67 89'),
(2, 1, '/images/icons/firma-profil/icons/sube-resim.svg', 'Ankara Şube', 'Çankaya Cad. No: 45 Kızılay/Ankara', 'ankara@ayyildiz.com.tr', '+90 312 555 67 89'),
(15, 20, '/images/default-branch.png', 'Merkez Şube2', '-', '-', '-'),
(16, 21, 'https://cdn.api.heda.tr/files/683de05e209f1-1748885598.png', 'TEST', '124124', '-', '-'),
(17, 22, '/images/default-branch.png', 'Merkez Şube', '-', '-', '-');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `subeler_ayarlar`
--

CREATE TABLE `subeler_ayarlar` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `baslik` varchar(255) DEFAULT NULL,
  `metin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `subeler_ayarlar`
--

INSERT INTO `subeler_ayarlar` (`id`, `firma_id`, `baslik`, `metin`) VALUES
(1, 1, 'Şubelerimiz Başlık', 'Şubelerimiz Metin'),
(3, 21, 'Şubelerimiz', 'test');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `urunler`
--

CREATE TABLE `urunler` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `belge_adi` varchar(255) NOT NULL,
  `gecerlilik_baslangic` date DEFAULT NULL,
  `gecerlilik_bitis` date DEFAULT NULL,
  `acilis_katalogu` tinyint(1) DEFAULT 0,
  `pdf_url` varchar(2048) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `urunler`
--

INSERT INTO `urunler` (`id`, `firma_id`, `belge_adi`, `gecerlilik_baslangic`, `gecerlilik_bitis`, `acilis_katalogu`, `pdf_url`) VALUES
(7, 21, 'TEST', '2025-05-27', '2025-06-27', 1, 'https://cdn.api.heda.tr/files/683ddbd47562f-1748884436.pdf');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `urun_hizmetler_ayarlar`
--

CREATE TABLE `urun_hizmetler_ayarlar` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `baslik` varchar(255) DEFAULT NULL,
  `metin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `urun_hizmetler_ayarlar`
--

INSERT INTO `urun_hizmetler_ayarlar` (`id`, `firma_id`, `baslik`, `metin`) VALUES
(1, 1, 'Ürün & Hizmetlerimiz', 'Ayyıldız olarak, tünel ekipmanları konusunda geniş bir ürün yelpazesi sunmaktayız. Müşterilerimizin ihtiyaçlarına uygun çözümler üretiyoruz.'),
(10, 20, 'Ürün & Hizmetlerimiz', '-'),
(11, 21, 'Ürün & Hizmetlerimiz', 'TRest'),
(12, 22, 'Ürün & Hizmetlerimiz', '-');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `kvkk_onayi` tinyint(1) DEFAULT 0,
  `kayit_tarihi` datetime DEFAULT current_timestamp(),
  `aktif` tinyint(1) DEFAULT 1,
  `yetkili_kisi_id` int(11) DEFAULT NULL,
  `firma_id` int(11) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `kvkk_onayi`, `kayit_tarihi`, `aktif`, `yetkili_kisi_id`, `firma_id`, `admin`) VALUES
(1, 'ali.atalan@ayyildiz.com.tr', '$2b$10$examplehashplaceholder12345', 1, '2023-09-15 10:30:45', 1, NULL, NULL, 0),
(13, 'kurkayayazilim@gmail.com', '$2b$10$oHZYrmWigr.hWtwg75rymuMOE.R/9SrDPEFvWmNEbSJxfws68pZYC', 1, '2025-04-21 19:23:55', 1, NULL, NULL, 1),
(19, 'salih@gmail.com', '$2b$10$yXPBfhd1F6vNU87/z2bHPOkNoV5jGJATBBqjJtx38MoDTAoPK/vxy', 1, '2025-05-18 09:45:35', 1, NULL, NULL, 0),
(21, 'test@gmail.com', '$2b$10$1Ee/e.vE7I6lR.fbIFp5GOBpGvyMIZdiboiTE5UvB96pHpHBZvavi', 1, '2025-05-19 12:37:50', 1, 24, NULL, 1),
(22, 'onurkurkaya@gmail.com', '$2b$10$qLw3RoSZlUeoJSgfnGg54O2vCevMTSTMKwwft4fVcQFCxj5lKtela', 1, '2025-06-13 22:59:37', 1, 26, NULL, 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `video_galerisi`
--

CREATE TABLE `video_galerisi` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `video_url` varchar(2048) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `video_galerisi`
--

INSERT INTO `video_galerisi` (`id`, `firma_id`, `video_url`) VALUES
(1, 1, '/video.mp4');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `video_galerisi_ayarlar`
--

CREATE TABLE `video_galerisi_ayarlar` (
  `id` int(11) NOT NULL,
  `firma_id` int(11) NOT NULL,
  `baslik` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `video_galerisi_ayarlar`
--

INSERT INTO `video_galerisi_ayarlar` (`id`, `firma_id`, `baslik`) VALUES
(1, 1, 'Videolarımız'),
(9, 20, 'Video Galerimiz'),
(10, 21, 'Video Galerimiz'),
(11, 22, 'Video Galerimiz');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `yetkili_kisiler`
--

CREATE TABLE `yetkili_kisiler` (
  `id` int(11) NOT NULL,
  `ad` varchar(100) NOT NULL,
  `soyad` varchar(100) NOT NULL,
  `tc_kimlik_no` varchar(11) DEFAULT NULL,
  `telefon_no` varchar(20) DEFAULT NULL,
  `telefon_dogrulandi` tinyint(1) DEFAULT 0,
  `dogrulama_tarihi` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `firma_id` int(11) DEFAULT NULL,
  `bireysel` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `yetkili_kisiler`
--

INSERT INTO `yetkili_kisiler` (`id`, `ad`, `soyad`, `tc_kimlik_no`, `telefon_no`, `telefon_dogrulandi`, `dogrulama_tarihi`, `user_id`, `firma_id`, `bireysel`) VALUES
(24, 'Onur', 'Kürkaya', '10228074240', '905437130857', 0, NULL, 21, 21, 0),
(26, 'Onur', 'Kürkaya', '38409026406', '905411961830', 0, NULL, 22, 22, 0);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `bildirimler`
--
ALTER TABLE `bildirimler`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `calisma_saatleri`
--
ALTER TABLE `calisma_saatleri`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sube_id` (`sube_id`,`gun`);

--
-- Tablo için indeksler `destek_mesajlari`
--
ALTER TABLE `destek_mesajlari`
  ADD PRIMARY KEY (`id`),
  ADD KEY `destek_talebi_id` (`destek_talebi_id`);

--
-- Tablo için indeksler `destek_talepleri`
--
ALTER TABLE `destek_talepleri`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_number` (`ticket_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `faaliyet_alanlari`
--
ALTER TABLE `faaliyet_alanlari`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `favoriler`
--
ALTER TABLE `favoriler`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `firmalar`
--
ALTER TABLE `firmalar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vergi_kimlik_no` (`vergi_kimlik_no`),
  ADD UNIQUE KEY `kep_adresi` (`kep_adresi`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `aktif_paket_id` (`aktif_paket_id`);

--
-- Tablo için indeksler `firma_paket_gecmisi`
--
ALTER TABLE `firma_paket_gecmisi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`),
  ADD KEY `paket_id` (`paket_id`);

--
-- Tablo için indeksler `hakkimizda`
--
ALTER TABLE `hakkimizda`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `is_kariyer_ayarlar`
--
ALTER TABLE `is_kariyer_ayarlar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `is_kariyer_sorular`
--
ALTER TABLE `is_kariyer_sorular`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `kalite_belgeleri`
--
ALTER TABLE `kalite_belgeleri`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `kalite_belgeleri_ayarlar`
--
ALTER TABLE `kalite_belgeleri_ayarlar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `kampanyalar`
--
ALTER TABLE `kampanyalar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `kampanyalar_ayarlar`
--
ALTER TABLE `kampanyalar_ayarlar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `paketler`
--
ALTER TABLE `paketler`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `paket_ozellikleri`
--
ALTER TABLE `paket_ozellikleri`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paket_id` (`paket_id`);

--
-- Tablo için indeksler `referanslar`
--
ALTER TABLE `referanslar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `referanslar_ayarlar`
--
ALTER TABLE `referanslar_ayarlar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `resim_galerisi`
--
ALTER TABLE `resim_galerisi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `resim_galerisi_ayarlar`
--
ALTER TABLE `resim_galerisi_ayarlar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `resmi_bilgiler`
--
ALTER TABLE `resmi_bilgiler`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firma_id` (`firma_id`),
  ADD UNIQUE KEY `mersis_no` (`mersis_no`);

--
-- Tablo için indeksler `subeler`
--
ALTER TABLE `subeler`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `subeler_ayarlar`
--
ALTER TABLE `subeler_ayarlar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `urunler`
--
ALTER TABLE `urunler`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `urun_hizmetler_ayarlar`
--
ALTER TABLE `urun_hizmetler_ayarlar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `yetkili_kisi_id` (`yetkili_kisi_id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `video_galerisi`
--
ALTER TABLE `video_galerisi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `video_galerisi_ayarlar`
--
ALTER TABLE `video_galerisi_ayarlar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `firma_id` (`firma_id`);

--
-- Tablo için indeksler `yetkili_kisiler`
--
ALTER TABLE `yetkili_kisiler`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tc_kimlik_no` (`tc_kimlik_no`),
  ADD UNIQUE KEY `telefon_no` (`telefon_no`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `firma_id` (`firma_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `bildirimler`
--
ALTER TABLE `bildirimler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Tablo için AUTO_INCREMENT değeri `calisma_saatleri`
--
ALTER TABLE `calisma_saatleri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- Tablo için AUTO_INCREMENT değeri `destek_mesajlari`
--
ALTER TABLE `destek_mesajlari`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `destek_talepleri`
--
ALTER TABLE `destek_talepleri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `faaliyet_alanlari`
--
ALTER TABLE `faaliyet_alanlari`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Tablo için AUTO_INCREMENT değeri `favoriler`
--
ALTER TABLE `favoriler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Tablo için AUTO_INCREMENT değeri `firmalar`
--
ALTER TABLE `firmalar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Tablo için AUTO_INCREMENT değeri `firma_paket_gecmisi`
--
ALTER TABLE `firma_paket_gecmisi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Tablo için AUTO_INCREMENT değeri `hakkimizda`
--
ALTER TABLE `hakkimizda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `is_kariyer_ayarlar`
--
ALTER TABLE `is_kariyer_ayarlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `is_kariyer_sorular`
--
ALTER TABLE `is_kariyer_sorular`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Tablo için AUTO_INCREMENT değeri `kalite_belgeleri`
--
ALTER TABLE `kalite_belgeleri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `kalite_belgeleri_ayarlar`
--
ALTER TABLE `kalite_belgeleri_ayarlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `kampanyalar`
--
ALTER TABLE `kampanyalar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `kampanyalar_ayarlar`
--
ALTER TABLE `kampanyalar_ayarlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `paketler`
--
ALTER TABLE `paketler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `paket_ozellikleri`
--
ALTER TABLE `paket_ozellikleri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Tablo için AUTO_INCREMENT değeri `referanslar`
--
ALTER TABLE `referanslar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Tablo için AUTO_INCREMENT değeri `referanslar_ayarlar`
--
ALTER TABLE `referanslar_ayarlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `resim_galerisi`
--
ALTER TABLE `resim_galerisi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `resim_galerisi_ayarlar`
--
ALTER TABLE `resim_galerisi_ayarlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Tablo için AUTO_INCREMENT değeri `resmi_bilgiler`
--
ALTER TABLE `resmi_bilgiler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `subeler`
--
ALTER TABLE `subeler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Tablo için AUTO_INCREMENT değeri `subeler_ayarlar`
--
ALTER TABLE `subeler_ayarlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `urunler`
--
ALTER TABLE `urunler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `urun_hizmetler_ayarlar`
--
ALTER TABLE `urun_hizmetler_ayarlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Tablo için AUTO_INCREMENT değeri `video_galerisi`
--
ALTER TABLE `video_galerisi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `video_galerisi_ayarlar`
--
ALTER TABLE `video_galerisi_ayarlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Tablo için AUTO_INCREMENT değeri `yetkili_kisiler`
--
ALTER TABLE `yetkili_kisiler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `bildirimler`
--
ALTER TABLE `bildirimler`
  ADD CONSTRAINT `bildirimler_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `calisma_saatleri`
--
ALTER TABLE `calisma_saatleri`
  ADD CONSTRAINT `calisma_saatleri_ibfk_1` FOREIGN KEY (`sube_id`) REFERENCES `subeler` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `destek_mesajlari`
--
ALTER TABLE `destek_mesajlari`
  ADD CONSTRAINT `destek_mesajlari_ibfk_1` FOREIGN KEY (`destek_talebi_id`) REFERENCES `destek_talepleri` (`id`);

--
-- Tablo kısıtlamaları `destek_talepleri`
--
ALTER TABLE `destek_talepleri`
  ADD CONSTRAINT `destek_talepleri_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Tablo kısıtlamaları `faaliyet_alanlari`
--
ALTER TABLE `faaliyet_alanlari`
  ADD CONSTRAINT `faaliyet_alanlari_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `favoriler`
--
ALTER TABLE `favoriler`
  ADD CONSTRAINT `favoriler_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `favoriler_ibfk_2` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`);

--
-- Tablo kısıtlamaları `firmalar`
--
ALTER TABLE `firmalar`
  ADD CONSTRAINT `firmalar_ibfk_1` FOREIGN KEY (`aktif_paket_id`) REFERENCES `paketler` (`id`);

--
-- Tablo kısıtlamaları `firma_paket_gecmisi`
--
ALTER TABLE `firma_paket_gecmisi`
  ADD CONSTRAINT `firma_paket_gecmisi_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `firma_paket_gecmisi_ibfk_2` FOREIGN KEY (`paket_id`) REFERENCES `paketler` (`id`);

--
-- Tablo kısıtlamaları `hakkimizda`
--
ALTER TABLE `hakkimizda`
  ADD CONSTRAINT `hakkimizda_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `is_kariyer_ayarlar`
--
ALTER TABLE `is_kariyer_ayarlar`
  ADD CONSTRAINT `is_kariyer_ayarlar_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `is_kariyer_sorular`
--
ALTER TABLE `is_kariyer_sorular`
  ADD CONSTRAINT `is_kariyer_sorular_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `kalite_belgeleri`
--
ALTER TABLE `kalite_belgeleri`
  ADD CONSTRAINT `kalite_belgeleri_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `kalite_belgeleri_ayarlar`
--
ALTER TABLE `kalite_belgeleri_ayarlar`
  ADD CONSTRAINT `kalite_belgeleri_ayarlar_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `kampanyalar`
--
ALTER TABLE `kampanyalar`
  ADD CONSTRAINT `kampanyalar_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `kampanyalar_ayarlar`
--
ALTER TABLE `kampanyalar_ayarlar`
  ADD CONSTRAINT `kampanyalar_ayarlar_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `paket_ozellikleri`
--
ALTER TABLE `paket_ozellikleri`
  ADD CONSTRAINT `paket_ozellikleri_ibfk_1` FOREIGN KEY (`paket_id`) REFERENCES `paketler` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `referanslar`
--
ALTER TABLE `referanslar`
  ADD CONSTRAINT `referanslar_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `referanslar_ayarlar`
--
ALTER TABLE `referanslar_ayarlar`
  ADD CONSTRAINT `referanslar_ayarlar_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `resim_galerisi`
--
ALTER TABLE `resim_galerisi`
  ADD CONSTRAINT `resim_galerisi_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `resim_galerisi_ayarlar`
--
ALTER TABLE `resim_galerisi_ayarlar`
  ADD CONSTRAINT `resim_galerisi_ayarlar_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `resmi_bilgiler`
--
ALTER TABLE `resmi_bilgiler`
  ADD CONSTRAINT `resmi_bilgiler_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `subeler`
--
ALTER TABLE `subeler`
  ADD CONSTRAINT `subeler_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `subeler_ayarlar`
--
ALTER TABLE `subeler_ayarlar`
  ADD CONSTRAINT `subeler_ayarlar_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `urunler`
--
ALTER TABLE `urunler`
  ADD CONSTRAINT `urunler_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `urun_hizmetler_ayarlar`
--
ALTER TABLE `urun_hizmetler_ayarlar`
  ADD CONSTRAINT `urun_hizmetler_ayarlar_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`yetkili_kisi_id`) REFERENCES `yetkili_kisiler` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `video_galerisi`
--
ALTER TABLE `video_galerisi`
  ADD CONSTRAINT `video_galerisi_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `video_galerisi_ayarlar`
--
ALTER TABLE `video_galerisi_ayarlar`
  ADD CONSTRAINT `video_galerisi_ayarlar_ibfk_1` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `yetkili_kisiler`
--
ALTER TABLE `yetkili_kisiler`
  ADD CONSTRAINT `yetkili_kisiler_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `yetkili_kisiler_ibfk_2` FOREIGN KEY (`firma_id`) REFERENCES `firmalar` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
