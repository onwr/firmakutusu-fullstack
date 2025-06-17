import React from 'react'
import Header from '../components/Header'
import { motion } from "framer-motion";
import DestekForm from '../components/home/Destek'
import Footer from '../components/Footer'

const Sponsorluk = () => {
    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
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

    const textFadeIn = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 }
        }
    };

    const sponsorshipAdvantages = [
        "Ana sayfada özel logo gösterimi",
        "Sektörünüze özel hedeflenmiş görünürlük",
        "Kategori bazlı aramalarda öncelikli listelenme",
        "Blog içeriklerinde sponsorlu tanıtım yazısı",
        "SEO ve dijital pazarlama desteği",
        "Özel reklam alanları ve vitrinlerde yer alma",
        "Marka bilinirliğinizi artırma fırsatı"
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className='px-4 md:px-6 lg:px-8 py-6'>
                <main>
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
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                Sponsorluk
                            </motion.h1>
                        </motion.div>

                        <motion.div
                            className='flex flex-col lg:flex-row items-center gap-5 md:gap-8'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            <motion.div
                                className='w-full text-center lg:text-right order-2 lg:order-1'
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <motion.p
                                    className='marcellus text-3xl md:text-4xl lg:text-6xl text-[#1C5540]'
                                    variants={itemVariants}
                                >
                                    FirmaKutusu.com <br className="hidden md:block" /> Sponsorluk Fırsatları
                                </motion.p>

                                <motion.p
                                    className='mt-6 md:mt-10 montserrat font-semibold text-xl md:text-2xl text-[#232323]'
                                    variants={itemVariants}
                                >
                                    Neden FirmaKutusu.com'da Sponsor Olmalısınız?
                                </motion.p>

                                <motion.p
                                    className='montserat text-lg md:text-xl text-left lg:text-right text-[#232323] mt-2'
                                    variants={itemVariants}
                                >
                                    FirmaKutusu.com, Türkiye'nin en kapsamlı işletme rehberlerinden biri olarak binlerce firmanın hedef kitleleriyle buluşmasını sağlar. Sponsorluk fırsatlarımızla markanızı öne çıkarabilir, geniş bir kitleye erişim sağlayabilirsiniz.
                                </motion.p>

                                <motion.p
                                    className='font-semibold text-left md:text-center lg:text-right text-xl md:text-2xl text-[#232323] mt-6'
                                    variants={itemVariants}
                                >
                                    Sponsorluk avantajları
                                </motion.p>

                                {/* Mobile version - Card-style list */}
                                <motion.div
                                    className='lg:hidden montserrat text-[#232323] text-md md:text-lg flex flex-col gap-3 mt-4'
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.1 }}
                                >
                                    {sponsorshipAdvantages.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            variants={textFadeIn}
                                            className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-sm border-l-4 border-[#1C5540]"
                                            whileHover={{
                                                scale: 1.02,
                                                backgroundColor: "rgba(28, 85, 64, 0.05)"
                                            }}
                                        >
                                            <span className="text-[#1C5540] text-lg">✓</span>
                                            <span className="text-left">{item}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Desktop version - Regular list */}
                                <motion.div
                                    className='hidden lg:flex montserrat text-[#232323] text-xl flex-col gap-2 mt-4'
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.1 }}
                                >
                                    {sponsorshipAdvantages.map((item, index) => (
                                        <motion.p
                                            key={index}
                                            variants={textFadeIn}
                                            className="flex items-center gap-2 justify-end"
                                        >
                                            <span>{item} ✅</span>
                                        </motion.p>
                                    ))}
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className='w-full mb-6 lg:mb-0 order-1 lg:order-2'
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                whileHover={{ scale: 1.03 }}
                            >
                                <img
                                    src="/images/icons/sponsorluk.svg"
                                    alt="Sponsorluk"
                                    className="w-full h-auto max-w-md mx-auto"
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="max-w-4xl mx-auto mt-8 rounded-xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, amount: 0.1 }}
                        >
                            <motion.p
                                className="montserrat text-center font-medium text-xl"
                                whileInView={{ scale: [1, 1.03, 1] }}
                                transition={{ duration: 1, times: [0, 0.5, 1] }}
                                viewport={{ once: true }}
                            >
                                Siz de sponsorlarımız arasında yer almak ister misiniz?
                            </motion.p>

                            <motion.p
                                className="text-[#232323] mt-2 text-center"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                Ekibimiz en kısa sürede size geri dönüş yapacaktır. Sizi de FirmaKutusu.com'un güçlü ekosisteminde görmekten mutluluk duyarız!
                            </motion.p>

                            <motion.div
                                className="mt-6 space-y-3"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                            >
                                {[
                                    { id: "adınız", label: "Adınız", placeholder: "Adınızı giriniz", type: "text" },
                                    { id: "soyadiniz", label: "Soyadınız", placeholder: "Soyadınızı Giriniz", type: "text" },
                                    { id: "tc", label: "T.C. Kimlik Numaranız", placeholder: "T.C. Kimlik Numaranız", type: "text" },
                                    { id: "tel", label: "Telefon Numaranız", placeholder: "Telefon Numaranız", type: "text" },
                                    { id: "email", label: "E-Mail Adresiniz", placeholder: "E-Mail Adresiniz", type: "email" },
                                    { id: "meslek", label: "Mesleğiniz", placeholder: "Mesleğiniz", type: "text" }
                                ].map((field, index) => (
                                    <motion.div
                                        key={index}
                                        className="py-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col"
                                        variants={itemVariants}
                                        whileHover={{ borderColor: "#1C5540", boxShadow: "0 0 0 1px rgba(28, 85, 64, 0.2)" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <label htmlFor={field.id} className="text-xs md:text-sm text-[#232323]">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            id={field.id}
                                            placeholder={field.placeholder}
                                            className="text-[#232323] font-medium outline-none mt-1 w-full"
                                        />
                                    </motion.div>
                                ))}

                                <motion.div
                                    className="py-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex gap-2 items-center"
                                    variants={itemVariants}
                                    whileHover={{ borderColor: "#1C5540", boxShadow: "0 0 0 1px rgba(28, 85, 64, 0.2)" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <img
                                        src="/images/icons/firma-profil/icons/cvekle.svg"
                                        className="size-6"
                                        alt="CV Ekle"
                                    />

                                    <p className="font-medium text-sm md:text-base">
                                        CV Dosyanızı Yükleyin{" "}
                                        <span className="text-xs block md:inline mt-1 md:mt-0">
                                            ( Maksimum: 2 MB / Dosya Türü: txt, pdf, doc, docx, xls, xlsx )
                                        </span>
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="flex items-start mt-4 gap-2"
                                    variants={itemVariants}
                                >
                                    <input
                                        type="checkbox"
                                        id="bilgi"
                                        className="w-5 h-5 mt-0.5 accent-[#A2ACC7]"
                                    />
                                    <label htmlFor="bilgi" className="text-sm md:text-base">
                                        FirmaKutusu.com tarafından yukarıda belirtmiş olduğum bilgiler
                                        üzerinden benimle iletişim kurulmasını ve izinli iletişim formu'nu
                                        onaylıyorum.
                                    </label>
                                </motion.div>

                                <motion.button
                                    className="flex items-center w-full mt-4 bg-[#1C5540] py-4 justify-center text-white rounded-lg gap-2 font-semibold"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, backgroundColor: "#164535" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    İş Başvuru Formumu Gönder
                                    <img src="/images/icons/firma-profil/icons/basvuruyolla.svg" alt="Gönder" />
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="mt-6 md:mt-12"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true, amount: 0.1 }}
                        >
                            <DestekForm sub={true} />
                        </motion.div>
                    </motion.div>
                </main>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <Footer />
            </motion.div>
        </div>
    )
}

export default Sponsorluk