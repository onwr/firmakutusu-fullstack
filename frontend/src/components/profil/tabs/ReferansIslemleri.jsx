import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import ReferansCard from "./components/ReferansCard";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const ReferansIslemleri = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [referanslar, setReferanslar] = useState([]);
  const [gelenReferanslar, setGelenReferanslar] = useState([]);
  const [formData, setFormData] = useState({
    baslik: "",
    metin: "",
    vkn: "",
    firmaunvan: "",
    mektub: "",
  });

  useEffect(() => {
    if (user?.yetkiliKisi?.firma_id) {
      loadReferansData();
    }
  }, [user?.yetkiliKisi?.firma_id]);

  const loadReferansData = async () => {
    try {
      setInitialLoading(true);
      const [ayarlarRes, referanslarRes, gelenReferanslarRes] =
        await Promise.all([
          firmaService.getReferanslarAyarlar(user.yetkiliKisi.firma_id),
          firmaService.getReferanslar(user.yetkiliKisi.firma_id),
          firmaService.getGelenReferanslar(user.yetkiliKisi.firma_id),
        ]);

      console.log("Ayarlar:", ayarlarRes.data);
      console.log("Referanslar:", referanslarRes.data);
      console.log("Gelen Referanslar:", gelenReferanslarRes.data);

      setFormData((prev) => ({
        ...prev,
        baslik: ayarlarRes.data?.data?.baslik || "",
        metin: ayarlarRes.data?.data?.metin || "",
      }));

      const referanslarData = referanslarRes.data?.data || [];
      const gelenReferanslarData = gelenReferanslarRes.data?.data || [];

      setReferanslar(referanslarData);
      setGelenReferanslar(gelenReferanslarData);
    } catch (error) {
      console.error("Referans verileri yüklenirken hata:", error);
      toast.error("Referans verileri yüklenirken bir hata oluştu");
      setReferanslar([]);
      setGelenReferanslar([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVKNSorgula = async () => {
    if (!formData.vkn.trim()) {
      toast.error("Lütfen VKN girin");
      return;
    }

    try {
      setLoading(true);
      const response = await firmaService.getFirmaByVKN(formData.vkn);

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          firmaunvan: response.data.data.data.firma_unvani,
          firmaid: response.data.data.data.id,
        }));
        toast.success("Firma bilgileri başarıyla getirildi");
      }
    } catch (error) {
      console.error("VKN sorgulanırken hata:", error);
      toast.error("VKN sorgulanırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleReferansTalebi = async (e) => {
    e.preventDefault();

    if (
      !formData.vkn.trim() ||
      !formData.firmaunvan.trim() ||
      !formData.mektub.trim()
    ) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      setLoading(true);

      // Önce firma bilgilerini al
      const firmaResponse = await firmaService.getFirma(
        user.yetkiliKisi.firma_id
      );

      if (!firmaResponse.data.success) {
        toast.error("Firma bilgileri alınamadı");
        return;
      }

      const firmaData = firmaResponse.data.data;

      // Kendi firmasına referans kontrolü
      if (firmaData.vergi_kimlik_no === formData.vkn) {
        toast.error("Kendi firmanıza referans talebi gönderemezsiniz");
        return;
      }

      // Referans talebini oluştur
      const response = await firmaService.createReferans({
        firma_id: user.yetkiliKisi.firma_id,
        firma_adi: firmaData.firma_unvani, // Burada firma unvanını kullan
        tip: "talep",
        ilgili_firma_vergi_no: formData.vkn,
        ilgili_firma_unvani: formData.firmaunvan,
        ilgili_firma_id: formData.firmaid,
        referans_mesaji: formData.mektub,
        durum: "beklemede",
      });

      if (response.data.success) {
        toast.success("Referans talebi başarıyla gönderildi");
        setFormData((prev) => ({
          ...prev,
          vkn: "",
          firmaunvan: "",
          mektub: "",
        }));
        await loadReferansData();
      }
    } catch (error) {
      console.error("İşlem sırasında hata:", error);
      toast.error("İşlem sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleAyarlarKaydet = async () => {
    try {
      setLoading(true);
      const response = await firmaService.updateReferanslarAyarlar({
        firma_id: user.yetkiliKisi.firma_id,
        baslik: formData.baslik,
        metin: formData.metin,
      });

      if (response.data.success) {
        toast.success("Referans ayarları başarıyla kaydedildi");
      }
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata:", error);
      toast.error("Ayarlar kaydedilirken bir hata oluştu");
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
      <div className="flex justify-between items-center">
        <p className="text-[#120A8F] font-semibold text-sm">Referanslarımız</p>
        <button
          onClick={handleAyarlarKaydet}
          disabled={loading}
          className="px-4 py-2 bg-[#1C5540] text-white rounded-lg text-sm"
        >
          {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
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

      <div className="flex mt-2 flex-col sm:items-start gap-2 sm:gap-5 sm:flex-row">
        <p className="flex w-32 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Metin
        </p>
        <textarea
          name="metin"
          value={formData.metin}
          onChange={handleInputChange}
          className="py-3 px-[10px] border w-full border-[#A2ACC7] border-dashed outline-0 rounded-lg text-[#1D547D]"
        ></textarea>
      </div>

      <div className="flex mt-2 flex-col sm:items-start gap-2 sm:gap-5 sm:flex-row">
        <p className="flex w-32 items-start gap-1.5 text-[#A42E2D] montserrat font-medium">
          <img src="/images/icons/profil/add-red.svg" alt="" />
          Yeni Referans Talebi
        </p>
        <div className="p-6 border w-full border-[#A2ACC7] border-dashed bg-[#FFF2F2] rounded-lg">
          <p className="text-[#1D547D] font-medium">
            Referansı Talep Edilecek Firmanın
          </p>
          <form
            onSubmit={handleReferansTalebi}
            className="mt-5 flex flex-col gap-3"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="vkn"
                className="font-semibold text-sm text-[#232323]"
              >
                Vergi Kimlik Numarası
              </label>
              <div className="flex items-center md:flex-row flex-col justify-between py-2 px-5 md:px-4 bg-white border-dashed rounded-sm border border-[#A2ACC7]">
                <input
                  type="text"
                  name="vkn"
                  value={formData.vkn}
                  onChange={handleInputChange}
                  placeholder="Vergi Kimlik Numarası"
                  className="outline-none py-2 md:py-0 w-full text-[#1D547D]"
                />
                <button
                  type="button"
                  onClick={handleVKNSorgula}
                  disabled={loading || !formData.vkn.trim()}
                  className="w-full md:w-1/3 bg-[#BCF6D9] rounded-[10px] text-xs md:text-base text-[#1C5540] py-3 disabled:opacity-50"
                >
                  {loading ? "Sorgulanıyor..." : "VKN Numarasını Sorgula"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="firmaunvan">Firma Unvanı</label>
              <input
                type="text"
                name="firmaunvan"
                value={formData.firmaunvan}
                onChange={handleInputChange}
                className="py-3 px-[10px] bg-white border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="mektub">Mesaj</label>
              <textarea
                name="mektub"
                value={formData.mektub}
                onChange={handleInputChange}
                placeholder="Referans Mektubu"
                className="py-3 px-[10px] bg-white border w-full border-[#A2ACC7] border-dashed outline-0 rounded-lg text-[#1D547D]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1C5540] text-sm font-medium text-white flex justify-center rounded-lg items-center gap-1 w-full py-5 mt-5 disabled:opacity-50"
            >
              <img src="/images/icons/profil/arti-beyaz.svg" alt="" />
              {loading ? "Gönderiliyor..." : "Referans Talebimi Gönder"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-5">
        <p className="bg-[#8B8138] rounded-t-xl px-6 py-2 text-white marcellus text-xl">
          Alınan Referanslarım{" "}
          <span className="text-sm">(Bana verilen referanslar)</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {Array.isArray(referanslar) &&
            referanslar
              .filter(
                (ref) =>
                  ref.ilgili_firma_id !== user.yetkiliKisi.firma_id &&
                  ref.durum === "onaylandi"
              )
              .map((referans) => (
                <ReferansCard
                  key={referans.id}
                  loadReferansData={loadReferansData}
                  referans={referans}
                  renk="#e8e6d7"
                  menurenk="#8b8138"
                />
              ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="bg-[#7512A2] rounded-t-xl px-6 py-2 text-white marcellus text-xl">
          Verilen Referanslar{" "}
          <span className="text-sm">(Benim referans olduğum firmalar)</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {Array.isArray(gelenReferanslar) &&
            gelenReferanslar
              .filter((ref) => ref.durum === "onaylandi")
              .map((referans) => (
                <ReferansCard
                  key={referans.id}
                  loadReferansData={loadReferansData}
                  referans={referans}
                  renk="#e3d0ec"
                  menurenk="#7512a2"
                />
              ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="bg-[#10069F] rounded-t-xl px-6 py-2 text-white marcellus text-xl">
          Gönderilen Referans Talepleri{" "}
          <span className="text-sm">(Benim gönderdiğim talepler)</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {Array.isArray(referanslar) &&
            referanslar
              .filter(
                (ref) =>
                  ref.ilgili_firma_id !== user.yetkiliKisi.firma_id &&
                  ref.durum === "beklemede"
              )
              .map((referans) => (
                <ReferansCard
                  key={referans.id}
                  loadReferansData={loadReferansData}
                  referans={referans}
                  renk="#dfe7ee"
                  menurenk="#10069f"
                />
              ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="bg-[#80CC28] rounded-t-xl px-6 py-2 text-white marcellus text-xl">
          Alınan Referans Talepleri{" "}
          <span className="text-sm">(Bana gelen referans talepleri)</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {Array.isArray(gelenReferanslar) &&
            gelenReferanslar
              .filter((ref) => ref.durum === "beklemede")
              .map((referans) => (
                <ReferansCard
                  key={referans.id}
                  loadReferansData={loadReferansData}
                  referans={referans}
                  renk="#e6f5d4"
                  menurenk="#80cc28"
                />
              ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ReferansIslemleri;
