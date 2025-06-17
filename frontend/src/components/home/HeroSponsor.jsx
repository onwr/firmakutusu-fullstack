import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroSponsor = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.5,
      },
    },
  };

  const logos = [
    "/images/icons/microsoft.png",
    "/images/icons/hubspot.svg",
    "/images/icons/invision.svg",
    "/images/icons/itsalive.svg",
    "/images/icons/segment.svg",
    "/images/icons/woocommerce.svg",
    "/images/icons/microsoft.png",
    "/images/icons/hubspot.svg",
    "/images/icons/invision.svg",
    "/images/icons/itsalive.svg",
    "/images/icons/segment.svg",
    "/images/icons/woocommerce.svg",
    "/images/icons/microsoft.png",
    "/images/icons/hubspot.svg",
    "/images/icons/invision.svg",
    "/images/icons/itsalive.svg",
    "/images/icons/segment.svg",
    "/images/icons/woocommerce.svg",
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <motion.div
      className="px-2 md:px-0"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto mt-4 md:mt-12 flex items-center">
        <motion.div
          variants={textVariants}
          className="w-80 allura h-14 flex items-center bg-[#A42E2D] rounded-l-lg text-white justify-center gap-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.img src="/images/icons/sponsor.svg" />
          <p className="text-xl lg:text-3xl">Sponsorlarımız</p>
        </motion.div>
        <motion.div variants={logoVariants} className="w-full overflow-hidden">
          <Slider {...settings}>
            {logos.map((logo, index) => (
              <motion.div
                key={index}
                className="px-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={logo}
                  alt={`Sponsor ${index + 1}`}
                  className="h-auto w-auto object-contain"
                />
              </motion.div>
            ))}
          </Slider>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSponsor;
