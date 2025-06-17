import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const CV = ({ id }) => {
  const [formData, setFormData] = useState({
    ad_soyad: "",
    tc_kimlik: "",
    telefon: "",
    email: "",
    meslek: "",
    cv: null,
    cevaplar: [],
  });

  const [ayarlar, setAyarlar] = useState(null);
  const [sorular, setSorular] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [ayarlarRes, sorularRes] = await Promise.all([
          firmaService.getIsKariyerAyarlar(id),
          firmaService.getIsKariyerSorular(id),
        ]);

        console.log("Ayarlar Response:", ayarlarRes.data);
        console.log("Sorular Response:", sorularRes.data);

        if (ayarlarRes.data) {
          setAyarlar(ayarlarRes.data);
        }

        // Sadece özel soruları al (sabit olmayan sorular)
        const ozelSorular = Array.isArray(sorularRes.data)
          ? sorularRes.data.filter((s) => s.sabit === 0)
          : [];

        console.log("Özel Sorular:", ozelSorular);
        setSorular(ozelSorular);
      } catch (error) {
        console.error("Veri yüklenirken hata:", error);
        toast.error("Veriler yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Debug için soruları logla
  useEffect(() => {
    console.log("Current Sorular State:", sorular);
  }, [sorular]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Sabit sorular için cevapları güncelle
    if (
      name === "ad_soyad" ||
      name === "tc_kimlik" ||
      name === "telefon" ||
      name === "email"
    ) {
      const soruId = sorular.find((s) => {
        switch (name) {
          case "ad_soyad":
            return s.soru_metni === "Adınız Soyadınız";
          case "tc_kimlik":
            return s.soru_metni === "T.C. Kimlik Numaranız";
          case "telefon":
            return s.soru_metni === "Telefon Numaranız";
          case "email":
            return s.soru_metni === "E-Mail Adresiniz";
          default:
            return false;
        }
      })?.id;

      if (soruId) {
        const cevaplar = [...formData.cevaplar];
        const index = cevaplar.findIndex((c) => c.soru_id === soruId);
        if (index > -1) {
          cevaplar[index].cevap = value;
        } else {
          cevaplar.push({
            soru_id: soruId,
            cevap: value,
          });
        }
        setFormData((prev) => ({
          ...prev,
          cevaplar,
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB kontrol
        toast.error("Dosya boyutu 2MB'dan büyük olamaz");
        return;
      }

      const allowedTypes = [
        "text/plain",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Geçersiz dosya türü. Lütfen txt, pdf, doc, docx, xls veya xlsx dosyası yükleyin"
        );
        return;
      }

      setFormData((prev) => ({
        ...prev,
        cv: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.ad_soyad ||
      !formData.telefon ||
      !formData.email ||
      !formData.cv
    ) {
      toast.error("Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    try {
      setSubmitting(true);

      // CV dosyasını yükle
      const formDataToSend = new FormData();
      formDataToSend.append("file", formData.cv);

      const uploadResponse = await firmaService.uploadKatalog(formData.cv);
      if (!uploadResponse.data.success) {
        throw new Error("CV dosyası yüklenemedi");
      }

      const cvUrl = uploadResponse.data.url;

      // Başvuruyu gönder
      const basvuruData = {
        ad_soyad: formData.ad_soyad,
        telefon: formData.telefon,
        email: formData.email,
        tc_kimlik: formData.tc_kimlik || null,
        meslek: formData.meslek || null,
        cv: cvUrl,
        cevaplar: formData.cevaplar.map((cevap) => ({
          soru_id: cevap.soru_id,
          cevap: cevap.cevap,
        })),
      };

      const response = await firmaService.createIsKariyerBasvuru(
        id,
        basvuruData
      );

      if (response.data.success) {
        toast.success("Başvurunuz başarıyla gönderildi");
        setFormData({
          ad_soyad: "",
          tc_kimlik: "",
          telefon: "",
          email: "",
          meslek: "",
          cv: null,
          cevaplar: [],
        });
      } else {
        throw new Error(response.data.message || "Başvuru gönderilemedi");
      }
    } catch (error) {
      console.error("Başvuru gönderilirken hata:", error);
      toast.error(error.message || "Başvuru gönderilirken bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008060]"></div>
      </div>
    );
  }

  return (
    <motion.div
      key="tab-7"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="montserrat text-[#232323]"
    >
      <div className="flex justify-end montserrat">
        <p className="text-[#120A8F] font-semibold text-sm">
          Bize Katılın | İş & Kariyer
        </p>
      </div>

      <p className="font-medium text-black">
        {ayarlar?.baslik || "İş Başvurusu"}
      </p>

      <p className="mt-5 text-black">
        {ayarlar?.metin ||
          "Firmamızda açık olan pozisyonlar için başvurularınızı bu form aracılığıyla iletebilirsiniz. Sizin gibi yetenekli ve motive çalışanlarla iş birliği yapmaktan mutluluk duyarız. Başvurunuzu en kısa sürede değerlendireceğiz."}
      </p>

      <div className="py-6 max-w-4xl mx-auto mt-8">
        <p className="montserrat font-medium">İş Başvurusu Formu</p>
        <p className="text-[#232323] mt-2">
          {ayarlar?.aydinlatma_metni ||
            "Başvurular, pozisyon niteliklerine göre filtrelenerek uygun adaylar sınav ve mülakat süreçlerine davet edilmektedir. İlan dönemi dışında web üzerinden yapılan başvurular ise aday havuzunda saklanmaktadır."}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Temel Bilgiler */}
          <div className="py-2 mt-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col">
            <label
              htmlFor="ad_soyad"
              className="text-xs md:text-sm text-[#232323]"
            >
              Adınız Soyadınız
            </label>
            <input
              type="text"
              id="ad_soyad"
              name="ad_soyad"
              value={formData.ad_soyad}
              onChange={handleInputChange}
              placeholder="Adınızı ve soyadınızı giriniz"
              className="text-[#232323] font-medium outline-none mt-1"
              required
            />
          </div>

          <div className="py-2 mt-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col">
            <label
              htmlFor="tc_kimlik"
              className="text-xs md:text-sm text-[#232323]"
            >
              T.C. Kimlik Numaranız
            </label>
            <input
              type="text"
              id="tc_kimlik"
              name="tc_kimlik"
              value={formData.tc_kimlik}
              onChange={handleInputChange}
              placeholder="T.C. Kimlik Numaranız"
              className="text-[#232323] font-medium outline-none mt-1"
            />
          </div>

          <div className="py-2 mt-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col">
            <label
              htmlFor="telefon"
              className="text-xs md:text-sm text-[#232323]"
            >
              Telefon Numaranız
            </label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              value={formData.telefon}
              onChange={handleInputChange}
              placeholder="Telefon Numaranız"
              className="text-[#232323] font-medium outline-none mt-1"
              required
            />
          </div>

          <div className="py-2 mt-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col">
            <label
              htmlFor="email"
              className="text-xs md:text-sm text-[#232323]"
            >
              E-Mail Adresiniz
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="E-Mail Adresiniz"
              className="text-[#232323] font-medium outline-none mt-1"
              required
            />
          </div>

          <div className="py-2 mt-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col">
            <label
              htmlFor="meslek"
              className="text-xs md:text-sm text-[#232323]"
            >
              Mesleğiniz
            </label>
            <input
              type="text"
              id="meslek"
              name="meslek"
              value={formData.meslek}
              onChange={handleInputChange}
              placeholder="Mesleğiniz"
              className="text-[#232323] font-medium outline-none mt-1"
            />
          </div>

          {/* Özel Sorular */}
          {sorular.map((soru) => (
            <div
              key={soru.id}
              className="py-2 mt-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col"
            >
              <label
                htmlFor={`soru_${soru.id}`}
                className="text-xs md:text-sm text-[#232323]"
              >
                {soru.soru_metni}
              </label>
              <input
                type="text"
                id={`soru_${soru.id}`}
                name={`soru_${soru.id}`}
                value={
                  formData.cevaplar.find((c) => c.soru_id === soru.id)?.cevap ||
                  ""
                }
                onChange={(e) => {
                  const cevaplar = [...formData.cevaplar];
                  const index = cevaplar.findIndex(
                    (c) => c.soru_id === soru.id
                  );
                  if (index > -1) {
                    cevaplar[index].cevap = e.target.value;
                  } else {
                    cevaplar.push({
                      soru_id: soru.id,
                      cevap: e.target.value,
                    });
                  }
                  setFormData((prev) => ({
                    ...prev,
                    cevaplar,
                  }));
                }}
                placeholder={`${soru.soru_metni} için cevabınız`}
                className="text-[#232323] font-medium outline-none mt-1"
              />
            </div>
          ))}

          <div className="py-2 mt-2 px-3 md:px-5 montserrat rounded-lg border border-[#A2ACC7] flex flex-col">
            <label
              htmlFor="cv"
              className="text-xs md:text-sm text-[#232323] flex items-center gap-2"
            >
              <img
                src="/images/icons/firma-profil/icons/cvekle.svg"
                className="size-6"
              />
              CV Dosyanızı Yükleyin
            </label>
            <input
              type="file"
              id="cv"
              name="cv"
              onChange={handleFileChange}
              className="text-[#232323] font-medium outline-none mt-1"
              accept=".txt,.pdf,.doc,.docx,.xls,.xlsx"
              required
            />
            <span className="text-xs text-gray-500 mt-1">
              Maksimum: 2 MB / Dosya Türü: txt, pdf, doc, docx, xls, xlsx
            </span>
          </div>

          <div className="flex items-start mt-2 gap-1">
            <input
              type="checkbox"
              id="bilgi"
              required
              className="w-5 h-5 mt-0.5 accent-[#A2ACC7]"
            />
            <label htmlFor="bilgi" className="text-sm">
              FirmaKutusu.com tarafından yukarıda belirtmiş olduğum bilgiler
              üzerinden benimle iletişim kurulmasını ve izinli iletişim formu'nu
              onaylıyorum.
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center w-full mt-2 bg-[#1C5540] py-4 justify-center text-white rounded-lg gap-2 font-semibold disabled:opacity-50"
          >
            {submitting ? "Gönderiliyor..." : "İş Başvuru Formumu Gönder"}
            {!submitting && (
              <img src="/images/icons/firma-profil/icons/basvuruyolla.svg" />
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CV;
