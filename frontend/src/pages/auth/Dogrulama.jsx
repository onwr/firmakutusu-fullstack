import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { toast } from "sonner";

const Dogrulama = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    tcNo: "",
    phone: "",
    verificationCode: "",
  });
  const [kisiDogrulandi, setKisiDogrulandi] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState("kurumsal");
  const [yukleniyor, setYukleniyor] = useState(false);

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [remainingTime, setRemainingTime] = useState(179);
  const [showCodeMessage, setShowCodeMessage] = useState(false);
  const [yetkiliKisi, setYetkiliKisi] = useState(null);
  const [isInitialCodeSent, setIsInitialCodeSent] = useState(false);
  const [tcError, setTcError] = useState("");

  const [kurumFormData, setKurumFormData] = useState({
    sektor: "",
    markaAdi: "",
    vergiNo: "",
    firmaUnvani: "",
  });
  const [showSektorDropdown, setShowSektorDropdown] = useState(false);
  const [sektorError, setSektorError] = useState("");
  const [vergiError, setVergiError] = useState("");
  const [isOnayChecked, setIsOnayChecked] = useState(false);

  useEffect(() => {
    const fetchYetkiliKisi = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Token bulunamadı");
        return;
      }
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/dogrulama/yetkili-kisi`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Yetkili kişi bilgileri alınamadı");
        }

        const data = await response.json();
        if (data.success) {
          setYetkiliKisi(data.data);
          setKisiDogrulandi(true);
        } else {
          console.error("Hata:", data.message);
        }
      } catch (error) {
        return;
      }
    };

    fetchYetkiliKisi();
  }, []);

  const sektorler = [
    "Bilişim Teknolojileri",
    "Eğitim",
    "Finans",
    "Gıda",
    "İnşaat",
    "Otomotiv",
    "Sağlık",
    "Tekstil",
    "Turizm",
    "Diğer",
  ];

  const formatPhoneNumber = (value) => {
    value = value.replace("+90", "").trim();

    let numbers = value.replace(/\D/g, "");

    if (numbers.length === 0) return "+90 ";

    let formatted = "+90 ";
    if (numbers.length > 0) {
      formatted += "(";
      formatted += numbers.substring(0, 3);
      if (numbers.length > 3) {
        formatted += ") ";
        formatted += numbers.substring(3, 6);
        if (numbers.length > 6) {
          formatted += " ";
          formatted += numbers.substring(6, 8);
          if (numbers.length > 8) {
            formatted += " ";
            formatted += numbers.substring(8, 10);
          }
        }
      }
    }
    return formatted;
  };

  const validateTCKN = (value) => {
    if (value.length !== 11) return false;

    if (!/^[0-9]+$/.test(value)) return false;

    if (value[0] === "0") return false;

    let sumOdd =
      parseInt(value[0]) +
      parseInt(value[2]) +
      parseInt(value[4]) +
      parseInt(value[6]) +
      parseInt(value[8]);
    let sumEven =
      parseInt(value[1]) +
      parseInt(value[3]) +
      parseInt(value[5]) +
      parseInt(value[7]);

    let digit10 = (sumOdd * 7 - sumEven) % 10;
    if (digit10 < 0) digit10 += 10;
    if (digit10 !== parseInt(value[9])) return false;

    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(value[i]);
    }
    let digit11 = sum % 10;
    if (digit11 !== parseInt(value[10])) return false;

    return true;
  };

  const validateVergiNo = (value) => {
    // Check if empty or not correct length
    if (!value || value.length !== 10) return false;

    // Check if contains only numbers
    if (!/^\d{10}$/.test(value)) return false;

    // VKN validation algorithm
    const digits = value.split("").map(Number);
    let sum = 0;

    // First 9 digits
    for (let i = 0; i < 9; i++) {
      let digit = digits[i];
      let temp = (digit + 10 - (i + 1)) % 10;
      sum += temp === 9 ? temp : (temp * Math.pow(2, 10 - (i + 1))) % 9;
    }

    let lastDigit = (10 - (sum % 10)) % 10;
    return lastDigit === digits[9];
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "tcNo") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 11);
      setFormData((prev) => ({
        ...prev,
        [id]: onlyNumbers,
      }));

      if (!onlyNumbers) {
        setTcError("");
        return;
      }

      if (onlyNumbers.length === 11) {
        if (!validateTCKN(onlyNumbers)) {
          setTcError("Geçersiz T.C. Kimlik Numarası");
        } else {
          setTcError("");
        }
      }
    } else if (id === "phone") {
      const isBackspace = e.nativeEvent.inputType === "deleteContentBackward";
      let newValue = value;

      if (isBackspace) {
        newValue = formData.phone.slice(0, -1);
        if (newValue === "+90 ") newValue = "+90 ";
      }

      setFormData((prev) => ({
        ...prev,
        [id]: formatPhoneNumber(newValue),
      }));
    } else if (id === "verificationCode") {
      const onlyNumbers = value.replace(/\D/g, "");
      if (onlyNumbers.length <= 6) {
        setFormData((prev) => ({
          ...prev,
          [id]: onlyNumbers,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleKisiSubmit = async (e) => {
    e.preventDefault();

    try {
      setYukleniyor(true);
      const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/dogrulama/yetkili-kisi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ad: formData.name,
            soyad: formData.surname,
            tc_kimlik_no: formData.tcNo,
            telefon_no: formData.phone,
            bireysel: selectedMembership === "bireysel",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (data.data.token) {
          localStorage.setItem("token", data.data.token);
        }
        setKisiDogrulandi(true);
        setYukleniyor(false);
      } else {
        toast.error(data.message);
        setYukleniyor(false);
      }
    } catch (error) {
      console.error("Kisi kayit hatasi", error);
      toast.error("Kisi kayit sırasında bir hata oluştu");
      setYukleniyor(false);
    }
  };

  const handleKurumFormChange = (e) => {
    const { id, value } = e.target;

    if (id === "vergiNo") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);
      setKurumFormData((prev) => ({
        ...prev,
        [id]: onlyNumbers,
      }));

      if (!validateVergiNo(onlyNumbers)) {
        setVergiError("Geçersiz Vergi Kimlik Numarası");
      } else {
        setVergiError("");
      }
    } else {
      setKurumFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSektorSelect = (sektor) => {
    setKurumFormData((prev) => ({
      ...prev,
      sektor,
    }));
    setSektorError("");
    setShowSektorDropdown(false);
  };

  const handleNewCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/dogrulama/sms-gonder",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telefon_no: formData.phone,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowCodeMessage(true);
        setRemainingTime(179);
        setIsInitialCodeSent(true);
        toast.success("SMS gönderildi", {
          duration: 3000,
        });

        setTimeout(() => {
          setShowCodeMessage(false);
        }, 3000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("SMS gönderme hatası:", error);
      toast.error("Kod gönderilirken bir hata oluştu");
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/dogrulama/dogrula",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            code: formData.verificationCode,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        await handleKisiSubmit(e);
        toast.success("Doğrulama başarılı bir şekilde gerçekleştirildi");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Kod doğrulama hatası:", error);
      toast.error("Doğrulama sırasında bir hata oluştu");
    }
  };

  const createFirma = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/firma`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            uyelik_turu: selectedMembership,
            sektor: kurumFormData.sektor,
            marka_adi: kurumFormData.markaAdi,
            vergi_kimlik_no: kurumFormData.vergiNo,
            firma_unvani: kurumFormData.firmaUnvani,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Firma başarıyla oluşturuldu");
        localStorage.removeItem("token");
        window.location.href = "/hesap/giris-kayit";
      } else {
        toast.error(result.message);
        return null;
      }
    } catch (error) {
      console.error("Firma oluşturma hatası:", error);
      toast.error("Firma oluşturulurken bir hata oluştu");
      return null;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (remainingTime > 0 && isInitialCodeSent) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remainingTime, isInitialCodeSent]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
      },
    },
  };

  const checkboxVariants = {
    checked: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.3,
      },
    },
    unchecked: {
      scale: 1,
    },
  };

  const handleBireyselSubmit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/firma`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            bireysel: true,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Bireysel üyelik başarıyla oluşturuldu");
        localStorage.removeItem("token");
        window.location.href = "/hesap/giris-kayit";
      } else {
        toast.error(result.message);
        return null;
      }
    } catch (error) {
      console.error("Bireysel üyelik oluşturma hatası:", error);
      toast.error("Bireysel üyelik oluşturulurken bir hata oluştu");
      return null;
    }
  };

  return (
    <div>
      <Header />
      <div className="relative z-10 pb-10">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          src="/images/icons/graident-bg.svg"
          className="absolute -z-10 top-0 w-full h-[550px] object-cover"
        />

        <div className="container px-4 lg:px-2 mx-auto z-10">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="marcellus pt-5 text-white "
          >
            {kisiDogrulandi
              ? "Kurumsal Üyelik & Bireysel Üyelik Doğrulama"
              : "Yetkili Kişi Kayıt ve Doğrulama Formu"}
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-5 w-full flex flex-col items-center justify-center rounded-xl py-10 md:py-20 px-4 md:px-[10px] bg-white drop-shadow-2xl"
          >
            {kisiDogrulandi ? (
              <>
                <motion.img
                  variants={itemVariants}
                  src="/images/icons/auth/basarili.svg"
                  className="w-48 md:w-auto"
                />
                <motion.p
                  variants={itemVariants}
                  className="mt-3 text-center marcellus text-xl md:text-2xl lg:text-3xl text-[#1D547D]"
                >
                  Tebrikler! <br /> Yetkili kişi bilgileri başarıyla kaydedildi.
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  className="mt-2 montserrat font-semibold text-sm md:text-base text-[#1D547D] text-center"
                >
                  Üyeliğinizi tamamlamak için lütfen aşağıdaki adımları takip
                  edin
                </motion.p>

                <motion.p
                  variants={cardVariants}
                  className="mt-4 bg-[#1C5540] text-white rounded-lg py-2 w-full max-w-4xl marcellus font-light text-sm md:text-base text-center"
                >
                  {yetkiliKisi && (
                    <>
                      Yetkili kişi{" "}
                      <span className="font-serif font-semibold">
                        {yetkiliKisi.ad} {yetkiliKisi.soyad}
                      </span>
                    </>
                  )}
                </motion.p>

                <motion.div
                  variants={cardVariants}
                  className="mt-4 max-w-4xl w-full flex flex-col md:flex-row gap-5"
                >
                  <label
                    htmlFor="kurumsal"
                    className={`w-full flex items-center gap-4 border border-[#A2ACC7] border-dashed rounded-xl py-12 px-8 cursor-pointer transition-all duration-300 ${
                      selectedMembership === "kurumsal" ? "bg-[#1C5540]/10" : ""
                    }`}
                  >
                    <motion.div
                      className="relative w-[20px] h-[20px]"
                      variants={cardVariants}
                      animate={
                        selectedMembership === "kurumsal"
                          ? "checked"
                          : "unchecked"
                      }
                    >
                      <input
                        type="checkbox"
                        id="kurumsal"
                        checked={selectedMembership === "kurumsal"}
                        onChange={() => setSelectedMembership("kurumsal")}
                        className="absolute w-[20px] h-[20px] appearance-none rounded-full border-2 border-[#9DA0A6] checked:bg-[#1C5540] checked:border-[#1C5540] cursor-pointer"
                      />
                    </motion.div>
                    <img
                      src="/images/icons/auth/kurumsal.svg"
                      className="w-auto"
                    />
                    <div className="flex flex-col gap-0">
                      <p className="montserrat font-semibold text-[#1C5540]">
                        Kurumsal Üyelik
                      </p>
                      <p className="text-sm font-light text-[#1C5540]">
                        Şirketinizi en iyi şekilde tanıtın! Vergi numaranız ile
                        doğrulama yaparak firmanızı kaydedin ve müşteri
                        kitlenize daha profesyonel bir şekilde ulaşın.
                      </p>
                    </div>
                  </label>

                  <label
                    htmlFor="bireysel"
                    className={`w-full flex items-center gap-4 border border-[#A2ACC7] border-dashed rounded-xl py-12 px-8 cursor-pointer transition-all duration-300 ${
                      selectedMembership === "bireysel" ? "bg-[#1C5540]/10" : ""
                    }`}
                  >
                    <motion.div
                      className="relative w-[20px] h-[20px]"
                      variants={cardVariants}
                      animate={
                        selectedMembership === "bireysel"
                          ? "checked"
                          : "unchecked"
                      }
                    >
                      <input
                        type="checkbox"
                        id="bireysel"
                        checked={selectedMembership === "bireysel"}
                        onChange={() => setSelectedMembership("bireysel")}
                        className="absolute w-[20px] h-[20px] appearance-none rounded-full border-2 border-[#9DA0A6] checked:bg-[#1C5540] checked:border-[#1C5540] cursor-pointer"
                      />
                    </motion.div>
                    <img
                      src="/images/icons/auth/bireysel.svg"
                      className="w-auto"
                    />
                    <div className="flex flex-col gap-0">
                      <p className="montserrat font-semibold text-[#1C5540]">
                        Bireysel Üyelik
                      </p>
                      <p className="text-sm font-light text-[#1C5540]">
                        İşletmeleri keşfedin, profesyonel ve kurumsal firmaları
                        bulun! Hizmetleri inceleyin, değerlendirin ve en doğru
                        seçimi yapın.
                      </p>
                    </div>
                  </label>
                </motion.div>

                <motion.div variants={cardVariants} className="mt-8 w-full">
                  {selectedMembership === "kurumsal" && (
                    <motion.div
                      variants={containerVariants}
                      className="max-w-4xl mx-auto w-full mt-6"
                    >
                      <div className="flex flex-col md:flex-row gap-5 items-start">
                        <img
                          src="/images/icons/auth/kurumsal-hero.svg"
                          className="w-16 md:w-20 mx-auto md:mx-0"
                        />
                        <div className="flex flex-col gap-1">
                          <p className="montserrat text-lg text-center md:text-left md:text-xl text-[#232323] font-semibold">
                            Kurumsal Üyelik İçin Doğrulama
                          </p>
                          <p className="montserrat text-xs md:text-left text-center md:text-sm text-[#232323]">
                            Lütfen vergi kimlik numaranızı girin, sorgulama
                            işlemini başlatın ve firmanıza ait bilgilerin
                            doğruluğunu kontrol ettikten sonra onaylayarak
                            işleminizi tamamlayın.
                          </p>
                        </div>
                      </div>

                      <form className="mt-5 space-y-4" onSubmit={createFirma}>
                        <div className="relative">
                          <motion.button
                            type="button"
                            onClick={() =>
                              setShowSektorDropdown(!showSektorDropdown)
                            }
                            className="py-2 px-3 md:px-5 montserrat w-full rounded-lg border border-[#A2ACC7] flex items-center justify-between"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="flex flex-col items-start gap-1">
                              <p className="montserrat text-sm text-[#232323]">
                                Sektörünüz
                              </p>
                              <p className="montserrat font-medium text-[#232323]">
                                {kurumFormData.sektor || "Sektör Seçiniz"}
                              </p>
                            </div>
                            <motion.img
                              src="/images/icons/down.svg"
                              alt=""
                              animate={{ rotate: showSektorDropdown ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>

                          <AnimatePresence>
                            {showSektorDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-50 mt-2 w-full bg-white rounded-lg border border-[#A2ACC7] shadow-lg py-2 max-h-[200px] overflow-y-auto"
                              >
                                {sektorler.map((sektor) => (
                                  <div
                                    key={sektor}
                                    onClick={() => handleSektorSelect(sektor)}
                                    className="px-4 py-2 hover:bg-[#1C5540]/5 cursor-pointer transition-colors"
                                  >
                                    {sektor}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <motion.div
                          className="py-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label
                            htmlFor="markaAdi"
                            className="text-xs md:text-sm text-[#232323]"
                          >
                            Marka Adınızı Girin
                          </label>
                          <input
                            type="text"
                            id="markaAdi"
                            value={kurumFormData.markaAdi}
                            onChange={handleKurumFormChange}
                            placeholder="Marka Adınızı Giriniz"
                            className="text-[#232323] placeholder-[#232323] font-medium outline-none mt-1 bg-transparent"
                          />
                        </motion.div>

                        <motion.div
                          className={`py-4 px-3 md:px-5 montserrat rounded-lg border ${
                            vergiError ? "border-red-500" : "border-[#A42E2D]"
                          } border-dashed flex flex-col md:flex-row items-center justify-between gap-4`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex flex-col w-full items-start gap-1">
                            <p className="montserrat text-sm text-[#232323]">
                              Vergi Kimlik Numaranızı Doğrulayın
                            </p>
                            <input
                              type="text"
                              id="vergiNo"
                              value={kurumFormData.vergiNo}
                              onChange={handleKurumFormChange}
                              placeholder="Vergi Kimlik Numarası"
                              maxLength={10}
                              className={`w-full text-[#232323] placeholder-[#232323] font-medium outline-none bg-transparent ${
                                vergiError ? "text-red-500" : ""
                              }`}
                            />
                            {vergiError && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-xs mt-1"
                              >
                                {vergiError}
                              </motion.p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (validateVergiNo(kurumFormData.vergiNo)) {
                                // api
                              }
                            }}
                            disabled={!kurumFormData.vergiNo || vergiError}
                            className="w-full md:w-1/2 bg-[#BCF6D9] hover:bg-[#1C5540]/90 duration-300 hover:text-white py-5 text-[#1C5540] font-medium montserrat rounded-[10px] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                          >
                            VKN Numaramı Sorgula
                          </button>
                        </motion.div>

                        <motion.div
                          className="py-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label
                            htmlFor="firmaUnvani"
                            className="text-xs md:text-sm text-[#232323]"
                          >
                            Firma Unvanı
                          </label>
                          <input
                            type="text"
                            id="firmaUnvani"
                            value={kurumFormData.firmaUnvani}
                            onChange={handleKurumFormChange}
                            placeholder="Firma Unvanı Giriniz"
                            className="text-[#232323] placeholder-[#232323] font-medium outline-none mt-1 bg-transparent"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-start gap-4"
                        >
                          <motion.div
                            className="relative mt-1 w-[20px] h-[20px]"
                            variants={checkboxVariants}
                            animate={isOnayChecked ? "checked" : "unchecked"}
                          >
                            <input
                              type="checkbox"
                              id="onay"
                              checked={isOnayChecked}
                              onChange={(e) =>
                                setIsOnayChecked(e.target.checked)
                              }
                              className="absolute md:w-[20px] size-4 md:h-[20px] appearance-none rounded-sm border-2 border-[#9DA0A6] checked:bg-[#1C5540] checked:border-[#1C5540] cursor-pointer"
                            />
                          </motion.div>
                          <label
                            htmlFor="onay"
                            className="montserrat text-[#232323]"
                          >
                            Vergi kimlik numarası sorgulaması sonrası, yukarıda
                            görünen firma ünvanının doğru olduğunu ve iş yeri
                            sahibi veya firma yetkilisi olarak bu bilgileri
                            onayladığımı kabul ediyorum.
                          </label>
                        </motion.div>

                        <motion.button
                          type="submit"
                          disabled={
                            !isOnayChecked ||
                            !kurumFormData.sektor ||
                            !kurumFormData.markaAdi ||
                            !kurumFormData.vergiNo ||
                            vergiError ||
                            !kurumFormData.firmaUnvani
                          }
                          whileHover={{ scale: isOnayChecked ? 1.01 : 1 }}
                          whileTap={{ scale: isOnayChecked ? 0.99 : 1 }}
                          className={`w-full text-white font-semibold montserrat py-6 md:py-8 rounded-lg mt-5 transition-all ${
                            isOnayChecked
                              ? "bg-[#1C5540] hover:bg-[#1A4D3A]"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Bilgileri Kaydet ve Profilime Git
                        </motion.button>
                      </form>
                    </motion.div>
                  )}
                  {selectedMembership === "bireysel" && (
                    <div className="w-full flex items-center justify-center">
                      <motion.button
                        variants={itemVariants}
                        onClick={handleBireyselSubmit}
                        whileHover={{ scale: isOnayChecked ? 1.01 : 1 }}
                        whileTap={{ scale: isOnayChecked ? 0.99 : 1 }}
                        className={`text-white max-w-4xl mx-auto  bg-[#1C5540] hover:bg-[#1A4D3A] w-full font-semibold montserrat py-6 md:py-8 rounded-lg transition-all`}
                      >
                        Bilgileri Kaydet ve Profilime Git
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </>
            ) : (
              <>
                <motion.img
                  variants={itemVariants}
                  src="/images/icons/auth/dogrula-hero.svg"
                  className="w-48 md:w-auto"
                />
                <motion.p
                  variants={itemVariants}
                  className="mt-3 text-center marcellus text-xl md:text-2xl lg:text-3xl text-[#1D547D]"
                >
                  Bilgilendirme! <br /> Bu Bilgileri Neden İstiyoruz?
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  className="mt-2 montserrat font-semibold text-sm md:text-base text-[#1D547D] text-center"
                >
                  Üyeliğinizi tamamlamak için lütfen aşağıdaki adımları takip
                  edin
                </motion.p>
                <motion.div
                  variants={containerVariants}
                  className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 w-full"
                >
                  {[
                    {
                      title: "Kimlik Doğrulama",
                      description:
                        "Üyelik işlemlerinin güvenliğini sağlamak ve sahte hesapların önüne geçmek için yetkili kişinin kimliğini doğruluyoruz.",
                    },
                    {
                      title: "Hesap Güvenliği",
                      description:
                        "Kullanıcının hesabına yalnızca kendisinin erişebilmesi için SMS doğrulama sistemi ile güvenliği artırıyoruz.",
                    },
                    {
                      title: "Yasal Zorunluluklar",
                      description:
                        "Yasal düzenlemelere tam uyum sağlamak ve ilgili tüm gereklilikleri eksiksiz yerine getirmek için zorunludur.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      whileHover="hover"
                      className="rounded-xl bg-[#F1EEE6] px-4 md:px-6 py-8 md:py-10 transition-shadow hover:shadow-lg"
                    >
                      <p className="montserrat text-center font-semibold text-base md:text-lg">
                        {item.title}
                      </p>
                      <p className="mt-1 text-center font-light montserrat text-sm md:text-base">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  className="max-w-3xl w-full mt-6 md:mt-12"
                >
                  <div className="flex flex-col md:flex-row gap-5 items-start">
                    <img
                      src="/images/icons/auth/yetkili.svg"
                      className="w-16 md:w-20 mx-auto md:mx-0"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="montserrat text-lg text-center md:text-left md:text-xl text-[#232323] font-semibold">
                        Yetkili Kişi Kayıt ve Doğrulama Formu
                      </p>
                      <p className="montserrat text-xs md:text-left text-center md:text-sm text-[#232323]">
                        Lütfen, üyelik işlemlerini tamamlamak ve hesabınızı
                        güvence altına almak için aşağıdaki bilgileri eksiksiz
                        doldurunuz.
                      </p>
                    </div>
                  </div>

                  <form className="mt-5 space-y-4" onSubmit={verifyCode}>
                    <motion.div
                      className="py-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label
                        htmlFor="name"
                        className="text-xs md:text-sm text-[#232323]"
                      >
                        Adınız
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Adınızı giriniz"
                        required
                        className="text-[#232323] placeholder-[#232323] font-medium outline-none mt-1 bg-transparent"
                      />
                    </motion.div>

                    <motion.div
                      className="py-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label
                        htmlFor="surname"
                        className="text-xs md:text-sm text-[#232323]"
                      >
                        Soyadınız
                      </label>
                      <input
                        type="text"
                        id="surname"
                        required
                        value={formData.surname}
                        onChange={handleInputChange}
                        placeholder="Soyadınızı Giriniz"
                        className="text-[#232323] placeholder-[#232323] font-medium outline-none mt-1 bg-transparent"
                      />
                    </motion.div>

                    <motion.div
                      className={`py-2 px-3 md:px-5 montserrat rounded-lg border ${
                        tcError ? "border-red-500" : "border-[#A2ACC7]"
                      } flex flex-col`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label
                        htmlFor="tcNo"
                        className="text-xs md:text-sm text-[#232323]"
                      >
                        T.C. Kimlik Numaranız
                      </label>
                      <input
                        type="text"
                        id="tcNo"
                        required
                        value={formData.tcNo}
                        onChange={handleInputChange}
                        placeholder="T.C. Kimlik Numaranız"
                        className={`text-[#232323] placeholder-[#232323] font-medium outline-none mt-1 bg-transparent ${
                          tcError ? "text-red-500" : ""
                        }`}
                        maxLength={11}
                      />
                      {tcError && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {tcError}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      className="py-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label
                        htmlFor="phone"
                        className="text-xs md:text-sm text-[#232323]"
                      >
                        Telefon Numaranız
                      </label>
                      <input
                        type="tel"
                        required
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+90"
                        maxLength={19}
                        className="text-[#232323] placeholder-[#232323] font-medium outline-none mt-1 bg-transparent"
                      />
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-center py-4 px-3 montserrat rounded-lg border border-[#A42E2D] border-dashed mt-2 md:px-5 gap-4">
                      <div className="flex items-center w-full">
                        <img
                          src="/images/icons/auth/phone.svg"
                          className="w-6 md:w-auto"
                        />
                        <input
                          type="text"
                          id="verificationCode"
                          required
                          value={formData.verificationCode}
                          onChange={handleInputChange}
                          placeholder="Doğrulama kodunuzu giriniz."
                          maxLength={6}
                          className="text-[#232323] ml-5 w-full placeholder-[#232323] appearance-none outline-none bg-transparent"
                        />
                      </div>
                      <div className="flex gap-2 w-full">
                        {isInitialCodeSent && (
                          <div className="rounded-[10px] flex items-center justify-center gap-1 text-xs md:text-sm bg-[#CED4DA] w-full py-3 md:py-5">
                            Kalan Süre{" "}
                            <span className="font-bold">
                              {formatTime(remainingTime)}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={handleNewCode}
                          disabled={isInitialCodeSent && remainingTime > 0}
                          className={`rounded-[10px] text-xs md:text-sm w-full py-3 md:py-5 transition-colors ${
                            isInitialCodeSent && remainingTime > 0
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-[#BCF6D9] text-[#1C5540] hover:bg-[#9CE7C3]"
                          }`}
                        >
                          {!isInitialCodeSent
                            ? "Kod Gönder"
                            : remainingTime > 0
                            ? "Kod Gönderildi"
                            : "Yeni Kod Gönder"}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showCodeMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-[#BCF6D9] text-[#1C5540] p-3 rounded-lg text-sm text-center"
                        >
                          Yeni doğrulama kodu gönderildi!
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-2 flex items-start md:items-center gap-2 montserrat text-[#232323] text-xs md:text-sm">
                      <img
                        src="/images/icons/auth/alert.svg"
                        className="w-5 md:w-auto"
                      />
                      <p>
                        İşlemlere devam edebilmek için{" "}
                        <strong>{formData.phone}</strong> numaralı telefonunuza
                        gönderilen 6 haneli doğrulama kodunu giriniz.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      type="submit"
                      whileTap={{ scale: 0.99 }}
                      className="w-full text-white font-semibold montserrat py-6 md:py-8 bg-[#1C5540] rounded-lg mt-5 hover:bg-[#1A4D3A] transition-colors"
                      disabled={yukleniyor}
                    >
                      {yukleniyor ? "Yükleniyor..." : "Onayla ve Devam Et"}
                    </motion.button>
                  </form>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dogrulama;
