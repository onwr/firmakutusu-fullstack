import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SSS = ({ home, about }) => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const questions = [
    {
      id: 1,
      number: "01",
      question: "Firma Kutusu nedir?",
      answer:
        "Firma Kutusu, Türkiye'deki tüm firmaların bir arada bulunduğu, kullanıcıların firma bilgilerine kolayca ulaşabildiği kapsamlı bir firma rehberi platformudur.",
    },
  ];

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="mt-8 md:mt-10 container mx-auto px-2 md:px-0">
      {home && (
        <img
          src="/images/icons/sss.svg"
          className="w-full hidden md:block"
          alt="Sıkça Sorulan Sorular"
        />
      )}

      {about && (
        <p className="mt-2 md:mt-8 text-center montserrat md:text-left text-[#232323] text-lg md:text-xl">
          Platformumuzu nasıl kullanacağınızı öğrenmek ve tüm özellikleri
          keşfetmek için tanıtım videolarımızı izleyin.
        </p>
      )}

      <div className="flex flex-col mt-5 gap-2">
        {questions.map((item) => (
          <div
            key={item.id}
            className={`${
              openQuestion === item.id ? "bg-[#F1EEE6]" : ""
            } group py-6 montserrat text-[#232323] rounded-2xl border border-[#CED4DA] px-5`}
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleQuestion(item.id)}
            >
              <div className="flex items-center gap-5">
                <p className="font-extrabold text-xl">{item.number}</p>
                <p className="text-xl font-extrabold">{item.question}</p>
              </div>
              <motion.img
                src="/images/icons/buttons/sss-down.svg"
                animate={{ rotate: openQuestion === item.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                alt=""
              />
            </div>
            <AnimatePresence>
              {openQuestion === item.id && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  {item.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SSS;
