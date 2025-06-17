import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { FormInput } from "../../../components/common/Input";
import { BiTrash, BiPlayCircle } from "react-icons/bi";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const VideoIslem = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    baslik: "Videolarımız",
    videolar: [],
  });
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (user?.yetkiliKisi?.firma_id) {
      loadVideoData();
    }
  }, [user?.yetkiliKisi?.firma_id]);

  const loadVideoData = async () => {
    try {
      setInitialLoading(true);
      const [ayarlarRes, videolarRes] = await Promise.all([
        firmaService.getVideoGalerisiAyarlar(user.yetkiliKisi.firma_id),
        firmaService.getVideoGalerisi(user.yetkiliKisi.firma_id),
      ]);

      setFormData((prev) => ({
        ...prev,
        baslik: ayarlarRes.data?.data?.baslik || "Videolarımız",
        videolar: videolarRes.data?.data || [],
      }));
    } catch (error) {
      console.error("Video verileri yüklenirken hata:", error);
      toast.error("Video verileri yüklenirken bir hata oluştu");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes("video")) {
      toast.error("Lütfen geçerli bir video dosyası seçin!");
      return;
    }

    try {
      setLoading(true);
      // Önce videoyu CDN'e yükle
      const uploadRes = await firmaService.uploadVideo(file);

      if (!uploadRes.data.success) {
        throw new Error("Video yüklenemedi");
      }

      const videoUrl = uploadRes.data.url;

      // Sonra veritabanına kaydet
      const response = await firmaService.createVideo({
        firma_id: user.yetkiliKisi.firma_id,
        video_url: videoUrl,
      });

      if (response.data.success) {
        toast.success("Video başarıyla yüklendi");
        await loadVideoData(); // Galeriyi yeniden yükle
      }
    } catch (error) {
      console.error("Video yüklenirken hata:", error);
      toast.error("Video yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      setLoading(true);
      const response = await firmaService.deleteVideo(id);

      if (response.data.success) {
        toast.success("Video başarıyla silindi");
        if (selectedVideo && selectedVideo.id === id) {
          setSelectedVideo(null);
        }
        await loadVideoData(); // Galeriyi yeniden yükle
      }
    } catch (error) {
      console.error("Video silinirken hata:", error);
      toast.error("Video silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await firmaService.updateVideoGalerisiAyarlar({
        firma_id: user.yetkiliKisi.firma_id,
        baslik: formData.baslik,
      });

      if (response.data.success) {
        toast.success("Video galerisi ayarları başarıyla güncellendi");
      }
    } catch (error) {
      console.error("Video galerisi ayarları güncellenirken hata:", error);
      toast.error("Video galerisi ayarları güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#1C5540] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      key="tab-1"
      className="montserrat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center">
        <p className="text-[#120A8F] font-semibold text-sm">Video Galerimiz</p>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-[#1C5540] text-white rounded-lg text-sm"
        >
          {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Başlık"
          name="baslik"
          value={formData.baslik}
          onChange={handleInputChange}
          className="mt-5"
        />

        <div className="my-5 relative bg-black rounded-xl">
          {selectedVideo || formData.videolar.length > 0 ? (
            <video
              src={
                selectedVideo
                  ? selectedVideo.video_url
                  : formData.videolar[0].video_url
              }
              className="w-full h-60 lg:h-96 object-contain rounded-xl"
              controls
              poster="/images/videobaslik.png"
            >
              Tarayıcınız video etiketini desteklemiyor.
            </video>
          ) : (
            <div className="w-full h-64 bg-gray-800 flex items-center justify-center rounded-xl text-white">
              <p>Video galerisi boş</p>
            </div>
          )}

          {(selectedVideo || formData.videolar.length > 0) && (
            <>
              {formData.videolar.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute top-1/2 left-5 transform -translate-y-1/2 z-10"
                    onClick={() => {
                      const currentIndex = formData.videolar.findIndex(
                        (vid) => vid.id === selectedVideo?.id
                      );
                      const prevIndex =
                        (currentIndex - 1 + formData.videolar.length) %
                        formData.videolar.length;
                      setSelectedVideo(formData.videolar[prevIndex]);
                    }}
                  >
                    <img src="/images/icons/left-arrow-red.svg" alt="Önceki" />
                  </button>
                  <button
                    type="button"
                    className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10"
                    onClick={() => {
                      const currentIndex = formData.videolar.findIndex(
                        (vid) => vid.id === selectedVideo?.id
                      );
                      const nextIndex =
                        (currentIndex + 1) % formData.videolar.length;
                      setSelectedVideo(formData.videolar[nextIndex]);
                    }}
                  >
                    <img
                      src="/images/icons/right-arrow-red.svg"
                      alt="Sonraki"
                    />
                  </button>
                </>
              )}

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  className="text-white bg-[#A42E2D] p-2 rounded"
                  onClick={() =>
                    handleDeleteVideo(
                      (selectedVideo || formData.videolar[0]).id
                    )
                  }
                  disabled={loading}
                >
                  <BiTrash />
                </button>
              </div>
            </>
          )}
        </div>

        <p className="bg-[#8B8138] rounded-t-xl px-6 py-2 text-white marcellus text-xl">
          Video Koleksiyonumuz
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5">
          <button
            type="button"
            className="h-60 w-full outline-none bg-[#A2ACC7] rounded-lg gap-5 flex items-center flex-col justify-center"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            <img src="/images/video-upload.svg" alt="Upload" />
            <div className="flex items-center gap-3 justify-center">
              <img src="/images/add-black.svg" alt="Add" />
              <p className="text-lg font-medium">Yeni Video Yükle</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleVideoUpload}
              className="hidden"
              accept="video/*"
            />
          </button>

          {formData.videolar.map((video) => (
            <div key={video.id} className="relative h-60 group">
              <div
                className="w-full h-full rounded-lg bg-black cursor-pointer overflow-hidden"
                onClick={() => setSelectedVideo(video)}
              >
                <video
                  src={video.video_url}
                  className="w-full h-full object-cover"
                  muted
                >
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all">
                  <BiPlayCircle className="text-white text-5xl" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 truncate">
                {video.baslik}
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  className="text-white bg-[#A42E2D] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVideo(video.id);
                  }}
                  disabled={loading}
                >
                  <BiTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </form>
    </motion.div>
  );
};

export default VideoIslem;
