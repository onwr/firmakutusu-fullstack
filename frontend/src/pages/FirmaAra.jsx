import React from "react";
import Header from "../components/Header";
import FirmaFiltre from "../components/firma-ara/FirmaFiltre";
import Firmalar from "../components/firma-ara/Firmalar";
import Footer from "../components/Footer";
const FirmaAra = () => {
  return (
    <div>
      <Header />
      <div className="px-2 md:px-0">
        <div className="container mt-5 md:mt-10 mx-auto bg-[#CED4DA] rounded-lg py-3 px-6">
          <h1 className="marcellus md:text-left text-center">Firma Ara</h1>
        </div>

        <div className="container gap-5 mx-auto mt-10 flex lg:flex-row px-2 md:px-0 flex-col">
          <div className="w-full lg:w-1/4">
            <FirmaFiltre />
          </div>
          <div className="w-full">
            <Firmalar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FirmaAra;
