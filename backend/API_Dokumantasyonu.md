# Firma Kutusu API Dokümantasyonu

## Temel Bilgiler

- Base URL: `http://localhost:3000/api`
- Tüm endpoint'ler için `Content-Type: application/json` header'ı gereklidir
- Yetkilendirme gerektiren endpoint'ler için `Authorization` header'ı gereklidir

## İçindekiler

1. [Kimlik Doğrulama](#kimlik-doğrulama)
2. [Doğrulama](#doğrulama)
3. [Firma](#firma)
4. [Hakkımızda](#hakkımızda)
5. [Faaliyet](#faaliyet)
6. [Kalite Belgeleri](#kalite-belgeleri)
7. [Kampanyalar](#kampanyalar)
8. [Resim Galerisi](#resim-galerisi)
9. [Video Galerisi](#video-galerisi)
10. [Resmi Bilgiler](#resmi-bilgiler)
11. [Şubeler](#şubeler)
12. [Şubeler Ayarlar](#şubeler-ayarlar)
13. [Çalışma Saatleri](#çalışma-saatleri)
14. [İş Kariyer](#iş-kariyer)
15. [Ürün Hizmetler](#ürün-hizmetler)
16. [Referanslar](#referanslar)

## Kimlik Doğrulama

### Giriş Yap

```http
POST /auth/login
```

**Request Body**

```json
{
  "email": "ornek@firma.com",
  "sifre": "123456"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "ornek@firma.com",
      "firma_id": 123
    }
  }
}
```

## Doğrulama

### E-posta Doğrulama

```http
POST /dogrulama/email
```

**Request Body**

```json
{
  "email": "ornek@firma.com"
}
```

## Firma

### Firma Bilgilerini Getir

```http
GET /firma/:id
```

### Firma Güncelle

```http
PUT /firma/:id
```

## Hakkımızda

### Hakkımızda Bilgilerini Getir

```http
GET /firma/hakkimizda/:firmaId
```

### Hakkımızda Güncelle

```http
PUT /firma/hakkimizda
```

## Faaliyet

### Faaliyet Bilgilerini Getir

```http
GET /firma/faaliyet/:firmaId
```

### Faaliyet Güncelle

```http
PUT /firma/faaliyet
```

## Kalite Belgeleri

### Belgeleri Listele

```http
GET /firma/kalite-belgeleri/:firmaId
```

### Belge Ekle

```http
POST /firma/kalite-belgeleri
```

**Request Body**

```json
{
  "belge_adi": "ISO 9001",
  "belge_no": "12345",
  "verilis_tarihi": "2024-01-01",
  "gecerlilik_tarihi": "2025-01-01",
  "belge_url": "https://..."
}
```

## Kampanyalar

### Kampanyaları Listele

```http
GET /firma/kampanyalar/:firmaId
```

### Kampanya Oluştur

```http
POST /firma/kampanyalar
```

**Request Body**

```json
{
  "kapak_resmi_url": "https://...",
  "aciklama": "Kampanya açıklaması...",
  "baslangic_tarihi": "2024-03-20",
  "bitis_tarihi": "2024-04-20",
  "acilis_katalogu": true,
  "katalog_pdf_url": "https://...",
  "aktif": true
}
```

## Resim Galerisi

### Resimleri Listele

```http
GET /firma/resim-galerisi/:firmaId
```

### Resim Ekle

```http
POST /firma/resim-galerisi
```

**Request Body**

```json
{
  "resim_url": "https://...",
  "baslik": "Galeri Resmi",
  "aciklama": "Resim açıklaması..."
}
```

## Video Galerisi

### Videoları Listele

```http
GET /firma/video-galerisi/:firmaId
```

### Video Ekle

```http
POST /firma/video-galerisi
```

**Request Body**

```json
{
  "video_url": "https://...",
  "baslik": "Video Başlığı",
  "aciklama": "Video açıklaması..."
}
```

## Resmi Bilgiler

### Resmi Bilgileri Getir

```http
GET /firma/resmi-bilgiler/:firmaId
```

### Resmi Bilgileri Güncelle

```http
PUT /firma/resmi-bilgiler
```

## Şubeler

### Şubeleri Listele

```http
GET /firma/subeler/:firmaId
```

### Şube Ekle

```http
POST /firma/subeler
```

**Request Body**

```json
{
  "sube_adi": "Merkez Şube",
  "adres": "Örnek Mah. Örnek Cad. No:1",
  "telefon": "0212 123 45 67",
  "email": "merkez@firma.com",
  "harita_url": "https://..."
}
```

## Şubeler Ayarlar

### Ayarları Getir

```http
GET /firma/subeler-ayarlar/:firmaId
```

### Ayarları Güncelle

```http
PUT /firma/subeler-ayarlar
```

## Çalışma Saatleri

### Çalışma Saatlerini Getir

```http
GET /firma/calisma-saatleri/:firmaId
```

### Çalışma Saatlerini Güncelle

```http
PUT /firma/calisma-saatleri
```

## İş Kariyer

### İlanları Listele

```http
GET /firma/is-kariyer/:firmaId
```

### İlan Oluştur

```http
POST /firma/is-kariyer
```

**Request Body**

```json
{
  "pozisyon": "Yazılım Geliştirici",
  "departman": "Yazılım",
  "is_tanimi": "İş tanımı...",
  "nitelikler": "Nitelikler...",
  "calisma_sekli": "Tam Zamanlı",
  "egitim_seviyesi": "Üniversite",
  "tecrube": "2-5 yıl",
  "aktif": true
}
```

## Ürün Hizmetler

### Ürün/Hizmetleri Listele

```http
GET /firma/urun-hizmetler/:firmaId
```

### Ürün/Hizmet Ekle

```http
POST /firma/urun-hizmetler
```

**Request Body**

```json
{
  "kategori": "Ürün",
  "baslik": "Örnek Ürün",
  "aciklama": "Ürün açıklaması...",
  "fiyat": 1000,
  "birim": "TL",
  "resim_url": "https://..."
}
```

## Referanslar

### Referansları Listele

```http
GET /firma/referanslar/:firmaId
```

### Referans Oluştur

```http
POST /firma/referanslar
```

**Request Body**

```json
{
  "tip": "Bana Verilen",
  "ilgili_firma_vergi_no": "1234567890",
  "referans_mesaji": "Referans mesajı...",
  "durum": "beklemede"
}
```

## Ortak Response Formatları

### Başarılı Response

```json
{
  "success": true,
  "data": { ... },
  "message": "İşlem başarılı"
}
```

### Hata Response

```json
{
  "success": false,
  "error": "Hata mesajı"
}
```

## HTTP Durum Kodları

- 200: Başarılı
- 201: Oluşturuldu
- 400: Hatalı İstek
- 401: Yetkisiz
- 404: Bulunamadı
- 500: Sunucu Hatası

## Frontend Entegrasyon Örnekleri

### Axios ile İstek Örneği

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Token ekleme
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Örnek kullanım
const getFirmaBilgileri = async (firmaId) => {
  try {
    const response = await api.get(`/firma/${firmaId}`);
    return response.data;
  } catch (error) {
    console.error("Hata:", error.response.data);
    throw error;
  }
};
```

### Fetch ile İstek Örneği

```javascript
const fetchData = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(`http://localhost:3000/api${url}`, {
      ...defaultOptions,
      ...options,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Hata:", error);
    throw error;
  }
};
```

## Önemli Notlar

1. Tüm POST ve PUT istekleri için yetkilendirme gereklidir
2. Dosya yüklemeleri için multipart/form-data kullanılmalıdır
3. Tarih alanları ISO formatında gönderilmelidir
4. Hata durumlarında uygun hata mesajları döner
5. Rate limiting uygulanmıştır (dakikada 100 istek)
