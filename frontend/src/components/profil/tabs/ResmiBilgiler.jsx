import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const FirmaBilgileri = () => {
  const { isLogin, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firmaData, setFirmaData] = useState(null);
  const [faaliyetAlanlari, setFaaliyetAlanlari] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFaaliyet, setEditingFaaliyet] = useState(null);
  const modalRef = useRef(null);

  const [isSektorDropdownOpen, setIsSektorDropdownOpen] = useState(false);
  const [isEFaturaDropdownOpen, setIsEFaturaDropdownOpen] = useState(false);
  const [isEArsivDropdownOpen, setIsEArsivDropdownOpen] = useState(false);
  const [isEIrsaliyeDropdownOpen, setIsEIrsaliyeDropdownOpen] = useState(false);
  const [isEDefterDropdownOpen, setIsEDefterDropdownOpen] = useState(false);

  const [newFaaliyetAlani, setNewFaaliyetAlani] = useState({
    tur: "",
    alan: "",
    nace_kodu: "",
  });

  const sektorler = [
    "İnşaat",
    "Otomotiv",
    "Tekstil",
    "Gıda",
    "Teknoloji",
    "Sağlık",
    "Eğitim",
    "Enerji",
    "Demir Çelik",
    "Diğer",
  ];

  const [formData, setFormData] = useState({
    firma_unvani: "",
    marka_adi: "",
    sektor: "",
    faaliyet_durumu: false,
    kurulus_tarihi: "",
    kurulus_sehri: "",
    vkn: "",
    vergi_dairesi_adi: "",
    mersis_no: "",
    e_fatura_kullanimi: false,
    e_arsiv_kullanimi: false,
    e_irsaliye_kullanimi: false,
    e_defter_kullanimi: false,
    merkez_adresi: "",
    kep_adresi: "",
    email: "",
    web_sitesi: "",
    iletisim_telefonu: "",
    fax_numarasi: "",
    iban_numarasi: "",
    banka_adi: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user?.yetkiliKisi?.firma_id) {
        try {
          setLoading(true);
          // Temel firma bilgilerini al
          const firmaResponse = await firmaService.getFirma();
          const firmaData = firmaResponse.data.data;

          // Resmi bilgileri al
          const resmiBilgilerResponse = await firmaService.getResmiBilgiler(
            user.yetkiliKisi.firma_id
          );
          const resmiBilgilerData = resmiBilgilerResponse.data.data;

          // Faaliyet alanlarını al
          const faaliyetResponse = await firmaService.getFaaliyetAlanlari(
            user.yetkiliKisi.firma_id
          );
          const faaliyetData = faaliyetResponse.data.data;

          // Tüm verileri birleştir
          setFirmaData({
            ...firmaData,
            resmi_bilgiler: resmiBilgilerData,
          });
          setFaaliyetAlanlari(faaliyetData);

          // Form verilerini güncelle
          setFormData({
            // Temel firma bilgileri
            firma_unvani: firmaData.firma_unvani || "",
            marka_adi: firmaData.marka_adi || "",
            sektor: firmaData.sektor || "",
            merkez_adresi: firmaData.merkez_adresi || "",
            kep_adresi: firmaData.kep_adresi || "",
            email: firmaData.email || "",
            web_sitesi: firmaData.web_sitesi || "",
            iletisim_telefonu: firmaData.iletisim_telefonu || "",
            profil_resmi_url: firmaData.profil_resmi_url || "",

            // Resmi bilgiler
            faaliyet_durumu: resmiBilgilerData?.faaliyet_durumu || false,
            kurulus_tarihi: firmaData.kurulus_tarihi || "",
            kurulus_sehri: firmaData.kurulus_sehri || "",
            vkn: firmaData.vergi_kimlik_no || "",
            vergi_dairesi_adi: resmiBilgilerData?.vergi_dairesi_adi || "",
            mersis_no: resmiBilgilerData?.mersis_no || "",
            e_fatura_kullanimi: resmiBilgilerData?.e_fatura_kullanimi || false,
            e_arsiv_kullanimi: resmiBilgilerData?.e_arsiv_kullanimi || false,
            e_irsaliye_kullanimi:
              resmiBilgilerData?.e_irsaliye_kullanimi || false,
            e_defter_kullanimi: resmiBilgilerData?.e_defter_kullanimi || false,
            fax_numarasi: resmiBilgilerData?.fax_numarasi || "",
            iban_numarasi: resmiBilgilerData?.banka_iban || "",
            banka_adi: resmiBilgilerData?.banka_adi || "",
          });
        } catch (error) {
          console.error("Veri alınamadı:", error);
          toast.error("Veriler alınamadı");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user?.yetkiliKisi?.firma_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFaaliyetInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaaliyetAlani((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteFaaliyetAlani = async (id) => {
    try {
      setLoading(true);
      await firmaService.deleteFaaliyetAlani(id);
      setFaaliyetAlanlari((prev) =>
        prev.filter((faaliyet) => faaliyet.id !== id)
      );
      toast.success("Faaliyet alanı başarıyla silindi");
    } catch (error) {
      console.error("Faaliyet alanı silinemedi:", error);
      toast.error("Faaliyet alanı silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingFaaliyet(null);
    setNewFaaliyetAlani({ tur: "", alan: "", nace_kodu: "" });
  };

  const handleEditClick = (faaliyet) => {
    setEditingFaaliyet(faaliyet);
    setNewFaaliyetAlani({
      tur: faaliyet.tur,
      alan: faaliyet.alan,
      nace_kodu: faaliyet.nace_kodu,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAddFaaliyetAlani = async () => {
    if (
      !newFaaliyetAlani.tur ||
      !newFaaliyetAlani.alan ||
      !newFaaliyetAlani.nace_kodu
    ) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        const response = await firmaService.updateFaaliyetAlani(
          editingFaaliyet.id,
          {
            ...newFaaliyetAlani,
            firma_id: user.yetkiliKisi.firma_id,
          }
        );
        setFaaliyetAlanlari((prev) =>
          prev.map((faaliyet) =>
            faaliyet.id === editingFaaliyet.id ? response.data.data : faaliyet
          )
        );
        toast.success("Faaliyet alanı başarıyla güncellendi");
      } else {
        const response = await firmaService.createFaaliyetAlani({
          ...newFaaliyetAlani,
          firma_id: user.yetkiliKisi.firma_id,
        });
        setFaaliyetAlanlari((prev) => [...prev, response.data.data]);
        toast.success("Faaliyet alanı başarıyla eklendi");
      }
      handleModalClose();
    } catch (error) {
      console.error("İşlem başarısız:", error);
      toast.error(isEditMode ? "Güncelleme başarısız" : "Ekleme başarısız");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFaaliyetAlani = async (id, data) => {
    try {
      setLoading(true);
      const response = await firmaService.updateFaaliyetAlani(id, data);

      setFaaliyetAlanlari((prev) =>
        prev.map((faaliyet) =>
          faaliyet.id === id ? response.data.data : faaliyet
        )
      );
      toast.success("Faaliyet alanı başarıyla güncellendi");
    } catch (error) {
      console.error("Faaliyet alanı güncellenemedi:", error);
      toast.error("Faaliyet alanı güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSektorSelect = (sektor) => {
    setFormData((prev) => ({
      ...prev,
      sektor: sektor,
    }));
    setIsSektorDropdownOpen(false);
  };

  const handleBooleanSelect = (field, value) => {
    const boolValue = value === "Evet";

    setFormData((prev) => ({
      ...prev,
      [field]: boolValue,
    }));

    switch (field) {
      case "e_fatura_kullanimi":
        setIsEFaturaDropdownOpen(false);
        break;
      case "e_arsiv_kullanimi":
        setIsEArsivDropdownOpen(false);
        break;
      case "e_irsaliye_kullanimi":
        setIsEIrsaliyeDropdownOpen(false);
        break;
      case "e_defter_kullanimi":
        setIsEDefterDropdownOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Boş string'leri null'a çeviren yardımcı fonksiyon
      const convertEmptyToNull = (obj) => {
        const newObj = {};
        Object.keys(obj).forEach((key) => {
          // profil_resmi_url için özel kontrol
          if (key === "profil_resmi_url") {
            newObj[key] = obj[key] || firmaData.profil_resmi_url;
          } else {
            newObj[key] = obj[key] === "" ? null : obj[key];
          }
        });
        return newObj;
      };

      // Temel firma bilgilerini güncelle
      const firmaUpdateData = convertEmptyToNull({
        firma_unvani: formData.firma_unvani,
        marka_adi: formData.marka_adi,
        sektor: formData.sektor,
        merkez_adresi: formData.merkez_adresi,
        kep_adresi: formData.kep_adresi,
        email: formData.email,
        web_sitesi: formData.web_sitesi,
        iletisim_telefonu: formData.iletisim_telefonu,
        kurulus_tarihi: formData.kurulus_tarihi,
        kurulus_sehri: formData.kurulus_sehri,
        vergi_kimlik_no: formData.vkn,
        profil_resmi_url: firmaData.profil_resmi_url,
      });

      // Resmi bilgileri güncelle
      const resmiBilgilerUpdateData = convertEmptyToNull({
        faaliyet_durumu: formData.faaliyet_durumu,
        vergi_dairesi_adi: formData.vergi_dairesi_adi,
        mersis_no: formData.mersis_no || firmaData.resmi_bilgiler?.mersis_no, // Mevcut mersis_no'yu koru
        e_fatura_kullanimi: formData.e_fatura_kullanimi,
        e_arsiv_kullanimi: formData.e_arsiv_kullanimi,
        e_irsaliye_kullanimi: formData.e_irsaliye_kullanimi,
        e_defter_kullanimi: formData.e_defter_kullanimi,
        fax_numarasi: formData.fax_numarasi,
        banka_iban: formData.iban_numarasi,
        banka_adi: formData.banka_adi,
      });

      // Her iki endpoint'e de güncelleme isteği gönder
      await Promise.all([
        firmaService.updateFirma(firmaUpdateData),
        firmaService.updateResmiBilgiler(resmiBilgilerUpdateData),
      ]);

      // Başarılı güncelleme sonrası verileri yeniden çek
      const [firmaResponse, resmiBilgilerResponse, faaliyetResponse] =
        await Promise.all([
          firmaService.getFirma(),
          firmaService.getResmiBilgiler(user.yetkiliKisi.firma_id),
          firmaService.getFaaliyetAlanlari(user.yetkiliKisi.firma_id),
        ]);

      // State'i güncelle
      setFirmaData({
        ...firmaResponse.data.data,
        resmi_bilgiler: resmiBilgilerResponse.data.data,
      });
      setFaaliyetAlanlari(faaliyetResponse.data.data);

      toast.success("Bilgiler başarıyla güncellendi");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      toast.error(
        error.response?.data?.message ||
          "Bilgiler güncellenirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const FaaliyetAlaniModal = () => {
    return (
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === modalRef.current) handleModalClose();
            }}
            ref={modalRef}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {isEditMode
                    ? "Faaliyet Alanı Düzenle"
                    : "Yeni Faaliyet Alanı Ekle"}
                </h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faaliyet Türü
                  </label>
                  <input
                    type="text"
                    name="tur"
                    value={newFaaliyetAlani.tur}
                    onChange={handleFaaliyetInputChange}
                    className="w-full py-2 px-3 border border-[#A2ACC7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5540] focus:border-transparent"
                    placeholder="Faaliyet türünü giriniz"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faaliyet Alanı
                  </label>
                  <input
                    type="text"
                    name="alan"
                    value={newFaaliyetAlani.alan}
                    onChange={handleFaaliyetInputChange}
                    className="w-full py-2 px-3 border border-[#A2ACC7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5540] focus:border-transparent"
                    placeholder="Faaliyet alanını giriniz"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NACE Kodu
                  </label>
                  <input
                    type="text"
                    name="nace_kodu"
                    value={newFaaliyetAlani.nace_kodu}
                    onChange={handleFaaliyetInputChange}
                    className="w-full py-2 px-3 border border-[#A2ACC7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5540] focus:border-transparent"
                    placeholder="NACE kodunu giriniz"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 border border-[#A2ACC7] rounded-lg text-[#1D547D] hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddFaaliyetAlani}
                  disabled={loading}
                  className="px-4 py-2 bg-[#1C5540] text-white rounded-lg hover:bg-[#1C5540]/90 disabled:opacity-50"
                >
                  {loading ? "İşleniyor..." : isEditMode ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const loginUI = (
    <>
      <div
        id="firma-profil"
        className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row"
      >
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#3D4D66] montserrat font-medium">
          <img src="/images/icons/profil/kilitli.svg" alt="" />
          Firma Unvanı
        </p>
        <input
          type="text"
          disabled
          name="firma_unvani"
          value={formData.firma_unvani}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Marka Adı
        </p>
        <input
          type="text"
          name="marka_adi"
          value={formData.marka_adi}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row relative">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Hizmet Sektörü
        </p>
        <div className="w-full relative">
          <div
            onClick={() => setIsSektorDropdownOpen(!isSektorDropdownOpen)}
            className="py-3 px-[10px] border border-[#A2ACC7] flex items-center justify-between border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
          >
            <p>{formData.sektor}</p>
            <button type="button">
              <img
                src="/images/icons/down.svg"
                alt="Aşağı"
                className={`transition-transform duration-200 ${
                  isSektorDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          {isSektorDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#A2ACC7] rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {sektorler.map((sektor, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#1D547D]"
                  onClick={() => handleSektorSelect(sektor)}
                >
                  {sektor}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Faaliyet Alanları
        </p>
        <div className="w-full">
          <div className="mb-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1C5540] text-white px-4 py-1.5 font-semibold text-xs hover:bg-[#1C5540]/90 transition-colors"
            >
              Yeni Faaliyet Alanı Ekle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="border font-medium w-32 sm:w-40 border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-center">
                    Faaliyet Türü
                  </th>
                  <th className="border font-medium border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-left">
                    Faaliyet Alanı
                  </th>
                  <th className="border font-medium w-32 sm:w-40 border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-center">
                    NACE Kodu
                  </th>
                  <th className="border font-medium w-32 sm:w-40 border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-center">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {faaliyetAlanlari.map((faaliyet) => (
                  <tr key={faaliyet.id}>
                    <td className="border text-center border-[#A2ACC7] p-2 text-xs sm:text-sm">
                      {faaliyet.tur || "Sayfayı yenileyiniz"}
                    </td>
                    <td className="border border-[#A2ACC7] p-2 text-xs sm:text-sm">
                      {faaliyet.alan || "Sayfayı yenileyiniz"}
                    </td>
                    <td className="border border-[#A2ACC7] p-2 text-xs sm:text-sm text-center">
                      {faaliyet.nace_kodu || "Sayfayı yenileyiniz"}
                    </td>
                    <td className="border border-[#A2ACC7] p-2 text-xs sm:text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(faaliyet)}
                          className="text-[#1C5540] hover:text-[#1C5540]/80"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteFaaliyetAlani(faaliyet.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#3D4D66] montserrat font-medium">
          <img src="/images/icons/profil/kilitli.svg" alt="" />
          Faaliyet Durumu
        </p>
        <input
          type="text"
          disabled
          name="faaliyet_durumu"
          value={formData.faaliyet_durumu ? "Faal" : "Pasif"}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#3D4D66] montserrat font-medium">
          <img src="/images/icons/profil/kilitli.svg" alt="" />
          Kuruluş Tarihi
        </p>
        <input
          type="text"
          disabled
          name="kurulus_tarihi"
          value={formData.kurulus_tarihi}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#3D4D66] montserrat font-medium">
          <img src="/images/icons/profil/kilitli.svg" alt="" />
          Kuruluş Şehri
        </p>
        <input
          type="text"
          disabled
          name="kurulus_tarihi"
          value={formData.kurulus_sehri}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#3D4D66] montserrat font-medium">
          <img src="/images/icons/profil/kilitli.svg" alt="" />
          Vergi Kimlik No
        </p>
        <input
          type="text"
          disabled
          name="vkn"
          value={formData.vkn}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#3D4D66] montserrat font-medium">
          <img src="/images/icons/profil/kilitli.svg" alt="" />
          Vergi Dairesi Adı
        </p>
        <input
          type="text"
          disabled
          name="vergi_dairesi_adi"
          value={formData.vergi_dairesi_adi}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          MERSİS No
        </p>
        <input
          type="text"
          name="mersis_no"
          value={formData.mersis_no}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row relative">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          E-Fatura Kullanımı
        </p>
        <div className="w-full relative">
          <div
            onClick={() => setIsEFaturaDropdownOpen(!isEFaturaDropdownOpen)}
            className="py-3 px-[10px] border border-[#A2ACC7] flex items-center justify-between border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
          >
            <p>{formData.e_fatura_kullanimi ? "Evet" : "Hayır"}</p>
            <button type="button">
              <img
                src="/images/icons/down.svg"
                alt="Aşağı"
                className={`transition-transform duration-200 ${
                  isEFaturaDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          {isEFaturaDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#A2ACC7] rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#1D547D]"
                onClick={() =>
                  handleBooleanSelect("e_fatura_kullanimi", "Evet")
                }
              >
                Evet
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#1D547D]"
                onClick={() =>
                  handleBooleanSelect("e_fatura_kullanimi", "Hayır")
                }
              >
                Hayır
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row relative">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          E-Arşiv Kullanımı
        </p>
        <div className="w-full relative">
          <div
            onClick={() => setIsEArsivDropdownOpen(!isEArsivDropdownOpen)}
            className="py-3 px-[10px] border border-[#A2ACC7] flex items-center justify-between border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
          >
            <p>{formData.e_arsiv_kullanimi ? "Evet" : "Hayır"}</p>
            <button type="button">
              <img
                src="/images/icons/down.svg"
                alt="Aşağı"
                className={`transition-transform duration-200 ${
                  isEArsivDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          {isEArsivDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#A2ACC7] rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#1D547D]"
                onClick={() => handleBooleanSelect("e_arsiv_kullanimi", "Evet")}
              >
                Evet
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#1D547D]"
                onClick={() =>
                  handleBooleanSelect("e_arsiv_kullanimi", "Hayır")
                }
              >
                Hayır
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row relative">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          E-İrsaliye Kullanımı
        </p>
        <div className="w-full relative">
          <div
            onClick={() => setIsEIrsaliyeDropdownOpen(!isEIrsaliyeDropdownOpen)}
            className="py-3 px-[10px] border border-[#A2ACC7] flex items-center justify-between border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
          >
            <p>{formData.e_irsaliye_kullanimi ? "Evet" : "Hayır"}</p>
            <button type="button">
              <img
                src="/images/icons/down.svg"
                alt="Aşağı"
                className={`transition-transform duration-200 ${
                  isEIrsaliyeDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          {isEIrsaliyeDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#A2ACC7] rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#1D547D]"
                onClick={() =>
                  handleBooleanSelect("e_irsaliye_kullanimi", "Evet")
                }
              >
                Evet
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#1D547D]"
                onClick={() =>
                  handleBooleanSelect("e_irsaliye_kullanimi", "Hayır")
                }
              >
                Hayır
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row relative">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          E-Defter Kullanımı
        </p>
        <div className="w-full relative">
          <div
            onClick={() => setIsEDefterDropdownOpen(!isEDefterDropdownOpen)}
            className="py-3 px-[10px] border border-[#A2ACC7] flex items-center justify-between border-dashed outline-0 rounded-lg w-full text-[#1D547D] cursor-pointer"
          >
            <p>{formData.e_defter_kullanimi ? "Evet" : "Hayır"}</p>
            <button type="button">
              <img
                src="/images/icons/down.svg"
                alt="Aşağı"
                className={`transition-transform duration-200 ${
                  isEDefterDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          {isEDefterDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#A2ACC7] rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#1D547D]"
                onClick={() =>
                  handleBooleanSelect("e_defter_kullanimi", "Evet")
                }
              >
                Evet
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#1D547D]"
                onClick={() =>
                  handleBooleanSelect("e_defter_kullanimi", "Hayır")
                }
              >
                Hayır
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Merkez Adresi
        </p>
        <input
          type="text"
          name="merkez_adresi"
          value={formData.merkez_adresi}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          KEP Adresi
        </p>
        <input
          type="text"
          name="kep_adresi"
          value={formData.kep_adresi}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          E-Posta Adresi
        </p>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Resmi Web Adresi
        </p>
        <input
          type="url"
          name="web_sitesi"
          value={formData.web_sitesi}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          İletişim Telefonu
        </p>
        <input
          type="tel"
          name="iletisim_telefonu"
          value={formData.iletisim_telefonu}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Fax Numarası
        </p>
        <input
          type="tel"
          name="fax_numarasi"
          value={formData.fax_numarasi}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Banka IBAN Numarası
        </p>
        <input
          type="text"
          name="iban_numarasi"
          value={formData.iban_numarasi}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>

      <div className="flex flex-col sm:items-center gap-2 sm:gap-0 sm:justify-between sm:flex-row">
        <p className="flex sm:w-1/3 items-center gap-1.5 text-[#007356] montserrat font-medium">
          <img src="/images/icons/profil/duzenlenebilir.svg" alt="" />
          Banka Adı
        </p>
        <input
          type="text"
          name="banka_adi"
          value={formData.banka_adi}
          onChange={handleInputChange}
          className="py-3 px-[10px] border border-[#A2ACC7] border-dashed outline-0 rounded-lg w-full text-[#1D547D]"
        />
      </div>
    </>
  );

  return (
    <motion.div
      key="tab-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="montserrat"
    >
      <div className="flex justify-end mb-2 sm:mb-0">
        <p className="text-[#120A8F] font-semibold text-xs sm:text-sm">
          Resmi Firma Bilgilerimiz
        </p>
      </div>

      <p className="font-medium text-base sm:text-lg">
        Resmi Firma Bilgilerimiz
      </p>
      <p className="my-3 text-sm sm:text-base">
        Ürün ve hizmetlerimizle ilgili detaylı bilgi almak için kataloğumuzu
        inceleyebilirsiniz. Size en uygun çözümleri keşfetmek için kataloğumuza
        göz atın.
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C5540]"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {isLogin && user ? (
            <>
              {loginUI}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#1C5540] text-white px-6 py-2 rounded-lg hover:bg-[#1C5540]/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Faaliyet Alanları Bölümü */}
              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
                <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
                  Faaliyet Alanları
                </p>
                <div className="w-full">
                  <div className="mb-4">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-[#1C5540] text-white px-4 py-2 rounded-lg hover:bg-[#1C5540]/90 transition-colors"
                    >
                      Yeni Faaliyet Alanı Ekle
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[600px]">
                      <thead>
                        <tr>
                          <th className="border font-medium w-32 sm:w-40 border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-center">
                            Faaliyet Türü
                          </th>
                          <th className="border font-medium border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-left">
                            Faaliyet Alanı
                          </th>
                          <th className="border font-medium w-32 sm:w-40 border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-center">
                            NACE Kodu
                          </th>
                          <th className="border font-medium w-32 sm:w-40 border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-center">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {faaliyetAlanlari.map((faaliyet) => (
                          <tr key={faaliyet.id}>
                            <td className="border text-center border-[#A2ACC7] p-2 text-xs sm:text-sm">
                              {faaliyet.tur}
                            </td>
                            <td className="border border-[#A2ACC7] p-2 text-xs sm:text-sm">
                              {faaliyet.alan}
                            </td>
                            <td className="border border-[#A2ACC7] p-2 text-xs sm:text-sm text-center">
                              {faaliyet.nace_kodu}
                            </td>
                            <td className="border border-[#A2ACC7] p-2 text-xs sm:text-sm text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateFaaliyetAlani(
                                      faaliyet.id,
                                      faaliyet
                                    )
                                  }
                                  className="text-[#1C5540] hover:text-[#1C5540]/80"
                                >
                                  Düzenle
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteFaaliyetAlani(faaliyet.id)
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Sil
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <FaaliyetAlaniModal />
    </motion.div>
  );
};

export default FirmaBilgileri;
