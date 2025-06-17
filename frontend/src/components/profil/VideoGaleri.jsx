import React from "react";

const VGaleri = ({ setTab }) => {
  return (
    <div className="px-8 h-fit montserrat py-10 montserrat border border-[#A2ACC7] outline-none rounded-xl flex flex-col gap-1 cursor-pointer mt-5">
      <div onClick={() => setTab(9)} className="flex items-center gap-2">
        <img src="/images/icons/firma-profil/icons/video.svg" />
        <p className="text-[#01A4BD] font-semibold">Video Galerimiz</p>
      </div>

      <div className="grid mt-2 grid-cols-4 lg:grid-cols-3 gap-2">
        <img
          src="/images/icons/firma-profil/icons/ornek-video.svg"
          className="size-20"
        />
        <img
          src="/images/icons/firma-profil/icons/ornek-video.svg"
          className="size-20"
        />
        <img
          src="/images/icons/firma-profil/icons/ornek-video.svg"
          className="size-20"
        />
        <img
          src="/images/icons/firma-profil/icons/ornek-video.svg"
          className="size-20"
        />
        <img
          src="/images/icons/firma-profil/icons/ornek-video.svg"
          className="size-20"
        />
      </div>
    </div>
  );
};

export default VGaleri;
