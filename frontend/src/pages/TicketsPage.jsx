import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, Calendar, MapPin } from 'lucide-react';
import api from '../api/axiosConfig';

const TicketsPage = ({ onBack }) => { // 🔥 onBack функциясын қабылдаймыз
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await api.get('/api/events/tickets/my');
                setTickets(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    if (loading) return <div className="text-center text-white mt-20">Жүктелуде...</div>;

    return (
        <div className="min-h-screen bg-black p-4 pb-20">
            {/* 🔥 HEADER: Артқа қайту батырмасы */}
            <div className="flex items-center gap-4 mb-8 sticky top-0 bg-black/80 backdrop-blur-md p-2 z-10">
                <button
                    onClick={onBack}
                    className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 active:scale-95 transition"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-black italic text-white uppercase tracking-wider">Менің Билеттерім</h1>
            </div>

            {/* Билеттер тізімі */}
            <div className="space-y-6">
                {tickets.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        <p>Әзірге билет жоқ.</p>
                        <button onClick={onBack} className="text-[#CCFF00] mt-2 underline">Билет сатып алу</button>
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        // 🔥 ДИЗАЙН: Квадрат емес, ПРЯМОУГОЛЬНИК (Ticket Shape)
                        <div key={ticket.id} className="bg-white rounded-3xl overflow-hidden relative shadow-lg flex flex-col">

                            {/* Жоғарғы жағы (Сурет) */}
                            <div className="h-40 relative">
                                <img
                                    src={ticket.event.imageUrl || "https://via.placeholder.com/400x200"}
                                    alt={ticket.event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-black uppercase leading-none mb-1">{ticket.event.title}</h3>
                                    <div className="flex items-center gap-2 text-xs opacity-80">
                                        <Calendar size={14} />
                                        <span>{new Date(ticket.event.eventDate).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ортасы (Тесік сызығы) */}
                            <div className="relative h-6 bg-white flex items-center justify-between px-[-10px]">
                                <div className="w-6 h-6 bg-black rounded-full -ml-3"></div>
                                <div className="border-t-2 border-dashed border-gray-300 w-full"></div>
                                <div className="w-6 h-6 bg-black rounded-full -mr-3"></div>
                            </div>

                            {/* Астыңғы жағы (QR код) - ТІК ПРЯМОУГОЛЬНИК */}
                            <div className="p-6 bg-white flex flex-col items-center justify-center pb-8">
                                <div className="bg-white p-2 border-4 border-black rounded-xl mb-4">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`}
                                        alt="QR"
                                        className="w-32 h-32"
                                    />
                                </div>
                                <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-4">{ticket.qrCode}</p>

                                <button className="w-full bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Download size={18} /> Жүктеу
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TicketsPage;