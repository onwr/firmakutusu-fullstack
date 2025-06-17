import React from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const Hero = () => {
  const { id } = useParams();
  return (
    <div className="relative h-[200px]">
      <img
        src="/images/icons/firma-profil/firma-profilhero.svg"
        className="w-full h-full object-cover rounded-t-2xl"
      />
      <div className="absolute top-4 md:top-32 right-5">
        <div className="flex pl-5 flex-row gap-2">
          <>
            {["upline", "downline", "message", "star", "download", "share"].map(
              (icon, index) => (
                <motion.button
                  key={icon}
                  className="p-2 rounded-[4px] bg-[#078C5B] cursor-pointer hover:bg-[#077C5B] duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img
                    src={`/images/icons/firma-profil/${icon}.svg`}
                    className="size-5"
                  />
                </motion.button>
              )
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default Hero;
