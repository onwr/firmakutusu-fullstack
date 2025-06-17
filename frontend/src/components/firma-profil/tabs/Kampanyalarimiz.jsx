import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const Kampanyalarimiz = ({ id }) => {
  const [kampanyalar, setKampanyalar] = useState([]);
  const [ayarlar, setAyarlar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [kampanyalarResponse, ayarlarResponse] = await Promise.all([
          firmaService.getKampanyalar(id),
          firmaService.getKampanyalarAyarlar(id),
        ]);

        console.log("Kampanyalar Response:", kampanyalarResponse.data);
        console.log("Kampanyalar Ayarlar Response:", ayarlarResponse.data);

        if (kampanyalarResponse.data.success) {
          setKampanyalar(kampanyalarResponse.data.data);
        } else {
          toast.error(
            kampanyalarResponse.data.message || "Kampanyalar alınamadı"
          );
          setKampanyalar([]);
        }

        if (ayarlarResponse.data.success) {
          setAyarlar(ayarlarResponse.data.data);
        } else {
          toast.error(
            ayarlarResponse.data.message || "Kampanya ayarları alınamadı"
          );
          setAyarlar(null);
        }
      } catch (error) {
        console.error("Veri yüklenirken hata:", error);
        toast.error("Veriler yüklenirken bir hata oluştu");
        setKampanyalar([]);
        setAyarlar(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008060]"></div>
      </div>
    );
  }

  if (!kampanyalar.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">
          Henüz kampanya bulunmamaktadır
        </h2>
        <p className="text-gray-500 mt-2">
          Lütfen daha sonra tekrar kontrol ediniz
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key="tab-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="montserrat text-[#232323]"
    >
      <div className="flex justify-end montserrat">
        <p className="text-[#120A8F] font-semibold text-sm">Kampanyalarımız</p>
      </div>

      <p className="font-medium text-black">
        {ayarlar?.baslik || "Kampanyalarımız"}
      </p>

      <p className="mt-5 text-black">
        {ayarlar?.metin ||
          "Düğün, Toplantı veya düzenleyeceğiniz kongrelerde siz ve misafirlerinizi yüksek kalitede ağırlayabilme misyonu ile hizmet vermeyi amaç ediniyor ve sizi kendi davetinize davet ediyoruz."}
      </p>

      {kampanyalar.map((kampanya) => (
        <div key={kampanya.id} className="mt-8">
          <div className="flex flex-col gap-2">
            <p className="text-[#232323] font-medium flex flex-row gap-4">
              Kampanya Başlangıç Tarihi{" "}
              <span>
                :{" "}
                {new Date(kampanya.baslangic_tarihi).toLocaleDateString(
                  "tr-TR"
                )}
              </span>
            </p>
            <p className="text-[#232323] font-medium flex flex-row gap-4">
              Kampanya Bitiş Tarihi{" "}
              <span>
                : {new Date(kampanya.bitis_tarihi).toLocaleDateString("tr-TR")}
              </span>
            </p>
          </div>

          {kampanya.aciklama && (
            <p className="mt-4 text-gray-700">{kampanya.aciklama}</p>
          )}

          {kampanya.kapak_resmi_url && (
            <img
              src={kampanya.kapak_resmi_url}
              alt="Kampanya Afişi"
              className="mt-5 w-auto max-h-[300px] rounded-lg shadow-md"
            />
          )}

          {kampanya.acilis_katalogu && kampanya.katalog_pdf_url && (
            <div className="mt-4">
              <a
                href={kampanya.katalog_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#120A8F] text-white rounded-md hover:bg-[#0d0770] transition-colors"
              >
                <img
                  src="/images/icons/firma-profil/icons/download.svg"
                  alt="İndir"
                />
                Kataloğu İndir
              </a>
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default Kampanyalarimiz;
