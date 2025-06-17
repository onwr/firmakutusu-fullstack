import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import Hero from "../../components/profil/Hero";
import FirmaBilgiHero from "../../components/profil/FirmaBilgiHero";
import FirmaContent from "../../components/profil/FirmaContent";

const Profil = () => {
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
            className="marcellus pt-5 text-white "
          >
            Profilim \ Resmi Firma Bilgilerimiz \ Düzenle
          </motion.p>

          <div className="flex mt-5 flex-col border bg-white border-[#A2ACC7] rounded-xl">
            <Hero isLogin={true} />
            <FirmaBilgiHero isLogin={true} />
          </div>

          <div>
            <FirmaContent isLogin={true} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profil;
