import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { FormInput, FormTextarea } from "../../../components/common/Input";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const KampanyaIslemleri = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    baslik: "",
    metin: "",
  });

  const [kampanyaList, setKampanyaList] = useState([]);

  const [newKampanya, setNewKampanya] = useState({
    kapak_resmi_url: "/images/icons/firma-profil/icons/kampanya-afis.svg",
    katalog_pdf_url: "",
    aciklama: "",
    baslangic_tarihi: "",
    bitis_tarihi: "",
    acilis_katalogu: false,
    aktif: true,
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (user?.yetkiliKisi?.firma_id) {
      loadKampanyalar();
    }
  }, [user?.yetkiliKisi?.firma_id]);

  const loadKampanyalar = async () => {
    try {
      setInitialLoading(true);
      const [kampanyalarRes, ayarlarRes] = await Promise.all([
        firmaService.getKampanyalar(user.yetkiliKisi.firma_id),
        firmaService.getKampanyalarAyarlar(user.yetkiliKisi.firma_id),
      ]);

      const formattedKampanyalar = kampanyalarRes.data.data.map((kampanya) => ({
        ...kampanya,
        baslangic_tarihi: formatDateForInput(kampanya.baslangic_tarihi),
        bitis_tarihi: formatDateForInput(kampanya.bitis_tarihi),
      }));

      setKampanyaList(formattedKampanyalar || []);
      console.log("Kampanya", kampanyalarRes.data);

      setFormData({
        baslik: ayarlarRes.data.data?.baslik || "",
        metin: ayarlarRes.data.data?.metin || "",
      });
    } catch (error) {
      console.error("Kampanyalar yüklenirken hata:", error);
      toast.error("Kampanyalar yüklenirken bir hata oluştu");
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

  const handleNewKampanyaChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewKampanya((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleKampanyaChange = (id, field, value) => {
    setKampanyaList((prev) =>
      prev.map((kampanya) =>
        kampanya.id === id
          ? {
              ...kampanya,
              [field]: field.includes("tarihi")
                ? formatDateForInput(value)
                : value,
            }
          : kampanya
      )
    );
  };

  const handleCheckboxChange = (id, checked) => {
    setKampanyaList((prev) =>
      prev.map((kampanya) =>
        kampanya.id === id
          ? { ...kampanya, acilis_katalogu: checked }
          : kampanya
      )
    );
  };

  const handleAddKampanya = async () => {
    try {
      setLoading(true);
      const response = await firmaService.createKampanya({
        ...newKampanya,
        firma_id: user.yetkiliKisi.firma_id,
      });

      const newKampanyaWithId = {
        ...newKampanya,
        id: response.data.data.id,
        baslangic_tarihi: formatDateForInput(newKampanya.baslangic_tarihi),
        bitis_tarihi: formatDateForInput(newKampanya.bitis_tarihi),
      };

      setKampanyaList((prev) => [...prev, newKampanyaWithId]);
      setNewKampanya({
        kapak_resmi_url: "/images/icons/firma-profil/icons/kampanya-afis.svg",
        katalog_pdf_url: "",
        aciklama: "",
        baslangic_tarihi: "",
        bitis_tarihi: "",
        acilis_katalogu: false,
        aktif: true,
      });

      toast.success("Kampanya başarıyla eklendi");
    } catch (error) {
      console.error("Kampanya eklenirken hata:", error);
      toast.error("Kampanya eklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKampanya = async (id) => {
    try {
      setLoading(true);
      await firmaService.deleteKampanya(id);
      setKampanyaList((prev) => prev.filter((kampanya) => kampanya.id !== id));
      toast.success("Kampanya başarıyla silindi");
    } catch (error) {
      console.error("Kampanya silinirken hata:", error);
      toast.error("Kampanya silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKampanya = async (id) => {
    try {
      setLoading(true);
      const kampanya = kampanyaList.find((k) => k.id === id);
      if (!kampanya) return;

      await firmaService.updateKampanya(id, kampanya);
      toast.success("Kampanya başarıyla güncellendi");
    } catch (error) {
      console.error("Kampanya güncellenirken hata:", error);
      toast.error("Kampanya güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAyarlar = async () => {
    try {
      setLoading(true);
      await firmaService.updateKampanyalarAyarlar({
        firma_id: user.yetkiliKisi.firma_id,
        ...formData,
      });
      toast.success("Kampanya ayarları başarıyla güncellendi");
    } catch (error) {
      console.error("Kampanya ayarları güncellenirken hata:", error);
      toast.error("Kampanya ayarları güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleResimYukle = async (kampanyaIndex, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await firmaService.uploadImage(file);
      const imageUrl = response.data.url;

      if (kampanyaIndex === "yeni") {
        setNewKampanya((prev) => ({
          ...prev,
          kapak_resmi_url: imageUrl,
        }));
      } else {
        setKampanyaList((prev) =>
          prev.map((kampanya, index) =>
            index === kampanyaIndex
              ? { ...kampanya, kapak_resmi_url: imageUrl }
              : kampanya
          )
        );
      }

      toast.success("Resim başarıyla yüklendi");
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      toast.error("Resim yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleResimSil = async (kampanyaIndex) => {
    try {
      setLoading(true);
      if (kampanyaIndex === "yeni") {
        setNewKampanya((prev) => ({
          ...prev,
          kapak_resmi_url: "/images/icons/firma-profil/icons/kampanya-afis.svg",
        }));
      } else {
        const kampanya = kampanyaList[kampanyaIndex];
        await firmaService.updateKampanya(kampanya.id, {
          ...kampanya,
          kapak_resmi_url: "/images/icons/firma-profil/icons/kampanya-afis.svg",
        });
        setKampanyaList((prev) =>
          prev.map((k, index) =>
            index === kampanyaIndex
              ? {
                  ...k,
                  kapak_resmi_url:
                    "/images/icons/firma-profil/icons/kampanya-afis.svg",
                }
              : k
          )
        );
      }
      toast.success("Resim başarıyla silindi");
    } catch (error) {
      console.error("Resim silme hatası:", error);
      toast.error("Resim silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfYukle = async (kampanyaIndex, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await firmaService.uploadKatalog(file);
      const pdfUrl = response.data.url;

      if (kampanyaIndex === "yeni") {
        setNewKampanya((prev) => ({
          ...prev,
          katalog_pdf_url: pdfUrl,
        }));
      } else {
        setKampanyaList((prev) =>
          prev.map((kampanya, index) =>
            index === kampanyaIndex
              ? { ...kampanya, katalog_pdf_url: pdfUrl }
              : kampanya
          )
        );
      }

      toast.success("PDF başarıyla yüklendi");
    } catch (error) {
      console.error("PDF yükleme hatası:", error);
      toast.error("PDF yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfSil = async (kampanyaIndex) => {
    try {
      setLoading(true);
      if (kampanyaIndex === "yeni") {
        setNewKampanya((prev) => ({
          ...prev,
          katalog_pdf_url: "",
        }));
      } else {
        const kampanya = kampanyaList[kampanyaIndex];
        await firmaService.updateKampanya(kampanya.id, {
          ...kampanya,
          katalog_pdf_url: "",
        });
        setKampanyaList((prev) =>
          prev.map((k, index) =>
            index === kampanyaIndex ? { ...k, katalog_pdf_url: "" } : k
          )
        );
      }
      toast.success("PDF başarıyla silindi");
    } catch (error) {
      console.error("PDF silme hatası:", error);
      toast.error("PDF silinirken bir hata oluştu");
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

  const acilisKatalogu = kampanyaList.find((k) => k.acilis_katalogu);

  return (
    <motion.div
      key="tab-1"
      className="montserrat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center">
        <p className="text-[#120A8F] font-semibold text-sm">Kampanyalarımız</p>
        <button
          onClick={handleSaveAyarlar}
          disabled={loading}
          className="px-4 py-2 bg-[#1C5540] text-white rounded-lg text-sm"
        >
          {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>

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

      <div className="flex flex-col sm:items-start mt-2 gap-2 sm:gap-5 sm:flex-row">
        <p className="flex w-32 items-start gap-1.5 text-[#A42E2D] montserrat font-medium">
          <img src="/images/icons/profil/add-red.svg" alt="" />
          Yeni Kampanya Gir
        </p>
        <div className="p-6 rounded-xl gap-5 flex md:flex-row flex-col bg-[#FFF2F2] border border-[#A2ACC7] w-full border-dashed">
          <div className="w-full">
            <p className="font-semibold montserrat text-sm">Kapak Resmi</p>
            <img
              src={newKampanya.kapak_resmi_url}
              className="mt-2 w-full rounded-lg border border-[#A2ACC7]"
              alt=""
            />
            <div className="w-full flex items-center gap-2 mt-2">
              <label className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleResimYukle("yeni", e)}
                  className="hidden"
                  disabled={loading}
                />
                <div className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm cursor-pointer">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#10069F] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <img src="/images/icons/profil/ekle-2.svg" alt="" />
                  )}
                  {loading ? "Yükleniyor..." : "Resim Yükle"}
                </div>
              </label>
              {newKampanya.kapak_resmi_url !==
                "/images/icons/firma-profil/icons/kampanya-afis.svg" && (
                <button
                  onClick={() => handleResimSil("yeni")}
                  className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm"
                >
                  <img src="/images/icons/profil/ekle-2.svg" alt="" />
                  Resmi Sil
                </button>
              )}
            </div>

            <p className="font-semibold montserrat text-sm mt-4">Katalog PDF</p>
            <div className="w-full flex items-center gap-2 mt-2">
              <label className="w-full">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handlePdfYukle("yeni", e)}
                  className="hidden"
                  disabled={loading}
                />
                <div className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm cursor-pointer">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#10069F] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <img src="/images/icons/profil/ekle-2.svg" alt="" />
                  )}
                  {loading ? "Yükleniyor..." : "PDF Yükle"}
                </div>
              </label>
              {newKampanya.katalog_pdf_url && (
                <button
                  onClick={() => handlePdfSil("yeni")}
                  className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm"
                >
                  <img src="/images/icons/profil/ekle-2.svg" alt="" />
                  PDF'i Sil
                </button>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="aciklama"
                className="text-sm font-semibold text-[#232323]"
              >
                Kampanya Açıklama Metni
              </label>
              <textarea
                name="aciklama"
                value={newKampanya.aciklama}
                onChange={handleNewKampanyaChange}
                placeholder="Kampanya Açıklama Metni"
                className="py-3 outline-none text-sm px-2 bg-white text-[#1D547D] placeholder-[#1D547D] border border-dotted border-[#A2ACC7] rounded-lg"
              ></textarea>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="baslangic_tarihi"
                className="text-sm font-semibold text-[#232323]"
              >
                Kampanya Başlangıç Tarihi
              </label>
              <input
                name="baslangic_tarihi"
                type="date"
                value={formatDateForInput(newKampanya.baslangic_tarihi)}
                onChange={handleNewKampanyaChange}
                className="py-3 outline-none text-sm px-2 bg-white text-[#1D547D] placeholder-[#1D547D] border border-dotted border-[#A2ACC7] rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="bitis_tarihi"
                className="text-sm font-semibold text-[#232323]"
              >
                Kampanya Bitiş Tarihi
              </label>
              <input
                name="bitis_tarihi"
                type="date"
                value={formatDateForInput(newKampanya.bitis_tarihi)}
                onChange={handleNewKampanyaChange}
                className="py-3 outline-none text-sm px-2 bg-white text-[#1D547D] placeholder-[#1D547D] border border-dotted border-[#A2ACC7] rounded-lg"
              />
            </div>

            <div className="mt-3 py-[10px] px-4 flex items-center gap-2 border bg-white border-[#A42E2D] rounded-sm border-dashed">
              <input
                type="checkbox"
                name="acilis_katalogu"
                checked={newKampanya.acilis_katalogu}
                onChange={handleNewKampanyaChange}
                className="w-5 h-5 appearance-none border-2 rounded-full border-[#45535E] checked:bg-[#45535E] checked:border-transparent"
              />
              <p className="text-[#A42E2D] text-sm font-semibold">
                Açılış kataloğu yap
              </p>
            </div>

            <button
              onClick={handleAddKampanya}
              disabled={loading}
              className="w-full mt-5 py-4 bg-[#1C5540] rounded-lg text-white flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Kaydediliyor...
                </div>
              ) : (
                <>
                  <img src="/images/icons/profil/arti-beyaz.svg" alt="" />
                  Yeni Kampanyayı Ekle
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {acilisKatalogu && (
        <div className="flex mt-4 flex-col sm:items-start gap-2 sm:gap-5 sm:flex-row">
          <p className="flex w-32  items-start gap-1.5 text-[#007356] montserrat font-medium">
            <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
            Açılış Kataloğu
          </p>
          <div className="p-[10px] border border-[#A2ACC7] border-dashed rounded-lg w-full flex justify-center items-center">
            <img
              src={acilisKatalogu.kapak_resmi_url}
              className="w-60 h-auto"
              alt="Açılış Kataloğu"
            />
          </div>
        </div>
      )}

      {kampanyaList.map((kampanya, index) => (
        <div
          key={kampanya.id}
          className="flex flex-col sm:items-start mt-2 gap-2 sm:gap-5 sm:flex-row"
        >
          <p className="flex w-32 items-start gap-1.5 text-[#007356] montserrat font-medium">
            <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
            Kampanya - {index + 1}
          </p>
          <div className="p-6 rounded-xl gap-5 flex md:flex-row flex-col bg-white border border-[#A2ACC7] w-full border-dashed">
            <div className="w-full">
              <p className="font-semibold montserrat text-sm">Kapak Resmi</p>
              <img
                src={kampanya.kapak_resmi_url}
                className="mt-2 w-full rounded-lg border border-[#A2ACC7]"
                alt=""
              />
              <div className="w-full flex items-center gap-2 mt-2">
                <label className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleResimYukle(index, e)}
                    className="hidden"
                    disabled={loading}
                  />
                  <div className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm cursor-pointer">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#10069F] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <img src="/images/icons/profil/ekle-2.svg" alt="" />
                    )}
                    {loading ? "Yükleniyor..." : "Resim Yükle"}
                  </div>
                </label>
                {kampanya.kapak_resmi_url !==
                  "/images/icons/firma-profil/icons/kampanya-afis.svg" && (
                  <button
                    onClick={() => handleResimSil(index)}
                    className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm"
                  >
                    <img src="/images/icons/profil/ekle-2.svg" alt="" />
                    Resmi Sil
                  </button>
                )}
              </div>

              <p className="font-semibold montserrat text-sm mt-4">
                Katalog PDF
              </p>
              <div className="w-full flex items-center gap-2 mt-2">
                <label className="w-full">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handlePdfYukle(index, e)}
                    className="hidden"
                    disabled={loading}
                  />
                  <div className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm cursor-pointer">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#10069F] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <img src="/images/icons/profil/ekle-2.svg" alt="" />
                    )}
                    {loading ? "Yükleniyor..." : "PDF Yükle"}
                  </div>
                </label>
                {kampanya.katalog_pdf_url && (
                  <button
                    onClick={() => handlePdfSil(index)}
                    className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm"
                  >
                    <img src="/images/icons/profil/ekle-2.svg" alt="" />
                    PDF'i Sil
                  </button>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={`aciklama-${kampanya.id}`}
                  className="text-sm font-semibold text-[#232323]"
                >
                  Kampanya Açıklama Metni
                </label>
                <textarea
                  id={`aciklama-${kampanya.id}`}
                  value={kampanya.aciklama}
                  onChange={(e) =>
                    handleKampanyaChange(
                      kampanya.id,
                      "aciklama",
                      e.target.value
                    )
                  }
                  placeholder="Kampanya Açıklama Metni"
                  className="py-3 outline-none text-sm px-2 bg-white text-[#1D547D] placeholder-[#1D547D] border border-dotted border-[#A2ACC7] rounded-lg"
                ></textarea>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor={`baslangic-${kampanya.id}`}
                  className="text-sm font-semibold text-[#232323]"
                >
                  Kampanya Başlangıç Tarihi
                </label>
                <input
                  id={`baslangic-${kampanya.id}`}
                  type="date"
                  value={formatDateForInput(kampanya.baslangic_tarihi)}
                  onChange={(e) =>
                    handleKampanyaChange(
                      kampanya.id,
                      "baslangic_tarihi",
                      e.target.value
                    )
                  }
                  className="py-3 outline-none text-sm px-2 bg-white text-[#1D547D] placeholder-[#1D547D] border border-dotted border-[#A2ACC7] rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor={`bitis-${kampanya.id}`}
                  className="text-sm font-semibold text-[#232323]"
                >
                  Kampanya Bitiş Tarihi
                </label>
                <input
                  id={`bitis-${kampanya.id}`}
                  type="date"
                  value={formatDateForInput(kampanya.bitis_tarihi)}
                  onChange={(e) =>
                    handleKampanyaChange(
                      kampanya.id,
                      "bitis_tarihi",
                      e.target.value
                    )
                  }
                  className="py-3 outline-none text-sm px-2 bg-white text-[#1D547D] placeholder-[#1D547D] border border-dotted border-[#A2ACC7] rounded-lg"
                />
              </div>

              <div className="mt-3 py-[10px] px-4 flex items-center gap-2 border bg-white border-[#A42E2D] rounded-sm border-dashed">
                <input
                  type="checkbox"
                  checked={kampanya.acilis_katalogu}
                  onChange={(e) =>
                    handleCheckboxChange(kampanya.id, e.target.checked)
                  }
                  className="w-5 h-5 appearance-none border-2 rounded-full border-[#45535E] checked:bg-[#45535E] checked:border-transparent"
                />
                <p className="text-[#A42E2D] text-sm font-semibold">
                  Açılış kataloğu yap
                </p>
              </div>

              <div className="flex md:flex-row flex-col mt-5 gap-1 md:gap-3">
                <button
                  onClick={() => handleDeleteKampanya(kampanya.id)}
                  disabled={loading}
                  className="w-full py-4 bg-[#F1EEE6] font-medium rounded-lg text-[#1C5540] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#1C5540] border-t-transparent rounded-full animate-spin"></div>
                      Siliniyor...
                    </div>
                  ) : (
                    <>
                      <img src="/images/icons/profil/arti-yesil.svg" alt="" />
                      Kampanyayı Sil
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleSaveKampanya(kampanya.id)}
                  disabled={loading}
                  className="w-full py-4 font-medium bg-[#1C5540] rounded-lg text-white flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Kaydediliyor...
                    </div>
                  ) : (
                    <>
                      <img src="/images/icons/profil/arti-beyaz.svg" alt="" />
                      Değişiklikleri Kaydet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default KampanyaIslemleri;
