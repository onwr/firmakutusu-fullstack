import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const Hakkimizda = () => {
  const { isLogin, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    ceo_resmi_url: "",
    baslik: "",
    ceo_adi: "",
    ceo_mesaji: "",
  });

  useEffect(() => {
    const fetchHakkimizda = async () => {
      if (user?.yetkiliKisi?.firma_id) {
        try {
          setLoading(true);
          const response = await firmaService.getHakkimizda(
            user.yetkiliKisi.firma_id
          );
          setFormData(response.data.data);
        } catch (error) {
          console.error("Hakkımızda bilgileri alınamadı:", error);
          toast.error("Hakkımızda bilgileri alınamadı");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHakkimizda();
  }, [user?.yetkiliKisi?.firma_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await firmaService.uploadImage(file);

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          ceo_resmi_url: response.data.url,
        }));
        toast.success("Resim başarıyla yüklendi");
      } else {
        throw new Error("Resim yüklenemedi");
      }
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      toast.error("Resim yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = () => {
    setFormData((prev) => ({
      ...prev,
      ceo_resmi_url: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await firmaService.updateHakkimizda(formData);
      toast.success("Bilgiler başarıyla güncellendi");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      toast.error("Bilgiler güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="tab-1"
      className="montserrat relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-end">
        <p className="text-[#120A8F] font-semibold text-sm">Hakkımızda</p>
      </div>

      <div className="pb-20">
        <div className="p-5 border mt-3 md:mt-0 border-[#A2ACC7] rounded-lg border-dashed md:w-fit">
          {formData.ceo_resmi_url ? (
            <img
              src={formData.ceo_resmi_url}
              alt="CEO Resmi"
              className="mx-auto max-w-[200px] max-h-[200px] object-contain"
            />
          ) : (
            <img
              src="/images/icons/firma-profil/icons/ceo.svg"
              className="mx-auto"
              alt=""
            />
          )}
          <div className="flex mt-5 gap-5">
            <button
              onClick={handleDeleteImage}
              disabled={!formData.ceo_resmi_url || uploading}
              className="flex p-2 gap-2 justify-center items-center bg-[#CED4DA] rounded-sm text-[#10069F] text-sm w-full disabled:opacity-50"
            >
              <img src="/images/icons/profil/sil.svg" alt="" />
              Sil
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex p-2 gap-2 justify-center items-center bg-[#CED4DA] rounded-sm text-[#10069F] text-sm w-full disabled:opacity-50"
            >
              <img src="/images/icons/profil/yukle.svg" alt="" />
              {uploading ? "Yükleniyor..." : "Yükle"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
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
            name="ceo_mesaji"
            value={formData.ceo_mesaji}
            onChange={handleInputChange}
            className="py-3 px-[10px] border w-full border-[#A2ACC7] border-dashed outline-0 rounded-lg text-[#1D547D] min-h-[150px]"
          ></textarea>
        </div>

        <div className="flex flex-col sm:items-center mt-2 gap-2 sm:gap-5 sm:flex-row">
          <p className="flex w-32 items-center gap-1.5 text-[#007356] montserrat font-medium">
            <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
            CEO Adı
          </p>
          <input
            type="text"
            name="ceo_adi"
            value={formData.ceo_adi}
            onChange={handleInputChange}
            className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
          />
        </div>
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

export default Hakkimizda;
