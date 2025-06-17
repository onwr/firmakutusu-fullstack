import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { FormInput } from "../../../components/common/Input";
import { BiTrash } from "react-icons/bi";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const GaleriIslem = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    baslik: "Resim Galerimiz",
    resimler: [],
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentEditImage, setCurrentEditImage] = useState(null);

  useEffect(() => {
    if (user?.yetkiliKisi?.firma_id) {
      loadGaleriData();
    }
  }, [user?.yetkiliKisi?.firma_id]);

  const loadGaleriData = async () => {
    try {
      setInitialLoading(true);
      const [ayarlarRes, resimlerRes] = await Promise.all([
        firmaService.getResimGalerisiAyarlar(user.yetkiliKisi.firma_id),
        firmaService.getResimGalerisi(user.yetkiliKisi.firma_id),
      ]);

      setFormData((prev) => ({
        ...prev,
        baslik: ayarlarRes.data?.data?.baslik || "Resim Galerimiz",
        resimler: resimlerRes.data?.data || [],
      }));
    } catch (error) {
      console.error("Galeri verileri yüklenirken hata:", error);
      toast.error("Galeri verileri yüklenirken bir hata oluştu");
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      // Önce resmi CDN'e yükle
      const uploadRes = await firmaService.uploadImage(file);

      if (!uploadRes.data.success) {
        throw new Error("Resim yüklenemedi");
      }

      const resimUrl = uploadRes.data.url;

      // Sonra veritabanına kaydet
      const response = await firmaService.createResim({
        firma_id: user.yetkiliKisi.firma_id,
        resim_url: resimUrl,
      });

      if (response.data.success) {
        toast.success("Resim başarıyla yüklendi");
        await loadGaleriData(); // Galeriyi yeniden yükle
      }
    } catch (error) {
      console.error("Resim yüklenirken hata:", error);
      toast.error("Resim yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      setLoading(true);
      const response = await firmaService.deleteResim(id);

      if (response.data.success) {
        toast.success("Resim başarıyla silindi");
        await loadGaleriData(); // Galeriyi yeniden yükle
      }
    } catch (error) {
      console.error("Resim silinirken hata:", error);
      toast.error("Resim silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await firmaService.updateResimGalerisiAyarlar({
        firma_id: user.yetkiliKisi.firma_id,
        baslik: formData.baslik,
      });

      if (response.data.success) {
        toast.success("Galeri ayarları başarıyla güncellendi");
      }
    } catch (error) {
      console.error("Galeri ayarları güncellenirken hata:", error);
      toast.error("Galeri ayarları güncellenirken bir hata oluştu");
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
        <p className="text-[#120A8F] font-semibold text-sm">Resim Galerimiz</p>
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

        <div className="my-5 relative">
          {selectedImage || formData.resimler.length > 0 ? (
            <img
              src={
                selectedImage
                  ? selectedImage.resim_url
                  : formData.resimler[0].resim_url
              }
              className="w-auto mx-auto h-64 object-contain rounded-xl"
              alt={
                selectedImage
                  ? selectedImage.baslik
                  : formData.resimler[0].baslik
              }
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-xl">
              <p className="text-gray-500">Galeri boş</p>
            </div>
          )}

          {formData.resimler.length > 0 && (
            <>
              <button
                type="button"
                className="absolute top-5 right-5 text-white bg-[#A42E2D] p-2 rounded"
                onClick={() => handleDeleteImage(formData.resimler[0].id)}
                disabled={loading}
              >
                <BiTrash />
              </button>
              <button
                type="button"
                className="absolute top-1/2 left-5 transform -translate-y-1/2"
                onClick={() => {
                  const currentIndex = formData.resimler.findIndex(
                    (img) => img.id === selectedImage?.id
                  );
                  const prevIndex =
                    (currentIndex - 1 + formData.resimler.length) %
                    formData.resimler.length;
                  setSelectedImage(formData.resimler[prevIndex]);
                }}
              >
                <img src="/images/icons/left-arrow-red.svg" alt="Önceki" />
              </button>
              <button
                type="button"
                className="absolute top-1/2 right-5 transform -translate-y-1/2"
                onClick={() => {
                  const currentIndex = formData.resimler.findIndex(
                    (img) => img.id === selectedImage?.id
                  );
                  const nextIndex =
                    (currentIndex + 1) % formData.resimler.length;
                  setSelectedImage(formData.resimler[nextIndex]);
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
          <button
            type="button"
            className="h-60 w-full outline-none bg-[#A2ACC7] rounded-lg gap-5 flex items-center flex-col justify-center"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            <img src="/images/img-upload.svg" alt="Upload" />
            <div className="flex items-center gap-3 justify-center">
              <img src="/images/add-black.svg" alt="Add" />
              <p className="text-lg font-medium">Yeni Resim Yükle</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
          </button>

          {formData.resimler.map((resim) => (
            <div key={resim.id} className="relative h-60">
              <img
                src={resim.resim_url}
                className="w-full h-full object-cover rounded-lg"
                alt={resim.baslik}
                onClick={() => setSelectedImage(resim)}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  className="text-white bg-[#A42E2D] p-2 rounded"
                  onClick={() => handleDeleteImage(resim.id)}
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

export default GaleriIslem;
