import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const UrunHizmetler = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    baslik: "",
    mesaj: "",
    kataloglar: [],
  });

  // Tarih formatını düzenleyen yardımcı fonksiyon
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user?.yetkiliKisi?.firma_id) {
        try {
          setInitialLoading(true);
          const ayarlarResponse = await firmaService.getUrunHizmetAyarlari(
            user.yetkiliKisi.firma_id
          );
          const urunlerResponse = await firmaService.getUrunler(
            user.yetkiliKisi.firma_id
          );

          const ayarlar = ayarlarResponse?.data || {};
          const urunler = urunlerResponse?.data || [];

          console.log(urunler, "urunler");

          setFormData({
            baslik: ayarlar.baslik || "",
            mesaj: ayarlar.metin || "",
            kataloglar: urunler.map((urun) => ({
              id: urun.id,
              belge_adi: urun.belge_adi || "",
              gecerlilik_baslangic: formatDateForInput(
                urun.gecerlilik_baslangic
              ),
              gecerlilik_bitis: formatDateForInput(urun.gecerlilik_bitis),
              acilis_katalogu: urun.acilis_katalogu || false,
              pdf_url: urun.pdf_url || "",
            })),
          });
        } catch (error) {
          console.error("Veri getirme hatası:", error);
          toast.error("Veriler alınırken bir hata oluştu");
          setFormData({
            baslik: "",
            mesaj: "",
            kataloglar: [],
          });
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchData();
  }, [user?.yetkiliKisi?.firma_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKatalogChange = (katalogId, field, value) => {
    if (field === "acilis_katalogu" && value) {
      setFormData((prev) => ({
        ...prev,
        kataloglar: prev.kataloglar.map((katalog) => ({
          ...katalog,
          acilis_katalogu: katalog.id === katalogId ? true : false,
        })),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        kataloglar: prev.kataloglar.map((katalog) =>
          katalog.id === katalogId ? { ...katalog, [field]: value } : katalog
        ),
      }));
    }
  };

  const handleFileUpload = async (katalogId, file) => {
    if (!file) return;

    try {
      setUploading(true);
      const response = await firmaService.uploadKatalog(file);
      const pdfUrl = response.data.url;

      setFormData((prev) => ({
        ...prev,
        kataloglar: prev.kataloglar.map((katalog) =>
          katalog.id === katalogId ? { ...katalog, pdf_url: pdfUrl } : katalog
        ),
      }));

      toast.success("Katalog başarıyla yüklendi");
    } catch (error) {
      console.error("Katalog yükleme hatası:", error);
      toast.error("Katalog yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteKatalog = async (katalogId) => {
    try {
      setLoading(true);
      await firmaService.deleteUrun(katalogId);

      setFormData((prev) => ({
        ...prev,
        kataloglar: prev.kataloglar.filter(
          (katalog) => katalog.id !== katalogId
        ),
      }));

      toast.success("Katalog başarıyla silindi");
    } catch (error) {
      console.error("Katalog silme hatası:", error);
      toast.error("Katalog silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await firmaService.updateUrunHizmetAyarlari({
        baslik: formData.baslik,
        metin: formData.mesaj,
      });

      const updatedKataloglar = [];
      for (const katalog of formData.kataloglar) {
        // Tarihleri ISO formatına dönüştür
        const formattedKatalog = {
          ...katalog,
          gecerlilik_baslangic: katalog.gecerlilik_baslangic
            ? new Date(katalog.gecerlilik_baslangic).toISOString()
            : null,
          gecerlilik_bitis: katalog.gecerlilik_bitis
            ? new Date(katalog.gecerlilik_bitis).toISOString()
            : null,
        };

        if (katalog.isNew) {
          const response = await firmaService.createUrun({
            ...formattedKatalog,
            firma_id: user.yetkiliKisi.firma_id,
          });

          updatedKataloglar.push({
            ...response.data.data,
            gecerlilik_baslangic: formatDateForInput(
              response.data.data.gecerlilik_baslangic
            ),
            gecerlilik_bitis: formatDateForInput(
              response.data.data.gecerlilik_bitis
            ),
            isNew: false,
          });
        } else if (katalog.id) {
          await firmaService.updateUrun(katalog.id, formattedKatalog);
          updatedKataloglar.push({
            ...katalog,
            gecerlilik_baslangic: formatDateForInput(
              katalog.gecerlilik_baslangic
            ),
            gecerlilik_bitis: formatDateForInput(katalog.gecerlilik_bitis),
          });
        }
      }

      setFormData((prev) => ({
        ...prev,
        kataloglar: updatedKataloglar,
      }));

      toast.success("Değişiklikler başarıyla kaydedildi");
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      toast.error("Değişiklikler kaydedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewKatalog = () => {
    setFormData((prev) => ({
      ...prev,
      kataloglar: [
        ...prev.kataloglar,
        {
          id: null,
          isNew: true,
          belge_adi: "",
          gecerlilik_baslangic: "",
          gecerlilik_bitis: "",
          acilis_katalogu: false,
          pdf_url: "",
        },
      ],
    }));
  };

  const handlePdfView = (pdfUrl) => {
    if (pdfUrl) {
      // Yeni sekmede PDF'i aç
      window.open(pdfUrl, "_blank");
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#1C5540] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      key="tab-1"
      className="montserrat relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-end">
        <p className="text-[#120A8F] font-semibold text-sm">
          Ürün & Hizmetlerimiz
        </p>
      </div>

      <div className="pb-20">
        <div className="flex flex-col sm:items-center mt-5 gap-2 sm:gap-5 sm:flex-row">
          <p className="flex w-32 items-center gap-1.5 text-[#007356] montserrat font-medium">
            <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
            Başlık
          </p>
          <input
            type="text"
            name="baslik"
            value={formData.baslik || ""}
            onChange={handleInputChange}
            className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
          />
        </div>

        <div className="flex mt-4 flex-col sm:items-start gap-2 sm:gap-5 sm:flex-row">
          <p className="flex w-32 items-center gap-1.5 text-[#007356] montserrat font-medium">
            <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
            Metin
          </p>
          <textarea
            type="text"
            name="mesaj"
            value={formData.mesaj || ""}
            onChange={handleInputChange}
            className="py-3 px-[10px] border w-full border-[#A2ACC7] border-dashed outline-0 rounded-lg text-[#1D547D]"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAddNewKatalog}
            className="flex items-center gap-2 bg-[#1C5540] text-white px-4 py-2 rounded-lg hover:bg-[#1C5540]/90 transition-colors"
          >
            <img src="/images/icons/profil/arti-beyaz.svg" alt="" />
            Yeni Katalog Ekle
          </button>
        </div>

        {formData.kataloglar.map((katalog, index) => (
          <div
            key={katalog.id || index}
            className="flex mt-4 flex-col sm:items-start gap-2 sm:gap-5 sm:flex-row"
          >
            <p className="flex w-32 items-center gap-1.5 text-[#007356] montserrat font-medium">
              <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
              Katalog {index + 1}
            </p>
            <div className="p-3 md:p-6 border gap-5 border-[#A2ACC7] border-dashed rounded-lg w-full md:flex-row flex-col flex">
              <div className="flex-1">
                {katalog.pdf_url ? (
                  <div className="relative">
                    <img
                      src="/images/icons/firma-profil/icons/afis.svg"
                      className="rounded-lg md:h-[55vh] mx-auto cursor-pointer"
                      alt={`Katalog ${index + 1}`}
                      onClick={() => handlePdfView(katalog.pdf_url)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => handlePdfView(katalog.pdf_url)}
                        className="bg-white/80 hover:bg-white/90 px-4 py-2 rounded-lg text-[#1C5540] font-medium transition-colors"
                      >
                        PDF'i Görüntüle
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src="/images/icons/firma-profil/icons/afis.svg"
                    className="rounded-lg md:h-[55vh] mx-auto"
                    alt={`Katalog ${index + 1}`}
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="montserrat font-semibold text-sm text-[#232323]">
                  Katalok Belgesini Yükle
                </p>
                <div className="flex mt-3 gap-4 items-center">
                  <label className="w-full">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        handleFileUpload(katalog.id, e.target.files[0])
                      }
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="w-full bg-[#CED4DA] rounded-sm py-[10px] text-sm text-[#10069F] flex items-center justify-center gap-1 cursor-pointer">
                      {uploading ? (
                        <div className="w-5 h-5 border-2 border-[#10069F] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <img src="/images/icons/profil/ekle-yesil.svg" alt="" />
                      )}
                      {uploading ? "Yükleniyor..." : "Yükle"}
                    </div>
                  </label>
                  <button
                    onClick={() => handleDeleteKatalog(katalog.id)}
                    disabled={loading}
                    className="w-full bg-[#CED4DA] rounded-sm py-[10px] text-sm text-[#10069F] flex items-center justify-center gap-1"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#10069F] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <img src="/images/icons/profil/ekle-yesil.svg" alt="" />
                    )}
                    {loading ? "Siliniyor..." : "Sil"}
                  </button>
                </div>

                <div className="flex montserrat flex-col mt-3 gap-1">
                  <p className="text-[#232323] font-semibold">Belgenin Adı</p>
                  <textarea
                    type="text"
                    value={katalog.belge_adi}
                    onChange={(e) =>
                      handleKatalogChange(
                        katalog.id,
                        "belge_adi",
                        e.target.value
                      )
                    }
                    placeholder="Belge adı"
                    className="py-3 px-[10px] border w-full border-[#A2ACC7] border-dashed outline-0 rounded-lg text-[#1D547D] placeholder-[#1D547D]"
                  />
                </div>

                <div className="flex montserrat flex-col mt-3 gap-1">
                  <p className="text-[#232323] font-semibold">
                    Geçerlilik Başlangıç Tarihi
                  </p>
                  <input
                    type="date"
                    value={katalog.gecerlilik_baslangic}
                    onChange={(e) =>
                      handleKatalogChange(
                        katalog.id,
                        "gecerlilik_baslangic",
                        e.target.value
                      )
                    }
                    className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
                  />
                </div>

                <div className="flex montserrat flex-col mt-3 gap-1">
                  <p className="text-[#232323] font-semibold">
                    Son Geçerlilik Tarihi
                  </p>
                  <input
                    type="date"
                    value={katalog.gecerlilik_bitis}
                    onChange={(e) =>
                      handleKatalogChange(
                        katalog.id,
                        "gecerlilik_bitis",
                        e.target.value
                      )
                    }
                    className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
                  />
                </div>

                <div className="mt-3 py-[10px] px-4 flex items-center gap-2 border border-[#A42E2D] rounded-sm border-dashed">
                  <input
                    type="checkbox"
                    checked={katalog.acilis_katalogu}
                    onChange={(e) =>
                      handleKatalogChange(
                        katalog.id,
                        "acilis_katalogu",
                        e.target.checked
                      )
                    }
                    className="w-5 h-5 appearance-none border-2 rounded-full border-[#45535E] checked:bg-[#45535E] checked:border-transparent"
                  />
                  <p className="text-[#A42E2D] text-sm font-semibold">
                    Açılış kataloğu yap
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky w-1/4 ml-auto bottom-0 left-0 right-0 py-4 mt-6">
        <div className="max-w-7xl mx-auto flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#1C5540] text-white px-8 py-3 rounded-lg hover:bg-[#1C5540]/90 disabled:opacity-50 text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Kaydediliyor...
              </div>
            ) : (
              "Değişiklikleri Kaydet"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UrunHizmetler;
