import React from 'react';
import { X, MapPin, Calendar, CheckCircle } from 'lucide-react';

const TicketModal = ({ isOpen, onClose, tickets }) => {
    if (!isOpen) return null;

    // Егер билет жоқ болса
    if (!tickets || tickets.length === 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
                    <h3 className="text-white font-bold text-xl mb-4">Билет жоқ 😢</h3>
                    <button onClick={onClose} className="text-[#CCFF00]">Жабу</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-md">

                {/* Жабу кнопкасы */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition"
                >
                    <X size={24} />
                </button>

                <h2 className="text-white text-2xl font-black italic mb-6 text-center">MY TICKETS</h2>

                <div className="space-y-6">
                    {tickets.map((ticket, index) => (
                        <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(204,255,0,0.2)] relative">

                            {/* Билеттің жоғарғы бөлігі (Event Info) */}
                            <div className="bg-gray-900 p-6 text-white relative border-b-2 border-dashed border-gray-600">
                                {/* Шетіндегі дөңгелек ойықтар (дизайн үшін) */}
                                <div className="absolute -left-3 bottom-[-12px] w-6 h-6 bg-black rounded-full"></div>
                                <div className="absolute -right-3 bottom-[-12px] w-6 h-6 bg-black rounded-full"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-[#CCFF00] text-black text-xs font-black px-2 py-1 rounded">TICKET #{ticket.id || '001'}</span>
                                    <CheckCircle className="text-[#CCFF00]" size={20} />
                                </div>

                                <h3 className="text-2xl font-black leading-none mb-4 uppercase">
                                    {ticket.event ? ticket.event.title : "Neon Party Event"}
                                </h3>

                                <div className="space-y-2 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-[#CCFF00]"/>
                                        <span>
                                            {ticket.event && ticket.event.eventDate
                                                ? new Date(ticket.event.eventDate).toLocaleString()
                                                : "25 June 2026 • 20:00"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-[#CCFF00]"/>
                                        <span>{ticket.event ? ticket.event.location : "Almaty Arena"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Билеттің төменгі бөлігі (QR Code) */}
                            <div className="bg-white p-6 flex flex-col items-center justify-center">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Scan this code at entrance</p>

                                {/* Автоматты QR код (Google Chart API немесе басқа API) */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode || 'test'}`}
                                    alt="QR Code"
                                    className="w-40 h-40 mix-blend-multiply"
                                />

                                <p className="text-black font-mono text-xs mt-4 opacity-50">{ticket.qrCode || "NO-CODE"}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default TicketModal;