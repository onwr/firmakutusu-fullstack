import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { firmaService } from "../../services/api";
import { toast } from "sonner";
import Firmalar from "../../components/firma-ara/Firmalar";

const FirmaAra = () => {
  const [searchParams] = useSearchParams();
  const [firmalar, setFirmalar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFirmalar = async () => {
      try {
        setIsLoading(true);
        const params = {
          sektor: searchParams.get("sektor"),
          il: searchParams.get("il"),
          ilce: searchParams.get("ilce"),
          keyword: searchParams.get("keyword"),
        };

        const response = await firmaService.searchFirmalar(params);
        console.log("API Response:2", response.data); // Debug için

        if (response.data.success) {
          setFirmalar(response.data.data);
        } else {
          setFirmalar([]);
          toast.error(
            response.data.message || "Firma arama sırasında bir hata oluştu"
          );
        }
      } catch (error) {
        console.error("Firma arama hatası:", error);
        toast.error("Firma arama sırasında bir hata oluştu");
        setFirmalar([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFirmalar();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Arama Sonuçları</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008060]"></div>
        </div>
      ) : firmalar && firmalar.length > 0 ? (
        <Firmalar firmalar={firmalar} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700">
            Aradığınız filtrelere uygun firma bulunamadı
          </h2>
          <p className="text-gray-500 mt-2">
            Lütfen farklı arama kriterleri deneyiniz
          </p>
        </div>
      )}
    </div>
  );
};

export default FirmaAra;
