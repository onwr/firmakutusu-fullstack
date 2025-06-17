import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import SSS from "../components/home/SSS";
import Destek from "../components/home/Destek";
import Footer from "../components/Footer";

const Hakkimizda = () => {
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

  const advantageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div>
      <Header />

      <div className="px-2 md:px-0">
        <motion.div
          className="container mt-5 md:mt-10 mx-auto bg-[#CED4DA] rounded-lg py-3 px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="marcellus md:text-left text-center">Hakkımızda</h1>
        </motion.div>

        <motion.div
          className="container mx-auto mt-5 marcellus text-[#232323]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <p className="marcellus text-3xl md:text-4xl text-[#1C5540]">
              Hakkımızda
            </p>
            <p className="mt-3 text-lg md:text-xl">
              En iyi iş deneyimini yaşamanız için buradayız!
            </p>
          </motion.div>

          <motion.div className="space-y-4 mt-4" variants={itemVariants}>
            <p className="text-sm md:text-base">
              Günümüz iş dünyasında doğru firmalara ulaşmak, güvenilir iş
              ortakları bulmak ve işletmelerin dijitalde güçlü bir varlık
              göstermesi büyük bir önem taşıyor. Firma Kutusu olarak, işletmeler
              ile müşteriler arasında köprü kurarak, firmaların daha fazla
              kişiye ulaşmasını ve kullanıcıların ihtiyaç duydukları hizmetlere
              en hızlı şekilde erişmesini sağlıyoruz.
            </p>
            <p className="text-sm md:text-base">
              Firma Kutusu, her sektörden işletmenin yer aldığı geniş kapsamlı
              bir iş rehberi ve kurumsal dizin platformudur. Firmalar, vergi
              kimlik numarasıyla doğrulama yaparak güvenilir bir şekilde sisteme
              kaydolabilir ve hizmetlerini tanıtabilirler. Kullanıcılar ise
              sektör, lokasyon ve NACE kodu gibi gelişmiş filtreleme seçenekleri
              sayesinde aradıkları firmaları hızlı ve kolay bir şekilde
              bulabilirler.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <p className="text-xl md:text-2xl">Misyonumuz</p>
            <p className="mt-2 text-sm md:text-base">
              Firma Kutusu olarak misyonumuz, işletmelerin dijital dünyada daha
              görünür olmasını sağlarken, müşterilerin de en doğru firmalarla
              buluşmasına yardımcı olmaktır. Güvenilir bir iş rehberi sunarak,
              firmaların dijital kimliklerini güçlendirmelerini ve
              müşterileriyle doğrudan etkileşim kurmalarını destekliyoruz.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <p className="text-xl md:text-2xl">Vizyonumuz</p>
            <p className="mt-2 text-sm md:text-base">
              İş dünyasında şeffaflık, güvenilirlik ve erişilebilirliği
              artırarak, sektör fark etmeksizin tüm işletmeler için dijital bir
              ekosistem oluşturmayı hedefliyoruz. Firma Kutusu, hem küçük
              işletmelerin hem de büyük markaların dijitalde büyümesini sağlayan
              kapsamlı bir iş ağı oluşturmayı amaçlamaktadır.
            </p>
          </motion.div>

          <motion.div
            className="w-full flex flex-col md:flex-row mt-8 gap-6 md:gap-10"
            variants={itemVariants}
          >
            <div className="w-full lg:w-2/6">
              <motion.img
                src="/images/icons/hakkimizda-1.svg"
                className="w-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="w-full">
              <motion.p
                className="flex flex-col md:flex-row md:items-end text-2xl md:text-4xl gap-1 text-[#1C5540]"
                variants={itemVariants}
              >
                Firma Kutusu'nun Avantajları
                <span className="text-base md:text-lg">Nedir?</span>
              </motion.p>

              <motion.div
                className="mt-3 montserrat text-[#232323] flex flex-col gap-3 md:gap-4"
                variants={containerVariants}
              >
                {[
                  "Doğrulanmış İşletme Profilleri",
                  "Detaylı Firma Bilgileri",
                  "Gelişmiş Arama ve Filtreleme",
                  "Kullanıcı Değerlendirme Puanı ve Yorumlar",
                  "SEO Destekli Blog İçerikleri",
                  "Öne Çıkma ve Reklam Fırsatları",
                ].map((advantage, index) => (
                  <motion.div
                    key={index}
                    variants={advantageVariants}
                    className="flex items-start gap-2"
                  >
                    <span className="text-[#1C5540] font-bold">✔</span>
                    <p className="text-sm md:text-base">
                      {advantage === "Doğrulanmış İşletme Profilleri" &&
                        "Tüm firmalar, sisteme kayıt olmadan önce vergi kimlik numarası doğrulamasından geçerek güvenilirliklerini kanıtlar."}
                      {advantage === "Detaylı Firma Bilgileri" &&
                        "Her işletmenin sunduğu hizmetler, çalışma saatleri, iletişim bilgileri, adresleri ve diğer önemli detaylar tek bir sayfada görüntülenebilir."}
                      {advantage === "Gelişmiş Arama ve Filtreleme" &&
                        "Kullanıcılar, sektör, lokasyon ve NACE kodu gibi detaylı filtreleme seçenekleriyle aradıkları firmaya en hızlı şekilde ulaşabilirler."}
                      {advantage ===
                        "Kullanıcı Değerlendirme Puanı ve Yorumlar" &&
                        "Firma Kutusu, kullanıcıların deneyimlerini paylaşabilecekleri gerçek yorumlar ve değerlendirme puanı sistemi ile firmalar hakkında bilinçli karar vermelerine yardımcı olur."}
                      {advantage === "SEO Destekli Blog İçerikleri" &&
                        "İş dünyasına yönelik güncel haberler, sektörel analizler ve iş geliştirme ipuçları sunan blogumuz, firmaların sektörel trendleri takip etmelerine yardımcı olur."}
                      {advantage === "Öne Çıkma ve Reklam Fırsatları" &&
                        "Premium paketler sayesinde işletmeler, sektör bazlı aramalarda üst sıralarda listelenme, ana sayfada vitrin alanında yer alma ve özel sponsorluk imkanları ile daha fazla müşteriye ulaşma şansı elde eder."}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 md:mt-14 montserrat px-2 md:px-0 container mx-auto"
            variants={itemVariants}
          >
            <motion.p
              className="mt-2 md:mt-8 text-center md:text-left text-[#232323] text-lg md:text-xl"
              variants={itemVariants}
            >
              Platformumuzu nasıl kullanacağınızı öğrenmek ve tüm özellikleri
              keşfetmek için tanıtım videolarımızı izleyin.
            </motion.p>
            <motion.div
              className="grid mt-5 md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-5"
              variants={containerVariants}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="cursor-pointer"
              >
                <img
                  src="/images/icons/video.jpg"
                  className="rounded-t-2xl w-full"
                  alt="Video thumbnail"
                />
                <p className="flex items-center quicksand text-base md:text-xl font-semibold rounded-b-2xl justify-center text-white gap-2 p-4 bg-[#51596C]">
                  <motion.img
                    src="/images/icons/buttons/play.svg"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  />
                  Nasıl Üye Olurum Vidomuzu İzleyin
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          <SSS about={true} />
          <Destek />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Hakkimizda;
