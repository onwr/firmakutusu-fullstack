import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";

const FirmaBilgileri = ({ id }) => {
  const [firma, setFirma] = useState(null);
  const [faaliyetAlanlari, setFaaliyetAlanlari] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [firmaResponse, faaliyetResponse] = await Promise.all([
          firmaService.getFirmaById(id),
          firmaService.getFaaliyetAlanlari(id),
        ]);

        if (firmaResponse.data.success) {
          setFirma(firmaResponse.data.data);
        } else {
          toast.error(
            firmaResponse.data.message || "Firma bilgileri alınamadı"
          );
        }

        if (faaliyetResponse.data.success) {
          setFaaliyetAlanlari(faaliyetResponse.data.data);
        } else {
          toast.error(
            faaliyetResponse.data.message || "Faaliyet alanları alınamadı"
          );
        }
      } catch (error) {
        console.error("Veri yüklenirken hata:", error);
        toast.error("Veriler yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Belirtilmemiş";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008060]"></div>
      </div>
    );
  }

  if (!firma) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">
          Firma bilgileri yüklenemedi
        </h2>
        <p className="text-gray-500 mt-2">Lütfen daha sonra tekrar deneyiniz</p>
      </div>
    );
  }

  return (
    <motion.div
      key="tab-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="montserrat px-4 lg:px-0"
    >
      <div className="flex justify-end">
        <p className="text-[#120A8F] font-semibold text-xs sm:text-sm">
          Resmi Firma Bilgilerimiz
        </p>
      </div>

      <p className="font-medium text-base sm:text-lg">
        Resmi Firma Bilgilerimiz
      </p>
      <p className="my-3 text-sm sm:text-base">
        Ürün ve hizmetlerimizle ilgili detaylı bilgi almak için kataloğumuzu
        inceleyebilirsiniz. Size en uygun çözümleri keşfetmek için kataloğumuza
        göz atın.
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Firma Unvanı
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.firma_unvani}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Marka Adı
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.marka_adi}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Hizmet Sektörü
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.sektor}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <>
            <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
              Faaliyet Alanı
            </p>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="border w-32 sm:w-40 border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-center">
                      Faaliyet Türü
                    </th>
                    <th className="border border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-left">
                      Faaliyet Alanı
                    </th>
                    <th className="border w-32 sm:w-40 border-[#A2ACC7] bg-[#F1EEE6] text-[#232323] p-2 text-xs sm:text-sm text-center">
                      NACE Kodu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {faaliyetAlanlari.map((faaliyet, index) => (
                    <tr key={index}>
                      <td className="border border-[#A2ACC7] p-2 text-xs sm:text-sm">
                        {faaliyet.tur}
                      </td>
                      <td className="border border-[#A2ACC7] p-2 text-xs sm:text-sm">
                        {faaliyet.alan}
                      </td>
                      <td className="border border-[#A2ACC7] p-2 text-xs sm:text-sm text-center">
                        {faaliyet.nace_kodu}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Faaliyet Durumu
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.faaliyet_durumu}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Kuruluş Tarihi
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {formatDate(firma.kurulus_tarihi)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Kuruluş Şehri
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.kurulus_sehri}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Vergi Kimlik Numarası
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.vergi_no}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Vergi Dairesi Adı
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.vergi_dairesi}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            MERSİS No
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.mersis_no}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            E-Fatura Kullanımı
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.e_fatura ? "Evet" : "Hayır"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            E-Arşiv Kullanımı
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.e_arsiv ? "Evet" : "Hayır"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            E-İrsaliye Kullanımı
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.e_irsaliye ? "Evet" : "Hayır"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            E-Defter Kullanımı
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.e_defter ? "Evet" : "Hayır"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Merkez Adresi
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl break-words">
            {firma.merkez_adresi}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            KEP Adresi
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.kep_adresi || "Mevcut Değil"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            E-Posta Adresi
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.eposta}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Resmi Web Adresi
          </p>
          <p className="text-[#120A8F] w-full text-base sm:text-xl">
            {firma.web_adresi}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            İletişim Telefonu
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.iletisim_telefonu}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Fax Numarası
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.fax || "Mevcut Değil"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Banka IBAN Numarası
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.iban}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between">
          <p className="text-[#232323] font-medium w-full sm:w-1/3 text-base sm:text-xl">
            Banka Adı
          </p>
          <p className="text-[#232323] w-full text-base sm:text-xl">
            {firma.banka_adi}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FirmaBilgileri;
