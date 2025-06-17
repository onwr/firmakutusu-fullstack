import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import FirmaFiltre from "../../components/firma-ara/FirmaFiltre";
import Firmalar from "../../components/firma-ara/Firmalar";

const FirmaAra = () => {
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
            Firma Ara
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
                  <img src="/images/firma-ara.svg" className="w-16 md:w-auto" />
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="mt-5 text-center text-[#1D547D] marcellus text-base md:text-2xl px-4 md:px-0"
                >
                  Firma Ara
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Bu sayfada, firmaları arayabilir ve detaylarını
                  görüntüleyebilirsiniz. İlgili sektör, konum ve NACE kodu gibi
                  filtreleri kullanarak aradığınız firmalara hızlıca
                  ulaşabilirsiniz.
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Favori firmalarınızı kaydedebilir, detaylarını daha sonra
                  incelemek için liste oluşturabilirsiniz.
                </motion.p>
              </div>
            </motion.div>

            <p className="bg-[#A2ACC7] mt-5 rounded-t-xl  px-6 py-2 text-white marcellus text-xl">
              Firma Ara
            </p>

            <div className="container gap-5 mx-auto mt-10 flex lg:flex-row px-2 md:px-0 flex-col">
              <div className="w-full lg:w-1/4">
                <FirmaFiltre />
              </div>
              <div className="w-full">
                <Firmalar />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FirmaAra;
