import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { firmaService } from "../../../services/api";
import { toast } from "sonner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const UrunHizmet = ({ id }) => {
  const [urunler, setUrunler] = useState([]);
  const [ayarlar, setAyarlar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [urunlerResponse, ayarlarResponse] = await Promise.all([
          firmaService.getUrunler(id),
          firmaService.getUrunHizmetAyarlari(id),
        ]);

        console.log("Ürünler Response:", urunlerResponse.data);
        console.log("Ayarlar Response:", ayarlarResponse.data);

        setUrunler(
          Array.isArray(urunlerResponse.data) ? urunlerResponse.data : []
        );
        setAyarlar(ayarlarResponse.data);
      } catch (error) {
        console.error("Veri yüklenirken hata:", error);
        toast.error("Veriler yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const next = () => {
    sliderRef.current?.slickNext();
  };

  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008060]"></div>
      </div>
    );
  }

  if (!urunler.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">
          Henüz ürün veya hizmet bulunmamaktadır
        </h2>
        <p className="text-gray-500 mt-2">
          Lütfen daha sonra tekrar kontrol ediniz
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key="tab-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="montserrat"
    >
      <div className="flex justify-end montserrat">
        <p className="text-[#120A8F] font-semibold text-sm">
          Ürün & Hizmetlerimiz
        </p>
      </div>
      <p className="font-medium">
        {ayarlar?.baslik || "Ürün ve Hizmet Kataloglarımız"}
      </p>
      <p className="mt-5">
        {ayarlar?.metin ||
          "Ürün ve hizmetlerimizle ilgili detaylı bilgi almak için kataloğumuzu inceleyebilirsiniz. Size en uygun çözümleri keşfetmek için kataloğumuza göz atın."}
      </p>
      <div className="mt-10 flex items-center justify-between">
        <button onClick={previous} className="focus:outline-none">
          <img
            src="/images/icons/firma-profil/icons/arrow.svg"
            className="w-6 h-6"
            alt="Önceki"
          />
        </button>
        <Slider ref={sliderRef} {...settings} className="w-64 lg:w-[90vh]">
          {urunler.map((urun, index) => (
            <div key={index} className="px-2">
              <div className="bg-[#51596C] rounded-xl p-4">
                <p className="montserrat font-semibold text-white">
                  {urun.belge_adi}
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Geçerlilik:{" "}
                  {new Date(urun.gecerlilik_baslangic).toLocaleDateString(
                    "tr-TR"
                  )}{" "}
                  -{" "}
                  {new Date(urun.gecerlilik_bitis).toLocaleDateString("tr-TR")}
                </p>
                <div className="flex gap-5 mt-4">
                  {urun.pdf_url && (
                    <>
                      <button
                        onClick={() => window.open(urun.pdf_url, "_blank")}
                        className="flex justify-center text-white text-sm items-center gap-2 w-full py-2 border border-white rounded-[4px]"
                      >
                        <img
                          src="/images/icons/firma-profil/icons/goster.svg"
                          alt="Göster"
                        />
                        Göster
                      </button>
                      <button
                        onClick={() => window.open(urun.pdf_url, "_blank")}
                        className="flex justify-center text-white text-sm items-center gap-2 w-full py-2 border border-white rounded-[4px]"
                      >
                        <img
                          src="/images/icons/firma-profil/icons/download.svg"
                          alt="İndir"
                        />
                        İndir
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
        <button onClick={next} className="focus:outline-none">
          <img
            src="/images/icons/firma-profil/icons/arrow.svg"
            className="w-6 h-6 rotate-180"
            alt="Sonraki"
          />
        </button>
      </div>
    </motion.div>
  );
};

export default UrunHizmet;
