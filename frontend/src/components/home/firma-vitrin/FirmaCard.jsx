import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { favoriService } from "../../../services/api";
import { toast } from "sonner";

const FirmaCard = ({ firma }) => {
  const navigate = useNavigate();
  const item = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const getLogoUrl = () => {
    if (firma.logo && firma.logo.trim() !== "") {
      return firma.logo;
    }
    return (
      firma.profil_resmi_url ||
      "/images/icons/home/firma-vitrin/default-logo.svg"
    );
  };

  const handleFavoriEkle = async (e) => {
    e.stopPropagation();
    try {
      const response = await favoriService.addFavori(firma.id);
      if (response.data.success) {
        toast.success("Firma favorilere eklendi!");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Favorilere eklenirken bir hata oluştu.");
      }
    }
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      onClick={() => {
        navigate(`/firma/${firma.id}`);
      }}
      className="flex flex-col border border-[#CED4DA] rounded-xl"
    >
      <div className="relative h-32">
        <motion.img
          src="/images/icons/home/firma-vitrin/cizgilikare.svg"
          className="rounded-t-xl w-full h-32 object-cover"
          alt={firma.isim}
        />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-5 w-20 h-20 flex items-center justify-center">
          <img
            src={getLogoUrl()}
            alt={`${firma.isim} logo`}
            className="rounded-t-2xl"
            style={{ maxWidth: "300%", maxHeight: "150%" }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 cursor-pointer right-3 z-10"
          onClick={handleFavoriEkle}
        >
          <img
            src="/images/icons/home/firma-vitrin/heart.svg"
            alt="Favorilere ekle"
          />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 h-full px-4 pb-3 text-[#232323] flex montserrat items-center flex-col"
      >
        <p className="line-clamp-2 text-sm text-center font-semibold">
          {firma.firma_unvani}
        </p>
        <p className="my-2 text-xs text-center font-medium">
          Sektörü: {firma.sektor}
        </p>
        <p className="text-xs text-center line-clamp-3">
          {firma.merkez_adresi}
        </p>
        <p className="text-xs text-center mt-1">{firma.iletisim_telefonu}</p>
      </motion.div>
    </motion.div>
  );
};

export default FirmaCard;
