import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuş
      localStorage.removeItem("token");
      window.location.href = "/hesap/giris-kayit";
    }
    return Promise.reject(error);
  }
);

// Auth servisleri
export const authService = {
  me: () => api.get("/auth/me"),
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  logout: () => {
    localStorage.removeItem("token");
  },
  // Şifre sıfırlama servisleri
  sendResetCode: (phoneNumber) =>
    api.post("/auth/send-reset-code", { phoneNumber }),
  verifyResetCode: (phoneNumber, code) =>
    api.post("/auth/verify-reset-code", { phoneNumber, code }),
  resetPassword: (phoneNumber, code, newPassword) =>
    api.post("/auth/reset-password", { phoneNumber, code, newPassword }),
};

// Firma servisleri
export const firmaService = {
  // Temel firma bilgileri
  getFirma: () => api.get(`/firma`),
  getFirmaById: (firmaId) => api.get(`/firma/${firmaId}`),
  updateFirma: (data) => api.put(`/firma`, data),

  // Resmi bilgiler
  getResmiBilgiler: (firmaId) => api.get(`/firma/resmi-bilgiler/${firmaId}`),
  updateResmiBilgiler: (data) => api.put(`/firma/resmi-bilgiler`, data),

  // Faaliyet alanları
  getFaaliyetAlanlari: (firmaId) => api.get(`/firma/faaliyet/${firmaId}`),
  createFaaliyetAlani: (data) => api.post(`/firma/faaliyet`, data),
  updateFaaliyetAlani: (id, data) => api.put(`/firma/faaliyet/${id}`, data),
  deleteFaaliyetAlani: (id) => api.delete(`/firma/faaliyet/${id}`),

  // Diğer firma bilgileri
  getHakkimizda: (firmaId) => api.get(`/firma/hakkimizda/${firmaId}`),
  getUrunHizmetAyarlari: (firmaId) =>
    api.get(`/firma/urun-hizmetler/${firmaId}/ayarlar`),
  getSubeler: (firmaId) => api.get(`/firma/subeler/${firmaId}`),
  getSubeById: (id) => api.get(`/firma/subeler/sube/${id}`),
  getKaliteBelgeleri: (firmaId) =>
    api.get(`/firma/kalite-belgeleri/${firmaId}`),
  getKaliteBelgeleriAyarlar: (firmaId) =>
    api.get(`/firma/kalite-belgeleri/ayarlar/${firmaId}`),
  getReferanslar: (firmaId) => api.get(`/firma/referanslar/${firmaId}`),
  getGelenReferanslar: (firmaId) =>
    api.get(`/firma/referanslar/gelen/${firmaId}`),
  getReferanslarAyarlar: (firmaId) =>
    api.get(`/firma/referanslar/ayarlar/${firmaId}`),
  getKampanyalar: (firmaId) => api.get(`/firma/kampanyalar/${firmaId}`),
  getResimGalerisi: (firmaId) => api.get(`/firma/resim-galerisi/${firmaId}`),
  getVideoGalerisi: (firmaId) => api.get(`/firma/video-galerisi/${firmaId}`),
  getIsKariyer: (firmaId) => api.get(`/firma/is-kariyer/${firmaId}`),

  // Hakkımızda servisleri
  updateHakkimizda: (data) => api.put(`/firma/hakkimizda`, data),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post("https://cdn.api.heda.tr/index.php", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Ürün ve Hizmetler servisleri
  getUrunler: (firmaId) => api.get(`/firma/urun-hizmetler/${firmaId}/urunler`),
  createUrun: (data) => api.post(`/firma/urun-hizmetler/urunler`, data),
  updateUrun: (id, data) =>
    api.put(`/firma/urun-hizmetler/urunler/${id}`, data),
  deleteUrun: (id) => api.delete(`/firma/urun-hizmetler/urunler/${id}`),
  updateUrunHizmetAyarlari: (data) =>
    api.put(`/firma/urun-hizmetler/ayarlar`, data),
  uploadKatalog: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post("https://cdn.api.heda.tr/index.php", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Şubeler servisleri
  getSubeler: (firmaId) => api.get(`/firma/subeler/${firmaId}`),
  getSubeById: (id) => api.get(`/firma/subeler/sube/${id}`),
  createSube: (data) => api.post(`/firma/subeler`, data),
  updateSube: (id, data) => api.put(`/firma/subeler/${id}`, data),
  deleteSube: (id) => api.delete(`/firma/subeler/${id}`),
  getCalismaSaatleri: (subeId) => api.get(`/firma/calisma-saatleri/${subeId}`),

  // Şube ayarları servisleri
  getSubelerAyarlar: (firmaId) => api.get(`/firma/subeler-ayarlar/${firmaId}`),
  createSubelerAyarlar: (data) => api.post(`/firma/subeler-ayarlar`, data),
  updateSubelerAyarlar: (data) => api.put(`/firma/subeler-ayarlar`, data),

  // Kalite belgeleri servisleri
  createKaliteBelgesi: (data) => api.post(`/firma/kalite-belgeleri`, data),
  updateKaliteBelgesi: (id, data) =>
    api.put(`/firma/kalite-belgeleri/${id}`, data),
  deleteKaliteBelgesi: (id) => api.delete(`/firma/kalite-belgeleri/${id}`),
  updateKaliteBelgeleriAyarlar: (data) =>
    api.put(`/firma/kalite-belgeleri/guncelle/ayarlar`, data),

  // Kampanya servisleri
  getKampanyalarAyarlar: (firmaId) =>
    api.get(`/firma/kampanyalar/ayarlar/${firmaId}`),
  createKampanya: (data) => api.post(`/firma/kampanyalar`, data),
  updateKampanya: (id, data) => api.put(`/firma/kampanyalar/${id}`, data),
  deleteKampanya: (id) => api.delete(`/firma/kampanyalar/${id}`),
  updateKampanyalarAyarlar: (data) =>
    api.put(`/firma/kampanyalar/guncelle/ayarlar`, data),

  // Kariyer servisleri
  getIsKariyerAyarlar: (firmaId) =>
    api.get(`/firma/is-kariyer/ayarlar/${firmaId}`),
  getIsKariyerSorular: (firmaId) =>
    api.get(`/firma/is-kariyer/sorular/${firmaId}`),
  updateIsKariyerAyarlar: (data) => api.put(`/firma/is-kariyer/ayarlar`, data),
  updateIsKariyerSoru: (id, data) =>
    api.put(`/firma/is-kariyer/sorular/${id}`, data),
  createIsKariyerSoru: (data) => api.post(`/firma/is-kariyer/sorular`, data),
  deleteIsKariyerSoru: (id) => api.delete(`/firma/is-kariyer/sorular/${id}`),
  createIsKariyerBasvuru: (firmaId, data) =>
    api.post(`/firma/is-kariyer/basvuru/${firmaId}`, data),

  // Referans servisleri
  createReferans: (data) => api.post("/firma/referanslar", data),
  updateReferans: (id, data) => api.put(`/firma/referanslar/${id}`, data),
  updateReferanslarAyarlar: (data) =>
    api.put("/firma/referanslar/guncelle/ayarlar", data),
  getFirmaByVKN: (vkn) => api.get(`/firma/vkn/${vkn}`),

  // Resim Galerisi servisleri
  createResim: (data) => api.post(`/firma/resim-galerisi`, data),
  deleteResim: (resimId) => api.delete(`/firma/resim-galerisi/${resimId}`),
  updateResimGalerisiAyarlar: (data) =>
    api.put(`/firma/resim-galerisi/guncelle/ayarlar`, data),
  getResimGalerisiAyarlar: (firmaId) =>
    api.get(`/firma/resim-galerisi/ayarlar/${firmaId}`),

  // Video Galerisi servisleri
  getVideoGalerisiAyarlar: (firmaId) =>
    api.get(`/firma/video-galerisi/ayarlar/${firmaId}`),
  createVideo: (data) => api.post(`/firma/video-galerisi`, data),
  deleteVideo: (videoId) => api.delete(`/firma/video-galerisi/${videoId}`),
  updateVideoGalerisiAyarlar: (data) =>
    api.put(`/firma/video-galerisi/guncelle/ayarlar`, data),
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post("https://cdn.api.heda.tr/index.php", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Arama servisi
  searchFirmalar: (params) => {
    const queryParams = new URLSearchParams();
    if (params.sektor) queryParams.append("sektor", params.sektor);
    if (params.il) queryParams.append("il", params.il);
    if (params.ilce) queryParams.append("ilce", params.ilce);
    if (params.keyword) queryParams.append("keyword", params.keyword);

    return api.get(`/firma/search/query?${queryParams.toString()}`);
  },

  getVitrinFirmalar: () => api.get("/firma/vitrin/firmalar"),
};

// Bildirim servisleri
export const bildirimService = {
  getBildirimler: () => api.get("/bildirim"),
  markAsRead: (id) => api.put(`/bildirim/${id}/read`),
  deleteBildirim: (id) => api.delete(`/bildirim/${id}`),
};

export const favoriService = {
  getFavoriler: () => api.get("/favoriler"),
  addFavori: (firmaId) => api.post("/favoriler", { firmaId }),
  removeFavori: (firmaId) => api.delete("/favoriler", { data: { firmaId } }),
};

// Paket servisleri
export const paketService = {
  getAllPakets: () => api.get("/paket"),
  getPaketById: (id) => api.get(`/paket/${id}`),
  getFirmaPaketGecmisi: () => api.get("/paket/firma/gecmis"),
  satinAl: (data) => api.post("/paket/satin-al", data),
  updateOtomatikYenileme: (data) => api.put("/paket/otomatik-yenileme", data),
  updateKayitliKart: (data) => api.put("/paket/kayitli-kart", data),
};

export const faturaService = {
  getFaturalar: () => api.get("/fatura"),
  getFaturaById: (id) => api.get(`/fatura/${id}`),
};

export const savedCardService = {
  getSavedCards: () => api.get("/saved-cards"),
  addCard: (data) => api.post("/saved-cards", data),
  updateCard: (id, data) => api.put(`/saved-cards/${id}`, data),
  deleteCard: (id) => api.delete(`/saved-cards/${id}`),
  setDefaultCard: (id) => api.put(`/saved-cards/${id}/default`),
};

export default api;
