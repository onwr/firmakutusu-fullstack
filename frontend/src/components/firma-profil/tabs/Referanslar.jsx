import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReferansCard from "./components/referanslar/ReferansCard";
import YorumCard from "./components/referanslar/YorumCard";
import { firmaService } from "../../../services/api";

const Referanslar = ({ id }) => {
  const [referanslar, setReferanslar] = useState([]);
  const [ayarlar, setAyarlar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReferansData = async () => {
      try {
        setLoading(true);
        const [referanslarRes, ayarlarRes] = await Promise.all([
          firmaService.getReferanslar(id),
          firmaService.getReferanslarAyarlar(id),
        ]);

        if (referanslarRes.data.success) {
          setReferanslar(referanslarRes.data.data);
        }

        if (ayarlarRes.data.success) {
          setAyarlar(ayarlarRes.data.data);
        }
      } catch (error) {
        console.error("Referans verileri yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReferansData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#120A8F]"></div>
      </div>
    );
  }

  if (referanslar.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Bu firma için referans bilgileri görüntülenemiyor.
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
        <p className="text-[#120A8F] font-semibold text-sm">Referanslarımız</p>
      </div>

      <p className="font-medium">{ayarlar?.baslik || "Referanslarımız"}</p>

      <p className="mt-5">
        {ayarlar?.metin ||
          "Firmamızın sunduğu hizmet ve ürünlere güvenen iş ortaklarımızı ve müşterilerimizi aşağıda bulabilirsiniz. Hayata geçirdiğimiz projeler ve kurduğumuz iş birlikleri, kaliteye verdiğimiz önemin ve müşteri memnuniyetine olan bağlılığımızın bir yansımasıdır."}
      </p>

      <p className="font-medium mt-5">
        {ayarlar?.referanslar_baslik ||
          "İş Ortaklarımız ve Çözüm Sağladığımız Firmalar"}
      </p>

      <p className="mt-2">
        {ayarlar?.referanslar_alt_baslik ||
          "Firmamızın iş birliği yaptığı ve hizmet sunduğu değerli iş ortaklarımızı aşağıda görebilirsiniz."}
      </p>

      <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {referanslar
          .filter((ref) => ref.durum === "onaylandi")
          .map((referans) => (
            <ReferansCard key={referans.id} referans={referans} />
          ))}
      </div>

      {referanslar.filter((ref) => ref.durum === "onaylandi").length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Henüz referans bulunmamaktadır.</p>
        </div>
      )}

      {ayarlar?.yorumlar_aktif && (
        <>
          <p className="font-medium mt-8">
            {ayarlar?.yorumlar_baslik || "Hizmet Verdiğimiz Müşterilerimiz"}
          </p>

          <p className="mt-2">
            {ayarlar?.yorumlar_alt_baslik ||
              "Ürün ve hizmetlerimize güvenen müşterilerimiz, başarımızın en büyük kanıtıdır."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            <YorumCard />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Referanslar;
