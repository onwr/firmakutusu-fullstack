import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { firmaService } from "../services/api";

const Header = () => {
  const { isLogin, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [firmaData, setFirmaData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFirmaData = async () => {
      if (user?.yetkiliKisi?.firma_id) {
        try {
          setLoading(true);
          const response = await firmaService.getFirma(
            user.yetkiliKisi.firma_id
          );
          setFirmaData(response.data.data);
        } catch (error) {
          console.error("Firma bilgileri alınamadı:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFirmaData();
  }, [user?.firma_id]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { icon: "/images/icons/nav/anasayfa.svg", text: "Anasayfa", link: "/" },
    {
      icon: "/images/icons/nav/firmaara.png",
      text: "Firma Ara",
      link: "/firma-ara",
    },
    {
      icon: "/images/icons/nav/sponsorluk.png",
      text: "Sponsorluk",
      link: "/sponsorluk",
    },
    {
      icon: "/images/icons/nav/paketler.png",
      text: "Paketler",
      link: "/paketler",
    },
    {
      icon: "/images/icons/nav/hakkimizda.png",
      text: "Hakkımızda",
      link: "/hakkimizda",
    },
    { icon: "/images/icons/nav/blog.svg", text: "Blog", link: "/blog" },
    { icon: "/images/icons/nav/destek.svg", text: "Destek", link: "/destek" },
  ];

  const UserNavItems = [
    {
      icon: "/images/icons/nav/firmaara.png",
      text: "Firma Ara",
      link: "/hesap/firma-ara",
    },
    {
      icon: "/images/icons/nav/favoriler.svg",
      text: "Favorilerim",
      link: "/hesap/favorilerim",
    },
    {
      icon: "/images/icons/nav/sponsorluk.png",
      text: "Sponsorluk",
      link: "/sponsorluk",
    },
    {
      icon: "/images/icons/nav/paketler.png",
      text: "Paketlerim",
      link: "/hesap/paketlerim",
    },
    {
      icon: "/images/icons/nav/blog.svg",
      text: "FK Blog",
      link: "/hesap/blog",
    },
    {
      icon: "/images/icons/nav/mesajlar.svg",
      text: "Mesajlarım",
      link: "/hesap/mesajlarim",
    },
    {
      icon: "/images/icons/nav/bildirimler.svg",
      text: "Bildirimler",
      link: "/hesap/bildirimler",
    },
    {
      icon: "/images/icons/nav/destek.svg",
      text: "Destek",
      link: "/hesap/destek",
    },
    {
      icon: "/images/icons/nav/profil.svg",
      text: "Profilim",
      link: "/hesap/profil",
    },
    {
      icon: "/images/icons/nav/faturalar.svg",
      text: "Faturalarım",
      link: "/hesap/faturalarim",
    },
    {
      icon: "/images/icons/nav/ayarlar.svg",
      text: "Ayarlarım",
      link: "/hesap/ayarlar",
    },
  ];

  const renderAuthButtons = () => {
    if (isLogin && user) {
      return (
        <div className="relative w-full flex gap-2">
          <div className="relative w-16 h-16 overflow-hidden">
            <img
              src={firmaData?.profil_resmi_url || "/images/logo.svg"}
              className="w-full h-full object-contain rounded-full border-2 border-[#01A4BD]"
              alt="Firma Logosu"
              onError={(e) => {
                e.target.src = "/images/logo.svg";
                e.target.onerror = null;
              }}
            />
          </div>
          <div className="flex pr-3 flex-col gap-0">
            <p className="font-semibold text-[13px] text-[#232323] montserrat">
              {user.yetkiliKisi?.ad} {user.yetkiliKisi?.soyad}
            </p>
            <p className="text-[10px] line-clamp-3 max-w-40 text-[#232323] uppercase montserrat">
              {firmaData?.firma_unvani || "Yükleniyor..."}
            </p>
          </div>
          <div className="flex-col gap-1 flex border-l border-[#45535E] pl-3">
            <button onClick={() => logout()}>
              <img
                src="/images/icons/nav/off-power.svg"
                className="cursor-pointer hover:scale-105 duration-300"
                alt="Çıkış"
              />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex w-full gap-2">
        <motion.a
          href="/hesap/giris-kayit"
          className="text-sm cursor-pointer w-full hover:bg-[#1C5540]/20 duration-300 font-semibold text-[#1C5540] bg-[#F1EEE6] h-12 px-3 rounded-lg flex items-center justify-center gap-1"
        >
          <img src="/images/icons/kayit.svg" alt="Register" />
          Üye Ol
        </motion.a>
        <motion.a
          href="/hesap/giris-kayit"
          className="text-sm font-semibold w-full text-white hover:bg-black/80 duration-300 bg-[#1C5540] h-12 px-3 rounded-lg flex items-center justify-center gap-1"
        >
          <img src="/images/icons/power.png" alt="Login" />
          Giriş
        </motion.a>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-5 px-4 md:px-0">
      <div className="flex items-center justify-between">
        <motion.a
          href="/"
          className={`w-40 ${user || isLogin ? "md:w-auto" : "md:w-1/6"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {!isLogin || !user ? (
            <img src="/images/logo.svg" alt="Logo" className="max-w-full" />
          ) : (
            <img
              src="/images/icons/nav/logokare.svg"
              alt="Logo"
              className="max-w-full"
            />
          )}
        </motion.a>

        <div
          className={`hidden xl:flex ${
            isLogin || user ? " w-3/4" : "w-3/5"
          } marcellus items-center justify-center gap-5 2xl:gap-6`}
        >
          {!user ? (
            <>
              {navItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  className="flex flex-col items-center cursor-pointer"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <img src={item.icon} alt={item.text} />
                  <p className="text-[#1C5540] mt-1">{item.text}</p>
                </motion.a>
              ))}
            </>
          ) : (
            <>
              {UserNavItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  className="flex flex-col items-center cursor-pointer"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <img src={item.icon} alt={item.text} />
                  <p className="text-[#1C5540] text-xs 2xl:text-sm font-bold mt-1">
                    {item.text}
                  </p>
                </motion.a>
              ))}
            </>
          )}
        </div>

        <motion.div
          className={`hidden xl:flex ${
            user || isLogin ? "w-1/5" : "w-1/5"
          }  montserrat items-start justify-end gap-2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderAuthButtons()}
        </motion.div>

        <motion.div className="hidden bg md:flex xl:hidden items-center gap-3">
          {isLogin && user ? (
            <div className="relative">
              <motion.div
                className="flex items-center gap-2 bg-[#1C5540]/10 text-white px-4 py-3 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-full flex gap-2">
                  <img
                    src={
                      firmaData?.profil_resmi_url ||
                      "/images/default-avatar.png"
                    }
                    className="size-16 rounded-full border border-[#01A4BD]"
                    alt="Profil"
                  />
                  <div className="flex pr-3 flex-col gap-0">
                    <p className="font-semibold text-[13px] text-[#232323] montserrat">
                      {user.yetkiliKisi?.ad} {user.yetkiliKisi?.soyad}
                    </p>
                    <p className="text-[10px] line-clamp-3 max-w-40 text-[#232323] uppercase montserrat">
                      {firmaData?.firma_unvani || "Yükleniyor..."}
                    </p>
                  </div>
                  <div className=" flex-col gap-1 flex border-l border-[#45535E] pl-3">
                    <button onClick={() => logout()}>
                      <img
                        src="/images/icons/nav/off-power.svg"
                        className="cursor-pointer hover:scale-105 duration-300"
                        alt="Çıkış"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              <motion.a
                href="/hesap/giris-kayit"
                className="text-sm cursor-pointer hover:bg-[#1C5540]/80 duration-300 font-semibold text-[#1C5540] bg-[#F1EEE6] h-10 px-3 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Üye Ol
              </motion.a>
              <motion.a
                href="/hesap/giris-kayit"
                className="text-sm font-semibold text-white bg-[#1C5540] h-10 px-3 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Giriş
              </motion.a>
            </>
          )}
        </motion.div>

        <motion.button
          className="xl:hidden text-[#1C5540] p-2 hover:bg-gray-100 rounded-full"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? (
            <HiX className="w-6 h-6" />
          ) : (
            <HiMenu className="w-6 h-6" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="xl:hidden mt-4 bg-white rounded-lg shadow-lg p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="flex flex-col gap-4">
              {!isLogin || !user ? (
                <>
                  {navItems.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.link}
                      className="flex items-center gap-3 p-3 hover:bg-[#F1EEE6] rounded-md cursor-pointer"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <img
                        src={item.icon}
                        alt={item.text}
                        className="w-6 h-6"
                      />
                      <p className="text-[#1C5540] font-medium">{item.text}</p>
                    </motion.a>
                  ))}
                </>
              ) : (
                <>
                  {UserNavItems.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.link}
                      className="flex items-center gap-3 p-3 hover:bg-[#F1EEE6] rounded-md cursor-pointer"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <img
                        src={item.icon}
                        alt={item.text}
                        className="w-6 h-6"
                      />
                      <p className="text-[#1C5540] font-bold">{item.text}</p>
                    </motion.a>
                  ))}
                </>
              )}

              <div className="md:hidden pt-4 border-t border-gray-200 mt-2">
                {isLogin && user ? (
                  <motion.div
                    className="flex items-center gap-2 bg-[#1C5540]/10 text-white px-4 py-3 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative w-full flex gap-2">
                      <img
                        src={
                          firmaData?.profil_resmi_url ||
                          "/images/default-avatar.png"
                        }
                        className="size-16 rounded-full border border-[#01A4BD]"
                        alt="Profil"
                      />
                      <div className="flex pr-3 flex-col gap-0">
                        <p className="font-semibold text-[13px] text-[#232323] montserrat">
                          {user.yetkiliKisi?.ad} {user.yetkiliKisi?.soyad}
                        </p>
                        <p className="text-[10px] line-clamp-3 max-w-40 text-[#232323] uppercase montserrat">
                          {firmaData?.firma_unvani || "Yükleniyor..."}
                        </p>
                      </div>
                      <div className=" flex-col gap-1 flex border-l border-[#45535E] pl-3">
                        <button onClick={() => logout()}>
                          <img
                            src="/images/icons/nav/off-power.svg"
                            className="cursor-pointer hover:scale-105 duration-300"
                            alt="Çıkış"
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex gap-2">
                    <motion.a
                      href="/hesap/giris-kayit"
                      className="w-full text-sm cursor-pointer hover:bg-[#1C5540] duration-300 font-semibold text-[#1C5540] bg-[#F1EEE6] h-12 rounded-lg flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <img
                        src="/images/icons/kayit.svg"
                        alt="Register"
                        className="w-5 h-5"
                      />
                      Üye Ol
                    </motion.a>
                    <motion.a
                      href="/hesap/giris-kayit"
                      className="w-full text-sm font-semibold text-white bg-[#1C5540] h-12 rounded-lg flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <img
                        src="/images/icons/power.png"
                        alt="Login"
                        className="w-5 h-5"
                      />
                      Giriş
                    </motion.a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
