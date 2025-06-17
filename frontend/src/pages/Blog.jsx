import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const Blog = () => {
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

  const socialVariants = {
    hover: { scale: 1.2, rotate: 5 },
    tap: { scale: 0.95 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
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
          <h1 className="marcellus md:text-left text-center">Blog</h1>
        </motion.div>

        <motion.div
          className="container mt-5 md:mt-10 mx-auto bg-[#F6F6F7] py-8 md:py-16 px-2 lg:px-0 flex items-center justify-center rounded-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-2xl w-full flex flex-col items-center justify-center">
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row items-center gap-4"
            >
              <img src="/images/icons/profil.svg" className="w-16 md:w-auto" />
              <div className="flex flex-col work-sans text-center md:text-left">
                <p className="text-lg md:text-xl text-[#181A2A] font-medium">
                  Jonathan Doe
                </p>
                <p className="text-sm text-[#696A75]">Collaborator & Editor</p>
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="my-5 text-center text-[#3B3C4A] work-sans text-base md:text-lg px-4 md:px-0"
            >
              Meet Jonathan Doe, a passionate writer and blogger with a love for
              technology and travel. Jonathan holds a degree in Computer Science
              and has spent years working in the tech industry, gaining a deep
              understanding of the impact technology has on our lives.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4"
            >
              {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                <motion.a
                  key={social}
                  href=""
                  variants={socialVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <img
                    src={`/images/icons/${social}.svg`}
                    className="w-6 md:w-auto"
                  />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="container montserrat mx-auto mt-8 md:mt-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl font-semibold text-black px-2 md:px-0"
          >
            Son Gönderi
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 px-2 md:px-0"
            variants={containerVariants}
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="border drop-shadow-xl hover:drop-shadow-2xl bg-white border-[#CED4DA] rounded-2xl py-4 md:py-6 px-4 md:px-5 transition-all duration-300"
            >
              <img
                src="/images/icons/blog-img.png"
                className="rounded-lg w-full h-48 md:h-56 object-cover"
              />
              <p className="mt-3 font-semibold text-base md:text-xl text-[#232323] line-clamp-2">
                There's going after top talent, and then there's going after top
                talent within highly-competitive industries
              </p>
              <p className="mt-1.5 text-sm md:text-base text-[#232323] line-clamp-3">
                So, what does this approach look like exactly? What is it that
                recruiters need to do to grab the attention of
              </p>

              <div className="flex mt-4 items-center gap-2 md:gap-4 flex-wrap">
                <div className="flex items-center gap-1 md:gap-2">
                  <img src="/images/icons/profil.svg" className="w-7 md:w-9" />
                  <p className="work-sans text-sm md:text-base text-[#97989F]">
                    Tracey Wilson
                  </p>
                </div>
                <p className="work-sans text-sm md:text-base text-[#97989F]">
                  August 20, 2022
                </p>
              </div>
            </motion.div>
            {/* Repeat card end */}
          </motion.div>

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
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
