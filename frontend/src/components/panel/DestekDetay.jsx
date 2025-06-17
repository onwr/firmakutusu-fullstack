import React, { useState } from "react";
import { motion } from "framer-motion";

const DestekDetay = ({ ticket, onClose }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement message submission
    setMessage("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-4"
    >
      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-12 text-[#232323] gap-0.5">
        <div className="px-3 flex text-[#1C5540] justify-center py-5 text-center montserrat bg-white border border-[#CED4DA] rounded-l-xl col-span-1 font-semibold">
          {ticket.id}
        </div>
        <div className="px-3 flex text-[#1C5540] justify-center py-5 text-center montserrat bg-white border border-[#CED4DA] col-span-2 font-semibold">
          #{ticket.ticketNumber}
        </div>
        <div className="px-3 py-5 text-[#1C5540] flex flex-col text-left montserrat bg-white border border-[#CED4DA] col-span-7 font-semibold">
          {ticket.subject}

          {ticket.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mt-4 max-w-2xl items-center gap-3 ${
                msg.isAdmin ? "bg-[#01A4BD]/10" : "bg-[#F6F6F7]"
              } rounded-lg p-4 ${msg.isAdmin ? "" : "ml-auto"}`}
            >
              <img
                src={
                  msg.isAdmin
                    ? "/images/icons/firma-profil/firma-logo.svg"
                    : "/images/icons/profil.svg"
                }
                className="w-16"
                alt={msg.isAdmin ? "admin" : "user"}
              />
              <p className="text-xs">{msg.content}</p>
            </div>
          ))}

          <form
            onSubmit={handleSubmit}
            className="flex mt-2 max-w-2xl w-full ml-auto items-center gap-3 bg-[#F6F6F7] rounded-lg p-4"
          >
            <img src="/images/icons/profil.svg" className="w-16" alt="user" />
            <div className="flex w-full flex-col gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border montserrat border-dashed max-h-36 min-h-20 border-[#A2ACC7] p-4 text-[#1C5540] text-sm rounded-lg outline-none"
                placeholder="Mesajınızı giriniz"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="flex items-center gap-0.5 montserrat text-xs text-[#1C5540]"
                  >
                    <img src="/images/dosya-ekle.svg" alt="file" />
                    Dosya Ekle
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-0.5 montserrat text-xs text-[#1C5540]"
                  >
                    <img src="/images/resim-ekle.svg" alt="image" />
                    Resim Ekle
                  </button>
                </div>
                <p className="montserrat text-xs text-[#1C5540]">
                  Göndermek için enter tuşuna bas
                </p>
              </div>
            </div>
          </form>
        </div>
        <div className="px-3 py-5 text-center flex rounded-r-xl justify-center montserrat bg-white border border-[#CED4DA] col-span-2 font-semibold">
          <img
            src="/images/arrow-dark.svg"
            className="size-8 rotate-180 cursor-pointer"
            onClick={onClose}
            alt="close"
          />
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden bg-white rounded-xl border border-[#CED4DA] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#1C5540] font-semibold">
              #{ticket.ticketNumber}
            </span>
            <span className="text-xs text-gray-500">S.No: {ticket.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <img
              src="/images/arrow-dark.svg"
              className="size-6 rotate-180"
              alt="close"
            />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-[#1C5540] font-semibold mb-2">Konu</h3>
          <p className="text-sm text-gray-700">{ticket.subject}</p>
        </div>

        <div className="space-y-4">
          {ticket.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.isAdmin ? "bg-[#01A4BD]/10" : "bg-[#F6F6F7]"
              } rounded-lg p-3 ${msg.isAdmin ? "" : "ml-auto"}`}
            >
              <img
                src={
                  msg.isAdmin
                    ? "/images/icons/firma-profil/firma-logo.svg"
                    : "/images/icons/profil.svg"
                }
                className="w-10 h-10 rounded-full"
                alt={msg.isAdmin ? "admin" : "user"}
              />
              <div className="flex-1">
                <p className="text-xs text-gray-700">{msg.content}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date().toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-[#F6F6F7] rounded-lg p-3"
        >
          <div className="flex items-start gap-3">
            <img
              src="/images/icons/profil.svg"
              className="w-10 h-10 rounded-full"
              alt="user"
            />
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border montserrat border-dashed min-h-20 border-[#A2ACC7] p-3 text-[#1C5540] text-sm rounded-lg outline-none"
                placeholder="Mesajınızı giriniz"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-1 montserrat text-xs text-[#1C5540]"
                  >
                    <img
                      src="/images/dosya-ekle.svg"
                      className="w-4 h-4"
                      alt="file"
                    />
                    <span className="hidden sm:inline">Dosya Ekle</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 montserrat text-xs text-[#1C5540]"
                  >
                    <img
                      src="/images/resim-ekle.svg"
                      className="w-4 h-4"
                      alt="image"
                    />
                    <span className="hidden sm:inline">Resim Ekle</span>
                  </button>
                </div>
                <p className="montserrat text-xs text-[#1C5540] hidden sm:block">
                  Göndermek için enter tuşuna bas
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default DestekDetay;
