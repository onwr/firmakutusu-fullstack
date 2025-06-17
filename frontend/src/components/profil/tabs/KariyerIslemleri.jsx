import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import {
  FormInput,
  FormTextarea,
  FormInputLock,
} from "../../../components/common/Input";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const KariyerIslemleri = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newSoru, setNewSoru] = useState("");

  const [formData, setFormData] = useState({
    baslik: "",
    metin: "",
    email_adresi: "",
    aydinlatma_metni: "",
    kariyer_sorulari: [],
  });

  // Sabit sorular
  const sabitSorular = [];

  useEffect(() => {
    if (user?.yetkiliKisi?.firma_id) {
      loadKariyerData();
    }
  }, [user?.yetkiliKisi?.firma_id]);

  const loadKariyerData = async () => {
    try {
      setInitialLoading(true);
      const [ayarlarRes, sorularRes] = await Promise.all([
        firmaService.getIsKariyerAyarlar(user.yetkiliKisi.firma_id),
        firmaService.getIsKariyerSorular(user.yetkiliKisi.firma_id),
      ]);

      console.log("Ayarlar:", ayarlarRes.data);
      console.log("Sorular:", sorularRes.data);

      // Sabit soruları ekle
      const tumSorular = [...sabitSorular];

      // API'den gelen özel soruları ekle
      if (Array.isArray(sorularRes.data)) {
        sorularRes.data.forEach((soru) => {
          if (!sabitSorular.find((s) => s.id === soru.id)) {
            tumSorular.push(soru);
          }
        });
      }

      setFormData({
        baslik: ayarlarRes.data.baslik || "",
        metin: ayarlarRes.data.metin || "",
        email_adresi: ayarlarRes.data.email_adresi || "",
        aydinlatma_metni: ayarlarRes.data.aydinlatma_metni || "",
        kariyer_sorulari: tumSorular,
      });
    } catch (error) {
      console.error("Kariyer verileri yüklenirken hata:", error);
      toast.error("Kariyer verileri yüklenirken bir hata oluştu");
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

  const handleSoruChange = async (id, value) => {
    const soru = formData.kariyer_sorulari.find((s) => s.id === id);
    if (soru?.sabit) {
      toast.error("Sabit sorular düzenlenemez");
      return;
    }

    try {
      setLoading(true);
      const response = await firmaService.updateIsKariyerSoru(id, {
        soru_metni: value,
      });

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          kariyer_sorulari: prev.kariyer_sorulari.map((soru) =>
            soru.id === id ? { ...soru, soru_metni: value } : soru
          ),
        }));
        toast.success("Soru başarıyla güncellendi");
      }
    } catch (error) {
      console.error("Soru güncellenirken hata:", error);
      toast.error("Soru güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSiraChange = async (id, direction) => {
    try {
      setLoading(true);
      const sorular = [...formData.kariyer_sorulari];
      const index = sorular.findIndex((soru) => soru.id === id);
      const soru = sorular[index];

      if (soru.sabit) {
        toast.error("Sabit soruların sırası değiştirilemez");
        return;
      }

      if (direction === "up" && index > 4) {
        // Sabit sorulardan sonra başla
        [sorular[index - 1], sorular[index]] = [
          sorular[index],
          sorular[index - 1],
        ];
        sorular[index - 1].sira = index;
        sorular[index].sira = index + 1;
      } else if (direction === "down" && index < sorular.length - 1) {
        [sorular[index], sorular[index + 1]] = [
          sorular[index + 1],
          sorular[index],
        ];
        sorular[index].sira = index + 1;
        sorular[index + 1].sira = index + 2;
      }

      // Her iki soruyu da güncelle
      await Promise.all([
        firmaService.updateIsKariyerSoru(sorular[index].id, {
          sira: sorular[index].sira,
        }),
        firmaService.updateIsKariyerSoru(
          sorular[index + (direction === "up" ? -1 : 1)].id,
          {
            sira: sorular[index + (direction === "up" ? -1 : 1)].sira,
          }
        ),
      ]);

      setFormData((prev) => ({
        ...prev,
        kariyer_sorulari: sorular,
      }));

      toast.success("Soru sırası güncellendi");
    } catch (error) {
      console.error("Soru sırası güncellenirken hata:", error);
      toast.error("Soru sırası güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSoru = async () => {
    if (!newSoru.trim()) {
      toast.error("Lütfen bir soru girin");
      return;
    }

    if (formData.kariyer_sorulari.length >= 10) {
      toast.error("En fazla 10 soru ekleyebilirsiniz");
      return;
    }

    try {
      setLoading(true);
      const response = await firmaService.createIsKariyerSoru({
        firma_id: user.yetkiliKisi.firma_id,
        soru_metni: newSoru.trim(),
        sira: formData.kariyer_sorulari.length + 1,
        sabit: false,
      });

      if (response.data.success) {
        const yeniSoru = {
          id: response.data.insertId,
          firma_id: user.yetkiliKisi.firma_id,
          soru_metni: newSoru.trim(),
          sira: formData.kariyer_sorulari.length + 1,
          sabit: false,
        };

        setFormData((prev) => ({
          ...prev,
          kariyer_sorulari: [...prev.kariyer_sorulari, yeniSoru],
        }));
        setNewSoru("");
        toast.success("Soru başarıyla eklendi");
      }
    } catch (error) {
      console.error("Soru eklenirken hata:", error);
      toast.error("Soru eklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSoru = async (id) => {
    const soru = formData.kariyer_sorulari.find((s) => s.id === id);
    if (soru?.sabit) {
      toast.error("Sabit sorular silinemez");
      return;
    }

    try {
      setLoading(true);
      const response = await firmaService.deleteIsKariyerSoru(id);

      if (response.data.success) {
        // Silinen sorudan sonraki soruların sırasını güncelle
        const guncelSorular = formData.kariyer_sorulari
          .filter((s) => s.id !== id)
          .map((soru, index) => ({
            ...soru,
            sira: soru.sabit ? soru.sira : index + 5, // Sabit sorulardan sonra başla
          }));

        // Sıra numaralarını API'de güncelle
        await Promise.all(
          guncelSorular
            .filter((s) => !s.sabit)
            .map((soru) =>
              firmaService.updateIsKariyerSoru(soru.id, { sira: soru.sira })
            )
        );

        setFormData((prev) => ({
          ...prev,
          kariyer_sorulari: guncelSorular,
        }));
        toast.success("Soru başarıyla silindi");
      }
    } catch (error) {
      console.error("Soru silinirken hata:", error);
      toast.error("Soru silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await firmaService.updateIsKariyerAyarlar({
        firma_id: user.yetkiliKisi.firma_id,
        baslik: formData.baslik,
        metin: formData.metin,
        email_adresi: formData.email_adresi,
        aydinlatma_metni: formData.aydinlatma_metni,
      });

      if (response.data.success) {
        toast.success("Kariyer ayarları başarıyla güncellendi");
        await loadKariyerData();
      } else {
        throw new Error("Güncelleme başarısız oldu");
      }
    } catch (error) {
      console.error("Kariyer ayarları güncellenirken hata:", error);
      toast.error("Kariyer ayarları güncellenirken bir hata oluştu");
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
        <p className="text-[#120A8F] font-semibold text-sm">
          Bize Katılın | İş & Kariyer
        </p>
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

        <FormTextarea
          label="Metin"
          name="metin"
          value={formData.metin}
          onChange={handleInputChange}
          className="mt-2"
        />

        <FormInput
          label="Başvuruların Gönderileceği E-Posta"
          name="email_adresi"
          value={formData.email_adresi}
          onChange={handleInputChange}
          itemsStart={true}
          className="mt-5 text-sm"
        />

        <FormTextarea
          label="Aydınlatma Metni"
          name="aydinlatma_metni"
          value={formData.aydinlatma_metni}
          onChange={handleInputChange}
          itemsStart={true}
          className="mt-5 text-sm"
        />

        <div className="mt-8">
          {/* Sabit Sorular */}
          {formData.kariyer_sorulari
            .filter((soru) => soru.sabit)
            .sort((a, b) => a.sira - b.sira)
            .map((soru) => (
              <div key={soru.id} className="mb-4">
                <div className="flex justify-between items-center">
                  <FormInputLock
                    label={`${soru.sira}. Soru`}
                    value={soru.soru_metni}
                    className="w-full"
                    disabled={true}
                  />
                </div>
              </div>
            ))}

          {/* Özel Sorular */}
          {formData.kariyer_sorulari
            .filter((soru) => !soru.sabit)
            .sort((a, b) => a.sira - b.sira)
            .map((soru) => (
              <div key={soru.id} className="mb-4">
                <div className="flex justify-between items-center gap-2">
                  <FormInput
                    label={`${soru.sira}. Soru`}
                    value={soru.soru_metni}
                    onChange={(e) => handleSoruChange(soru.id, e.target.value)}
                    className="w-full"
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => handleSiraChange(soru.id, "up")}
                      disabled={loading || soru.sira === 5}
                      className="p-2 bg-[#F1EEE6] text-[#1C5540] rounded-lg disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSiraChange(soru.id, "down")}
                      disabled={
                        loading ||
                        soru.sira === formData.kariyer_sorulari.length
                      }
                      className="p-2 bg-[#F1EEE6] text-[#1C5540] rounded-lg disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSoru(soru.id)}
                      disabled={loading}
                      className="p-2 bg-[#F1EEE6] text-[#A42E2D] rounded-lg"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Yeni Soru Ekleme */}
          {formData.kariyer_sorulari.length < 10 && (
            <div className="mt-4">
              <div className="flex gap-2">
                <FormInput
                  label="Yeni Soru"
                  value={newSoru}
                  onChange={(e) => setNewSoru(e.target.value)}
                  placeholder="Yeni soru ekleyin"
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={handleAddSoru}
                  disabled={loading || !newSoru.trim()}
                  className="px-4 py-2 bg-[#1C5540] text-white rounded-lg disabled:opacity-50"
                >
                  {loading ? "Ekleniyor..." : "Ekle"}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default KariyerIslemleri;
