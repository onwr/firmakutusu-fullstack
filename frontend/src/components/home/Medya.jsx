import React from "react";

const Medya = () => {
  return (
    <div className="mt-6 md:mt-14  montserrat px-2 md:px-0 container mx-auto">
      <img src="/images/icons/medya.svg" className="w-full md:block hidden" />
      <p className="marcellus text-center text-4xl text-[#1C5540] block md:hidden">
        MEDYA
      </p>
      <p className="mt-2 md:mt-8 text-center md:text-left text-[#232323] text-lg md:text-xl">
        Platformumuzu nasıl kullanacağınızı öğrenmek ve tüm özellikleri
        keşfetmek için tanıtım videolarımızı izleyin.
      </p>
      <div className="grid mt-5 md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-5">
        <div>
          <img src="/images/icons/video.jpg" className="rounded-t-2xl w-full" />
          <p className="flex items-center quicksand text-xl font-semibold rounded-b-2xl justify-center text-white gap-2 p-4 bg-[#51596C]">
            <img src="/images/icons/buttons/play.svg" />
            Nasıl Üye Olurum Vidomuzu İzleyin
          </p>
        </div>
      </div>
    </div>
  );
};

export default Medya;
