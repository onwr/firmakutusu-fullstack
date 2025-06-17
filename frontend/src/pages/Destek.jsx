import React from 'react';
import Header from '../components/Header';
import { motion } from "framer-motion";
import DestekForm from '../components/home/Destek';
import SSS from '../components/home/SSS';
import Footer from '../components/Footer';

const Destek = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const videos = [
        {
            image: "/images/icons/video.jpg",
            title: "Nasıl Üye Olurum Vidomuzu İzleyin"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="px-2 md:px-0">
                <motion.div
                    className="container mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="bg-[#CED4DA] rounded-lg py-4 px-6 mb-8 shadow-md"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.h1
                            className="marcellus text-center md:text-left"
                        >
                            Destek
                        </motion.h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <DestekForm />
                    </motion.div>

                    <motion.div
                        className="mt-12 md:mt-16 container mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.p
                            className="marcellus text-center text-3xl md:text-4xl text-[#1C5540] md:hidden"
                            variants={itemVariants}
                        >
                            MEDYA
                        </motion.p>

                        <motion.p
                            className="mt-4 text-center md:text-left text-[#232323] text-lg md:text-xl max-w-4xl"
                            variants={itemVariants}
                        >
                            Platformumuzu nasıl kullanacağınızı öğrenmek ve tüm özellikleri
                            keşfetmek için tanıtım videolarımızı izleyin.
                        </motion.p>

                        <motion.div
                            className="grid mt-6 md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                        >
                            {videos.map((video, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            src={video.image}
                                            alt={video.title}
                                            className="rounded-t-2xl w-full object-cover h-48"
                                        />
                                    </motion.div>
                                    <motion.p
                                        className="flex items-center quicksand text-base md:text-lg font-semibold rounded-b-2xl justify-center text-white gap-2 p-4 bg-[#51596C]"
                                        whileHover={{ backgroundColor: "#3A4254" }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img src="/images/icons/buttons/play.svg" alt="Play" />
                                        {video.title}
                                    </motion.p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="mt-12 md:mt-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        <SSS about={true} />
                    </motion.div>
                </motion.div>
            </main>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <Footer />
            </motion.div>
        </div>
    );
};

export default Destek;