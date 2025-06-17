import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { firmaService } from "../../services/api";
import { toast } from "sonner";

const FirmaBilgiHero = () => {
  const { user } = useAuth();
  const [firmaDetay, setFirmaDetay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFirmaDetay = async () => {
      try {
        const response = await firmaService.getFirma();
        setFirmaDetay(response.data.data);
      } catch (error) {
        console.error("Firma detayları yüklenirken hata:", error);
        toast.error("Firma detayları yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadFirmaDetay();
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await firmaService.uploadImage(file);

      if (response.data.success) {
        await firmaService.updateFirma({
          ...firmaDetay,
          profil_resmi_url: response.data.url,
        });
        toast.success("Logo başarıyla yüklendi!");
        const firmaResponse = await firmaService.getFirma();
        setFirmaDetay(firmaResponse.data.data);
      }
    } catch (error) {
      console.error("Logo yüklenirken hata:", error);
      toast.error("Logo yüklenirken bir hata oluştu!");
    }
  };

  const handleLogoDelete = async () => {
    try {
      await firmaService.updateFirma({
        ...firmaDetay,
        profil_resmi_url: "/images/icons/firma-profil/firma-logo.svg",
      });
      toast.success("Logo başarıyla silindi!");
      const firmaResponse = await firmaService.getFirma();
      setFirmaDetay(firmaResponse.data.data);
    } catch (error) {
      console.error("Logo silinirken hata:", error);
      toast.error("Logo silinirken bir hata oluştu!");
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row px-5 lg:px-20 lg:gap-10 pb-5">
      <motion.div
        className="w-full lg:w-1/3 flex flex-col items-center montserrat"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="py-10 px-5 border -translate-y-6 lg:-translate-y-20 border-dashed border-[#A2ACC7] rounded-lg flex flex-col items-center justify-center">
          <motion.img
            src={
              firmaDetay?.profil_resmi_url ||
              "/images/icons/firma-profil/firma-logo.svg"
            }
            className="rounded-full border-6 border-[#01A4BD]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            alt={firmaDetay?.firma_unvani || "Firma Logo"}
          />
          <div className="mt-5 w-full flex lg:flex-row flex-col items-center gap-2">
            <button
              onClick={handleLogoDelete}
              className="bg-[#CED4DA] p-2 justify-center rounded-sm text-[#10069F] flex items-center gap-1 w-full"
            >
              <img src="/images/icons/profil/sil.svg" alt="Sil" />
              Sil
            </button>
            <label className="bg-[#CED4DA] py-2 justify-center rounded-sm text-[#10069F] flex items-center gap-1 w-full cursor-pointer">
              <img src="/images/icons/profil/yukle.svg" alt="Yükle" />
              Yükle
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </label>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="w-full pt-5"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p
          className="text-[#A42E2D] marcellus text-lg text-center lg:text-left md:text-xl lg:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {firmaDetay?.marka_adi || "-"}
        </motion.p>
        <motion.p
          className="marcellus text-[#232323] text-lg text-center lg:text-left md:text-2xl lg:text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {firmaDetay?.firma_unvani || "-"}
        </motion.p>
        <div className="mt-4 md:mt-8 flex flex-col gap-2 md:gap-1">
          {[
            { label: "Hizmet Alanı", value: firmaDetay?.hizmet_alani || "-" },
            {
              label: "Kuruluş Tarihi",
              value: firmaDetay?.kurulus_tarihi || "-",
            },
            { label: "Kuruluş Şehri", value: firmaDetay?.kurulus_sehri || "-" },
            { label: "Merkez Adresi", value: firmaDetay?.merkez_adresi || "-" },
            { label: "KEP Adresi", value: firmaDetay?.kep_adresi || "-" },
            { label: "E-Posta Adresi", value: firmaDetay?.email || "-" },
            {
              label: "Resmi Web Adresi",
              value: firmaDetay?.web_sitesi || "-",
              link: true,
            },
            {
              label: "İletişim Telefonu",
              value: firmaDetay?.iletisim_telefonu || "-",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex md:flex-row flex-col md:items-center md:justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 + index * 0.2 }}
            >
              <p className="montserrat font-medium w-full md:w-1/5">
                {item.label}
              </p>
              <p
                className={`montserrat ${
                  item.link && "text-[#120A8F]"
                } text-sm md:text-base w-full`}
              >
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FirmaBilgiHero;
