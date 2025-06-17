import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { bildirimService } from "../../services/api";
import { toast } from "sonner";

const Bildirimler = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await bildirimService.getBildirimler();
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Bildirimler alınırken hata:", error);
      toast.error("Bildirimler alınırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await bildirimService.markAsRead(id);
      if (response.data.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id
              ? { ...notification, okundu: true }
              : notification
          )
        );
        toast.success("Bildirim okundu olarak işaretlendi");
      }
    } catch (error) {
      console.error("Bildirim güncellenirken hata:", error);
      toast.error("Bildirim güncellenirken bir hata oluştu");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await bildirimService.deleteBildirim(id);
      if (response.data.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.id !== id)
        );
        toast.success("Bildirim başarıyla silindi");
      }
    } catch (error) {
      console.error("Bildirim silinirken hata:", error);
      toast.error("Bildirim silinirken bir hata oluştu");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("tr-TR"),
      time: date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
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
            Bildirimler
          </motion.p>

          <div className="flex mt-5 flex-col border py-6 px-3 bg-white border-[#A2ACC7] rounded-xl">
            <motion.div
              className="container mx-auto bg-[#F6F6F7] py-8 md:py-16 px-2 lg:px-0 flex items-center justify-center rounded-xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="max-w-5xl w-full flex flex-col items-center justify-center">
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col md:flex-row items-center gap-4"
                >
                  <img
                    src="/images/bildirimler.svg"
                    className="w-16 md:w-auto"
                  />
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="mt-5 text-center text-[#1D547D] marcellus text-base md:text-2xl px-4 md:px-0"
                >
                  Bildirimler
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Bu sayfada, son 10 bildiriminizi görüntüleyebilir ve takip
                  edebilirsiniz. Size iletilen güncellemeleri inceleyerek önemli
                  duyuruları kaçırmadan işlem yapabilirsiniz.
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Yeni bildirimler otomatik olarak eklenecek ve en güncel
                  bilgilere anında ulaşabileceksiniz.
                </motion.p>
              </div>
            </motion.div>

            <div className="mt-10 w-full flex justify-center">
              <div className="w-full">
                {loading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D547D] mx-auto"></div>
                    <p className="mt-4 text-[#1D547D]">
                      Bildirimler yükleniyor...
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-[#1D547D]">
                      Henüz bildiriminiz bulunmamaktadır.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl shadow-lg border border-[#A2ACC7] bg-gradient-to-br from-[#f8fafc] to-[#e6ecf5]">
                    <table className="min-w-full divide-y divide-[#E0E7EF] rounded-2xl">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#1c5540] via-[#1c5540]/80 to-[#1c5540]">
                          <th className="px-6 py-4 text-left text-xs font-bold text-white rounded-tl-2xl tracking-wider uppercase shadow-sm">
                            S. No
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider uppercase shadow-sm">
                            Bildirim Tipi
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider uppercase shadow-sm">
                            Konu
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white rounded-tr-2xl tracking-wider uppercase shadow-sm">
                            Tarih / Saat
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#E0E7EF]">
                        {notifications.map((notification, index) => {
                          const { date, time } = formatDate(
                            notification.olusturma_tarihi
                          );
                          return (
                            <tr
                              key={notification.id}
                              className={`transition-all duration-200 hover:bg-[#F3F7FB] group ${
                                !notification.okundu ? "bg-white" : ""
                              }`}
                            >
                              <td
                                className="px-6 py-5 align-top text-center font-bold text-base group-hover:text-[#1D547D] transition-colors"
                                style={{ color: notification.tip_renk }}
                              >
                                {index + 1}
                              </td>
                              <td className="px-6 py-5 align-top">
                                <div className="flex items-center gap-3">
                                  <span
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-full shadow bg-white border border-[#E0E7EF] group-hover:scale-105 transition-transform"
                                    style={{
                                      boxShadow: `0 2px 8px 0 ${notification.tip_renk}22`,
                                    }}
                                  >
                                    <img
                                      src={notification.tip_icon}
                                      alt={notification.tip}
                                      className="w-6 h-6"
                                    />
                                  </span>
                                  <span
                                    className="font-bold text-center text-sm px-3 py-1 rounded-full bg-opacity-10"
                                    style={{
                                      color: notification.tip_renk,
                                      backgroundColor:
                                        notification.tip_renk + "22",
                                    }}
                                  >
                                    {notification.tip}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5 align-top text-[#1D547D] font-medium text-sm">
                                <div className="space-y-2">
                                  <div className="font-semibold">
                                    {notification.konu}
                                  </div>
                                  {notification.icerik && (
                                    <div className="text-gray-600 text-sm">
                                      {notification.icerik}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-5 align-top whitespace-nowrap text-[#45535E] font-semibold text-sm">
                                {date}
                                <br />
                                <span className="text-xs font-normal">
                                  {time}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Bildirimler;
