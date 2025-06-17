import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firmaService } from "../../../../services/api";
import { toast } from "sonner";
import { useAuth } from "../../../../context/AuthContext";

const ReferansCard = ({ referans, renk, menurenk, loadReferansData }) => {
  const { user } = useAuth();
  const firmaId = user?.yetkiliKisi?.firma_id;
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firmaDetay, setFirmaDetay] = useState(null);

  useEffect(() => {
    const getFirmaDetay = async () => {
      try {
        // Referansın hangi firma ID'sini kullanacağımızı belirle
        let targetFirmaId;
        if (referans.durum === "beklemede") {
          // Bekleyen referanslar için
          if (referans.ilgili_firma_id === firmaId) {
            // Bana gelen talep ise talep eden firmanın bilgilerini göster
            targetFirmaId = referans.firma_id;
          } else {
            // Benim gönderdiğim talep ise hedef firmanın bilgilerini göster
            targetFirmaId = referans.ilgili_firma_id;
          }
        } else {
          // Onaylanmış referanslar için
          if (referans.ilgili_firma_id === firmaId) {
            // Benim verdiğim referans ise referans olan firmanın bilgilerini göster
            targetFirmaId = referans.firma_id;
          } else {
            // Bana verilen referans ise referans veren firmanın bilgilerini göster
            targetFirmaId = referans.ilgili_firma_id;
          }
        }

        const response = await firmaService.getFirmaById(targetFirmaId);
        if (response.data.success) {
          setFirmaDetay(response.data.data);
        }
      } catch (error) {
        console.error("Firma detayları alınırken hata:", error);
      }
    };

    getFirmaDetay();
  }, [referans, firmaId]);

  const handleGeriCek = async () => {
    try {
      setLoading(true);
      const response = await firmaService.updateReferans(referans.id, {
        durum: "iptal",
      });
      if (response.data.success) {
        toast.success("Referans talebi geri çekildi");
        loadReferansData();
      }
    } catch (error) {
      console.error("Talep geri çekilirken hata:", error);
      toast.error("Talep geri çekilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleOnayla = async () => {
    try {
      setLoading(true);
      const response = await firmaService.updateReferans(referans.id, {
        durum: "onaylandi",
      });
      if (response.data.success) {
        toast.success("Referans talebi onaylandı");
        loadReferansData();
      }
    } catch (error) {
      console.error("Talep onaylanırken hata:", error);
      toast.error("Talep onaylanırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleReddet = async () => {
    try {
      setLoading(true);
      const response = await firmaService.updateReferans(referans.id, {
        durum: "reddedildi",
      });
      if (response.data.success) {
        toast.success("Referans talebi reddedildi");
        loadReferansData();
      }
    } catch (error) {
      console.error("Talep reddedilirken hata:", error);
      toast.error("Talep reddedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleKaldir = async () => {
    try {
      setLoading(true);
      const response = await firmaService.updateReferans(referans.id, {
        durum: "iptal",
      });
      if (response.data.success) {
        toast.success("Referans kaldırıldı");
        loadReferansData();
      }
    } catch (error) {
      console.error("Referans kaldırılırken hata:", error);
      toast.error("Referans kaldırılırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      className="flex flex-col border border-[#CED4DA] rounded-xl relative"
    >
      <div className="relative h-32">
        <motion.img
          src="/images/icons/home/firma-vitrin/cizgilikare.svg"
          className="rounded-t-xl w-full h-32 object-cover"
          alt="Firma Profil"
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
            className="rounded-xl w-full h-28 object-contain"
            alt="Logo"
          />
        </motion.div>

        {(referans.durum === "beklemede" || referans.durum === "onaylandi") && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ backgroundColor: menurenk }}
            onClick={() => setMenuOpen(!menuOpen)}
            disabled={loading}
            className="absolute p-1 rounded-sm top-3 cursor-pointer right-5"
          >
            <img src="/images/icons/menu.svg" alt="Menü" className="size-5" />
          </motion.button>
        )}

        {menuOpen && (
          <div className="absolute right-5 top-12 bg-white shadow-lg rounded-md p-2 z-10">
            {referans.durum === "beklemede" ? (
              referans.ilgili_firma_id === firmaId ? (
                <>
                  <button
                    onClick={handleOnayla}
                    disabled={loading}
                    className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded w-full text-left mb-1"
                  >
                    {loading ? "İşleniyor..." : "Talebi Onayla"}
                  </button>
                  <button
                    onClick={handleReddet}
                    disabled={loading}
                    className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded w-full text-left"
                  >
                    {loading ? "İşleniyor..." : "Talebi Reddet"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGeriCek}
                  disabled={loading}
                  className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded w-full text-left"
                >
                  {loading ? "İşleniyor..." : "Talebi Geri Çek"}
                </button>
              )
            ) : (
              <button
                onClick={handleKaldir}
                disabled={loading}
                className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded w-full text-left"
              >
                {loading ? "İşleniyor..." : "Referansı Kaldır"}
              </button>
            )}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ backgroundColor: renk }}
        className="pt-6 h-full px-4 pb-3 text-[#232323] flex montserrat items-center flex-col"
      >
        <p className="line-clamp-2 text-sm text-center font-semibold">
          {firmaDetay?.firma_unvani || referans.ilgili_firma_adi}
        </p>
        <p className="my-2 text-xs text-center font-medium">
          Talep Tarihi:{" "}
          {new Date(referans.talep_tarihi).toLocaleDateString("tr-TR")}
        </p>
        <p className="text-xs text-center line-clamp-3">
          {referans.referans_mesaji}
        </p>
        <p className="text-xs text-center mt-2 font-medium">
          Durum:{" "}
          {referans.durum === "beklemede"
            ? "Beklemede"
            : referans.durum === "onaylandi"
            ? "Onaylandı"
            : "İptal Edildi"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ReferansCard;
