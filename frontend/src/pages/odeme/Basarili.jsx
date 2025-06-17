import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Basarili = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/hesap/paketlerim");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="">
      <Header />

      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full container mx-auto"
        >
          {/* Ana Kart */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            {/* Başarı İkonu */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </motion.div>

            {/* İçerik */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-4"
            >
              <h1 className="text-2xl font-bold text-slate-900">
                Ödeme Tamamlandı
              </h1>

              <p className="text-slate-600 leading-relaxed">
                Paketiniz başarıyla satın alındı. Detayları panelinizden
                inceleyebilirsiniz.
              </p>

              {/* Aksiyon Butonu */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/hesap/paketlerim")}
                className="w-full mt-6 mx-auto max-w-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Paketlerime Git
              </motion.button>

              {/* Geri Sayım */}
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-4">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin"></div>
                <span>Otomatik yönlendirme: {countdown}s</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Basarili;
