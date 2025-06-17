import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const SubeIslemleri = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const haftaninGunleri = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
  ];
  const saatler = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  const [formData, setFormData] = useState({
    baslik: "",
    metin: "",
    subeler: [],
  });

  const [yeniSube, setYeniSube] = useState({
    kapak_resmi_url: "",
    sube_adi: "",
    sube_adresi: "",
    mail_adresi: "",
    telefon_numarasi: "",
    calisma_saatleri: [],
  });

  const [showTimePicker, setShowTimePicker] = useState({
    subeIndex: null,
    visible: false,
    selectedGun: "",
  });

  // Verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      if (user?.yetkiliKisi?.firma_id) {
        try {
          setInitialLoading(true);
          const [ayarlarResponse, subelerResponse] = await Promise.all([
            firmaService.getSubelerAyarlar(user.yetkiliKisi.firma_id),
            firmaService.getSubeler(user.yetkiliKisi.firma_id),
          ]);

          const ayarlar = ayarlarResponse?.data?.data || {};
          const subeler = subelerResponse?.data?.data || [];

          setFormData({
            baslik: ayarlar.baslik || "",
            metin: ayarlar.metin || "",
            subeler: subeler.map((sube) => ({
              id: sube.id,
              kapak_resmi_url: sube.kapak_resmi_url || "",
              sube_adi: sube.sube_adi || "",
              sube_adresi: sube.sube_adresi || "",
              mail_adresi: sube.mail_adresi || "",
              telefon_numarasi: sube.telefon_numarasi || "",
              calisma_saatleri:
                sube.calisma_saatleri?.map((saat) => ({
                  gun: saat.gun,
                  acilis_saati: saat.acilis_saati,
                  kapanis_saati: saat.kapanis_saati,
                  kapali: saat.kapali || false,
                })) || [],
            })),
          });
        } catch (error) {
          console.error("Veri getirme hatası:", error);
          toast.error("Veriler alınırken bir hata oluştu");
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchData();
  }, [user?.yetkiliKisi?.firma_id]);

  // Ana form için veri değişikliği
  const handleBaslikMetinChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mevcut şubeler için değişiklik
  const handleInputChange = (e, subeIndex) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSubeler = [...prev.subeler];
      updatedSubeler[subeIndex] = {
        ...updatedSubeler[subeIndex],
        [name]: value,
      };
      return { ...prev, subeler: updatedSubeler };
    });
  };

  // Yeni şube için değişiklik
  const handleYeniSubeChange = (e) => {
    const { name, value } = e.target;
    setYeniSube((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Çalışma saati değişimi
  const handleCalismaSaatiChange = (e, subeIndex, gunIndex) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updatedSubeler = [...prev.subeler];
      const updatedSaatler = [...updatedSubeler[subeIndex].calisma_saatleri];

      updatedSaatler[gunIndex] = {
        ...updatedSaatler[gunIndex],
        [name]: type === "checkbox" ? checked : value,
      };

      updatedSubeler[subeIndex] = {
        ...updatedSubeler[subeIndex],
        calisma_saatleri: updatedSaatler,
      };

      return { ...prev, subeler: updatedSubeler };
    });
  };

  // Yeni şube için çalışma saati ekleme
  const handleYeniCalismaSaatiChange = (gun, field, value) => {
    setYeniSube((prev) => {
      const gunIndex = prev.calisma_saatleri.findIndex(
        (item) => item.gun === gun
      );

      if (gunIndex === -1) {
        // Eğer gün yoksa yeni ekleyelim
        return {
          ...prev,
          calisma_saatleri: [
            ...prev.calisma_saatleri,
            {
              gun,
              acilis_saati: field === "acilis_saati" ? value : "09:00",
              kapanis_saati: field === "kapanis_saati" ? value : "18:00",
              kapali: field === "kapali" ? value : false,
            },
          ],
        };
      } else {
        // Gün varsa güncelle
        const updatedSaatler = [...prev.calisma_saatleri];
        updatedSaatler[gunIndex] = {
          ...updatedSaatler[gunIndex],
          [field]: value,
        };
        return {
          ...prev,
          calisma_saatleri: updatedSaatler,
        };
      }
    });
  };

  // Yeni şubeyi kaydet
  const handleYeniSubeKaydet = async () => {
    try {
      setLoading(true);
      const response = await firmaService.createSube({
        ...yeniSube,
        firma_id: user.yetkiliKisi.firma_id,
      });

      setFormData((prev) => ({
        ...prev,
        subeler: [...prev.subeler, { ...yeniSube, id: response.data.data.id }],
      }));

      // Formu temizle
      setYeniSube({
        kapak_resmi_url: "",
        sube_adi: "",
        sube_adresi: "",
        mail_adresi: "",
        telefon_numarasi: "",
        calisma_saatleri: [],
      });

      toast.success("Yeni şube başarıyla eklendi");
    } catch (error) {
      console.error("Şube ekleme hatası:", error);
      toast.error("Şube eklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Şube silme
  const handleSubeSil = async (subeIndex) => {
    const sube = formData.subeler[subeIndex];
    if (!sube.id) return;

    try {
      setLoading(true);
      await firmaService.deleteSube(sube.id);

      setFormData((prev) => ({
        ...prev,
        subeler: prev.subeler.filter((_, index) => index !== subeIndex),
      }));

      toast.success("Şube başarıyla silindi");
    } catch (error) {
      console.error("Şube silme hatası:", error);
      toast.error("Şube silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Çalışma saati günü ekle
  const handleGunEkle = (subeIndex, gun) => {
    if (subeIndex === "yeni") {
      handleYeniCalismaSaatiChange(gun, "acilis_saati", "09:00");
    } else {
      setFormData((prev) => {
        const updatedSubeler = [...prev.subeler];
        const subeItem = updatedSubeler[subeIndex];

        // Eğer bu gün zaten ekliyse, ekleme
        if (subeItem.calisma_saatleri.some((item) => item.gun === gun)) {
          return prev;
        }

        subeItem.calisma_saatleri.push({
          gun,
          acilis_saati: "09:00",
          kapanis_saati: "18:00",
          kapali: false,
        });

        return { ...prev, subeler: updatedSubeler };
      });
    }
    setShowTimePicker({ subeIndex: null, visible: false, selectedGun: "" });
  };

  // Resim yükleme fonksiyonu
  const handleResimYukle = async (subeIndex, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await firmaService.uploadImage(file);
      const imageUrl = response.data.url;

      if (subeIndex === "yeni") {
        setYeniSube((prev) => ({
          ...prev,
          kapak_resmi_url: imageUrl,
        }));
      } else {
        setFormData((prev) => {
          const updatedSubeler = [...prev.subeler];
          updatedSubeler[subeIndex] = {
            ...updatedSubeler[subeIndex],
            kapak_resmi_url: imageUrl,
          };
          return { ...prev, subeler: updatedSubeler };
        });
      }

      toast.success("Resim başarıyla yüklendi");
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      toast.error("Resim yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleResimSil = (subeIndex) => {
    if (subeIndex === "yeni") {
      setYeniSube((prev) => ({
        ...prev,
        kapak_resmi_url: "",
      }));
    } else {
      setFormData((prev) => {
        const updatedSubeler = [...prev.subeler];
        updatedSubeler[subeIndex] = {
          ...updatedSubeler[subeIndex],
          kapak_resmi_url: "",
        };
        return { ...prev, subeler: updatedSubeler };
      });
    }
    toast.success("Resim başarıyla silindi");
  };

  // Değişiklikleri kaydet
  const handleDegisiklikleriKaydet = async (subeIndex) => {
    const sube = formData.subeler[subeIndex];
    if (!sube.id) return;

    try {
      setLoading(true);
      await firmaService.updateSube(sube.id, sube);
      toast.success("Değişiklikler başarıyla kaydedildi");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      toast.error("Değişiklikler kaydedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Tüm değişiklikleri kaydet
  const handleTumDegisiklikleriKaydet = async () => {
    try {
      setLoading(true);
      await firmaService.updateSubelerAyarlar({
        baslik: formData.baslik,
        metin: formData.metin,
        firma_id: user.yetkiliKisi.firma_id,
      });
      toast.success("Tüm değişiklikler başarıyla kaydedildi");
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      toast.error("Değişiklikler kaydedilirken bir hata oluştu");
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
      <div className="flex justify-end">
        <p className="text-[#120A8F] font-semibold text-sm">Hakkımızda</p>
      </div>

      {/* Başlık */}
      <div className="flex flex-col sm:items-center mt-5 gap-2 sm:gap-5 sm:flex-row">
        <p className="flex w-32 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Başlık
        </p>
        <input
          type="text"
          name="baslik"
          value={formData.baslik}
          onChange={handleBaslikMetinChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      {/* Metin */}
      <div className="flex mt-2 flex-col sm:items-start gap-2 sm:gap-5 sm:flex-row">
        <p className="flex w-32 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Metin
        </p>
        <textarea
          name="metin"
          value={formData.metin}
          onChange={handleBaslikMetinChange}
          className="py-3 px-[10px] border w-full border-[#A2ACC7] border-dashed outline-0 rounded-lg text-[#1D547D]"
        ></textarea>
      </div>

      {/* Yeni Şube Ekle */}
      <div className="flex flex-col sm:items-start mt-2 gap-2 sm:gap-5 sm:flex-row">
        <p className="flex w-32 items-start gap-1.5 text-[#A42E2D] montserrat font-medium">
          <img src="/images/icons/profil/add-red.svg" alt="" />
          Yeni Şube Ekle
        </p>
        <div className="p-6 rounded-xl gap-5 flex md:flex-row flex-col bg-[#FFF2F2] border border-[#A2ACC7] w-full border-dashed">
          <div className="flex-1 text-[#232323]">
            {/* Kapak Resmi */}
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">Kapak Resmi</p>
              {yeniSube.kapak_resmi_url ? (
                <img
                  src={yeniSube.kapak_resmi_url}
                  alt="Şube Resmi"
                  className="mt-1 max-h-60 object-cover rounded-lg"
                />
              ) : (
                <img
                  src="/images/icons/firma-profil/icons/sube-resim.svg"
                  className="mt-1"
                  alt="Varsayılan Resim"
                />
              )}
              <div className="flex mt-2 items-center gap-2">
                <label className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleResimYukle("yeni", e)}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm cursor-pointer">
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-[#10069F] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <img src="/images/icons/profil/ekle-yesil.svg" alt="" />
                    )}
                    {uploading ? "Yükleniyor..." : "Yükle"}
                  </div>
                </label>
                {yeniSube.kapak_resmi_url && (
                  <button
                    onClick={() => handleResimSil("yeni")}
                    className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm"
                  >
                    <img src="/images/icons/profil/ekle-yesil.svg" alt="" />
                    Sil
                  </button>
                )}
              </div>
            </div>

            {/* Şube Adı */}
            <div className="flex flex-col gap-1 mt-3">
              <p className="font-semibold text-sm">Şube Adı</p>
              <input
                type="text"
                name="sube_adi"
                value={yeniSube.sube_adi}
                onChange={handleYeniSubeChange}
                placeholder="Şube Adı"
                className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
              />
            </div>

            {/* Şube Adresi */}
            <div className="flex flex-col gap-1 mt-3">
              <p className="font-semibold text-sm">Şube Adresi</p>
              <input
                type="text"
                name="sube_adresi"
                value={yeniSube.sube_adresi}
                onChange={handleYeniSubeChange}
                placeholder="Şube Adresi"
                className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
              />
            </div>

            {/* Mail Adresi */}
            <div className="flex flex-col gap-1 mt-3">
              <p className="font-semibold text-sm">Mail Adresi</p>
              <input
                type="text"
                name="mail_adresi"
                value={yeniSube.mail_adresi}
                onChange={handleYeniSubeChange}
                placeholder="Mail Adresi"
                className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
              />
            </div>

            {/* Telefon Numarası */}
            <div className="flex flex-col gap-1 mt-3">
              <p className="font-semibold text-sm">Telefon Numarası</p>
              <input
                type="text"
                name="telefon_numarasi"
                value={yeniSube.telefon_numarasi}
                onChange={handleYeniSubeChange}
                placeholder="Telefon Numarası"
                className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
              />
            </div>
          </div>

          {/* Çalışma Saatleri */}
          <div className="flex-1">
            <div className="flex flex-col gap-1 mt-3">
              <p className="font-semibold text-sm">Çalışma Saatleri</p>

              {/* Gün Ekleme Dropdown */}
              <div
                onClick={() =>
                  setShowTimePicker({
                    subeIndex: "yeni",
                    visible: !showTimePicker.visible,
                    selectedGun: "",
                  })
                }
                className="py-3 px-[12px] border bg-white mt-1 flex items-center justify-between border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
              >
                <p>Ekle</p>
                <button>
                  <img src="/images/arrow-down.svg" />
                </button>
              </div>

              {/* Gün Seçici Dropdown */}
              {showTimePicker.visible &&
                showTimePicker.subeIndex === "yeni" &&
                showTimePicker.selectedGun === "" && ( // Bu satırı ekleyin
                  <div className="bg-white border mt-24 border-[#A2ACC7] border-dashed rounded-lg shadow-md absolute z-10">
                    {haftaninGunleri.map((gun) => (
                      <div
                        key={gun}
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleGunEkle("yeni", gun)}
                      >
                        {gun}
                      </div>
                    ))}
                  </div>
                )}

              {/* Çalışma Saatleri Listesi */}
              {yeniSube.calisma_saatleri.map((saat, gunIndex) => (
                <div
                  key={saat.gun}
                  className="flex md:flex-row flex-col mt-3 items-center gap-2"
                >
                  <p className="text-[#1D547D] font-medium w-full">
                    {saat.gun}
                  </p>

                  {/* Açılış Saati */}
                  <div className="relative w-full">
                    <div
                      onClick={() =>
                        setShowTimePicker({
                          subeIndex: "yeni",
                          visible: !showTimePicker.visible,
                          selectedGun: `${saat.gun}-acilis`,
                        })
                      }
                      className="py-3 text-sm px-[12px] border bg-white mt-1 flex items-center justify-between border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
                    >
                      <p>{saat.acilis_saati || "Açılış"}</p>
                      <button>
                        <img src="/images/arrow-down.svg" />
                      </button>
                    </div>

                    {/* Saat Dropdown */}
                    {showTimePicker.visible &&
                      showTimePicker.selectedGun === `${saat.gun}-acilis` && (
                        <div className="bg-white border border-[#A2ACC7] border-dashed rounded-lg shadow-md absolute z-10 max-h-40 overflow-y-auto">
                          {saatler.map((s) => (
                            <div
                              key={s}
                              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                handleYeniCalismaSaatiChange(
                                  saat.gun,
                                  "acilis_saati",
                                  s
                                );
                                setShowTimePicker({
                                  subeIndex: null,
                                  visible: false,
                                  selectedGun: "",
                                });
                              }}
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="relative w-full">
                    <div
                      onClick={() =>
                        setShowTimePicker({
                          subeIndex: "yeni",
                          visible: !showTimePicker.visible,
                          selectedGun: `${saat.gun}-kapanis`,
                        })
                      }
                      className="py-3 text-sm px-[12px] border bg-white mt-1 flex items-center justify-between border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
                    >
                      <p>{saat.kapanis_saati || "Kapanış"}</p>
                      <button>
                        <img src="/images/arrow-down.svg" />
                      </button>
                    </div>

                    {showTimePicker.visible &&
                      showTimePicker.selectedGun === `${saat.gun}-kapanis` && (
                        <div className="bg-white border border-[#A2ACC7] border-dashed rounded-lg shadow-md absolute z-10 max-h-40 overflow-y-auto">
                          {saatler.map((s) => (
                            <div
                              key={s}
                              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                handleYeniCalismaSaatiChange(
                                  saat.gun,
                                  "kapanis_saati",
                                  s
                                );
                                setShowTimePicker({
                                  subeIndex: null,
                                  visible: false,
                                  selectedGun: "",
                                });
                              }}
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="checkbox"
                      id={`yeni-${saat.gun}-kapali`}
                      checked={saat.kapali}
                      onChange={(e) =>
                        handleYeniCalismaSaatiChange(
                          saat.gun,
                          "kapali",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor={`yeni-${saat.gun}-kapali`}
                      className="text-sm"
                    >
                      Kapalı
                    </label>
                  </div>
                </div>
              ))}

              <button
                onClick={handleYeniSubeKaydet}
                className="w-full mt-5 py-4 bg-[#1C5540] rounded-lg text-white flex items-center justify-center gap-2"
              >
                <img src="/images/icons/profil/arti-beyaz.svg" alt="" />
                Yeni Şubeyi Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>

      {formData.subeler.map((sube, subeIndex) => (
        <div
          key={sube.id}
          className="flex flex-col sm:items-start mt-2 gap-2 sm:gap-5 sm:flex-row"
        >
          <p className="flex w-32 items-start gap-1.5 text-[#007356] montserrat font-medium">
            <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
            Şube - {subeIndex + 1}
          </p>
          <div className="p-3 md:p-6 rounded-xl gap-5 flex md:flex-row flex-col bg-white border border-[#A2ACC7] w-full border-dashed">
            <div className="flex-1 text-[#232323]">
              {/* Kapak Resmi */}
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm">Kapak Resmi</p>
                {sube.kapak_resmi_url ? (
                  <img
                    src={sube.kapak_resmi_url}
                    alt="Şube Resmi"
                    className="mt-1 max-h-60 object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src="/images/icons/firma-profil/icons/sube-resim.svg"
                    className="mt-1"
                    alt="Varsayılan Resim"
                  />
                )}
                <div className="flex mt-2 items-center gap-2">
                  <label className="w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleResimYukle(subeIndex, e)}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm cursor-pointer">
                      {uploading ? (
                        <div className="w-5 h-5 border-2 border-[#10069F] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <img src="/images/icons/profil/ekle-yesil.svg" alt="" />
                      )}
                      {uploading ? "Yükleniyor..." : "Yükle"}
                    </div>
                  </label>
                  {sube.kapak_resmi_url && (
                    <button
                      onClick={() => handleResimSil(subeIndex)}
                      className="w-full py-3 bg-[#CED4DA] flex items-center gap-1 text-[#10069F] text-sm justify-center rounded-sm"
                    >
                      <img src="/images/icons/profil/ekle-yesil.svg" alt="" />
                      Sil
                    </button>
                  )}
                </div>
              </div>

              {/* Şube Adı */}
              <div className="flex flex-col gap-1 mt-3">
                <p className="font-semibold text-sm">Şube Adı</p>
                <input
                  type="text"
                  name="sube_adi"
                  value={sube.sube_adi || ""}
                  onChange={(e) => handleInputChange(e, subeIndex)}
                  placeholder="Şube Adı"
                  className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
                />
              </div>

              {/* Şube Adresi */}
              <div className="flex flex-col gap-1 mt-3">
                <p className="font-semibold text-sm">Şube Adresi</p>
                <input
                  type="text"
                  name="sube_adresi"
                  value={sube.sube_adresi || ""}
                  onChange={(e) => handleInputChange(e, subeIndex)}
                  placeholder="Şube Adresi"
                  className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
                />
              </div>

              {/* Mail Adresi */}
              <div className="flex flex-col gap-1 mt-3">
                <p className="font-semibold text-sm">Mail Adresi</p>
                <input
                  type="text"
                  name="mail_adresi"
                  value={sube.mail_adresi || ""}
                  onChange={(e) => handleInputChange(e, subeIndex)}
                  placeholder="Mail Adresi"
                  className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
                />
              </div>

              {/* Telefon Numarası */}
              <div className="flex flex-col gap-1 mt-3">
                <p className="font-semibold text-sm">Telefon Numarası</p>
                <input
                  type="text"
                  name="telefon_numarasi"
                  value={sube.telefon_numarasi || ""}
                  onChange={(e) => handleInputChange(e, subeIndex)}
                  placeholder="Telefon Numarası"
                  className="py-3 px-[10px] border bg-white mt-1 border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
                />
              </div>
            </div>

            {/* Çalışma Saatleri */}
            <div className="flex-1">
              <div className="flex flex-col gap-1 mt-3">
                <p className="font-semibold text-sm">Çalışma Saatleri</p>

                {/* Gün Ekleme Dropdown */}
                <div
                  onClick={() =>
                    setShowTimePicker({
                      subeIndex,
                      visible: !showTimePicker.visible,
                      selectedGun: "",
                    })
                  }
                  className="py-3 px-[12px] border bg-white mt-1 flex items-center justify-between border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
                >
                  <p>Ekle</p>
                  <button>
                    <img src="/images/arrow-down.svg" />
                  </button>
                </div>

                {showTimePicker.visible &&
                  showTimePicker.subeIndex === subeIndex &&
                  !showTimePicker.selectedGun && (
                    <div className="bg-white mt-24 w-60 border border-[#A2ACC7] border-dashed rounded-lg shadow-md absolute z-10">
                      {haftaninGunleri.map((gun) => (
                        <div
                          key={gun}
                          className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleGunEkle(subeIndex, gun)}
                        >
                          {gun}
                        </div>
                      ))}
                    </div>
                  )}

                {/* Çalışma Saatleri Listesi */}
                {sube.calisma_saatleri.map((saat, gunIndex) => (
                  <div
                    key={saat.gun}
                    className="flex md:flex-row flex-col mt-3 items-center gap-2"
                  >
                    <p className="text-[#1D547D] font-medium w-full">
                      {saat.gun}
                    </p>

                    {/* Açılış Saati */}
                    <div className="relative w-full">
                      <div
                        onClick={() =>
                          setShowTimePicker({
                            subeIndex,
                            visible: !showTimePicker.visible,
                            selectedGun: `${subeIndex}-${saat.gun}-acilis`,
                          })
                        }
                        className="py-3 text-sm px-[12px] border bg-white mt-1 flex items-center justify-between border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
                      >
                        <p>{saat.acilis_saati || "Açılış"}</p>
                        <button>
                          <img src="/images/arrow-down.svg" />
                        </button>
                      </div>

                      {/* Saat Dropdown */}
                      {showTimePicker.visible &&
                        showTimePicker.selectedGun ===
                          `${subeIndex}-${saat.gun}-acilis` && (
                          <div className="bg-white border border-[#A2ACC7] border-dashed rounded-lg shadow-md absolute z-10 max-h-40 overflow-y-auto">
                            {saatler.map((s) => (
                              <div
                                key={s}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  handleCalismaSaatiChange(
                                    {
                                      target: {
                                        name: "acilis_saati",
                                        value: s,
                                      },
                                    },
                                    subeIndex,
                                    gunIndex
                                  );
                                  setShowTimePicker({
                                    subeIndex: null,
                                    visible: false,
                                    selectedGun: "",
                                  });
                                }}
                              >
                                {s}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Kapanış Saati */}
                    <div className="relative w-full">
                      <div
                        onClick={() =>
                          setShowTimePicker({
                            subeIndex,
                            visible: !showTimePicker.visible,
                            selectedGun: `${subeIndex}-${saat.gun}-kapanis`,
                          })
                        }
                        className="py-3 text-sm px-[12px] border bg-white mt-1 flex items-center justify-between border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
                      >
                        <p>{saat.kapanis_saati || "Kapanış"}</p>
                        <button>
                          <img src="/images/arrow-down.svg" />
                        </button>
                      </div>

                      {/* Saat Dropdown */}
                      {showTimePicker.visible &&
                        showTimePicker.selectedGun ===
                          `${subeIndex}-${saat.gun}-kapanis` && (
                          <div className="bg-white border border-[#A2ACC7] border-dashed rounded-lg shadow-md absolute z-10 max-h-40 overflow-y-auto">
                            {saatler.map((s) => (
                              <div
                                key={s}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  handleCalismaSaatiChange(
                                    {
                                      target: {
                                        name: "kapanis_saati",
                                        value: s,
                                      },
                                    },
                                    subeIndex,
                                    gunIndex
                                  );
                                  setShowTimePicker({
                                    subeIndex: null,
                                    visible: false,
                                    selectedGun: "",
                                  });
                                }}
                              >
                                {s}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Kapalı Checkbox */}
                    <div className="flex items-center gap-2 ml-2">
                      <input
                        type="checkbox"
                        id={`${subeIndex}-${saat.gun}-kapali`}
                        name="kapali"
                        checked={saat.kapali || false}
                        onChange={(e) =>
                          handleCalismaSaatiChange(e, subeIndex, gunIndex)
                        }
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor={`${subeIndex}-${saat.gun}-kapali`}
                        className="text-sm"
                      >
                        Kapalı
                      </label>
                    </div>
                  </div>
                ))}

                <div className="flex md:flex-row flex-col mt-5 gap-1 md:gap-3">
                  <button
                    onClick={() => handleSubeSil(subeIndex)}
                    className="w-full  py-4 bg-[#F1EEE6] font-medium rounded-lg text-[#1C5540] flex items-center justify-center gap-2"
                  >
                    <img src="/images/icons/profil/arti-yesil.svg" alt="" />
                    Şubeyi Sil
                  </button>
                  <button
                    onClick={() => handleDegisiklikleriKaydet(subeIndex)}
                    className="w-full py-4 font-medium bg-[#1C5540] rounded-lg text-white flex items-center justify-center gap-2"
                  >
                    <img src="/images/icons/profil/arti-beyaz.svg" alt="" />
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Kaydet butonu */}
      <div className="sticky w-1/4 ml-auto bottom-0 left-0 right-0 py-4 mt-6">
        <div className="max-w-7xl mx-auto flex justify-end">
          <button
            onClick={handleTumDegisiklikleriKaydet}
            disabled={loading}
            className="bg-[#1C5540] text-white px-8 py-3 rounded-lg hover:bg-[#1C5540]/90 disabled:opacity-50 text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Kaydediliyor...
              </div>
            ) : (
              "Değişiklikleri Kaydet"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SubeIslemleri;
