import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const Hakkimizda = ({ id }) => {
  const [hakkimizda, setHakkimizda] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHakkimizda = async () => {
      try {
        setIsLoading(true);
        const response = await firmaService.getHakkimizda(id);
        if (response.data.success) {
          setHakkimizda(response.data.data);
          console.log(response.data.data);
        } else {
          toast.error(
            response.data.message || "Hakkımızda bilgileri alınamadı"
          );
        }
      } catch (error) {
        console.error("Hakkımızda bilgileri yüklenirken hata:", error);
        toast.error("Hakkımızda bilgileri yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHakkimizda();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008060]"></div>
      </div>
    );
  }

  if (!hakkimizda) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">
          Hakkımızda bilgileri yüklenemedi
        </h2>
        <p className="text-gray-500 mt-2">Lütfen daha sonra tekrar deneyiniz</p>
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
        <p className="text-[#120A8F] font-semibold text-sm">Hakkımızda</p>
      </div>

      {hakkimizda.ceo_resmi_url && (
        <img
          src={hakkimizda.ceo_resmi_url}
          alt="CEO"
          className="w-full max-w-[200px] h-auto object-cover rounded-lg"
        />
      )}

      <p className="text-xl font-semibold text-[#232323] my-4">
        CEO <span className="text-[#1C5540]">Mesajı</span>
      </p>

      <div className="montserrat text-[#232323] whitespace-pre-line">
        {hakkimizda.ceo_mesaji}
      </div>

      {hakkimizda.ceo_adi && (
        <div className="mt-2 flex justify-end">
          <p className="allura text-3xl">{hakkimizda.ceo_adi}</p>
        </div>
      )}

      {hakkimizda.vizyon && (
        <div className="mt-8">
          <p className="text-xl font-semibold text-[#232323] mb-4">Vizyon</p>
          <div className="montserrat text-[#232323] whitespace-pre-line">
            {hakkimizda.vizyon}
          </div>
        </div>
      )}

      {hakkimizda.misyon && (
        <div className="mt-8">
          <p className="text-xl font-semibold text-[#232323] mb-4">Misyon</p>
          <div className="montserrat text-[#232323] whitespace-pre-line">
            {hakkimizda.misyon}
          </div>
        </div>
      )}

      {hakkimizda.tarihce && (
        <div className="mt-8">
          <p className="text-xl font-semibold text-[#232323] mb-4">Tarihçe</p>
          <div className="montserrat text-[#232323] whitespace-pre-line">
            {hakkimizda.tarihce}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Hakkimizda;
