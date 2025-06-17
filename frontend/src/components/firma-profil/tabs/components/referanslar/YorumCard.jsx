import React from "react";

const YorumCard = () => {
  return (
    <div className="py-6 px-4 flex flex-col text-[#232323] items-center justify-center rounded-[10px] border gap-2 border-[#A2ACC7]">
      <p className="montserrat font-semibold">Ali ATALAN</p>
      <div className="flex flow-row gap-1 items-center">
        <img src="/images/icons/firma-profil/star-sari.svg" alt="" />
        <img src="/images/icons/firma-profil/star-sari.svg" alt="" />
        <img src="/images/icons/firma-profil/star-sari.svg" alt="" />
        <img src="/images/icons/firma-profil/star-sari.svg" alt="" />
        <img src="/images/icons/firma-profil/star-bos.svg" alt="" />
      </div>
      <p className="montserrat text-sm">29.10.2024</p>
      <p className="text-sm montserrat text-[#232323] text-center">
        Firmanızla çalışmak bizim için gerçekten harika bir deneyim oldu.
        Profesyonel ekibiniz ve müşteri odaklı yaklaşımınız sayesinde tüm süreç
        sorunsuz ilerledi. Aldığımız hizmetten son derece memnunuz ve kesinlikle
        tavsiye ederiz
      </p>
    </div>
  );
};

export default YorumCard;
