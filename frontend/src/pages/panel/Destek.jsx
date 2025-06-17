import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import DestekListesi from "../../components/panel/DestekListesi";
import DestekDetay from "../../components/panel/DestekDetay";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HesapDestek = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/destek`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Destek talepleri alınamadı");
      }

      const data = await response.json();
      // Veri doğrulama
      const validatedTickets = (data.data || []).map((ticket) => ({
        id: ticket.id || "",
        ticketNumber: ticket.ticketNumber || "",
        subject: ticket.subject || "",
        status: ticket.status || "open",
        messages: ticket.messages || [],
      }));
      setTickets(validatedTickets);
    } catch (error) {
      setError("Destek talepleri yüklenirken bir hata oluştu");
      toast.error("Destek talepleri yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (subject) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/destek`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ subject }),
      });

      if (!response.ok) {
        throw new Error("Destek talebi oluşturulamadı");
      }

      const data = await response.json();
      setTickets((prevTickets) => [data.data, ...prevTickets]);
      toast.success("Destek talebi başarıyla oluşturuldu");
    } catch (error) {
      toast.error("Destek talebi oluşturulurken bir hata oluştu");
    }
  };

  const handleAddMessage = async (ticketId, content) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/destek/${ticketId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Mesaj gönderilemedi");
      }

      const ticketResponse = await fetch(
        `${API_BASE_URL}/api/destek/${ticketId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!ticketResponse.ok) {
        throw new Error("Destek talebi detayları alınamadı");
      }

      const ticketData = await ticketResponse.json();
      setSelectedTicket(ticketData.data);
      toast.success("Mesajınız başarıyla gönderildi");
    } catch (error) {
      toast.error("Mesaj gönderilirken bir hata oluştu");
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/destek/${ticketId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: "closed" }),
        }
      );

      if (!response.ok) {
        throw new Error("Destek talebi kapatılamadı");
      }

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: "closed" } : ticket
        )
      );
      toast.success("Destek talebi başarıyla kapatıldı");
    } catch (error) {
      toast.error("Destek talebi kapatılırken bir hata oluştu");
    }
  };

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
          alt="background"
        />

        <div className="container mx-auto px-4 lg:px-2 z-10">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="marcellus pt-5 text-white"
          >
            Destek
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
                    src="/images/destek.svg"
                    className="w-16 md:w-auto"
                    alt="support"
                  />
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="mt-5 text-center text-[#1D547D] marcellus text-base md:text-2xl px-4 md:px-0"
                >
                  Destek
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Bu sayfada, destek taleplerinizi görüntüleyebilir ve
                  yönetebilirsiniz. Oluşturduğunuz talepleri takip ederek çözüme
                  hızlıca ulaşabilirsiniz.
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Destek kayıtlarınızı dilediğiniz zaman güncelleyebilir, eski
                  talepleri arşivleyebilir veya silebilirsiniz.
                </motion.p>
              </div>
            </motion.div>

            {selectedTicket ? (
              <DestekDetay
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
                onAddMessage={handleAddMessage}
                onCloseTicket={handleCloseTicket}
              />
            ) : (
              <DestekListesi
                tickets={tickets}
                onTicketClick={setSelectedTicket}
                onCreateTicket={handleCreateTicket}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HesapDestek;
