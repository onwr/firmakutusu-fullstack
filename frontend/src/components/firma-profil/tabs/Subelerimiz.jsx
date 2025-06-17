import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const Subelerimiz = ({ id }) => {
  const [subeler, setSubeler] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [calismaSaatleri, setCalismaSaatleri] = useState({});

  // Günleri sıralamak için yardımcı fonksiyon
  const gunSiralama = {
    Pazartesi: 1,
    Salı: 2,
    Çarşamba: 3,
    Perşembe: 4,
    Cuma: 5,
    Cumartesi: 6,
    Pazar: 7,
  };

  useEffect(() => {
    const fetchSubeler = async () => {
      try {
        setIsLoading(true);
        const response = await firmaService.getSubeler(id);
        console.log("Şubeler Response:", response.data);

        if (response.data.success) {
          const subelerData = response.data.data;
          setSubeler(subelerData);

          // Her şube için çalışma saatlerini getir
          const saatlerPromises = subelerData.map(async (sube) => {
            try {
              const saatlerResponse = await firmaService.getCalismaSaatleri(
                sube.id
              );
              if (saatlerResponse.data.success) {
                // Çalışma saatlerini sırala
                const siraliSaatler = saatlerResponse.data.data.sort(
                  (a, b) => gunSiralama[a.gun] - gunSiralama[b.gun]
                );
                return { [sube.id]: siraliSaatler };
              }
              return { [sube.id]: [] };
            } catch (error) {
              console.error(
                `Şube ${sube.id} için çalışma saatleri alınamadı:`,
                error
              );
              return { [sube.id]: [] };
            }
          });

          const saatlerResults = await Promise.all(saatlerPromises);
          const saatlerMap = saatlerResults.reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {}
          );
          setCalismaSaatleri(saatlerMap);
        } else {
          toast.error(response.data.message || "Şubeler alınamadı");
          setSubeler([]);
        }
      } catch (error) {
        console.error("Şubeler yüklenirken hata:", error);
        toast.error("Şubeler yüklenirken bir hata oluştu");
        setSubeler([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubeler();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008060]"></div>
      </div>
    );
  }

  if (!subeler.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">
          Henüz şube bulunmamaktadır
        </h2>
        <p className="text-gray-500 mt-2">
          Lütfen daha sonra tekrar kontrol ediniz
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key="tab-2"
      className="montserrat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-end">
        <p className="text-[#120A8F] font-semibold text-sm">Şubelerimiz</p>
      </div>

      <p className="font-medium">Şubelerimiz</p>

      <p className="mt-5">
        Firmamızın farklı lokasyonlardaki şubelerini aşağıda bulabilirsiniz.
        Size en yakın şubemizi ziyaret ederek hizmetlerimizden yerinde
        faydalanabilirsiniz.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {subeler.map((sube, index) => (
          <div key={sube.id || index}>
            <img
              src={
                sube.kapak_resmi_url ||
                "/images/icons/firma-profil/icons/sube-resim.svg"
              }
              className="w-full rounded-t-xl"
              alt={sube.sube_adi}
            />
            <div className="py-4 px-8 border rounded-b-xl border-[#A2ACC7]">
              <p className="audiowide text-2xl bg-[#A2ACC7] py-2 px-5 rounded-lg text-white w-fit">
                {index + 1}
              </p>
              <p className="font-semibold text-[#232323] mt-5">
                {sube.sube_adi}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-start gap-1.5">
                  <img
                    src="/images/icons/firma-profil/icons/konum.svg"
                    alt="Konum"
                  />
                  <p className="text-[#232323] text-sm">{sube.sube_adresi}</p>
                </div>
                <div className="flex items-start gap-1.5">
                  <img
                    src="/images/icons/firma-profil/icons/email.svg"
                    alt="E-posta"
                  />
                  <p className="text-[#232323] text-sm">{sube.mail_adresi}</p>
                </div>
                <div className="flex items-start gap-1.5">
                  <img
                    src="/images/icons/firma-profil/icons/telefon.svg"
                    alt="Telefon"
                  />
                  <p className="text-[#232323] text-sm">
                    {sube.telefon_numarasi}
                  </p>
                </div>
                <div className="flex items-start gap-1.5">
                  <img
                    src="/images/icons/firma-profil/icons/calisma-saat.svg"
                    alt="Çalışma Saatleri"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-[#232323] text-sm">Çalışma Saatleri</p>
                    {calismaSaatleri[sube.id]?.length > 0 ? (
                      calismaSaatleri[sube.id].map((saat, idx) => (
                        <div key={idx} className="flex items-center">
                          <p className="text-[#232323] w-20 text-sm">
                            {saat.gun}
                          </p>
                          <p
                            className={saat.kapali === 1 ? "font-semibold" : ""}
                          >
                            {saat.kapali === 1
                              ? "Kapalı"
                              : saat.acilis_saati === null ||
                                saat.kapanis_saati === null
                              ? "Bu gün ile ilgili veri bulunmamaktadır"
                              : `${saat.acilis_saati.slice(
                                  0,
                                  5
                                )} - ${saat.kapanis_saati.slice(0, 5)}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#232323] text-sm">
                        Çalışma saatleri belirtilmemiş
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Subelerimiz;
