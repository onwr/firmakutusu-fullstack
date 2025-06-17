import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const KaliteBelge = ({ id }) => {
  const [belgeler, setBelgeler] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKaliteBelgeleri = async () => {
      try {
        setIsLoading(true);
        const response = await firmaService.getKaliteBelgeleri(id);
        console.log("Kalite Belgeleri Response:", response.data);

        if (response.data.success) {
          setBelgeler(response.data.data);
        } else {
          toast.error(response.data.message || "Kalite belgeleri alınamadı");
          setBelgeler([]);
        }
      } catch (error) {
        console.error("Kalite belgeleri yüklenirken hata:", error);
        toast.error("Kalite belgeleri yüklenirken bir hata oluştu");
        setBelgeler([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKaliteBelgeleri();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008060]"></div>
      </div>
    );
  }

  if (!belgeler.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">
          Henüz kalite belgesi bulunmamaktadır
        </h2>
        <p className="text-gray-500 mt-2">
          Lütfen daha sonra tekrar kontrol ediniz
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key="tab-4"
      className="montserrat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-end">
        <p className="text-[#120A8F] font-semibold text-sm">
          Kalite Belgelerimiz
        </p>
      </div>

      <p className="font-medium">Kalite Belgelerimiz</p>

      <p className="mt-5">
        Firmamızın kalite ve güvenilirlik standartlarını belgeleyen
        sertifikalarımızı aşağıda bulabilirsiniz. Hizmet ve ürünlerimizin ulusal
        ve uluslararası standartlara uygunluğunu gösteren bu belgeler, kaliteye
        verdiğimiz önemin bir göstergesidir.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {belgeler.map((belge) => (
          <div key={belge.id} className="px-2">
            <img
              src={
                belge.belge_resmi_url ||
                "/images/icons/firma-profil/icons/kalite-sertifika.svg"
              }
              className="rounded-t-xl w-full h-48 object-cover"
              alt={belge.belge_adi}
            />
            <div className="bg-[#51596C] rounded-b-xl p-4">
              <p className="montserrat font-semibold text-white">
                {belge.belge_adi}
              </p>
              {belge.sertifika_no && (
                <p className="text-white text-sm mt-1">
                  Sertifika No: {belge.sertifika_no}
                </p>
              )}
              {belge.verilis_tarihi && (
                <p className="text-white text-sm mt-1">
                  Veriliş Tarihi:{" "}
                  {new Date(belge.verilis_tarihi).toLocaleDateString("tr-TR")}
                </p>
              )}
              {belge.gecerlilik_bitis && (
                <p className="text-white text-sm mt-1">
                  Geçerlilik Bitiş:{" "}
                  {new Date(belge.gecerlilik_bitis).toLocaleDateString("tr-TR")}
                </p>
              )}
              <div className="flex gap-5 mt-4">
                <button
                  className="flex justify-center text-white text-sm items-center gap-2 w-full py-2 border border-white rounded-[4px]"
                  onClick={() => window.open(belge.belge_resmi_url, "_blank")}
                >
                  <img
                    src="/images/icons/firma-profil/icons/goster.svg"
                    alt="Göster"
                  />
                  Göster
                </button>
                <button
                  className="flex justify-center text-white text-sm items-center gap-2 w-full py-2 border border-white rounded-[4px]"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = belge.belge_resmi_url;
                    link.download = belge.belge_adi;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <img
                    src="/images/icons/firma-profil/icons/download.svg"
                    alt="İndir"
                  />
                  İndir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default KaliteBelge;
