import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firmaService, favoriService } from "../../../../../services/api";
import { toast } from "sonner";

const ReferansCard = ({ referans }) => {
  const [firmaDetay, setFirmaDetay] = useState(null);

  useEffect(() => {
    const loadFirmaDetay = async () => {
      try {
        const response = await firmaService.getFirmaById(
          referans.ilgili_firma_id
        );
        if (response.data.success) {
          setFirmaDetay(response.data.data);
        }
      } catch (error) {
        console.error("Firma detayları yüklenirken hata:", error);
      }
    };

    loadFirmaDetay();
  }, [referans.ilgili_firma_id]);

  const handleFavoriEkle = async (e) => {
    e.stopPropagation();
    try {
      const response = await favoriService.addFavori(referans.ilgili_firma_id);
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
          className="absolute top-0 right-1/2 translate-x-1/2 translate-y-6"
        >
          <img
            src={
              firmaDetay?.profil_resmi_url ||
              "/images/icons/home/firma-vitrin/logo.svg"
            }
            alt={firmaDetay?.unvan || "Firma Logo"}
            className="rounded-xl w-full h-28 object-contain"
          />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 cursor-pointer right-3"
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
          {firmaDetay?.firma_unvani || referans.ilgili_firma_adi}
        </p>
        <p className="my-2 text-xs text-center font-medium">
          Sektörü: {firmaDetay?.sektor || "-"}
        </p>
        <p className="text-xs text-center line-clamp-3">
          {firmaDetay?.merkez_adresi || ""}
        </p>
        <p className="text-xs text-center mt-1">
          {firmaDetay?.iletisim_telefonu || ""}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ReferansCard;
