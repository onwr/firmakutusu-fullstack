import React from "react";

const Bilgi = () => {
  return (
    <div className="container px-2 md:px-0 mx-auto mt-8 md:mt-14">
      <img src="/images/icons/bilgi.svg" className="w-full hidden md:block" />
      <div className="flex md:flex-row flex-col items-start mt-5">
        <div className="w-full">
          <img
            src="/images/icons/bilgihero.svg"
            className="w-80 md:w-auto mx-auto md:mx-0"
          />
        </div>
        <div className="w-full mt-5 md:mt-0">
          <p className="marcellus text-5xl text-center md:text-left md:text-8xl text-[#1C5540] flex md:flex-row flex-col md:items-end gap-1">
            Firma Kutusu <span className="text-3xl">Nedir?</span>
          </p>
          <p className="montserrat text-center md:text-left font-medium text-2xl mt-3 md:mt-5">
            En iyi iş deneyimini yaşamanız için buradayız!
          </p>
          <p className="montserrat text-center md:text-left text-xl mt-3">
            Aradığınız firmalara anında ulaşın. Firma Kutusu, size kapsamlı bir
            firma rehberi sunmanın yanı sıra, işletmenizin de bu rehberde yer
            almasını sağlar.
          </p>
          <p className="text-xl montserrat text-center md:text-left mt-3">
            Kullanıcı dostu arama özelliklerimiz sayesinde, sektör veya konum
            bilgisi girerek ya da firma unvanı, vergi numarası veya NACE kodu
            ile detaylı filtreleme yapabilirsiniz.
          </p>
          <p className="text-xl montserrat text-center md:text-left mt-3">
            Zengin içerikli firma sayfaları sayesinde, işletmeler hakkında en
            güncel bilgilere kolayca ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bilgi;
