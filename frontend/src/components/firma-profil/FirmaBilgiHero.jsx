import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { firmaService } from "../../services/api";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const FirmaBilgiHero = () => {
  const { id } = useParams();
  const [firma, setFirma] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirmaDetay = async () => {
      try {
        const response = await firmaService.getFirmaById(id);
        if (response.data.success) {
          setFirma(response.data.data);
        }
      } catch (error) {
        console.error("Firma detayları yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirmaDetay();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#01A4BD]"></div>
      </div>
    );
  }

  if (!firma) {
    return (
      <div className="text-center text-red-500 py-10">
        Firma bilgileri bulunamadı
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row px-5 lg:px-20 lg:gap-10 pb-5">
      <motion.div
        className="w-full lg:w-1/6 flex flex-col items-center montserrat"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={
            firma.profil_resmi_url ||
            "/images/icons/firma-profil/firma-logo.svg"
          }
          className="rounded-full border-6 border-[#01A4BD] -translate-y-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          alt={firma.firma_unvani}
        />
        <motion.p
          className="text-center -translate-y-8 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Kullanıcı <br />
          Değerlendirme Puanı
        </motion.p>
        <motion.div
          className="flex flex-row gap-1 items-center justify-center -translate-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {Array(4)
            .fill()
            .map((_, i) => (
              <img
                key={i}
                src="/images/icons/firma-profil/star-sari.svg"
                alt="Yıldız"
              />
            ))}
          <img src="/images/icons/firma-profil/star-bos.svg" alt="Yıldız" />
        </motion.div>
        <motion.p
          className="-translate-y-3 text-center text-sm montserrat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          FK Üye No: <span className="audiowide font-semibold">{firma.id}</span>
        </motion.p>
        <motion.img
          src="/images/icons/firma-profil/qr.svg"
          className="w-16 mx-auto -translate-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          alt="QR Kod"
        />
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
          {firma.marka_adi}
        </motion.p>
        <motion.p
          className="marcellus text-[#232323] text-lg text-center lg:text-left md:text-2xl lg:text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {firma.firma_unvani}
        </motion.p>
        <div className="mt-8 flex flex-col gap-2 md:gap-1">
          {[
            { label: "Hizmet Alanı", value: firma.hizmet_alani || "-" },
            {
              label: "Kuruluş Tarihi",
              value: formatDate(firma.kurulus_tarihi),
            },
            { label: "Kuruluş Şehri", value: firma.kurulus_sehri || "-" },
            { label: "Merkez Adresi", value: firma.merkez_adresi || "-" },
            { label: "KEP Adresi", value: firma.kep_adresi || "-" },
            { label: "E-Posta Adresi", value: firma.email || "-" },
            {
              label: "Resmi Web Adresi",
              value: firma.web_sitesi || "-",
              link: true,
            },
            {
              label: "İletişim Telefonu",
              value: firma.iletisim_telefonu || "-",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex md:flex-row flex-col md:items-center md:justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 + index * 0.2 }}
            >
              <p className="montserrat font-medium w-1/3 md:w-1/5">
                {item.label}
              </p>
              <p
                className={`montserrat ${item.link && "text-[#120A8F]"} w-full`}
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
