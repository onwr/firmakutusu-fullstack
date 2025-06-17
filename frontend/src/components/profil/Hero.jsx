import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { firmaService } from "../../services/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FirmaPdfTemplate from "./FirmaPdfTemplate";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [firmaDetay, setFirmaDetay] = useState(null);

  useEffect(() => {
    const loadFirmaDetay = async () => {
      try {
        const response = await firmaService.getFirma();
        setFirmaDetay(response.data.data);
      } catch (error) {
        console.error("Firma detayları yüklenirken hata:", error);
        toast.error("Firma detayları yüklenirken bir hata oluştu.");
      }
    };

    if (user?.yetkiliKisi?.firma_id) {
      loadFirmaDetay();
    }
  }, [user?.yetkiliKisi?.firma_id]);

  const handleProfilDuzenle = () => {
    navigate("/hesap/profil#firma-profil");
    setTimeout(() => {
      const element = document.getElementById("firma-profil");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handlePdfIndir = () => {
    if (!firmaDetay) {
      toast.error("Firma bilgileri yüklenemedi!");
      return;
    }
  };

  const handlePaylas = async () => {
    try {
      // URL'yi oluştur
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/firma/${user?.yetkiliKisi?.firma_id}`;

      // Panoya kopyala
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Profil linki kopyalandı!");
    } catch (error) {
      toast.error("Link kopyalanırken bir hata oluştu!");
    }
  };

  const handleUpline = () => {
    toast.info("Upline özelliği yakında eklenecek!");
  };

  const handleDownline = () => {
    toast.info("Downline özelliği yakında eklenecek!");
  };

  const handleMessage = () => {
    toast.info("Mesaj özelliği yakında eklenecek!");
  };

  const handleStar = () => {
    toast.info("Yıldız verme özelliği yakında eklenecek!");
  };

  const handleDownload = () => {
    toast.info("İndirme özelliği yakında eklenecek!");
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Profil linki kopyalandı!");
    } catch (error) {
      toast.error("Link kopyalanırken bir hata oluştu!");
    }
  };

  return (
    <div className="relative h-[200px]">
      <img
        src="/images/icons/firma-profil/firma-profilhero.svg"
        className="w-full h-full object-cover rounded-t-2xl"
        alt={firmaDetay?.firma_unvani || "Firma Kapak"}
      />
      <div className="absolute top-4 md:top-32 right-4">
        <div className="flex pl-5 flex-row gap-2">
          {[
            {
              icon: "duzenle",
              title: "Profilimi Düzenle",
              handler: handleProfilDuzenle,
            },
            {
              icon: "pdf-indir",
              title: "Dijital Kartvizit İndir",
              component: (
                <PDFDownloadLink
                  document={<FirmaPdfTemplate firmaDetay={firmaDetay} />}
                  fileName={`${firmaDetay?.firma_unvani || "firma"}-profil.pdf`}
                  className="w-full h-full"
                >
                  {({ loading }) => (
                    <div className="flex flex-col gap-1 items-center justify-center">
                      <img
                        src="/images/icons/profil/pdf-indir.svg"
                        className="size-5"
                        alt="pdf-indir"
                      />
                      <p className="text-[#10069F] text-[10px] lg:text-sm montserrat font-medium">
                        {loading ? "Yükleniyor..." : "Dijital Kartvizit İndir"}
                      </p>
                    </div>
                  )}
                </PDFDownloadLink>
              ),
            },
            {
              icon: "paylas",
              title: "Profilimi Paylaş",
              handler: handlePaylas,
            },
          ].map(({ icon, title, handler, component }) => (
            <motion.button
              key={icon}
              className="p-2 rounded-[4px] flex flex-col gap-1 items-center justify-center bg-[#CED4DA] cursor-pointer hover:bg-[#CED4DA]/90 duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handler}
            >
              {component || (
                <>
                  <img
                    src={`/images/icons/profil/${icon}.svg`}
                    className="size-5"
                    alt={icon}
                  />
                  <p className="text-[#10069F] text-[10px] lg:text-sm montserrat font-medium">
                    {title}
                  </p>
                </>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
