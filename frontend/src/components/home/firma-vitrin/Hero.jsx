import React from "react";
import { motion } from "framer-motion";

const PopulerFirmalar = ({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrev,
  onPlay,
  isPlaying,
}) => {
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

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <div className="flex items-center justify-between">
        <motion.div variants={itemVariants} className="marcellus-sc w-fit">
          <p className="text-[#232323] text-2xl md:text-3xl">
            <motion.span
              initial={{ color: "#232323" }}
              animate={{ color: "#120A8F" }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[#120A8F]"
            >
              Popüler
            </motion.span>{" "}
            Firmalar
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="w-full h-0.5 mt-1 flex items-center justify-between gap-2"
          >
            <div className="w-40 md:w-44 h-full bg-[#2A323C]"></div>
            <div className="w-1/2 h-full bg-[#1252AE]/50"></div>
            <div className="w-1/3 h-full bg-[#1252AE]/25"></div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[#CED4DA] px-4 py-3 rounded-lg w-44 gap-2 flex items-center justify-center"
        >
          <div className="w-full flex items-center justify-center gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => onPageChange(index + 1)}
                className={`w-2 h-2 rounded-full ${
                  index + 1 === currentPage ? "bg-[#007356]" : "bg-white"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center w-[48px] gap-1">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPrev}
              className="outline-none cursor-pointer"
            >
              <img
                src="/images/icons/home/sol.png"
                className="h-3 w-auto"
                alt="Önceki"
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPlay}
              className="outline-none cursor-pointer"
            >
              <img
                src={`/images/icons/home/${
                  isPlaying ? "durdur" : "durdur"
                }.png`}
                className="h-3 w-auto"
                alt={isPlaying ? "Durdur" : "Oynat"}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={onNext}
              className="outline-none cursor-pointer"
            >
              <img
                src="/images/icons/home/sag.png"
                className="h-3 w-auto"
                alt="Sonraki"
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PopulerFirmalar;
