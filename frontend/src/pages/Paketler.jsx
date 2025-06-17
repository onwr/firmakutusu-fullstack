import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Paketler = () => {
  const [tur, setTur] = useState("yillik");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.02 },
  };

  const slideVariants = {
    yillik: { x: "100%" },
    aylik: { x: "0%" },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
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

  return (
    <div>
      <Header />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 lg:px-0"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row items-center p-5 lg:p-10 justify-between mt-5 lg:mt-10 bg-gradient-to-r to-[#EFFEF9] from-[#047857] from-40% rounded-lg"
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
                İhtiyacınıza en uygun paketi seçerek rekabette fark yaratın,
                firmanızı daha görünür hale getirin.
                <br className="hidden lg:block" />
                Avantajlı fırsatları kaçırmayın, hemen paketlerimizi inceleyin
                ve size en uygun çözümü keşfedin!
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
          <motion.div
            variants={cardVariants}
            custom={0}
            whileHover="hover"
            className="montserrat py-8 md:py-[60px] w-full px-6 md:px-[30px] border border-[#A2ACC7] rounded-lg bg-white relative overflow-hidden"
          >
            <motion.p
              variants={featureVariants}
              className="font-semibold text-xl md:text-2xl text-[#232323]"
            >
              Standart Paket
            </motion.p>

            <motion.p
              variants={featureVariants}
              className="tracking-tight mt-2 font-light text-[#232323] text-sm md:text-base"
            >
              İşletmenizi sektörünüzde ön plana çıkarın! Standart paket ile
              firmanız sektör aramalarında üst sıralarda listelenir ve vitrin
              alanında gösterilir. Ayrıca, öne çıkan iş ilanı paylaşarak daha
              fazla müşteriye ulaşabilirsiniz.
            </motion.p>

            <motion.div
              variants={featureVariants}
              className="flex items-center gap-2 mt-5"
            >
              <p className="font-semibold text-3xl md:text-5xl text-[#232323]">
                <span className="font-light">₺</span>{" "}
                {tur === "yillik" ? "-" : "1.500"}
              </p>
              <p className="montserrat font-light text-[#232323]">
                / {tur === "yillik" ? "Yıllık" : "1 Aylık"}
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full my-5 bg-[#047857] rounded-lg py-2 md:py-3 text-white text-lg md:text-xl font-semibold relative overflow-hidden"
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
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-green.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-[#232323]">
                  <p className="font-semibold text-sm md:text-base">
                    Firma Profili Öne Çıkar
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Firmanız, ilgili sektörde yapılan aramalarda üst sıralarda
                    listelenerek daha fazla görünürlük elde eder.
                  </p>
                </div>
              </motion.div>
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-green.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-[#232323]">
                  <p className="font-semibold text-sm md:text-base">
                    Vitrin Alanında 1 Hafta Gösterim
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Firmanız, ilgili sektörde yapılan aramalarda üst sıralarda
                    listelenerek daha fazla görünürlük elde eder.
                  </p>
                </div>
              </motion.div>
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-green.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-[#232323]">
                  <p className="font-semibold text-sm md:text-base">
                    Öne Çıkan İş İlanı Paylaşma (1 Adet)
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Firmanızın iş ilanı, "Öne Çıkanlar" bölümünde yer alarak
                    daha fazla başvuru almanızı sağlar.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            custom={1}
            whileHover="hover"
            className="montserrat py-8 md:py-[60px] w-full px-6 md:px-[30px] border border-[#A2ACC7] rounded-lg bg-[#047857] relative overflow-hidden"
          >
            <motion.div
              className="absolute -right-20 -top-20 w-40 h-40 bg-[#047857] opacity-10 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            <motion.p
              variants={featureVariants}
              className="font-semibold text-xl md:text-2xl text-white"
            >
              Profesyonel Paket
            </motion.p>

            <motion.p
              variants={featureVariants}
              className="tracking-tight mt-2 font-light text-white text-sm md:text-base"
            >
              Markanızı güçlendirin ve daha geniş kitlelere ulaşın! Profesyonel
              paket ile firmanız ana sayfa vitrininde yer alır, SEO uyumlu blog
              yazısı ile Google’da öne çıkar ve 3 iş ilanı/kampanya yayını ile
              etkileşiminizi artırırsınız.
            </motion.p>

            <motion.div
              variants={featureVariants}
              className="flex items-center gap-2 mt-5"
            >
              <p className="font-semibold text-3xl md:text-5xl text-white">
                <span className="font-light">₺</span>{" "}
                {tur === "yillik" ? "-" : "3.500"}
              </p>
              <p className="montserrat font-light text-white">
                / {tur === "yillik" ? "Yıllık" : "3 Aylık"}
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full my-5 bg-white rounded-lg py-2 md:py-3 text-[#047857] text-lg md:text-xl font-semibold relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-[#047857]"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.4 }}
                style={{ opacity: 0.2 }}
              />
              Satın Al
            </motion.button>

            <div className="flex flex-col gap-4">
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-white.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-white">
                  <p className="font-semibold text-sm md:text-base">
                    Standart Paket +
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Standart pakette sunulan tüm ayrıcalıklara ek olarak daha
                    uzun süreli ve etkili tanıtım fırsatları elde edin.
                  </p>
                </div>
              </motion.div>
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-white.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-white">
                  <p className="font-semibold text-sm md:text-base">
                    Ana Sayfa Alanında 1 Ay Gösterim
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Firmanız, ana sayfanın vitrin bölümünde 30 gün boyunca
                    sergilenerek marka bilinirliğinizi artırır.
                  </p>
                </div>
              </motion.div>
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-white.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-white">
                  <p className="font-semibold text-sm md:text-base">
                    3 İş İlanı veya Kampanya Yayını
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    İş ilanlarınızı veya kampanyalarınızı duyurarak daha fazla
                    müşteri ve çalışan adayıyla buluşun.
                  </p>
                </div>
              </motion.div>
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-white.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-white">
                  <p className="font-semibold text-sm md:text-base">
                    Blog'da Firma Tanıtımı (SEO'ya uyumlu)
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Firmanız hakkında profesyonel, SEO uyumlu bir blog yazısı
                    yayımlanarak Google aramalarında daha görünür hale
                    gelirsiniz.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            custom={2}
            whileHover="hover"
            className="montserrat py-8 md:py-[60px] w-full px-6 md:px-[30px] border border-[#A2ACC7] rounded-lg bg-white relative overflow-hidden"
          >
            <motion.p
              variants={featureVariants}
              className="font-semibold text-xl md:text-2xl text-[#232323]"
            >
              Kurumsal (VIP) Paket
            </motion.p>

            <motion.p
              variants={featureVariants}
              className="tracking-tight mt-2 font-light text-[#232323] text-sm md:text-base"
            >
              Markanızı zirveye taşıyın! Kurumsal paket ile ana sayfa banner
              reklamı, blog ve sosyal medya tanıtımlarıyla firmanızın
              görünürlüğünü artırın, sektör aramalarında birinci sırada yer
              alın.
            </motion.p>

            <motion.div
              variants={featureVariants}
              className="flex items-center gap-2 mt-5"
            >
              <p className="font-semibold text-3xl md:text-5xl text-[#232323]">
                <span className="font-light">₺</span>{" "}
                {tur === "yillik" ? "-" : "7.500"}
              </p>
              <p className="montserrat font-light text-[#232323]">
                / {tur === "yillik" ? "Yıllık" : "6 Aylık"}
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full my-5 bg-[#047857] rounded-lg py-2 md:py-3 text-white text-lg md:text-xl font-semibold relative overflow-hidden"
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
              {/* Feature items */}
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-green.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-[#232323]">
                  <p className="font-semibold text-sm md:text-base">
                    Profesyonel Paket +
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Profesyonel Pakete sunulan tüm ayrıcalıklara ek olarak daha
                    uzun süreli ve etkili tanıtım fırsatları elde edin.
                  </p>
                </div>
              </motion.div>
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-green.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-[#232323]">
                  <p className="font-semibold text-sm md:text-base">
                    Ana Sayfa Banner Reklamı (1 Ay)
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Firmanızın banner reklamı ana sayfada 1 ay boyunca görünür,
                    potansiyel müşterilere hızlıca ulaşabilirsiniz.
                  </p>
                </div>
              </motion.div>
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-green.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-[#232323]">
                  <p className="font-semibold text-sm md:text-base">
                    Blog & E-Posta Bülteni ile Reklam
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Firmanız hakkında SEO uyumlu blog yazıları yayımlar ve
                    e-posta bülteni ile geniş bir kitleye ulaşarak
                    görünürlüğünüzü artırırsınız.
                  </p>
                </div>
              </motion.div>
              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-green.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-[#232323]">
                  <p className="font-semibold text-sm md:text-base">
                    Sosyal Medyada Paylaşım
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Firmanız sosyal medya hesaplarında tanıtılarak markanızın
                    bilinirliği artırılır ve daha fazla etkileşim sağlanır.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={featureVariants}
                className="flex items-start gap-2"
              >
                <img
                  src="/images/icons/check-green.svg"
                  className="w-5 md:w-auto mt-1"
                />
                <div className="text-[#232323]">
                  <p className="font-semibold text-sm md:text-base">
                    Sektör Aramalarında 1. Sırada
                  </p>
                  <p className="font-light text-xs md:text-sm">
                    Sektör aramalarında 1. sırada yer alarak firmanızın daha
                    fazla görünmesini ve potansiyel müşteriler tarafından
                    kolayca bulunmasını sağlarsınız.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Paketler;
