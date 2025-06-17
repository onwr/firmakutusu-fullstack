import React from "react";
import { motion } from "framer-motion";
import Galeri from "./Galeri";
import Video from "./VideoGaleri";

const BilgiSidebar = ({ tab, setTab }) => {
  return (
    <div className="w-full lg:w-auto">
      <div className="px-4 lg:px-8 py-6 lg:py-10 montserrat border border-[#A2ACC7] outline-none rounded-xl flex flex-col gap-4 cursor-pointer">
        <motion.button
          onClick={() => setTab(0)}
          className="flex items-center group gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={
              tab === 0
                ? "/images/icons/firma-profil/icons/firmabilgi-mavi.svg"
                : "/images/icons/firma-profil/icons/firma-bilgi.svg"
            }
            className="w-5 lg:w-auto"
            alt=""
          />
          <p
            className={`font-semibold mt-1 text-sm lg:text-base ${
              tab === 0 ? "text-[#120A8F]" : "text-[#01A4BD]"
            } group-hover:text-[#120A8F]/80 cursor-pointer duration-300`}
          >
            Resmi Firma Bilgilerimiz
          </p>
        </motion.button>

        <motion.button
          onClick={() => setTab(1)}
          className="flex items-center group gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={
              tab === 1
                ? "/images/icons/firma-profil/icons/hakkinda-mavi.svg"
                : "/images/icons/firma-profil/icons/hakkinda.svg"
            }
            className="w-5 lg:w-auto"
            alt=""
          />
          <p
            className={`font-semibold mt-1 text-sm lg:text-base ${
              tab === 1 ? "text-[#120A8F]" : "text-[#01A4BD]"
            } group-hover:text-[#120A8F]/80 cursor-pointer duration-300`}
          >
            Hakkımızda
          </p>
        </motion.button>

        <motion.button
          onClick={() => setTab(2)}
          className="flex items-center group gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={
              tab === 2
                ? "/images/icons/firma-profil/icons/products-mavi.svg"
                : "/images/icons/firma-profil/icons/products.svg"
            }
            className="w-5 lg:w-auto"
            alt=""
          />
          <p
            className={`font-semibold mt-1 text-sm lg:text-base ${
              tab === 2 ? "text-[#120A8F]" : "text-[#01A4BD]"
            } group-hover:text-[#120A8F]/80 cursor-pointer duration-300`}
          >
            Ürün & Hizmetlerimiz
          </p>
        </motion.button>

        <motion.button
          onClick={() => setTab(3)}
          className="flex items-center group gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={
              tab === 3
                ? "/images/icons/firma-profil/icons/sube-mavi.svg"
                : "/images/icons/firma-profil/icons/sube.svg"
            }
            className="w-5 lg:w-auto"
            alt=""
          />
          <p
            className={`font-semibold mt-1 text-sm lg:text-base ${
              tab === 3 ? "text-[#120A8F]" : "text-[#01A4BD]"
            } group-hover:text-[#120A8F]/80 cursor-pointer duration-300`}
          >
            Şubelerimiz
          </p>
        </motion.button>

        <motion.button
          onClick={() => setTab(4)}
          className="flex items-center group gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={
              tab === 4
                ? "/images/icons/firma-profil/icons/kalite-belge-mavi.svg"
                : "/images/icons/firma-profil/icons/kalite-belge.svg"
            }
            className="w-5 lg:w-auto"
            alt=""
          />
          <p
            className={`font-semibold mt-1 text-sm lg:text-base ${
              tab === 4 ? "text-[#120A8F]" : "text-[#01A4BD]"
            } group-hover:text-[#120A8F]/80 cursor-pointer duration-300`}
          >
            Kalite Belgelerimiz
          </p>
        </motion.button>

        <motion.button
          onClick={() => setTab(5)}
          className="flex items-center group gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={
              tab === 5
                ? "/images/icons/firma-profil/icons/referans-mavi.svg"
                : "/images/icons/firma-profil/icons/referans.svg"
            }
            className="w-5 lg:w-auto"
            alt=""
          />
          <p
            className={`font-semibold mt-1 text-sm lg:text-base ${
              tab === 5 ? "text-[#120A8F]" : "text-[#01A4BD]"
            } group-hover:text-[#120A8F]/80 cursor-pointer duration-300`}
          >
            Referanslarımız
          </p>
        </motion.button>

        <motion.button
          onClick={() => setTab(6)}
          className="flex items-center group gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={
              tab === 6
                ? "/images/icons/firma-profil/icons/kampanya-mavi.svg"
                : "/images/icons/firma-profil/icons/kampanya.svg"
            }
            className="w-5 lg:w-auto"
            alt=""
          />
          <p
            className={`font-semibold mt-1 text-sm lg:text-base ${
              tab === 6 ? "text-[#120A8F]" : "text-[#01A4BD]"
            } group-hover:text-[#120A8F]/80 cursor-pointer duration-300`}
          >
            Kampanyalarımız
          </p>
        </motion.button>

        <motion.button
          onClick={() => setTab(7)}
          className="flex items-center group gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={
              tab === 7
                ? "/images/icons/firma-profil/icons/cv.svg"
                : "/images/icons/firma-profil/icons/cv.svg"
            }
            className="w-5 lg:w-auto"
            alt=""
          />
          <p
            className={`font-semibold mt-1 text-sm lg:text-base ${
              tab === 7 ? "text-[#120A8F]" : "text-[#01A4BD]"
            } group-hover:text-[#120A8F]/80 cursor-pointer duration-300`}
          >
            Bize Katılın | İş & Kariyer
          </p>
        </motion.button>

        <motion.button
          onClick={() => setTab(8)}
          className="flex items-center group gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={
              tab === 8
                ? "/images/icons/firma-profil/icons/resim.svg"
                : "/images/icons/firma-profil/icons/resim.svg"
            }
            className="w-5 lg:w-auto"
            alt=""
          />
          <p
            className={`font-semibold mt-1 text-sm lg:text-base ${
              tab === 8 ? "text-[#120A8F]" : "text-[#01A4BD]"
            } group-hover:text-[#120A8F]/80 cursor-pointer duration-300`}
          >
            Resim Galerimiz
          </p>
        </motion.button>

        <motion.button
          onClick={() => setTab(9)}
          className="flex items-center group gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={
              tab === 9
                ? "/images/icons/firma-profil/icons/video.svg"
                : "/images/icons/firma-profil/icons/video.svg"
            }
            className="w-5 lg:w-auto"
            alt=""
          />
          <p
            className={`font-semibold mt-1 text-sm lg:text-base ${
              tab === 9 ? "text-[#120A8F]" : "text-[#01A4BD]"
            } group-hover:text-[#120A8F]/80 cursor-pointer duration-300`}
          >
            Video Galerimiz
          </p>
        </motion.button>
      </div>
    </div>
  );
};

export default BilgiSidebar;
