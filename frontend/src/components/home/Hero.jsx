import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import illerData from "../../utils/il.json";
import ilcelerData from "../../utils/ilceler.json";
import { firmaService } from "../../services/api";
import { toast } from "sonner";

const Hero = () => {
  const navigate = useNavigate();
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [isIlDropdownOpen, setIsIlDropdownOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState("Seçiniz");
  const [selectedIl, setSelectedIl] = useState("Seçiniz");
  const [selectedIlce, setSelectedIlce] = useState("Seçiniz");
  const [isIlceDropdownOpen, setIsIlceDropdownOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableIlceler, setAvailableIlceler] = useState(
    ilcelerData[selectedIl] || []
  );

  const sectors = [
    "Seçiniz",
    "İnşaat",
    "Otomotiv",
    "Sağlık",
    "Eğitim",
    "Teknoloji",
    "Gıda",
    "Tekstil",
  ];

  const handleIlSelect = (il) => {
    setSelectedIl(il);
    setSelectedIlce("Seçiniz");
    setAvailableIlceler(ilcelerData[il] || []);
    setIsIlDropdownOpen(false);
  };

  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
    exit: {
      opacity: 0,
      y: -10,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const params = {
        sektor: selectedSector !== "Seçiniz" ? selectedSector : undefined,
        il: selectedIl !== "Seçiniz" ? selectedIl : undefined,
        ilce: selectedIlce !== "Seçiniz" ? selectedIlce : undefined,
        keyword: keyword.trim() || undefined,
      };

      // Arama parametrelerini URL'e ekle
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });

      // Firma arama sayfasına yönlendir
      navigate(`/hesap/firma-ara?${searchParams.toString()}`);
    } catch (error) {
      console.error("Arama hatası:", error);
      toast.error("Arama sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container marcellus mx-auto relative">
      <img
        src="/images/hero.svg"
        className="w-full h-auto hidden md:block object-cover"
      />
      <div className="md:inset-0 top-0 flex bg-[#005c45] md:bg-transparent items-center justify-center md:absolute px-4 py-8 md:p-0">
        <motion.div
          className="px-5 2xl:px-0 max-w-7xl w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.p
            className="text-2xl lg:text-4xl text-white text-center md:text-left"
            variants={itemVariants}
          >
            Türkiye'nin Firma Rehberi
          </motion.p>
          <motion.p
            className="text-2xl lg:text-4xl text-white text-center md:text-left"
            variants={itemVariants}
          >
            Firma Kutusu ile aradığınız firmaya hızlı ve kolay ulaşın.
          </motion.p>
          <motion.p
            className="mt-4 lg:mt-8 text-sm text-white text-center md:text-left"
            variants={itemVariants}
          >
            Sektör veya konum bilgisi girerek ya da firma unvanı, vergi numarası
            veya NACE kodu ile detaylı arama yapabilirsiniz.
          </motion.p>
          <motion.div
            className="flex montserrat flex-col md:flex-row gap-2 max-w-6xl mt-4"
            variants={itemVariants}
          >
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col md:flex-row items-center gap-2 md:gap-1">
                <div className="relative w-full">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setIsSectorDropdownOpen(!isSectorDropdownOpen)
                    }
                    className="px-5 bg-white w-full rounded-lg md:rounded-l-lg md:rounded-r-none h-[60px] flex items-center justify-between"
                  >
                    <div className="flex flex-col items-start">
                      <p className="text-sm text-[#1C5540]">Sektör</p>
                      <p className="font-medium text-[#1C5540]">
                        {selectedSector}
                      </p>
                    </div>
                    <motion.img
                      animate={{ rotate: isSectorDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      src="/images/icons/down.svg"
                      alt=""
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isSectorDropdownOpen && (
                      <motion.div
                        className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-50 py-2 max-h-60 overflow-y-auto"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                      >
                        {sectors.map((sector, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            onClick={() => {
                              setSelectedSector(sector);
                              setIsSectorDropdownOpen(false);
                            }}
                            className="w-full px-5 py-3 text-left hover:bg-gray-100 text-[#1C5540]"
                          >
                            {sector}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative w-full">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsIlDropdownOpen(!isIlDropdownOpen)}
                    className="px-5 bg-white w-full rounded-lg md:rounded-none h-[60px] flex items-center justify-between"
                  >
                    <div className="flex flex-col items-start">
                      <p className="text-sm text-[#1C5540]">İl</p>
                      <p className="font-medium text-[#1C5540]">{selectedIl}</p>
                    </div>
                    <motion.img
                      animate={{ rotate: isIlDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      src="/images/icons/down.svg"
                      alt=""
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isIlDropdownOpen && (
                      <motion.div
                        className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-50 py-2 max-h-60 overflow-y-auto"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                      >
                        {illerData.iller.map((il, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            onClick={() => handleIlSelect(il)}
                            className="w-full px-5 py-3 text-left hover:bg-gray-100 text-[#1C5540]"
                          >
                            {il}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative w-full">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsIlceDropdownOpen(!isIlceDropdownOpen)}
                    className="px-5 bg-white w-full rounded-lg md:rounded-r-lg md:rounded-l-none h-[60px] flex items-center justify-between"
                  >
                    <div className="flex flex-col items-start">
                      <p className="text-sm text-[#1C5540]">İlçe</p>
                      <p className="font-medium text-[#1C5540]">
                        {selectedIlce}
                      </p>
                    </div>
                    <motion.img
                      animate={{ rotate: isIlceDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      src="/images/icons/down.svg"
                      alt=""
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isIlceDropdownOpen && (
                      <motion.div
                        className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-50 py-2 max-h-60 overflow-y-auto"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                      >
                        {availableIlceler.map((ilce, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            onClick={() => {
                              setSelectedIlce(ilce);
                              setIsIlceDropdownOpen(false);
                            }}
                            className="w-full px-5 py-3 text-left hover:bg-gray-100 text-[#1C5540]"
                          >
                            {ilce}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative w-full">
                <motion.div
                  whileTap={{ scale: 0.99 }}
                  className="px-5 bg-white w-full h-[60px] flex flex-col justify-center items-start rounded-lg"
                >
                  <p className="text-sm text-[#1C5540]">Anahtar Kelime</p>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full font-medium text-[#1C5540] placeholder-[#1C5540] outline-none"
                    placeholder="Firma Unvanı veya Firma Vergi No veya NACE Kodu"
                  />
                </motion.div>
              </div>
            </div>
            <motion.button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full md:w-1/6 h-16 md:h-auto flex font-extrabold cursor-pointer hover:bg-[#008060]/80 flex-row md:flex-col gap-2 text-white items-center justify-center rounded-xl bg-[#008060] mt-2 md:mt-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <img src="/images/icons/search.svg" className="w-8 md:w-10" />
              <span className="md:text-center">
                {isLoading ? (
                  "Aranıyor..."
                ) : (
                  <>
                    Sonuçları <span className="md:block">Göster</span>
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
        <img
          src="/images/arrow-down-fill.svg"
          className="bottom-0 hidden lg:block translate-y-12 translate-x-1/2 absolute right-1/2"
        />
      </div>
    </div>
  );
};

export default Hero;
