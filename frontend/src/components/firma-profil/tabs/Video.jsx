import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const Video = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
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
        baslik: ayarlarRes.data?.data?.baslik || "Video Galerimiz",
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
    <motion.div
      className="montserrat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center">
        <p className="text-[#120A8F] font-semibold text-sm">
          {videoData.baslik}
        </p>
      </div>

      <div className="my-5 relative">
        {selectedVideo || videoData.videolar.length > 0 ? (
          <div className="aspect-video w-full">
            <iframe
              src={
                selectedVideo
                  ? selectedVideo.video_url
                  : videoData.videolar[0].video_url
              }
              className="w-full h-full rounded-xl"
              allowFullScreen
              title={
                selectedVideo
                  ? selectedVideo.baslik
                  : videoData.videolar[0].baslik
              }
            />
          </div>
        ) : (
          <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-xl">
            <p className="text-gray-500">Video galerisi boş</p>
          </div>
        )}

        {videoData.videolar.length > 0 && (
          <>
            <button
              type="button"
              className="absolute top-1/2 left-5 transform -translate-y-1/2"
              onClick={() => {
                const currentIndex = videoData.videolar.findIndex(
                  (video) => video.id === selectedVideo?.id
                );
                const prevIndex =
                  (currentIndex - 1 + videoData.videolar.length) %
                  videoData.videolar.length;
                setSelectedVideo(videoData.videolar[prevIndex]);
              }}
            >
              <img src="/images/icons/left-arrow-red.svg" alt="Önceki" />
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-5 transform -translate-y-1/2"
              onClick={() => {
                const currentIndex = videoData.videolar.findIndex(
                  (video) => video.id === selectedVideo?.id
                );
                const nextIndex =
                  (currentIndex + 1) % videoData.videolar.length;
                setSelectedVideo(videoData.videolar[nextIndex]);
              }}
            >
              <img src="/images/icons/right-arrow-red.svg" alt="Sonraki" />
            </button>
          </>
        )}
      </div>

      <p className="bg-[#8B8138] rounded-t-xl px-6 py-2 text-white marcellus text-xl">
        Video Albümümüz
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5">
        {videoData.videolar.map((video) => (
          <div key={video.id} className="relative aspect-video">
            <div className="relative w-full h-full">
              <img
                src={
                  video.thumbnail_url ||
                  "/images/icons/firma-profil/icons/ornek-video.svg"
                }
                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                alt={video.baslik}
                onClick={() => setSelectedVideo(video)}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
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
    </motion.div>
  );
};

export default Video;
