import React, { useState, useEffect } from "react";
import { firmaService } from "../../services/api";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const VGaleri = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState({
    baslik: "Video Galerimiz",
    videolar: [],
  });

  useEffect(() => {
    loadVideoData();
  }, []);

  const loadVideoData = async () => {
    try {
      setLoading(true);
      const [ayarlarRes, videolarRes] = await Promise.all([
        firmaService.getVideoGalerisiAyarlar(id),
        firmaService.getVideoGalerisi(id),
      ]);

      setVideoData({
        baslik: "Video Galerimiz",
        videolar: videolarRes.data?.data || [],
      });
    } catch (error) {
      console.error("Video galerisi verileri yüklenirken hata:", error);
      toast.error("Video galerisi verileri yüklenirken bir hata oluştu");
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
        <img src="/images/icons/firma-profil/icons/video.svg" alt="" />
        <p className="text-[#01A4BD] font-semibold">{videoData.baslik}</p>
      </div>

      {videoData.videolar.length > 0 && (
        <div className="grid mt-2 grid-cols-4 lg:grid-cols-3 gap-2">
          {videoData.videolar.slice(0, 5).map((video) => (
            <div key={video.id} className="relative aspect-video">
              <div className="relative w-full h-full">
                <img
                  src={
                    video.thumbnail_url ||
                    "/images/icons/firma-profil/icons/ornek-video.svg"
                  }
                  className="w-full h-full object-cover rounded-lg"
                  alt={video.baslik}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VGaleri;
