import React from "react";

const Footer = () => {
  return (
    <div className="px-2 md:px-0 relative mt-20">
      <div className="container mx-auto  rounded-t-xl bg-[#1C5540] px-4 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-8 lg:py-10">
        <p className="marcellus text-2xl sm:text-3xl lg:text-4xl text-white">
          Keşfedin, Tanıtın ve Büyütün!
        </p>
        <p className="text-base sm:text-lg text-white mt-2 sm:mt-3 marcellus">
          Siz de Türkiye'nin en kapsamlı firma rehberi platformu FirmaKutusu.com
          ile işletmenizin dijital dünyada daha fazla görünürlük kazanmasını
          sağlayın. Hemen üye olun, yeni müşterilere ulaşın, markanızı tanıtın
          ve işinizi büyütme fırsatını yakalayın!
        </p>

        <div className="w-full h-0.5 mt-6 sm:mt-8 mb-6 sm:mb-8 lg:mb-12 bg-white"></div>

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 mb-6 lg:mb-0 lg:border-r lg:border-white flex justify-center lg:justify-start">
            <img src="/images/logodik.svg" alt="FirmaKutusu Logo" />
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-between flex-wrap gap-8 sm:gap-4 lg:px-6 xl:px-20 montserrat text-white">
            <div className="flex flex-col gap-2 w-full sm:w-1/2 md:w-1/3 xl:w-auto">
              <p className="font-semibold text-lg border-b border-white pb-1 sm:border-0">
                Kurumsal
              </p>
              <a href="#" className="text-sm font-semibold hover:underline">
                Hakkımızda
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Misyon & Vizyon
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Referanslarımız
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Sponsorlarımız
              </a>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-1/2 md:w-1/3 xl:w-auto">
              <p className="font-semibold text-lg border-b border-white pb-1 sm:border-0">
                Hızlı Erişim
              </p>
              <a href="#" className="text-sm font-semibold hover:underline">
                Anasayfa
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Firma Ara
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Paketler
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Sponsorluk
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Blog
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                S.S.S.
              </a>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-1/2 md:w-1/3 xl:w-auto">
              <p className="font-semibold text-lg border-b border-white pb-1 sm:border-0">
                Gizlilik & Kullanım
              </p>
              <a href="#" className="text-sm font-semibold hover:underline">
                Kullanım Koşulları
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Üyelik Sözleşmesi
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Kullanıcı Sözleşmesi
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                KVKK Aydınlatma Metni
              </a>
              <a href="#" className="text-sm font-semibold hover:underline">
                Çerez Politikası
              </a>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-1/2 md:w-1/3 xl:w-auto">
              <p className="font-semibold text-lg border-b border-white pb-1 sm:border-0">
                İletişim
              </p>
              <a href="#" className="text-sm font-semibold hover:underline">
                İletişim Formu
              </a>
              <div className="text-sm font-semibold">
                Adres:
                <p className="max-w-52 mt-1 text-sm font-light">
                  Güzelyaka Mah. 551. Sok No: 17 Batu Life Sitesi Kat: 16 Daire:
                  66 Yenimahalle / ANKARA
                </p>
                <p className="text-sm font-light mt-1">info@firmakutusu.com</p>
                <p className="text-sm font-light mt-1">+90 312 911 4332</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-0.5 mt-8 sm:mt-10 lg:mt-12 bg-white"></div>

        <p className="mt-6 sm:mt-8 text-center text-white text-xs sm:text-sm font-light montserrat">
          © 2025{" "}
          <a href="https://www.firmakutusu.com" className="underline">
            www.firmakutusu.com
          </a>{" "}
          – Heda Teknoloji Bilişim A.Ş. markasıdır. Tüm hakları saklıdır.
        </p>
      </div>
      <img
        src="/images/arrow-up.svg"
        className="top-0 hidden lg:block -translate-y-12 translate-x-1/2 absolute right-1/2"
      />
    </div>
  );
};

export default Footer;
