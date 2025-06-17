import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const Galeri = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
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
        baslik: ayarlarRes.data?.data?.baslik || "Resim Galerimiz",
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
    <motion.div
      className="montserrat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center">
        <p className="text-[#120A8F] font-semibold text-sm">
          {galleryData.baslik}
        </p>
      </div>

      <div className="my-5 relative">
        {selectedImage || galleryData.resimler.length > 0 ? (
          <img
            src={
              selectedImage
                ? selectedImage.resim_url
                : galleryData.resimler[0].resim_url
            }
            className="w-auto mx-auto h-64 object-contain rounded-xl"
            alt={
              selectedImage
                ? selectedImage.baslik
                : galleryData.resimler[0].baslik
            }
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-xl">
            <p className="text-gray-500">Galeri boş</p>
          </div>
        )}

        {galleryData.resimler.length > 0 && (
          <>
            <button
              type="button"
              className="absolute top-1/2 left-5 transform -translate-y-1/2"
              onClick={() => {
                const currentIndex = galleryData.resimler.findIndex(
                  (img) => img.id === selectedImage?.id
                );
                const prevIndex =
                  (currentIndex - 1 + galleryData.resimler.length) %
                  galleryData.resimler.length;
                setSelectedImage(galleryData.resimler[prevIndex]);
              }}
            >
              <img src="/images/icons/left-arrow-red.svg" alt="Önceki" />
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-5 transform -translate-y-1/2"
              onClick={() => {
                const currentIndex = galleryData.resimler.findIndex(
                  (img) => img.id === selectedImage?.id
                );
                const nextIndex =
                  (currentIndex + 1) % galleryData.resimler.length;
                setSelectedImage(galleryData.resimler[nextIndex]);
              }}
            >
              <img src="/images/icons/right-arrow-red.svg" alt="Sonraki" />
            </button>
          </>
        )}
      </div>

      <p className="bg-[#8B8138] rounded-t-xl px-6 py-2 text-white marcellus text-xl">
        Fotoğraf Albümümüz
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5">
        {galleryData.resimler.map((resim) => (
          <div key={resim.id} className="relative h-60">
            <img
              src={resim.resim_url}
              className="w-full h-full object-contain border border-black/15 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              alt={resim.baslik}
              onClick={() => setSelectedImage(resim)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Galeri;
