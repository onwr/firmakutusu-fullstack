import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import illerData from "../../utils/il.json";
import ilcelerData from "../../utils/ilceler.json";
import { useNavigate } from "react-router-dom";

const FirmaFiltre = () => {
  const navigate = useNavigate();
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [isIlDropdownOpen, setIsIlDropdownOpen] = useState(false);
  const [isIlceDropdownOpen, setIsIlceDropdownOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState("Seçiniz");
  const [selectedIl, setSelectedIl] = useState("Seçiniz");
  const [selectedIlce, setSelectedIlce] = useState("Seçiniz");
  const [keyword, setKeyword] = useState("");
  const [availableIlceler, setAvailableIlceler] = useState([]);

  const sectors = [
    "İnşaat",
    "Otomotiv",
    "Sağlık",
    "Eğitim",
    "Teknoloji",
    "Gıda",
    "Tekstil",
  ];

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

  const handleIlSelect = (il) => {
    setSelectedIl(il);
    setSelectedIlce("Seçiniz");
    setAvailableIlceler(ilcelerData[il] || []);
    setIsIlDropdownOpen(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedSector !== "Seçiniz") params.append("sektor", selectedSector);
    if (selectedIl !== "Seçiniz") params.append("il", selectedIl);
    if (selectedIlce !== "Seçiniz") params.append("ilce", selectedIlce);
    if (keyword.trim()) params.append("keyword", keyword.trim());

    navigate(`/hesap/firma-ara?${params.toString()}`);
  };

  return (
    <div className="border border-[#A2ACC7] rounded-[10px] p-4 md:p-6">
      <div className="flex montserrat items-center gap-2">
        <img
          src="/images/icons/filtre.svg"
          alt="Filtre"
          className="w-5 md:w-auto"
        />
        <p className="font-semibold text-sm md:text-base">
          Aramanızı özelleştirin.
        </p>
      </div>

      <div className="mt-4 md:mt-5 flex montserrat flex-col gap-2">
        <div className="relative">
          <motion.div
            className="py-2 px-3 md:px-5 rounded-lg border border-[#A2ACC7] flex items-center justify-between cursor-pointer"
            onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
          >
            <div className="flex flex-col">
              <p className="text-xs md:text-sm text-[#232323]">Sektör</p>
              <p className="text-[#232323] font-medium text-sm md:text-base">
                {selectedSector}
              </p>
            </div>
            <motion.img
              src="/images/icons/down.svg"
              animate={{ rotate: isSectorDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              alt=""
            />
          </motion.div>
          <AnimatePresence>
            {isSectorDropdownOpen && (
              <motion.div
                className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-50 py-2 max-h-60 overflow-y-auto border border-[#A2ACC7]"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.button
                  className="w-full px-5 py-3 text-left hover:bg-gray-100 text-[#232323]"
                  onClick={() => {
                    setSelectedSector("Seçiniz");
                    setIsSectorDropdownOpen(false);
                  }}
                >
                  Hepsi
                </motion.button>
                {sectors.map((sector, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    onClick={() => {
                      setSelectedSector(sector);
                      setIsSectorDropdownOpen(false);
                    }}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100 text-[#232323]"
                  >
                    {sector}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <motion.div
            className="py-2 px-3 md:px-5 rounded-lg border border-[#A2ACC7] flex items-center justify-between cursor-pointer"
            onClick={() => setIsIlDropdownOpen(!isIlDropdownOpen)}
          >
            <div className="flex flex-col">
              <p className="text-xs md:text-sm text-[#232323]">İl</p>
              <p className="text-[#232323] font-medium text-sm md:text-base">
                {selectedIl}
              </p>
            </div>
            <motion.img
              src="/images/icons/down.svg"
              animate={{ rotate: isIlDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              alt=""
            />
          </motion.div>
          <AnimatePresence>
            {isIlDropdownOpen && (
              <motion.div
                className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-50 py-2 max-h-60 overflow-y-auto border border-[#A2ACC7]"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.button
                  className="w-full px-5 py-3 text-left hover:bg-gray-100 text-[#232323]"
                  onClick={() => {
                    setSelectedIl("Seçiniz");
                    setIsIlDropdownOpen(false);
                  }}
                >
                  Hepsi
                </motion.button>
                {illerData.iller.map((il, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    onClick={() => handleIlSelect(il)}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100 text-[#232323]"
                  >
                    {il}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <motion.div
            className="py-2 px-3 md:px-5 rounded-lg border border-[#A2ACC7] flex items-center justify-between cursor-pointer"
            onClick={() => setIsIlceDropdownOpen(!isIlceDropdownOpen)}
          >
            <div className="flex flex-col">
              <p className="text-xs md:text-sm text-[#232323]">İlçe</p>
              <p className="text-[#232323] font-medium text-sm md:text-base">
                {selectedIlce}
              </p>
            </div>
            <motion.img
              src="/images/icons/down.svg"
              animate={{ rotate: isIlceDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              alt=""
            />
          </motion.div>
          <AnimatePresence>
            {isIlceDropdownOpen && (
              <motion.div
                className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-50 py-2 max-h-60 overflow-y-auto border border-[#A2ACC7]"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.button
                  className="w-full px-5 py-3 text-left hover:bg-gray-100 text-[#232323]"
                  onClick={() => {
                    setSelectedIlce("Seçiniz");
                    setIsIlceDropdownOpen(false);
                  }}
                >
                  Hepsi
                </motion.button>
                {availableIlceler.map((ilce, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    onClick={() => {
                      setSelectedIlce(ilce);
                      setIsIlceDropdownOpen(false);
                    }}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100 text-[#232323]"
                  >
                    {ilce}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="py-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col">
          <label
            htmlFor="anahtarKelime"
            className="text-xs md:text-sm text-[#232323]"
          >
            Anahtar Kelime
          </label>
          <input
            type="text"
            id="anahtarKelime"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Firma Unvanı, Vergi No, NACE Kodu"
            className="text-xs text-[#232323] outline-none mt-1"
          />
        </div>
      </div>
      <button
        onClick={handleSearch}
        className="rounded-[10px] w-full mt-4 md:mt-5 text-white montserrat font-medium text-sm md:text-base py-2 px-5 duration-300 cursor-pointer hover:bg-[#232323] bg-[#1C5540] border border-[#A2ACC7] flex items-center gap-1 justify-center"
      >
        Firma Bul{" "}
        <img src="/images/icons/find.svg" alt="" className="w-4 md:w-auto" />
      </button>
    </div>
  );
};

export default FirmaFiltre;
