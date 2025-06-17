import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FirmaCard from "./FirmaCard";
import PopulerFirmalar from "./Hero";
import { firmaService } from "../../../services/api";

const FirmaList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [firmalar, setFirmalar] = useState([]);
  const itemsPerPage = 15;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const pageVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const [pageDirection, setPageDirection] = useState(0);
  const indexOfLastFirma = currentPage * itemsPerPage;
  const indexOfFirstFirma = indexOfLastFirma - itemsPerPage;
  const currentFirmalar = firmalar.slice(indexOfFirstFirma, indexOfLastFirma);
  const totalPages = Math.ceil(firmalar.length / itemsPerPage);

  useEffect(() => {
    fetchVitrinFirmalar();
  }, []);

  const fetchVitrinFirmalar = async () => {
    try {
      const response = await firmaService.getVitrinFirmalar();
      if (response.data.success) {
        setFirmalar(response.data.data);
      }
    } catch (error) {
      console.error("Vitrin firmaları yüklenirken hata:", error);
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPageDirection(1);
        setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalPages]);

  const handlePageChange = (pageNumber) => {
    setPageDirection(pageNumber > currentPage ? 1 : -1);
    setCurrentPage(pageNumber);
    setIsPlaying(false);
  };

  const handleNext = () => {
    setPageDirection(1);
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setPageDirection(-1);
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <PopulerFirmalar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onNext={handleNext}
        onPrev={handlePrev}
        onPlay={togglePlay}
        isPlaying={isPlaying}
      />
      <AnimatePresence initial={false} custom={pageDirection} mode="wait">
        <motion.div
          key={currentPage}
          custom={pageDirection}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
        >
          {currentFirmalar.map((firma) => (
            <FirmaCard key={firma.id} firma={firma} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FirmaList;
