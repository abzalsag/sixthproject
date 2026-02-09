import React from 'react';
import { X, Download, Share2, CheckCircle } from 'lucide-react';

const TicketSuccessModal = ({ isOpen, onClose, ticket }) => {
    if (!isOpen || !ticket) return null;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>

            {/* 🔥 ӨЗГЕРІС: min-h-[550px] қосылды (Ұзынша болу үшін) */}
            <div className="relative bg-white text-black w-full max-w-sm min-h-[550px] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(204,255,0,0.5)] animate-in zoom-in-95 duration-300 flex flex-col">

                {/* Header */}
                <div className="bg-[#CCFF00] p-6 text-center pt-10 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                        <h2 className="text-4xl font-black italic tracking-tighter opacity-10">ALMATY TONIGHT</h2>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <CheckCircle size={48} className="text-black mb-2" />
                        <h2 className="text-2xl font-black uppercase">Төлем сәтті өтті!</h2>
                    </div>

                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/10 p-2 rounded-full hover:bg-black/20">
                        <X size={20} />
                    </button>
                </div>

                {/* Тесік сызығы */}
                <div className="relative h-6 bg-gray-100 flex items-center justify-between px-[-10px]">
                    <div className="w-6 h-6 bg-black rounded-full -ml-3"></div>
                    <div className="border-t-2 border-dashed border-gray-300 w-full"></div>
                    <div className="w-6 h-6 bg-black rounded-full -mr-3"></div>
                </div>

                {/* Body */}
                <div className="bg-white p-6 flex flex-col items-center flex-1">
                    <h3 className="text-xl font-bold uppercase text-center mb-1">{ticket.event.title}</h3>
                    <p className="text-gray-500 text-sm mb-6">{new Date(ticket.event.eventDate).toLocaleString()}</p>

                    <div className="p-2 border-4 border-black rounded-xl mb-6">
                        <img src={qrUrl} alt="QR Code" className="w-40 h-40" />
                    </div>

                    <p className="text-xs text-gray-400 font-mono mb-6 uppercase tracking-widest">{ticket.qrCode}</p>

                    {/* Түймелер ең астына түсуі үшін margin-top auto */}
                    <div className="flex gap-4 w-full mt-auto">
                        <button className="flex-1 bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                            <Download size={18} /> Жүктеу
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketSuccessModal;