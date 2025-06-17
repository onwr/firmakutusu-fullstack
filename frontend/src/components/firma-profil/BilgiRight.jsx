import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import FirmaBilgileri from "./tabs/FirmaBilgileri";
import Hakkimizda from "./tabs/Hakkimizda";
import UrunHizmet from "./tabs/UrunHizmet";
import Subelerimiz from "./tabs/Subelerimiz";
import KaliteBelge from "./tabs/KaliteBelge";
import Referanslar from "./tabs/Referanslar";
import Kampanyalarimiz from "./tabs/Kampanyalarimiz";
import CV from "./tabs/CV";
import Galeri from "./tabs/Galeri";
import Video from "./tabs/Video";

const BilgiRight = ({ tab, id }) => {
  return (
    <div className="w-full p-4 lg:p-[42px] h-fit border border-[#A2ACC7] montserrat rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 0 && <FirmaBilgileri id={id} />}
          {tab === 1 && <Hakkimizda id={id} />}
          {tab === 2 && <UrunHizmet id={id} />}
          {tab === 3 && <Subelerimiz id={id} />}
          {tab === 4 && <KaliteBelge id={id} />}
          {tab === 5 && <Referanslar id={id} />}
          {tab === 6 && <Kampanyalarimiz id={id} />}
          {tab === 7 && <CV id={id} />}
          {tab === 8 && <Galeri />}
          {tab === 9 && <Video />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BilgiRight;
