import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/firma-profil/Hero";
import FirmaBilgiHero from "../components/firma-profil/FirmaBilgiHero";
import FirmaContent from "../components/firma-profil/FirmaContent";

const FirmaProfil = () => {
  const { id } = useParams();

  return (
    <div>
      <Header />
      <div className="container mx-auto mt-8 px-2 md:px-0">
        <div className="flex flex-col border border-[#A2ACC7] rounded-2xl">
          <Hero id={id} />
          <FirmaBilgiHero id={id} />
        </div>
        <div>
          <FirmaContent id={id} />
        </div>
      </div>
    </div>
  );
};

export default FirmaProfil;
