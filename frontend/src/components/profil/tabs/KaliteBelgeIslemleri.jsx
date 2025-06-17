import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const KaliteBelgeIslemleri = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    baslik: "",
    metin: "",
    belgeler: [],
  });

  const [yeniBelge, setYeniBelge] = useState({
    belge_resmi_url: "",
    belge_adi: "",
    sertifika_no: "",
    verilis_tarihi: "",
    gecerlilik_bitis: "",
  });

  // Verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      if (user?.yetkiliKisi?.firma_id) {
        try {
          setInitialLoading(true);
          const [ayarlarResponse, belgelerResponse] = await Promise.all([
            firmaService.getKaliteBelgeleriAyarlar(user.yetkiliKisi.firma_id),
            firmaService.getKaliteBelgeleri(user.yetkiliKisi.firma_id),
          ]);

          const ayarlar = ayarlarResponse?.data?.data || {};
          const belgeler = belgelerResponse?.data?.data || [];

          setFormData({
            baslik: ayarlar.baslik || "",
            metin: ayarlar.metin || "",
            belgeler: belgeler.map((belge) => ({
              id: belge.id,
              belge_resmi_url: belge.belge_resmi_url || "",
              belge_adi: belge.belge_adi || "",
              sertifika_no: belge.sertifika_no || "",
              verilis_tarihi: belge.verilis_tarihi || "",
              gecerlilik_bitis: belge.gecerlilik_bitis || "",
            })),
          });
        } catch (error) {
          console.error("Veri getirme hatası:", error);
          toast.error("Veriler alınırken bir hata oluştu");
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchData();
  }, [user?.yetkiliKisi?.firma_id]);

  // Ana form için veri değişikliği
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Yeni belge için değişiklik
  const handleYeniBelgeChange = (e) => {
    const { name, value } = e.target;
    setYeniBelge((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Belge yükleme fonksiyonu
  const handleBelgeYukle = async (belgeIndex, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await firmaService.uploadImage(file);
      const imageUrl = response.data.url;

      if (belgeIndex === "yeni") {
        setYeniBelge((prev) => ({
          ...prev,
          belge_resmi_url: imageUrl,
        }));
      } else {
        setFormData((prev) => {
          const updatedBelgeler = [...prev.belgeler];
          updatedBelgeler[belgeIndex] = {
            ...updatedBelgeler[belgeIndex],
            belge_resmi_url: imageUrl,
          };
          return { ...prev, belgeler: updatedBelgeler };
        });
      }

      toast.success("Belge başarıyla yüklendi");
    } catch (error) {
      console.error("Belge yükleme hatası:", error);
      toast.error("Belge yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  // Belge silme fonksiyonu
  const handleBelgeSil = async (belgeIndex) => {
    if (belgeIndex === "yeni") {
      setYeniBelge((prev) => ({
        ...prev,
        belge_resmi_url: "",
      }));
      toast.success("Belge başarıyla silindi");
      return;
    }

    const belge = formData.belgeler[belgeIndex];
    if (!belge.id) return;

    try {
      setLoading(true);
      await firmaService.deleteKaliteBelgesi(belge.id);

      setFormData((prev) => ({
        ...prev,
        belgeler: prev.belgeler.filter((_, index) => index !== belgeIndex),
      }));

      toast.success("Belge başarıyla silindi");
    } catch (error) {
      console.error("Belge silme hatası:", error);
      toast.error("Belge silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Yeni belgeyi kaydet
  const handleYeniBelgeKaydet = async () => {
    try {
      setLoading(true);
      const response = await firmaService.createKaliteBelgesi({
        ...yeniBelge,
        firma_id: user.yetkiliKisi.firma_id,
      });

      setFormData((prev) => ({
        ...prev,
        belgeler: [...prev.belgeler, { ...yeniBelge, id: response.data.id }],
      }));

      // Formu temizle
      setYeniBelge({
        belge_resmi_url: "",
        belge_adi: "",
        sertifika_no: "",
        verilis_tarihi: "",
        gecerlilik_bitis: "",
      });

      toast.success("Yeni belge başarıyla eklendi");
    } catch (error) {
      console.error("Belge ekleme hatası:", error);
      toast.error("Belge eklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Değişiklikleri kaydet
  const handleDegisiklikleriKaydet = async (belgeIndex) => {
    const belge = formData.belgeler[belgeIndex];
    if (!belge.id) return;

    try {
      setLoading(true);
      await firmaService.updateKaliteBelgesi(belge.id, belge);
      toast.success("Değişiklikler başarıyla kaydedildi");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      toast.error("Değişiklikler kaydedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Tüm değişiklikleri kaydet
  const handleTumDegisiklikleriKaydet = async () => {
    try {
      setLoading(true);
      await firmaService.updateKaliteBelgeleriAyarlar({
        baslik: formData.baslik,
        metin: formData.metin,
        firma_id: user.yetkiliKisi.firma_id,
      });
      toast.success("Tüm değişiklikler başarıyla kaydedildi");
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      toast.error("Değişiklikler kaydedilirken bir hata oluştu");
    } finally {
      setLoading(false);
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
      className="montserrat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-end">
        <p className="text-[#120A8F] font-semibold text-sm">
          Kalite Belgelerimiz
        </p>
      </div>

      <div className="flex flex-col sm:items-center mt-5 gap-2 sm:gap-5 sm:flex-row">
        <p className="flex w-32 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Başlık
        </p>
        <input
          type="text"
          name="baslik"
          value={formData.baslik}
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
          name="metin"
          value={formData.metin}
          onChange={handleInputChange}
          className="py-3 px-[10px] border w-full border-[#A2ACC7] border-dashed outline-0 rounded-lg text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-start mt-2 gap-2 sm:gap-5 sm:flex-row">
        <p className="flex w-32 items-start gap-1.5 text-[#A42E2D] montserrat font-medium">
          <img src="/images/icons/profil/add-red.svg" alt="" />
          Yeni Kalite Belgesi Ekle
        </p>
        <div className="p-6 rounded-xl gap-5 flex flex-col bg-[#FFF2F2] border border-[#A2ACC7] w-full border-dashed">
          <div className="flex-1 text-[#232323]">
            {/* Belge Resmi */}
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">Belge Resmi</p>
              {yeniBelge.belge_resmi_url ? (
                <img
                  src={yeniBelge.belge_resmi_url}
                  alt="Belge Resmi"
                  className="mt-1 h-60 w-60 object-cover rounded-lg"
                />
              ) : (
                <img
                  src="/images/icons/firma-profil/icons/kalite-sertifika.svg"
                  className="mt-1 h-60 w-60 rounded-lg"
                  alt="Varsayılan Resim"
                />
              )}
              <div className="flex mt-2 items-center gap-2">
                <label className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBelgeYukle("yeni", e)}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm cursor-pointer">
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-[#10069F] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <img src="/images/icons/profil/ekle-yesil.svg" alt="" />
                    )}
                    {uploading ? "Yükleniyor..." : "Yükle"}
                  </div>
                </label>
                {yeniBelge.belge_resmi_url && (
                  <button
                    onClick={() => handleBelgeSil("yeni")}
                    className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm"
                  >
                    <img src="/images/icons/profil/ekle-yesil.svg" alt="" />
                    Sil
                  </button>
                )}
              </div>
            </div>

            {/* Belge Adı */}
            <div className="flex flex-col gap-1 mt-3">
              <p className="font-semibold text-sm">Belge Adı</p>
              <input
                type="text"
                name="belge_adi"
                value={yeniBelge.belge_adi}
                onChange={handleYeniBelgeChange}
                placeholder="Belge Adı"
                className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
              />
            </div>

            {/* Sertifika No */}
            <div className="flex flex-col gap-1 mt-3">
              <p className="font-semibold text-sm">Sertifika No</p>
              <input
                type="text"
                name="sertifika_no"
                value={yeniBelge.sertifika_no}
                onChange={handleYeniBelgeChange}
                placeholder="Sertifika No"
                className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
              />
            </div>

            {/* Veriliş Tarihi */}
            <div className="flex flex-col gap-1 mt-3">
              <p className="font-semibold text-sm">Veriliş Tarihi</p>
              <input
                type="date"
                name="verilis_tarihi"
                value={yeniBelge.verilis_tarihi}
                onChange={handleYeniBelgeChange}
                className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
              />
            </div>

            {/* Geçerlilik Bitiş */}
            <div className="flex flex-col gap-1 mt-3">
              <p className="font-semibold text-sm">Geçerlilik Bitiş Tarihi</p>
              <input
                type="date"
                name="gecerlilik_bitis"
                value={yeniBelge.gecerlilik_bitis}
                onChange={handleYeniBelgeChange}
                className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
              />
            </div>
          </div>

          <button
            onClick={handleYeniBelgeKaydet}
            disabled={loading}
            className="w-full mt-5 py-4 bg-[#1C5540] rounded-lg text-white flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Kaydediliyor...
              </div>
            ) : (
              <>
                <img src="/images/icons/profil/arti-beyaz.svg" alt="" />
                Yeni Belgeyi Kaydet
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mevcut Belgeler */}
      {formData.belgeler.map((belge, belgeIndex) => (
        <div
          key={belge.id}
          className="flex flex-col sm:items-start mt-2 gap-2 sm:gap-5 sm:flex-row"
        >
          <p className="flex w-32 items-start gap-1.5 text-[#007356] montserrat font-medium">
            <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
            Belge - {belgeIndex + 1}
          </p>
          <div className="p-6 rounded-xl gap-5 flex flex-col bg-white border border-[#A2ACC7] w-full border-dashed">
            <div className="flex-1 text-[#232323]">
              {/* Belge Resmi */}
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm">Belge Resmi</p>
                {belge.belge_resmi_url ? (
                  <img
                    src={belge.belge_resmi_url}
                    alt="Belge Resmi"
                    className="mt-1 h-40 w-40 object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src="/images/icons/firma-profil/icons/kalite-sertifika.svg"
                    className="mt-1"
                    alt="Varsayılan Resim"
                  />
                )}
                <div className="flex mt-2 items-center gap-2">
                  <label className="w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBelgeYukle(belgeIndex, e)}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm cursor-pointer">
                      {uploading ? (
                        <div className="w-5 h-5 border-2 border-[#10069F] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <img src="/images/icons/profil/ekle-yesil.svg" alt="" />
                      )}
                      {uploading ? "Yükleniyor..." : "Yükle"}
                    </div>
                  </label>
                  {belge.belge_resmi_url && (
                    <button
                      onClick={() => handleBelgeSil(belgeIndex)}
                      className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm"
                    >
                      <img src="/images/icons/profil/ekle-yesil.svg" alt="" />
                      Sil
                    </button>
                  )}
                </div>
              </div>

              {/* Belge Adı */}
              <div className="flex flex-col gap-1 mt-3">
                <p className="font-semibold text-sm">Belge Adı</p>
                <input
                  type="text"
                  name="belge_adi"
                  value={belge.belge_adi}
                  onChange={(e) => {
                    const updatedBelgeler = [...formData.belgeler];
                    updatedBelgeler[belgeIndex] = {
                      ...updatedBelgeler[belgeIndex],
                      belge_adi: e.target.value,
                    };
                    setFormData((prev) => ({
                      ...prev,
                      belgeler: updatedBelgeler,
                    }));
                  }}
                  placeholder="Belge Adı"
                  className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
                />
              </div>

              {/* Sertifika No */}
              <div className="flex flex-col gap-1 mt-3">
                <p className="font-semibold text-sm">Sertifika No</p>
                <input
                  type="text"
                  name="sertifika_no"
                  value={belge.sertifika_no}
                  onChange={(e) => {
                    const updatedBelgeler = [...formData.belgeler];
                    updatedBelgeler[belgeIndex] = {
                      ...updatedBelgeler[belgeIndex],
                      sertifika_no: e.target.value,
                    };
                    setFormData((prev) => ({
                      ...prev,
                      belgeler: updatedBelgeler,
                    }));
                  }}
                  placeholder="Sertifika No"
                  className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
                />
              </div>

              {/* Veriliş Tarihi */}
              <div className="flex flex-col gap-1 mt-3">
                <p className="font-semibold text-sm">Veriliş Tarihi</p>
                <input
                  type="date"
                  name="verilis_tarihi"
                  value={belge.verilis_tarihi}
                  onChange={(e) => {
                    const updatedBelgeler = [...formData.belgeler];
                    updatedBelgeler[belgeIndex] = {
                      ...updatedBelgeler[belgeIndex],
                      verilis_tarihi: e.target.value,
                    };
                    setFormData((prev) => ({
                      ...prev,
                      belgeler: updatedBelgeler,
                    }));
                  }}
                  className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
                />
              </div>

              {/* Geçerlilik Bitiş */}
              <div className="flex flex-col gap-1 mt-3">
                <p className="font-semibold text-sm">Geçerlilik Bitiş Tarihi</p>
                <input
                  type="date"
                  name="gecerlilik_bitis"
                  value={belge.gecerlilik_bitis}
                  onChange={(e) => {
                    const updatedBelgeler = [...formData.belgeler];
                    updatedBelgeler[belgeIndex] = {
                      ...updatedBelgeler[belgeIndex],
                      gecerlilik_bitis: e.target.value,
                    };
                    setFormData((prev) => ({
                      ...prev,
                      belgeler: updatedBelgeler,
                    }));
                  }}
                  className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
                />
              </div>
            </div>

            <div className="flex md:flex-row flex-col mt-5 gap-1 md:gap-3">
              <button
                onClick={() => handleBelgeSil(belgeIndex)}
                disabled={loading}
                className="w-full py-4 bg-[#F1EEE6] font-medium rounded-lg text-[#1C5540] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#1C5540] border-t-transparent rounded-full animate-spin"></div>
                    Siliniyor...
                  </div>
                ) : (
                  <>
                    <img src="/images/icons/profil/arti-yesil.svg" alt="" />
                    Belgeyi Sil
                  </>
                )}
              </button>
              <button
                onClick={() => handleDegisiklikleriKaydet(belgeIndex)}
                disabled={loading}
                className="w-full py-4 font-medium bg-[#1C5540] rounded-lg text-white flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Kaydediliyor...
                  </div>
                ) : (
                  <>
                    <img src="/images/icons/profil/arti-beyaz.svg" alt="" />
                    Değişiklikleri Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Kaydet butonu */}
      <div className="sticky w-1/4 ml-auto bottom-0 left-0 right-0 py-4 mt-6">
        <div className="max-w-7xl mx-auto flex justify-end">
          <button
            onClick={handleTumDegisiklikleriKaydet}
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

export default KaliteBelgeIslemleri;
