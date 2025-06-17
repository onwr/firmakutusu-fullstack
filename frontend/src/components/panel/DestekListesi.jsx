import React, { useState } from "react";
import { motion } from "framer-motion";

const DestekListesi = ({
  tickets = [],
  onTicketClick,
  onCreateTicket,
  loading,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newTicketSubject, setNewTicketSubject] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    if (!ticket) return false;

    const subject = ticket.subject || "";
    const ticketNumber = ticket.ticketNumber || "";

    return (
      subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (newTicketSubject.trim()) {
      onCreateTicket(newTicketSubject.trim());
      setNewTicketSubject("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Destek taleplerinde ara..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <form
          onSubmit={handleCreateTicket}
          className="w-full md:w-1/2 flex gap-2"
        >
          <input
            type="text"
            placeholder="Yeni destek talebi konusu..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTicketSubject}
            onChange={(e) => setNewTicketSubject(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Oluştur
          </button>
        </form>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          {searchTerm
            ? "Arama sonucu bulunamadı"
            : "Henüz destek talebi bulunmuyor"}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onTicketClick(ticket)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {ticket.subject || "Konu belirtilmemiş"}
                  </h3>
                  <p className="text-gray-500">
                    Talep No: {ticket.ticketNumber || "Belirtilmemiş"}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    ticket.status === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ticket.status === "open" ? "Açık" : "Kapalı"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestekListesi;
