import React from "react";

const Galeri = ({ setTab }) => {
  return (
    <div className="px-8 h-fit montserrat py-10 montserrat border border-[#A2ACC7] outline-none rounded-xl flex flex-col gap-1 cursor-pointer mt-5">
      <button onClick={() => setTab(8)} className="flex items-center gap-2">
        <img src="/images/icons/firma-profil/icons/resim.svg" />
        <p className="text-[#01A4BD] font-semibold">Resim Galerimiz</p>
      </button>

      <div className="mt-3 flex items-center gap-2">
        <img src="/images/icons/firma-profil/icons/ornek-resim.svg" />
        <img src="/images/icons/firma-profil/icons/ornek-resim.svg" />
      </div>

      <div className="grid mt-2 grid-cols-4 lg:grid-cols-3 gap-2">
        <img
          src="/images/icons/firma-profil/icons/ornek-resim.svg"
          className="size-20"
        />
        <img
          src="/images/icons/firma-profil/icons/ornek-resim.svg"
          className="size-20"
        />
        <img
          src="/images/icons/firma-profil/icons/ornek-resim.svg"
          className="size-20"
        />
        <img
          src="/images/icons/firma-profil/icons/ornek-resim.svg"
          className="size-20"
        />
        <img
          src="/images/icons/firma-profil/icons/ornek-resim.svg"
          className="size-20"
        />
      </div>
    </div>
  );
};

export default Galeri;
