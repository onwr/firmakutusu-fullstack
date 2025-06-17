import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { FormInput, FormSelect } from "../../components/common/Input";
import { paketService, savedCardService } from "../../services/api";
import { toast } from "sonner";

const Paketlerim = () => {
  const [formData, setFormData] = useState({});
  const [tur, setTur] = useState("yillik");
  const [paketler, setPaketler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aktifPaket, setAktifPaket] = useState(null);
  const [savedCards, setSavedCards] = useState([]);

  // Özellikleri parse eden yardımcı fonksiyon
  const parseOzellikler = (ozelliklerStr) => {
    if (!ozelliklerStr) return [];
    return ozelliklerStr.split("||").map((ozellik) => {
      const [baslik, aciklama] = ozellik.split(":");
      return { baslik, aciklama };
    });
  };

  useEffect(() => {
    fetchPaketler();
    fetchAktifPaket();
    fetchSavedCards();
  }, []);

  const fetchPaketler = async () => {
    try {
      const response = await paketService.getAllPakets();
      // Her paketin özelliklerini parse et
      const parsedPaketler = response.data.data.map((paket) => ({
        ...paket,
        ozellikler: parseOzellikler(paket.ozellikler),
      }));
      setPaketler(parsedPaketler);
      setLoading(false);
    } catch (error) {
      toast.error("Paketler yüklenirken bir hata oluştu");
      setLoading(false);
    }
  };

  const fetchSavedCards = async () => {
    try {
      const response = await savedCardService.getSavedCards();
      setSavedCards(response.data.data || []);
    } catch (error) {
      console.error("Kayıtlı kartlar yüklenirken hata:", error);
    }
  };

  const fetchAktifPaket = async () => {
    try {
      const response = await paketService.getFirmaPaketGecmisi();
      const now = new Date();

      // Ödenmiş ve şu an aktif olan paketi bul
      const aktifPaket = response.data.data.find(
        (paket) =>
          paket.odeme_durumu === "odendi" &&
          new Date(paket.baslangic_tarihi) <= now &&
          new Date(paket.bitis_tarihi) >= now
      );

      if (aktifPaket) {
        setAktifPaket(aktifPaket);
        setFormData({
          aktifpaket: aktifPaket.paket_adi,
          paketbaslangic: new Date(
            aktifPaket.baslangic_tarihi
          ).toLocaleDateString("tr-TR"),
          paketbitis: new Date(aktifPaket.bitis_tarihi).toLocaleDateString(
            "tr-TR"
          ),
          otomatikpaketyenileme: aktifPaket.otomatik_yenileme
            ? "acik"
            : "kapali",
          kayitliKrediKarti: aktifPaket.kayitli_kart_id || "",
        });
      } else {
        // Aktif paket yoksa formu sıfırla
        setFormData({
          aktifpaket: "Aktif paket bulunmuyor",
          paketbaslangic: "-",
          paketbitis: "-",
          otomatikpaketyenileme: "kapali",
          kayitliKrediKarti: "",
        });
      }
    } catch (error) {
      toast.error("Aktif paket bilgileri yüklenirken bir hata oluştu");
    }
  };

  const handleSatinAl = async (paketId) => {
    try {
      const response = await paketService.satinAl({ paketId });
      if (response.data.success && response.data.data.paytrData) {
        const paytrData = response.data.data.paytrData;

        // PayTR iframe container'ı göster
        const container = document.getElementById("paytr-iframe-container");
        container.classList.remove("hidden");

        // PayTR iframe'ini oluştur
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.paytr.com/odeme/guvenli/${paytrData.token}`;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.allow = "camera";
        iframe.allowFullscreen = true;

        // Container'ı temizle ve iframe'i ekle
        const iframeContainer = container.querySelector(".bg-white");
        iframeContainer.innerHTML = ""; // Önce içeriği temizle
        iframeContainer.appendChild(iframe);

        // PayTR iframe yüklendiğinde
        iframe.onload = () => {
          // PayTR iframe'i hazır olduğunda
          iframe.contentWindow.postMessage(
            JSON.stringify(paytrData),
            "https://www.paytr.com"
          );
        };

        // PayTR'den gelen mesajları dinle
        window.addEventListener("message", (event) => {
          if (event.origin === "https://www.paytr.com") {
            if (event.data === "PAYTR_IFRAME_READY") {
              // iframe hazır, verileri gönder
              iframe.contentWindow.postMessage(
                JSON.stringify(paytrData),
                "https://www.paytr.com"
              );
            }
          }
        });
      }
    } catch (error) {
      console.error("PayTR Error:", error);
      toast.error(
        "Ödeme işlemi başlatılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    }
  };

  const handleOtomatikYenilemeChange = async (e) => {
    const { value } = e.target;
    try {
      if (!aktifPaket) {
        toast.error("Aktif paket bulunamadı");
        return;
      }

      const response = await paketService.updateOtomatikYenileme({
        paket_id: aktifPaket.id,
        otomatik_yenileme: value === "acik",
      });

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          otomatikpaketyenileme: value,
        }));
        toast.success("Otomatik yenileme ayarı güncellendi");
      }
    } catch (error) {
      console.error("Otomatik yenileme hatası:", error);
      toast.error("Otomatik yenileme ayarı güncellenirken bir hata oluştu");
    }
  };

  const handleKartSecimi = async (e) => {
    const { value } = e.target;
    try {
      if (!aktifPaket) {
        toast.error("Aktif paket bulunamadı");
        return;
      }

      const response = await paketService.updateKayitliKart({
        paket_id: aktifPaket.id,
        kart_id: value || null,
      });

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          kayitliKrediKarti: value,
        }));
        toast.success("Kayıtlı kart güncellendi");
      }
    } catch (error) {
      console.error("Kart seçimi hatası:", error);
      toast.error("Kayıtlı kart güncellenirken bir hata oluştu");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const slideVariants = {
    yillik: { x: "100%" },
    aylik: { x: "0%" },
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

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const socialVariants = {
    hover: { scale: 1.2, rotate: 5 },
    tap: { scale: 0.95 },
  };

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.02 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#047857]"></div>
      </div>
    );
  }

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

        <div className="container mx-auto px-4 lg:px-2 z-10">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="marcellus pt-5 text-white"
          >
            Paketlerim
          </motion.p>

          <div className="flex mt-5 flex-col border py-6 px-3 bg-white border-[#A2ACC7] rounded-xl">
            <motion.div
              className="container mx-auto bg-[#F6F6F7] py-8 md:py-16 px-2 lg:px-0 flex items-center justify-center rounded-xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="max-w-5xl w-full flex flex-col items-center justify-center">
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col md:flex-row items-center gap-4"
                >
                  <img
                    src="/images/paketicon-mavi.svg"
                    className="w-16 md:w-auto"
                  />
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="mt-5 text-center text-[#1D547D] marcellus text-base md:text-2xl px-4 md:px-0"
                >
                  Paketlerim
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Bu alanda, satın aldığınız veya aktif olarak kullandığınız
                  paketleri görüntüleyebilirsiniz. Paket detaylarını inceleyerek
                  kullanım sürenizi takip edebilir ve ihtiyaçlarınıza göre yeni
                  paketler ekleyebilirsiniz.{" "}
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Hizmetlerinizi en verimli şekilde yönetmek için paketlerinizi
                  güncel tutmayı unutmayın!{" "}
                </motion.p>
              </div>
            </motion.div>

            <form className="container max-w-4xl mx-auto">
              <FormInput
                label="Aktif Paketiniz"
                name="aktifpaket"
                labelWidth="w-1/2"
                value={formData.aktifpaket || "Aktif paket bulunmuyor"}
                placeholder="Aktif Paketiniz"
                onChange={handleInputChange}
                className="mt-5 w-full"
                disabled
              />
              <FormInput
                label="Paket Başlangıç Tarihiniz"
                name="paketbaslangic"
                labelWidth="w-1/2"
                value={formData.paketbaslangic || "-"}
                placeholder="Paket Başlangıç Tarihiniz"
                onChange={handleInputChange}
                className="mt-5 w-full"
                disabled
              />
              <FormInput
                label="Paket Bitiş Tarihiniz"
                name="paketbitis"
                labelWidth="w-1/2"
                value={formData.paketbitis || "-"}
                placeholder="Paket Bitiş Tarihiniz"
                onChange={handleInputChange}
                className="mt-5 w-full"
                disabled
              />
              <FormSelect
                label="Otomatik Paket Yenileme"
                name="otomatikpaketyenileme"
                labelWidth="w-1/2"
                value={formData.otomatikpaketyenileme || "kapali"}
                onChange={handleOtomatikYenilemeChange}
                options={[
                  { value: "acik", label: "Açık" },
                  { value: "kapali", label: "Kapalı" },
                ]}
                className="mt-5 w-full"
                disabled={!aktifPaket}
              />
              <FormSelect
                label="Kayıtlı Kredi Kartı"
                name="kayitliKrediKarti"
                labelWidth="w-1/2"
                value={formData.kayitliKrediKarti || ""}
                onChange={handleKartSecimi}
                options={[
                  { value: "", label: "Kayıtlı kart bulunmuyor" },
                  ...savedCards.map((card) => ({
                    value: card.id.toString(),
                    label: `${
                      card.card_type
                    } - **** **** **** ${card.card_number.slice(-4)}`,
                  })),
                ]}
                className="mt-5 w-full"
                disabled={!aktifPaket || savedCards.length === 0}
              />
            </form>

            <div className="container lg:px-10 mx-auto">
              <motion.div
                variants={itemVariants}
                className="flex flex-col w-full mx-auto lg:flex-row items-center p-5 lg:p-10 justify-between mt-5 lg:mt-10 bg-gradient-to-b lg:bg-gradient-to-r to-[#EFFEF9] from-[#047857] from-40% rounded-lg"
              >
                <div className="w-full lg:w-2/3">
                  <div className="max-w-6xl">
                    <motion.p
                      variants={itemVariants}
                      className="marcellus text-2xl lg:text-4xl text-[#DFFF00] text-center lg:text-left"
                    >
                      Rakiplerinin Önüne Geçmek İçin Bu Fırsatı Kaçırma!
                    </motion.p>
                    <motion.p
                      variants={itemVariants}
                      className="marcellus text-base lg:text-xl text-white mt-5 text-center lg:text-left"
                    >
                      İşinizi bir adım öne çıkarmak için özel olarak tasarlanmış
                      paketlerimizle tanışın! <br className="hidden lg:block" />
                      İhtiyacınıza en uygun paketi seçerek rekabette fark
                      yaratın, firmanızı daha görünür hale getirin.
                      <br className="hidden lg:block" />
                      Avantajlı fırsatları kaçırmayın, hemen paketlerimizi
                      inceleyin ve size en uygun çözümü keşfedin!
                    </motion.p>
                  </div>
                </div>
                <motion.img
                  variants={itemVariants}
                  src="/images/icons/paket-hero.svg"
                  className="w-full lg:w-auto mt-5 lg:mt-0 max-w-[300px] lg:max-w-none"
                  alt="Paket Hero"
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mt-10">
              <div className="relative flex items-center justify-center w-full md:max-w-xs mx-auto rounded-[10px] p-1 border border-[#A2ACC7] bg-white overflow-hidden">
                <motion.div
                  animate={tur}
                  variants={slideVariants}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute left-0 top-0 w-1/2 h-full bg-[#047857] rounded-lg"
                />

                <motion.button
                  variants={buttonVariants}
                  whileTap="tap"
                  whileHover="hover"
                  onClick={() => setTur("aylik")}
                  className={`relative z-10 p-3 lg:p-4 rounded-lg marcellus text-sm lg:text-base w-full transition-colors duration-200 ${
                    tur === "aylik" ? "text-white" : "text-[#232323]"
                  }`}
                >
                  Aylık Paketler
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileTap="tap"
                  whileHover="hover"
                  onClick={() => setTur("yillik")}
                  className={`relative z-10 p-3 lg:p-4 rounded-lg marcellus text-sm lg:text-base w-full transition-colors duration-200 ${
                    tur === "yillik" ? "text-white" : "text-[#232323]"
                  }`}
                >
                  Yıllık Paketler
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              className="max-w-7xl mt-5 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={containerVariants}
            >
              {paketler.map((paket, index) => (
                <motion.div
                  key={paket.id}
                  variants={cardVariants}
                  custom={index}
                  whileHover="hover"
                  className={`montserrat py-8 md:py-[60px] w-full px-6 md:px-[30px] border border-[#A2ACC7] rounded-lg ${
                    paket.id === 2 ? "bg-[#047857]" : "bg-white"
                  } relative overflow-hidden`}
                >
                  <motion.p
                    variants={featureVariants}
                    className={`font-semibold text-xl md:text-2xl ${
                      paket.id === 2 ? "text-white" : "text-[#232323]"
                    }`}
                  >
                    {paket.ad}
                  </motion.p>

                  <motion.p
                    variants={featureVariants}
                    className={`tracking-tight mt-2 font-light ${
                      paket.id === 2 ? "text-white" : "text-[#232323]"
                    } text-sm md:text-base`}
                  >
                    {paket.aciklama}
                  </motion.p>

                  <motion.div
                    variants={featureVariants}
                    className="flex items-center gap-2 mt-5"
                  >
                    <p
                      className={`font-semibold text-3xl md:text-5xl ${
                        paket.id === 2 ? "text-white" : "text-[#232323]"
                      }`}
                    >
                      <span className="font-light">₺</span>{" "}
                      {tur === "yillik"
                        ? (parseFloat(paket.fiyat) * 12).toFixed(2)
                        : paket.fiyat}
                    </p>
                    <p
                      className={`montserrat font-light ${
                        paket.id === 2 ? "text-white" : "text-[#232323]"
                      }`}
                    >
                      /{" "}
                      {tur === "yillik" ? "Yıllık" : `${paket.sure_gun} Günlük`}
                    </p>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSatinAl(paket.id)}
                    className={`w-full my-5 ${
                      paket.id === 2
                        ? "bg-white text-[#047857]"
                        : "bg-[#047857] text-white"
                    } rounded-lg py-2 md:py-3 text-lg md:text-xl font-semibold relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.4 }}
                      style={{ opacity: 0.2 }}
                    />
                    Satın Al
                  </motion.button>

                  <div className="flex flex-col gap-4">
                    {paket.ozellikler.map((ozellik, idx) => (
                      <motion.div
                        key={idx}
                        variants={featureVariants}
                        className="flex items-start gap-2"
                      >
                        <img
                          src={`/images/icons/check-${
                            paket.id === 2 ? "white" : "green"
                          }.svg`}
                          className="w-5 md:w-auto mt-1"
                        />
                        <div
                          className={
                            paket.id === 2 ? "text-white" : "text-[#232323]"
                          }
                        >
                          <p className="font-semibold text-sm md:text-base">
                            {ozellik.baslik}
                          </p>
                          <p className="font-light text-xs md:text-sm">
                            {ozellik.aciklama}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div
        id="paytr-iframe-container"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm hidden z-50"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-11/12 h-5/6 relative">
            <button
              onClick={() => {
                const container = document.getElementById(
                  "paytr-iframe-container"
                );
                container.classList.add("hidden");
                container.querySelector(".bg-white").innerHTML = "";
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
            >
              ✕
            </button>
            <div className="w-full h-full">{/* iframe buraya eklenecek */}</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Paketlerim;
