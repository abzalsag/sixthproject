import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';
import api from '../api/axiosConfig';

const EventDetailsPage = ({ eventId, onBack }) => {

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [friendsGoing, setFriendsGoing] = useState([]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/api/events/${eventId}`);
                setEvent(response.data);

                try {
                    const friendsRes = await api.get(`/api/events/${eventId}/friends-going`);
                    setFriendsGoing(friendsRes.data);
                } catch (err) {
                    console.error("Достарды алу қатесі:", err);
                }

            } catch (error) {
                console.error("Қате:", error);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    if (loading) return <div className="text-white text-center mt-20">Жүктелуде... 🚀</div>;
    if (!event) return <div className="text-white text-center mt-20">Ивент табылмады 😔</div>;

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <div className="fixed top-4 left-4 z-50">
                <button
                    onClick={onBack}
                    className="bg-black/50 p-3 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition"
                >
                    <ArrowLeft color="white" size={24} />
                </button>
            </div>

            <div className="w-full h-96 relative">
                {/* 🔥 ӨЗГЕРТІЛДІ: placehold.co */}
                <img
                    src={event.imageUrl || "https://placehold.co/600x400"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            <div className="px-5 -mt-10 relative z-10">
                <h1 className="text-4xl font-black italic uppercase leading-tight mb-4">{event.title}</h1>

                <span className="inline-block bg-[#CCFF00] text-black font-bold px-4 py-1 rounded-lg text-sm mb-6 uppercase tracking-wider">
                    {event.category || "Party"}
                </span>

                {friendsGoing.length > 0 && (
                    <div className="flex items-center gap-3 mb-6 bg-[#1a1a1a] p-3 rounded-xl border border-gray-800 shadow-lg animate-fade-in">
                        <div className="flex -space-x-3">
                            {friendsGoing.slice(0, 3).map((friend, idx) => (
                                <div key={idx} className="w-10 h-10 rounded-full border-2 border-black bg-gray-700 overflow-hidden">
                                    {/* 🔥 ӨЗГЕРТІЛДІ: placehold.co */}
                                    <img
                                        src={friend.avatarUrl || "https://placehold.co/50"}
                                        className="w-full h-full object-cover"
                                        alt={friend.firstname}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="text-sm text-gray-300 leading-tight">
                            <span className="font-bold text-white block">{friendsGoing[0].firstname}</span>
                            {friendsGoing.length > 1 ? (
                                <span>және тағы <span className="font-bold text-[#CCFF00]">{friendsGoing.length - 1} досың</span> барады! 🔥</span>
                            ) : (
                                <span>бара жатыр! 🔥</span>
                            )}
                        </div>
                    </div>
                )}

                <div className="space-y-4 text-gray-300 bg-[#111] p-5 rounded-2xl border border-gray-800 mb-8">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-[#CCFF00]" size={20} />
                        <span className="font-medium">{new Date(event.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="text-[#CCFF00]" size={20} />
                        <span className="font-medium">{new Date(event.eventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="text-[#CCFF00]" size={20} />
                        <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <DollarSign className="text-[#CCFF00]" size={20} />
                        <span className="text-xl font-bold text-white">
                            {event.price > 0 ? `${event.price} ₸` : "Тегін кіру"}
                        </span>
                    </div>
                </div>

                <div className="mb-24">
                    <h3 className="text-xl font-bold text-white mb-3">Толығырақ</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        {event.description || "Сипаттамасы жоқ."}
                    </p>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 border-t border-gray-800 backdrop-blur-md z-40">
                <button className="w-full bg-[#CCFF00] text-black font-black py-4 rounded-xl text-lg hover:bg-[#b3e600] transition active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                    БИЛЕТ САТЫП АЛУ 🎟️
                </button>
            </div>
        </div>
    );
};

export default EventDetailsPage;