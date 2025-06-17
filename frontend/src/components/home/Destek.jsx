import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Destek = ({ home, sub }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Sponsorluk Başvurusu");
  const [phoneNumber, setPhoneNumber] = useState("");

  const basvuruTipleri = [
    "Sponsorluk Başvurusu",
    "Teknik Destek",
    "Reklam Başvurusu",
    "İş Birliği Talebi",
    "Diğer",
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

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, "");

    if (phoneNumber.length <= 10) {
      return phoneNumber.replace(
        /^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2}).*/,
        (_, p1, p2, p3, p4) => {
          if (p1) {
            p1 = `(${p1}`;
          }
          if (p2) {
            p2 = `) ${p2}`;
          }
          if (p3) {
            p3 = ` ${p3}`;
          }
          if (p4) {
            p4 = ` ${p4}`;
          }
          return [p1, p2, p3, p4].filter(Boolean).join("");
        }
      );
    }
    return phoneNumber.slice(0, 10);
  };

  const handlePhoneChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };

  return (
    <div className={`mt-6 md:mt-10 ${sub ? "px-0" : "px-2"} md:px-0 montserrat container mx-auto`}>
      {home && (
        <img
          src="/images/icons/destek.svg"
          className="w-full md:block hidden"
          alt="Destek Banner"
        />
      )}

      <div className="mt-8 p-4 sm:p-6 md:p-8 lg:p-14 bg-[#F1EEE6] rounded-xl flex flex-col lg:flex-row">
        <div className="w-full montserrat">
          <p className="text-[#1C5540] text-3xl sm:text-4xl md:text-5xl font-semibold">
            7/24 Destek Merkezi
          </p>
          <p className="text-[#1C5540] text-lg sm:text-xl font-semibold my-2">
            Size nasıl yardımcı olabiliriz?
          </p>
          <p className="text-[#1C5540] max-w-md">
            Sorularınızı yanıtlamak ve en iyi hizmeti sunmak için buradayız!
          </p>
          <p className="text-[#1C5540] my-2">
            Destek ekibimizle iletişime geçerek:
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex text-[#1C5540] items-center gap-1">
              <img src="/images/icons/check.svg" alt="Check icon" />
              <p>Merak ettiğiniz konular hakkında bilgi alabilir,</p>
            </div>
            <div className="flex text-[#1C5540] items-center gap-1">
              <img src="/images/icons/check.svg" alt="Check icon" />
              <p>Teknik destek talep edebilir,</p>
            </div>
            <div className="flex text-[#1C5540] items-center gap-1">
              <img src="/images/icons/check.svg" alt="Check icon" />
              <p>İş birliği ve reklam taleplerinizi iletebilirsiniz.</p>
            </div>
          </div>

          <p className="my-2 max-w-md text-[#1C5540] text-sm sm:text-base">
            Güzelyaka Mahhallesi 551. Sokak No: 17 Batu Life Sitesi Kat: 16
            Daire: 66 Yenimahalle / ANKARA
          </p>
          <p className="text-[#1C5540]">Tel: 0312 123 4567</p>

          <div className="mt-4 flex items-center gap-4">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <img src="/images/icons/mail.svg" alt="Email" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <img src="/images/icons/phone.svg" alt="Phone" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <img src="/images/icons/whatsapp.svg" alt="WhatsApp" />
            </a>
          </div>
        </div>

        <div className="w-full montserrat">
          <p className="text-xl font-semibold text-[#1C5540]">Destek Formu</p>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4">
            <div className="relative w-full sm:col-span-1">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 sm:px-5 bg-white w-full lg:shadow-xl rounded-lg h-[50px] sm:h-[60px] flex items-center justify-between"
              >
                <div className="flex flex-col items-start">
                  <p className="text-xs sm:text-sm text-[#1C5540]">
                    Başvuru Türü
                  </p>
                  <p className="font-medium text-sm sm:text-base text-[#1C5540] truncate max-w-[90%]">
                    {selectedType}
                  </p>
                </div>
                <motion.img
                  src="/images/icons/down.svg"
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  alt="Dropdown icon"
                  className="w-4 h-4 sm:w-auto sm:h-auto"
                />
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute w-full mt-1 bg-white rounded-lg lg:shadow-lg z-50 py-2 max-h-60 overflow-y-auto"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {basvuruTipleri.map((tip, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        onClick={() => {
                          setSelectedType(tip);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-5 py-2 sm:py-3 text-left hover:bg-gray-100 text-[#1C5540] text-sm sm:text-base"
                      >
                        {tip}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-4 sm:px-5 bg-white w-full rounded-lg lg:shadow-xl h-[50px] sm:h-[60px] flex flex-col justify-center gap-0 sm:col-span-1">
              <label
                htmlFor="adsoyad"
                className="text-[#1C5540] text-xs sm:text-sm"
              >
                Ad Soyad
              </label>
              <input
                type="text"
                id="adsoyad"
                placeholder="Ad Soyad Giriniz"
                className="outline-none font-medium text-sm sm:text-base text-[#1C5540] w-full"
              />
            </div>

            <div className="px-4 sm:px-5 bg-white w-full lg:shadow-xl rounded-lg h-[50px] sm:h-[60px] flex flex-col justify-center gap-0 sm:col-span-1">
              <label
                htmlFor="email"
                className="text-[#1C5540] text-xs sm:text-sm"
              >
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                placeholder="E-Mail Adresi Giriniz"
                className="outline-none font-medium text-sm sm:text-base text-[#1C5540] w-full"
              />
            </div>

            <div className="px-4 sm:px-5 bg-white w-full lg:shadow-xl rounded-lg h-[50px] sm:h-[60px] flex flex-col justify-center gap-0 sm:col-span-1">
              <label
                htmlFor="tel"
                className="text-[#1C5540] text-xs sm:text-sm"
              >
                Telefon Numaranız
              </label>
              <input
                type="tel"
                id="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="(5XX) XXX XX XX"
                maxLength={15}
                className="outline-none font-medium text-sm sm:text-base text-[#1C5540] w-full"
              />
            </div>

            <div className="col-span-1 sm:col-span-2 bg-white relative px-4 sm:px-5 py-2 rounded-lg">
              <label
                htmlFor="mesaj"
                className="text-[#1C5540] text-xs sm:text-sm"
              >
                Mesajınız
              </label>
              <textarea
                id="mesaj"
                placeholder="Mesajınızı Giriniz"
                className="outline-none font-medium min-h-24 sm:min-h-32 max-h-24 sm:max-h-32 overflow-auto resize-none text-sm sm:text-base text-[#1C5540] w-full"
              ></textarea>
              <button
                type="submit"
                className="flex items-center gap-1 absolute bottom-2 right-2 bg-[#1C5540] righteous text-xs sm:text-sm rounded-[10px] px-3 sm:px-6 py-1.5 sm:py-2 cursor-pointer duration-300 hover:bg-[#232323]/80 text-white justify-center"
              >
                <img
                  src="/images/icons/buttons/send.svg"
                  alt="Send"
                  className="w-3 h-3 sm:w-auto sm:h-auto"
                />
                Gönder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Destek;
