import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BilgiSidebar from "./BilgiSidebar";
import BilgiRight from "./BilgiRight";
import { BsArrowDownCircle } from "react-icons/bs";

const FirmaContent = ({ id }) => {
  const [tab, setTab] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabSelect = (number) => {
    setTab(number);
    setIsMobileMenuOpen(false);
  };

  const menuVariants = {
    initial: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    animate: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 mt-5">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden flex montserrat font-medium items-center justify-between gap-2 bg-[#078c5b] text-white px-4 py-2 rounded-lg"
      >
        <span>{isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}</span>
        <motion.div
          animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <BsArrowDownCircle className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence mode="wait">
        {(isMobileMenuOpen || window.innerWidth >= 1024) && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full lg:w-1/2 xl:w-1/4 overflow-hidden"
          >
            <BilgiSidebar tab={tab} setTab={handleTabSelect} id={id} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full">
        <BilgiRight tab={tab} setTab={handleTabSelect} id={id} />
      </div>
    </div>
  );
};

export default FirmaContent;
