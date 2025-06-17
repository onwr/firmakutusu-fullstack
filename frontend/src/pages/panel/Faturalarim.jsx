import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import {
  FaChevronDown,
  FaCreditCard,
  FaTrash,
  FaEdit,
  FaStar,
} from "react-icons/fa";
import { pdf } from "@react-pdf/renderer";
import FaturaPdfTemplate from "../../components/fatura/FaturaPdfTemplate";
import {
  faturaService,
  firmaService,
  savedCardService,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { RiVisaLine } from "react-icons/ri";
import { FaCcMastercard } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";

const Faturalarim = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("faturalarim");
  const [expandedRow, setExpandedRow] = useState(null);
  const [faturalar, setFaturalar] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardLoading, setCardLoading] = useState(true);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showEditCardModal, setShowEditCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    card_number: "",
    card_holder_name: "",
    expiry_month: "",
    expiry_year: "",
    card_type: "VISA",
    is_default: false,
  });

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

  // Faturaları çek
  useEffect(() => {
    const fetchFaturalar = async () => {
      setLoading(true);
      try {
        const res = await faturaService.getFaturalar();
        setFaturalar(res.data.data || []);
      } catch (err) {
        setFaturalar([]);
      }
      setLoading(false);
    };
    if (activeTab === "faturalarim") fetchFaturalar();
  }, [activeTab]);

  // Kayıtlı kartları çek
  useEffect(() => {
    const fetchSavedCards = async () => {
      setCardLoading(true);
      try {
        const res = await savedCardService.getSavedCards();
        setSavedCards(res.data.data || []);
      } catch (err) {
        setSavedCards([]);
      }
      setCardLoading(false);
    };
    if (activeTab === "kartlarim") fetchSavedCards();
  }, [activeTab]);

  const handleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handlePrint = async (fatura) => {
    const firma = await firmaService.getFirma();
    // Fatura detayını doldur!
    const faturaDetay = {
      fatura_no: fatura.fatura_no,
      satici_firma: "Firma Kutusu",
      satici_vergi_no: "1234567890",
      satici_adres: "Ankara, Türkiye",
      alici_firma: firma.data.data.firma_unvani,
      alici_vergi_no: firma.data.data.vergi_kimlik_no,
      alici_adres: firma.data.data.merkez_adresi,
      kalemler: [
        {
          urun_adi: fatura.urun_hizmet,
          miktar: 1,
          birim_fiyat: fatura.odeme_tutari,
          kdv: 18,
          toplam: fatura.odeme_tutari * 1 * 1.18,
        },
      ],
      ara_toplam: fatura.odeme_tutari,
      kdv_toplam: fatura.odeme_tutari * 0.18,
      genel_toplam: fatura.odeme_tutari * 1.18,
    };

    const blob = await pdf(
      <FaturaPdfTemplate faturaDetay={faturaDetay} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const win = window.open(url);
    setTimeout(() => {
      win.print();
    }, 500);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry month
  const formatExpiryMonth = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length > 2) return v.slice(0, 2);
    if (v.length === 2) {
      const month = parseInt(v);
      if (month > 12) return "12";
    }
    return v;
  };

  // Format expiry year
  const formatExpiryYear = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length > 4) return v.slice(0, 4);
    return v;
  };

  // Format card holder name
  const formatCardHolderName = (value) => {
    return value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "").toUpperCase();
  };

  // Validate card number
  const validateCardNumber = (number) => {
    const v = number.replace(/\s+/g, "");
    if (v.length < 13 || v.length > 19) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = v.length - 1; i >= 0; i--) {
      let digit = parseInt(v.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      await savedCardService.addCard(cardForm);
      const res = await savedCardService.getSavedCards();
      setSavedCards(res.data.data);
      setShowAddCardModal(false);
      setCardForm({
        card_number: "",
        card_holder_name: "",
        expiry_month: "",
        expiry_year: "",
        card_type: "VISA",
        is_default: false,
      });
    } catch (error) {
      console.error("Kart eklenirken hata oluştu:", error);
    }
  };

  const handleUpdateCard = async (e) => {
    e.preventDefault();
    try {
      await savedCardService.updateCard(selectedCard.id, cardForm);
      const res = await savedCardService.getSavedCards();
      setSavedCards(res.data.data);
      setShowEditCardModal(false);
      setSelectedCard(null);
      setCardForm({
        card_number: "",
        card_holder_name: "",
        expiry_month: "",
        expiry_year: "",
        card_type: "VISA",
        is_default: false,
      });
    } catch (error) {
      console.error("Kart güncellenirken hata oluştu:", error);
    }
  };

  const handleDeleteCard = async (id) => {
    if (window.confirm("Bu kartı silmek istediğinizden emin misiniz?")) {
      try {
        await savedCardService.deleteCard(id);
        const res = await savedCardService.getSavedCards();
        setSavedCards(res.data.data);
      } catch (error) {
        console.error("Kart silinirken hata oluştu:", error);
      }
    }
  };

  const handleSetDefaultCard = async (id) => {
    try {
      await savedCardService.setDefaultCard(id);
      const res = await savedCardService.getSavedCards();
      setSavedCards(res.data.data);
    } catch (error) {
      console.error("Varsayılan kart ayarlanırken hata oluştu:", error);
    }
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setCardForm({
      card_number: card.card_number,
      card_holder_name: card.card_holder_name,
      expiry_month: card.expiry_month,
      expiry_year: card.expiry_year,
      card_type: card.card_type,
      is_default: card.is_default,
    });
    setShowEditCardModal(true);
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
            Faturalarım
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
                    src="/images/faturalarim.svg"
                    className="w-16 md:w-auto"
                  />
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="mt-5 text-center text-[#1D547D] marcellus text-base md:text-2xl px-4 md:px-0"
                >
                  Faturalarım
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Bu sayfada, faturalarınızı ve kayıtlı kart bilgilerinizi
                  görüntüleyip yönetebilirsiniz. Faturalarınızı inceleyerek
                  ödemelerinizi takip edebilir, kart bilgilerinizi güncelleyerek
                  işlemlerinizi hızlandırabilirsiniz.
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="my-1 text-center text-[#1D547D] work-sans text-base md:text-lg px-4 md:px-0"
                >
                  Yeni faturalar ve kart bilgileri otomatik olarak eklenecek ve
                  en güncel bilgilere anında ulaşabileceksiniz.
                </motion.p>
              </div>
            </motion.div>
            <p className="bg-[#A2ACC7] rounded-t-xl  px-6 py-2 text-white marcellus text-xl">
              Faturalarım
            </p>
            <div className="pt-5">
              <div className="container mx-auto flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4 bg-white border border-[#A2ACC7] rounded-xl p-4 flex flex-col gap-2">
                  <button
                    className={`text-left px-4 flex items-center gap-2 montserrat py-2 rounded-lg font-semibold transition-colors duration-200 ${
                      activeTab === "faturalarim"
                        ? "border border-[#01A4BD] text-[#01A4BD]"
                        : "text-[#01A4BD] hover:bg-[#01A4BD]/10"
                    }`}
                    onClick={() => setActiveTab("faturalarim")}
                  >
                    <img src="/images/faturalar.svg" alt="" /> Faturalarım
                  </button>
                  <button
                    className={`text-left px-4 flex items-center gap-2 montserrat py-2 rounded-lg font-semibold transition-colors duration-200 ${
                      activeTab === "kartlarim"
                        ? "border border-[#01A4BD] text-[#01A4BD]"
                        : "text-[#01A4BD] hover:bg-[#01A4BD]/10"
                    }`}
                    onClick={() => setActiveTab("kartlarim")}
                  >
                    <img src="/images/kayitlikart.svg" alt="" /> Kayıtlı
                    Kartlarım
                  </button>
                </div>

                <div className="w-full md:w-3/4 bg-white border border-[#A2ACC7] rounded-xl p-6 min-h-[400px]">
                  {activeTab === "faturalarim" && (
                    <>
                      <h2 className="text-xl font-bold text-[#1c5540] mb-2">
                        Faturalarım
                      </h2>
                      <p className="text-[#475569] mb-4 text-sm">
                        Aşağıdaki alanlarda, hesabınıza ait fatura bilgilerini
                        görüntüleyebilir ve yönetebilirsiniz. Bu sayfada
                        yalnızca mevcut faturalarınızı inceleyebilir, ödeme
                        durumlarını takip edebilir ve kayıtlı kart bilgilerinizi
                        güncelleyebilirsiniz. Fatura bilgilerinizi güncellemeden
                        önce, tüm detayları dikkatlice gözden geçirdiğinizden
                        emin olun.
                      </p>
                      {/* Fatura Tablosu Başlangıç */}
                      {loading ? (
                        <div className="text-center py-10 text-[#1c5540] font-semibold">
                          Yükleniyor...
                        </div>
                      ) : faturalar.length === 0 ? (
                        <div className="text-center py-10 text-[#1c5540] font-semibold">
                          Fatura bulunamadı.
                        </div>
                      ) : (
                        <div className="overflow-x-auto mt-6">
                          <table className="min-w-full divide-y divide-[#E0E7EF] rounded-2xl">
                            <thead>
                              <tr className="bg-gradient-to-r from-[#1c5540] via-[#1c5540]/80 to-[#1c5540]">
                                <th className="px-6 py-4 text-left text-xs font-bold text-white rounded-tl-2xl tracking-wider uppercase shadow-sm">
                                  S. No
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider uppercase shadow-sm">
                                  Tarih
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider uppercase shadow-sm">
                                  Fatura No
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider uppercase shadow-sm">
                                  Ürün Hizmet Cinsi
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider uppercase shadow-sm">
                                  Tutar
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-white rounded-tr-2xl tracking-wider uppercase shadow-sm">
                                  Faturayı Görüntüle
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#E0E7EF]">
                              {faturalar.map((fatura, index) => (
                                <React.Fragment key={fatura.id}>
                                  <tr className="transition-all duration-200 hover:bg-[#F3F7FB] group">
                                    <td className="px-6 py-5 align-top text-center font-bold text-base group-hover:text-[#1D547D]">
                                      {index + 1}
                                    </td>
                                    <td className="px-6 py-5 align-top text-[#1D547D] font-medium text-sm">
                                      {new Date(
                                        fatura.odeme_tarihi
                                      ).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-5 align-top text-[#1D547D] font-medium text-sm">
                                      {fatura.fatura_no}
                                    </td>
                                    <td className="px-6 py-5 align-top text-[#1D547D] font-medium text-sm">
                                      {fatura.urun_hizmet}
                                    </td>
                                    <td className="px-6 py-5 align-top text-[#1D547D] font-semibold text-sm">
                                      {Number(
                                        fatura.odeme_tutari
                                      ).toLocaleString("tr-TR", {
                                        minimumFractionDigits: 2,
                                      })}{" "}
                                      TL + KDV
                                    </td>
                                    <td className="px-6 py-5 align-top text-center flex items-center justify-center">
                                      <button
                                        className={`w-10 h-10 flex items-center justify-center rounded-full border border-[#E0E7EF] bg-white hover:bg-[#F3F7FB] transition ${
                                          expandedRow === fatura.id
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                        onClick={() => handleExpand(fatura.id)}
                                        aria-label="Faturayı Görüntüle"
                                      >
                                        <FaChevronDown className="text-[#1D547D]" />
                                      </button>
                                    </td>
                                  </tr>
                                  {expandedRow === fatura.id && (
                                    <tr>
                                      <td
                                        colSpan={6}
                                        className="bg-[#F8FAFC] px-6 py-8 border-b border-[#E0E7EF] text-center animate-fade-in"
                                      >
                                        <button
                                          onClick={() => handlePrint(fatura)}
                                          className="inline-flex items-center px-4 py-2 bg-[#1c5540] text-white rounded-md font-semibold hover:bg-[#174632] transition"
                                        >
                                          Faturayı Yazdır
                                        </button>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {/* Fatura Tablosu Bitiş */}
                    </>
                  )}
                  {activeTab === "kartlarim" && (
                    <>
                      <div className="bg-white border border-[#A2ACC7] rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-bold text-[#1c5540] mb-4">
                          Kayıtlı Kartlarım
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-[#475569] mb-4 text-sm leading-relaxed">
                              Kayıtlı kartlarınızı bu alanda görüntüleyebilir ve
                              yönetebilirsiniz. Kart ekleme, silme ve güncelleme
                              işlemlerini buradan yapabilirsiniz.
                            </p>
                            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E0E7EF]">
                              <h3 className="text-[#1c5540] font-semibold mb-2 flex items-center gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Güvenlik Bilgileri
                              </h3>
                              <ul className="text-sm text-[#475569] space-y-2">
                                <li className="flex items-start gap-2">
                                  <svg
                                    className="h-5 w-5 text-[#1c5540] mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Tüm kart bilgileriniz AES-256 şifreleme ile
                                  güvenli bir şekilde saklanmaktadır.
                                </li>
                                <li className="flex items-start gap-2">
                                  <svg
                                    className="h-5 w-5 text-[#1c5540] mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Kart numaraları sadece son 4 hanesi görünecek
                                  şekilde maskelenmektedir.
                                </li>
                                <li className="flex items-start gap-2">
                                  <svg
                                    className="h-5 w-5 text-[#1c5540] mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  PCI DSS standartlarına uygun güvenlik
                                  önlemleri alınmıştır.
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E0E7EF]">
                            <h3 className="text-[#1c5540] font-semibold mb-2 flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Desteklenen Kartlar
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#E0E7EF]">
                                <RiVisaLine className="h-6" />
                                <span className="text-sm font-medium">
                                  Visa
                                </span>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#E0E7EF]">
                                <FaCcMastercard className="h-6" />
                                <span className="text-sm font-medium">
                                  Mastercard
                                </span>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#E0E7EF]">
                                <SiAmericanexpress className="h-6" />
                                <span className="text-sm font-medium">
                                  American Express
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 flex justify-between items-center">
                        <button
                          onClick={() => setShowAddCardModal(true)}
                          className="bg-[#1c5540] text-white px-6 py-2.5 rounded-md hover:bg-[#174632] transition flex items-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Yeni Kart Ekle
                        </button>
                        <div className="text-sm text-[#475569]">
                          Toplam {savedCards.length} kayıtlı kart
                        </div>
                      </div>

                      {cardLoading ? (
                        <div className="text-center py-10">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1c5540] border-t-transparent"></div>
                          <p className="mt-2 text-[#1c5540] font-semibold">
                            Kartlar yükleniyor...
                          </p>
                        </div>
                      ) : savedCards.length === 0 ? (
                        <div className="text-center py-10 bg-white border border-[#A2ACC7] rounded-xl">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-[#A2ACC7]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <p className="mt-4 text-[#1c5540] font-semibold">
                            Henüz kayıtlı kart bulunmuyor
                          </p>
                          <p className="mt-2 text-[#475569] text-sm">
                            Yeni bir kart ekleyerek başlayabilirsiniz
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {savedCards.map((card) => (
                            <div
                              key={card.id}
                              className="bg-white border border-[#A2ACC7] rounded-xl p-6 relative group hover:shadow-lg transition-shadow"
                            >
                              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditCard(card)}
                                  className="p-2 text-[#1c5540] hover:bg-[#1c5540]/10 rounded-full transition"
                                  title="Kartı Düzenle"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteCard(card.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                                  title="Kartı Sil"
                                >
                                  <FaTrash />
                                </button>
                              </div>

                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      card.card_type === "VISA"
                                        ? "bg-blue-50"
                                        : card.card_type === "MASTERCARD"
                                        ? "bg-orange-50"
                                        : "bg-green-50"
                                    }`}
                                  >
                                    <FaCreditCard
                                      className={`text-xl ${
                                        card.card_type === "VISA"
                                          ? "text-blue-600"
                                          : card.card_type === "MASTERCARD"
                                          ? "text-orange-600"
                                          : "text-green-600"
                                      }`}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[#1c5540]">
                                      {card.card_type}
                                    </p>
                                    <p className="text-sm text-[#475569]">
                                      Son 4 hane: {card.card_number.slice(-4)}
                                    </p>
                                  </div>
                                </div>
                                {card.is_default === 1 && (
                                  <span className="px-2 py-1 bg-[#1c5540]/10 text-[#1c5540] text-xs font-medium rounded-full">
                                    Varsayılan
                                  </span>
                                )}
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-[#475569] mb-1">
                                    Kart Sahibi
                                  </p>
                                  <p className="font-medium text-[#1c5540]">
                                    {card.card_holder_name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-[#475569] mb-1">
                                    Son Kullanma Tarihi
                                  </p>
                                  <p className="font-medium text-[#1c5540]">
                                    {card.expiry_month}/{card.expiry_year}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-6 pt-4 border-t border-[#E0E7EF]">
                                <button
                                  onClick={() => handleSetDefaultCard(card.id)}
                                  className={`w-full py-2 rounded-md flex items-center justify-center gap-2 transition ${
                                    card.is_default
                                      ? "bg-[#1c5540] text-white"
                                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                  }`}
                                >
                                  <FaStar
                                    className={
                                      card.is_default
                                        ? "text-yellow-300"
                                        : "text-gray-400"
                                    }
                                  />
                                  {card.is_default
                                    ? "Varsayılan Kart"
                                    : "Varsayılan Yap"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1c5540]">
                Yeni Kart Ekle
              </h3>
              <button
                onClick={() => setShowAddCardModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-lg mb-6">
              <p className="text-sm text-[#475569] flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#1c5540] mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Kart bilgileriniz güvenli bir şekilde şifrelenerek
                saklanacaktır. PCI DSS standartlarına uygun olarak
                işlenmektedir.
              </p>
            </div>

            <form onSubmit={handleAddCard}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Numarası
                  </label>
                  <input
                    type="text"
                    value={cardForm.card_number}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setCardForm({ ...cardForm, card_number: formatted });
                    }}
                    onBlur={(e) => {
                      if (
                        e.target.value &&
                        !validateCardNumber(e.target.value)
                      ) {
                        alert("Geçersiz kart numarası");
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c5540] focus:border-[#1c5540] transition tracking-wider"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Sahibi
                  </label>
                  <input
                    type="text"
                    value={cardForm.card_holder_name}
                    onChange={(e) => {
                      const formatted = formatCardHolderName(e.target.value);
                      setCardForm({
                        ...cardForm,
                        card_holder_name: formatted,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c5540] focus:border-[#1c5540] transition uppercase"
                    placeholder="AD SOYAD"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Son Kullanma Ay
                    </label>
                    <input
                      type="text"
                      value={cardForm.expiry_month}
                      onChange={(e) => {
                        const formatted = formatExpiryMonth(e.target.value);
                        setCardForm({
                          ...cardForm,
                          expiry_month: formatted,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c5540] focus:border-[#1c5540] transition text-center"
                      placeholder="MM"
                      maxLength="2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Son Kullanma Yıl
                    </label>
                    <input
                      type="text"
                      value={cardForm.expiry_year}
                      onChange={(e) => {
                        const formatted = formatExpiryYear(e.target.value);
                        setCardForm({
                          ...cardForm,
                          expiry_year: formatted,
                        });
                      }}
                      onBlur={(e) => {
                        const year = parseInt(e.target.value);
                        const currentYear = new Date().getFullYear();
                        if (year < currentYear || year > currentYear + 10) {
                          alert("Geçersiz yıl");
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c5540] focus:border-[#1c5540] transition text-center"
                      placeholder="YYYY"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Tipi
                  </label>
                  <select
                    value={cardForm.card_type}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, card_type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c5540] focus:border-[#1c5540] transition"
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                    <option value="AMEX">AMEX</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={cardForm.is_default}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, is_default: e.target.checked })
                    }
                    className="h-4 w-4 text-[#1c5540] focus:ring-[#1c5540] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_default"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Varsayılan kart olarak ayarla
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1c5540] text-white rounded-md hover:bg-[#174632] transition flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {showEditCardModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1c5540]">
                Kartı Düzenle
              </h3>
              <button
                onClick={() => {
                  setShowEditCardModal(false);
                  setSelectedCard(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-lg mb-6">
              <p className="text-sm text-[#475569] flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#1c5540] mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Kart bilgileriniz güvenli bir şekilde şifrelenerek
                saklanacaktır. PCI DSS standartlarına uygun olarak
                işlenmektedir.
              </p>
            </div>

            <form onSubmit={handleUpdateCard}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Numarası
                  </label>
                  <input
                    type="text"
                    value={cardForm.card_number}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setCardForm({ ...cardForm, card_number: formatted });
                    }}
                    onBlur={(e) => {
                      if (
                        e.target.value &&
                        !validateCardNumber(e.target.value)
                      ) {
                        alert("Geçersiz kart numarası");
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c5540] focus:border-[#1c5540] transition tracking-wider"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Sahibi
                  </label>
                  <input
                    type="text"
                    value={cardForm.card_holder_name}
                    onChange={(e) => {
                      const formatted = formatCardHolderName(e.target.value);
                      setCardForm({
                        ...cardForm,
                        card_holder_name: formatted,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c5540] focus:border-[#1c5540] transition uppercase"
                    placeholder="AD SOYAD"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Son Kullanma Ay
                    </label>
                    <input
                      type="text"
                      value={cardForm.expiry_month}
                      onChange={(e) => {
                        const formatted = formatExpiryMonth(e.target.value);
                        setCardForm({
                          ...cardForm,
                          expiry_month: formatted,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c5540] focus:border-[#1c5540] transition text-center"
                      placeholder="MM"
                      maxLength="2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Son Kullanma Yıl
                    </label>
                    <input
                      type="text"
                      value={cardForm.expiry_year}
                      onChange={(e) => {
                        const formatted = formatExpiryYear(e.target.value);
                        setCardForm({
                          ...cardForm,
                          expiry_year: formatted,
                        });
                      }}
                      onBlur={(e) => {
                        const year = parseInt(e.target.value);
                        const currentYear = new Date().getFullYear();
                        if (year < currentYear || year > currentYear + 10) {
                          alert("Geçersiz yıl");
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c5540] focus:border-[#1c5540] transition text-center"
                      placeholder="YYYY"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Tipi
                  </label>
                  <select
                    value={cardForm.card_type}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, card_type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c5540] focus:border-[#1c5540] transition"
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                    <option value="AMEX">AMEX</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default_edit"
                    checked={cardForm.is_default}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, is_default: e.target.checked })
                    }
                    className="h-4 w-4 text-[#1c5540] focus:ring-[#1c5540] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_default_edit"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Varsayılan kart olarak ayarla
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditCardModal(false);
                    setSelectedCard(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1c5540] text-white rounded-md hover:bg-[#174632] transition flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Faturalarim;
