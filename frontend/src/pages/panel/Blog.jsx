import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";

const HesapBlog = () => {
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
                        Blog
                    </motion.p>

                    <div className="flex mt-5 flex-col border py-6 px-3 bg-white border-[#A2ACC7] rounded-xl">
                        <motion.div
                            className="container mx-auto bg-[#F6F6F7] py-8 md:py-16 px-2 lg:px-0 flex items-center justify-center rounded-xl"
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
                                    className="my-5 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
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

                        <div className="my-10 max-w-xl w-full mx-auto border gap-5 border-[#A2ACC7] relative rounded-md px-2 py-3 flex items-center justify-between">
                            <img src="/images/search-black.svg" className="absolute top-5 left-3" />
                            <input className="text-[#45535E] placeholder-[#45535E] ml-8 outline-none text-sm w-full" placeholder="Blog içeriğinde hızlıca arama yapın" />
                            <button className="w-1/5 bg-[#A2ACC7] rounded-md py-2 text-white">Ara</button>
                        </div>

                        <motion.div
                            className="container montserrat mx-auto"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* İlk iki blog için özel grid */}
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 px-2 md:px-0"
                                variants={containerVariants}
                            >
                                {/* İlk iki blog kartı */}
                                <motion.div
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="border drop-shadow-xl hover:drop-shadow-2xl bg-white border-[#CED4DA] rounded-2xl py-4 md:py-6 px-4 md:px-5 transition-all duration-300"
                                >
                                    <img
                                        src="/images/icons/blog-img.png"
                                        className="rounded-lg w-full h-48 md:h-64 object-cover"
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

                                <motion.div
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="border drop-shadow-xl hover:drop-shadow-2xl bg-white border-[#CED4DA] rounded-2xl py-4 md:py-6 px-4 md:px-5 transition-all duration-300"
                                >
                                    <img
                                        src="/images/icons/blog-img.png"
                                        className="rounded-lg w-full h-48 md:h-64 object-cover"
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
                            </motion.div>

                            {/* Alttaki 3 blog için grid */}
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 px-2 md:px-0"
                                variants={containerVariants}
                            >
                                {/* Alttaki 3 blog kartı */}
                                <motion.div
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="border drop-shadow-xl hover:drop-shadow-2xl bg-white border-[#CED4DA] rounded-2xl py-4 md:py-6 px-4 md:px-5 transition-all duration-300"
                                >
                                    <img
                                        src="/images/icons/blog-img.png"
                                        className="rounded-lg w-full h-48 object-cover"
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

                                <motion.div
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="border drop-shadow-xl hover:drop-shadow-2xl bg-white border-[#CED4DA] rounded-2xl py-4 md:py-6 px-4 md:px-5 transition-all duration-300"
                                >
                                    <img
                                        src="/images/icons/blog-img.png"
                                        className="rounded-lg w-full h-48 object-cover"
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

                                <motion.div
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="border drop-shadow-xl hover:drop-shadow-2xl bg-white border-[#CED4DA] rounded-2xl py-4 md:py-6 px-4 md:px-5 transition-all duration-300 sm:col-span-2 lg:col-span-1"
                                >
                                    <img
                                        src="/images/icons/blog-img.png"
                                        className="rounded-lg w-full h-48 object-cover"
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
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HesapBlog;