import React, { useState, useEffect } from "react";
import { firmaService } from "../../services/api";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const Galeri = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [galleryData, setGalleryData] = useState({
    baslik: "Resim Galerimiz",
    resimler: [],
  });

  useEffect(() => {
    loadGaleriData();
  }, []);

  const loadGaleriData = async () => {
    try {
      setLoading(true);
      const [ayarlarRes, resimlerRes] = await Promise.all([
        firmaService.getResimGalerisiAyarlar(id),
        firmaService.getResimGalerisi(id),
      ]);

      setGalleryData({
        baslik: "Resim Galerimiz",
        resimler: resimlerRes.data?.data || [],
      });
    } catch (error) {
      console.error("Galeri verileri yüklenirken hata:", error);
      toast.error("Galeri verileri yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#1C5540] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-8 h-fit montserrat py-10 montserrat border border-[#A2ACC7] outline-none rounded-xl flex flex-col gap-1 cursor-pointer mt-5">
      <div className="flex items-center gap-2">
        <img src="/images/icons/firma-profil/icons/resim.svg" alt="" />
        <p className="text-[#01A4BD] font-semibold">{galleryData.baslik}</p>
      </div>

      {galleryData.resimler.length > 0 && (
        <>
          <div className="mt-3 flex items-center gap-2">
            {galleryData.resimler.slice(0, 2).map((resim) => (
              <img
                key={resim.id}
                src={resim.resim_url}
                alt={resim.baslik}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>

          <div className="grid mt-2 grid-cols-4 lg:grid-cols-3 gap-2">
            {galleryData.resimler.slice(2, 7).map((resim) => (
              <img
                key={resim.id}
                src={resim.resim_url}
                alt={resim.baslik}
                className="size-20 object-cover rounded-lg"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Galeri;
