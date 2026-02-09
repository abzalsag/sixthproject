import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, UserPlus, Check } from 'lucide-react'; // 🔥 UserPlus, Check қосылды
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const ExplorePage = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // 🔥 1. ЖАҢА STATE-тер: Таб және Адамдар тізімі
    const [activeTab, setActiveTab] = useState('EVENTS'); // 'EVENTS' or 'PEOPLE'
    const [users, setUsers] = useState([]); // Табылған адамдар

    // Ескі state-тер (Ивенттер үшін)
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
        // Басында тек ивенттерді жүктеп қоямыз (Default)
        const fetchAll = async () => {
            try {
                const res = await api.get('/api/events');
                setAllEvents(res.data || []);
            } catch (error) {
                console.error("ExplorePage Error:", error);
            }
        };
        fetchAll();
    }, []);

    // 🔥 2. ІЗДЕУ ЛОГИКАСЫ (Екіге бөлінді)
    const handleSearch = async (e) => {
        const text = e.target.value;
        setQuery(text);

        if (text.trim().length > 1) {
            setLoading(true);
            try {
                if (activeTab === 'EVENTS') {
                    // Ивент іздеу (Ескі)
                    const res = await api.get(`/api/events/search?query=${text}`);
                    setEvents(res.data || []);
                } else {
                    // 🔥 Адам іздеу (Жаңа)
                    const res = await api.get(`/api/users/search?query=${text}`);
                    setUsers(res.data || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            setEvents([]);
            setUsers([]);
        }
    };

    // 🔥 3. FOLLOW БАСУ ФУНКЦИЯСЫ
    const handleFollow = async (userId) => {
        try {
            await api.post(`/api/users/${userId}/follow`);
            toast.success("Өзгертілді ✅");
            // Визуалды түрде жаңарту (қарапайым жолмен)
            // Шынайы жобада backend 'isFollowing' қайтару керек, әзірге осылай:
        } catch (error) {
            toast.error("Қате шықты");
        }
    };

    const displayEvents = query.length > 1 ? events : allEvents;

    return (
        <div className="min-h-screen bg-black text-white pb-24 pt-4 px-2">

            {/* SEARCH BAR */}
            <div className="sticky top-0 bg-black/95 backdrop-blur-md z-10 py-2 px-2 mb-2">
                <div className="relative mb-3">
                    <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder={activeTab === 'EVENTS' ? "Тусовка іздеу..." : "Адам іздеу (@username)..."}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-10 text-white focus:border-[#CCFF00] outline-none"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="absolute right-3 top-3.5 text-gray-500 hover:text-white">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* 🔥 4. ЖАҢА TAB SWITCHER */}
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => { setActiveTab('EVENTS'); setQuery(''); }}
                        className={`flex-1 py-2 text-sm font-bold border-b-2 transition ${activeTab === 'EVENTS' ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-transparent text-gray-500'}`}
                    >
                        EVENTS
                    </button>
                    <button
                        onClick={() => { setActiveTab('PEOPLE'); setQuery(''); }}
                        className={`flex-1 py-2 text-sm font-bold border-b-2 transition ${activeTab === 'PEOPLE' ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-transparent text-gray-500'}`}
                    >
                        PEOPLE
                    </button>
                </div>
            </div>

            {/* 🔥 5. НӘТИЖЕЛЕРДІ КӨРСЕТУ */}

            {/* А) EVENTS GRID (Ескі дизайн) */}
            {activeTab === 'EVENTS' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                    {displayEvents.length === 0 ? (
                        <div className="col-span-full text-center text-gray-600 mt-20">
                            <p>{loading ? "Ізделуде..." : "Посттар табылмады 😕"}</p>
                        </div>
                    ) : (
                        displayEvents.map((event) => (
                            <div key={event.id} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-800 group cursor-pointer">
                                <img
                                    src={event.imageUrl || "https://placehold.co/300"}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                    <h3 className="font-bold text-sm text-white truncate">{event.title}</h3>
                                    <div className="text-[#CCFF00] text-xs flex items-center gap-1">
                                        <MapPin size={10} /> {event.location}
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
                                    <span className="text-xs font-bold text-[#CCFF00]">{event.price} ₸</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Б) PEOPLE LIST (Жаңа дизайн) */}
            {activeTab === 'PEOPLE' && (
                <div className="space-y-3 mt-4 px-2">
                    {users.length === 0 ? (
                        <div className="text-center text-gray-600 mt-20">
                            <p>{loading ? "Ізделуде..." : (query ? "Адам табылmadı 🤷‍♂️" : "Достарыңды іздеп көр!")}</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                                        <img src={user.avatarUrl || "https://placehold.co/100"} alt="ava" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{user.firstname} {user.lastname}</h4>
                                        <p className="text-xs text-gray-500">@{user.email.split('@')[0]}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleFollow(user.id)}
                                    className="bg-[#CCFF00] text-black p-2 rounded-full hover:scale-110 transition active:scale-95"
                                >
                                    <UserPlus size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ExplorePage;