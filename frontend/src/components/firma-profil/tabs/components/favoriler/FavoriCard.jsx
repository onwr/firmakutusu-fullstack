import React from "react";
import { motion } from "framer-motion";
import { favoriService } from "../../../../../services/api";
import { toast } from "sonner";

const FavoriCard = ({ firma, onFavoriKaldir }) => {
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

  const handleFavoriKaldir = async (e) => {
    e.stopPropagation();
    try {
      await favoriService.removeFavori(firma.firma_id);
      toast.success("Favori kaldırıldı!");
      if (onFavoriKaldir) onFavoriKaldir(firma.firma_id);
    } catch (err) {
      toast.error("Favori kaldırılamadı.");
    }
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      className="flex flex-col border border-[#CED4DA] rounded-xl"
    >
      <div className="relative h-32">
        <motion.img
          src="/images/icons/home/firma-vitrin/cizgilikare.svg"
          className="rounded-t-xl w-full h-32 object-cover"
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-2 w-20 h-20  flex items-center justify-center"
        >
          <img
            src={
              firma.profil_resmi_url ||
              "/images/icons/home/firma-vitrin/logo.svg"
            }
            alt={firma.firma_unvani}
            style={{ maxWidth: "300%", maxHeight: "150%" }}
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bg-[#A2ACC7] p-2 rounded-sm top-3 cursor-pointer right-5"
          onClick={handleFavoriKaldir}
        >
          <img src="/images/icons/menu.svg" alt="Menü" className="size-3" />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`pt-6 h-full px-4 pb-3 text-[#232323] flex montserrat items-center flex-col`}
      >
        <p className="line-clamp-2 text-sm text-center font-semibold">
          {firma.firma_unvani}
        </p>
        <p className="my-2 text-xs text-center font-medium">
          Sektörü: {firma.sektor || "-"}
        </p>
        <p className="text-xs text-center line-clamp-3">
          {firma.merkez_adresi || "-"}
        </p>
        <p className="text-xs text-center mt-1">
          {firma.iletisim_telefonu || "-"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FavoriCard;
