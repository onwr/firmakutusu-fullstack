import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FavoriCard from "../../components/firma-profil/tabs/components/favoriler/FavoriCard";
import { motion } from "framer-motion";
import { favoriService } from "../../services/api";

const Favorilerim = () => {
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

  const [favoriler, setFavoriler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoriService.getFavoriler().then((res) => {
      setFavoriler(res.data.data);
      setLoading(false);
    });
  }, []);

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
            Favorilerim
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
                  <img src="/images/stars.svg" className="w-16 md:w-auto" />
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="mt-5 text-center text-[#1D547D] marcellus text-base md:text-2xl px-4 md:px-0"
                >
                  Favorilerim
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Bu sayfada, ilginizi çeken ve daha sonra hızlıca erişmek
                  istediğiniz firmaları listeleyebilirsiniz. Favorilerinize
                  eklediğiniz firmalar, detaylı inceleme yapabilmeniz ve kolay
                  erişim sağlayabilmeniz için burada görüntülenir.
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Favori listenizi dilediğiniz zaman güncelleyebilir, firmaları
                  ekleyip çıkarabilirsiniz.
                </motion.p>
              </div>
            </motion.div>

            <div className="my-10 max-w-xl w-full mx-auto border gap-5 border-[#A2ACC7] relative rounded-md px-2 py-3 flex items-center justify-between">
              <img
                src="/images/search-black.svg"
                className="absolute top-5 left-3"
              />
              <input
                className="text-[#45535E] placeholder-[#45535E] ml-8 outline-none text-sm w-full"
                placeholder="Favori listenizde hızlıca arama yapın"
              />
              <button className="w-1/5 bg-[#A2ACC7] rounded-md py-2 text-white">
                Ara
              </button>
            </div>

            <p className="bg-[#A2ACC7] rounded-t-xl  px-6 py-2 text-white marcellus text-xl">
              Favori Listem
            </p>

            <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {loading ? (
                <div>Yükleniyor...</div>
              ) : favoriler.length === 0 ? (
                <div className="text-center w-full col-span-full text-[#A2ACC7] font-semibold py-8">
                  Aktif favori bulunamadı.
                </div>
              ) : (
                favoriler.map((firma) => (
                  <FavoriCard
                    key={firma.favori_id}
                    firma={firma}
                    onFavoriKaldir={(firmaId) =>
                      setFavoriler((prev) =>
                        prev.filter((f) => f.firma_id !== firmaId)
                      )
                    }
                  />
                ))
              )}
            </div>

            <motion.div
              className="flex items-center justify-center gap-2 mt-8 md:mt-10 flex-wrap"
              variants={itemVariants}
            >
              {["prev", "1", "2", "3", "next"].map((item, index) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border montserrat text-base md:text-xl font-medium text-[#232323] border-[#A2ACC7] rounded-lg py-2 px-3 md:px-4 hover:bg-[#047857] hover:text-white transition-all duration-300"
                >
                  {item === "prev" ? (
                    <img
                      src="/images/icons/arrow-left.svg"
                      alt="Previous"
                      className="w-4 md:w-auto"
                    />
                  ) : item === "next" ? (
                    <img
                      src="/images/icons/arrow-right.svg"
                      alt="Next"
                      className="w-4 md:w-auto"
                    />
                  ) : (
                    item
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Favorilerim;
