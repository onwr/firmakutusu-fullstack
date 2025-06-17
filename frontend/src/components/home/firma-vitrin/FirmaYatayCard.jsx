import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { favoriService } from "../../../services/api";

const FirmaYatayCard = ({ firma }) => {
  const navigate = useNavigate();

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        navigate(`/firma/${firma.id}`);
      }}
      className="w-full h-auto md:h-52 flex md:flex-row flex-col border border-[#A2ACC7] rounded-[10px] cursor-pointer"
    >
      <div className="w-full md:w-48 relative">
        <motion.img
          src={firma.kapak || "/images/icons/home/firma-vitrin/cizgilikare.svg"}
          className="rounded-l-[10px] h-32 md:h-full object-cover w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <motion.img
          src={getLogoUrl()}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 md:top-1/2 right-1/2 translate-x-1/2 md:right-0 translate-y-6 md:translate-x-6 md:-translate-y-1/2"
        />
      </div>
      <div className="flex w-full py-10 px-2 md:px-0 md:py-0 relative flex-col text-[#232323] montserrat justify-center text-center md:text-left md:ml-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-2 md:top-4 right-4"
          onClick={handleFavoriEkle}
        >
          <img src="/images/icons/firma-ara/heart.svg" alt="Favoriye ekle" />
        </motion.button>
        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-semibold md:text-base text-sm line-clamp-2"
        >
          {firma.firma_unvani}
        </motion.p>
        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-medium text-xs md:text-sm my-1"
        >
          Sektörü: {firma.sektor}
        </motion.p>
        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs md:text-sm"
        >
          {firma.merkez_adresi}
        </motion.p>
        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs md:text-sm"
        >
          Tel: {firma.iletisim_telefonu}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default FirmaYatayCard;
