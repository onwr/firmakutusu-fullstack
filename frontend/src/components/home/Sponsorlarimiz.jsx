import React from "react";

const Sponsorlarimiz = () => {
  return (
    <div className="mt-8 md:mt-14 px-2 md:px-0 container mx-auto">
      <img
        src="/images/icons/sponsorhero.svg"
        className="w-full hidden md:block"
      />
      <div className="flex md:flex-row flex-col-reverse mt-8">
        <div className="w-full flex md:block flex-col items-center">
          <p className="marcellus text-4xl lg:text-7xl text-[#1C5540]">
            Sponsorlarımız
          </p>
          <p className="allison text-3xl md:text-6xl text-[#8B8138] mt-4 lg:mt-10">
            Hızla Büyümeye Devam Ediyoruz.
          </p>
          <p className="montserrat text-center md:text-left text-lg md:text-xl mt-5">
            Firmakutusu olarak, büyümemize ve gelişimimize katkı sağlayan
            değerli sponsorlarımıza teşekkür ederiz. İş dünyasını dijitalde daha
            görünür kılmak için çıktığımız bu yolda, sizlerin desteğiyle daha
            güçlü ilerliyoruz.
          </p>
          <p className="montserrat text-center md:text-left text-lg md:text-xl mt-5">
            Siz de sponsorlarımız arasında yer almak ve markanızı geniş
            kitlelere duyurmak isterseniz, bizimle iletişime geçebilirsiniz.
          </p>
          <p className="montserrat text-center md:text-left text-lg md:text-xl font-medium mt-3">
            Birlikte daha güçlü!
          </p>
        </div>
        <div className="w-full">
          <img
            src="/images/icons/sponsor-img.svg"
            className="mx-auto md:ml-auto w-80 md:w-auto"
          />
        </div>
      </div>
      <div className="flex items-center px-5 md:px-0 justify-center mt-2">
        <button className="cursor-pointer duration-300 hover:scale-105">
          <img src="/images/icons/buttons/sponsor-btn.svg" />
        </button>
      </div>
    </div>
  );
};

export default Sponsorlarimiz;
