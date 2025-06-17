import React from "react";
import Header from "../components/Header";
import Hero from "../components/home/Hero";
import HeroSponsor from "../components/home/HeroSponsor";
import FirmaVitrin from "../components/home/FirmaVitrin";
import Bilgi from "../components/home/Bilgi";
import Sponsorlarimiz from "../components/home/Sponsorlarimiz";
import SSS from "../components/home/SSS";
import Medya from "../components/home/Medya";
import Blog from "../components/home/Blog";
import Destek from "../components/home/Destek";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <HeroSponsor />
      <FirmaVitrin />
      <Bilgi />
      <Sponsorlarimiz />
      <SSS home={true} />
      <Medya />
      <Blog />
      <Destek home={true} />
      <Footer />
    </div>
  );
};

export default Home;
