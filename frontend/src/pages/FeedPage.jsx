import React, { useEffect, useState } from 'react';
import {
    Heart, MessageCircle, Share2, MapPin, Calendar, Ticket,
    MoreHorizontal, Menu, X, Search
} from 'lucide-react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import PaymentModal from '../modals/PaymentModal';
import CommentModal from '../modals/CommentModal';
import TicketSuccessModal from '../modals/TicketSuccessModal';
import { formatDate } from '../utils/dateUtils';
import EventSkeleton from '../components/ui/EventSkeleton';

// --- EVENT CATEGORIES (Ескі кодтан) ---
const CATEGORIES = ["All", "Party", "Concert", "Cinema", "Sport", "Meetup", "Other"];

const FeedPage = ({ onOpenTickets, onEventClick }) => {
    // 🔥 ЭКРАН РЕЖИМІ: 'social' (Достар лентасы) немесе 'events' (Билет алу)
    const [currentView, setCurrentView] = useState('social');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Бүйірдегі меню

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Модальдар логикасы (Like, Comment, Payment)
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [activeEventId, setActiveEventId] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedEventForBuy, setSelectedEventForBuy] = useState(null);
    const [purchasedTicket, setPurchasedTicket] = useState(null);
    const [showTicketModal, setShowTicketModal] = useState(false);

    // Деректерді алу
    const fetchEvents = async (category = "All") => {
        setLoading(true);
        try {
            const endpoint = category === "All" ? '/api/events' : `/api/events/filter?category=${category}`;
            const res = await api.get(endpoint);
            setEvents(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Лента жүктелмеді");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents("All"); }, []);

    // --- ФУНКЦИЯЛАР (Events логикасы) ---
    const handleCategoryClick = (cat) => { setSelectedCategory(cat); fetchEvents(cat); };

    const handleLike = async (eventId) => {
        try {
            const res = await api.post(`/api/events/${eventId}/like`);
            setEvents(events.map(e => e.id === eventId ? { ...e, likes: res.data.likes } : e));
        } catch (error) { console.error(error); }
    };

    const openCommentModal = async (eventId) => {
        setActiveEventId(eventId);
        setIsCommentModalOpen(true);
        setCommentsLoading(true);
        setComments([]);
        try {
            const res = await api.get(`/api/events/${eventId}/comments`);
            setComments(res.data);
        } catch (error) { console.error(error); }
        finally { setCommentsLoading(false); }
    };

    const handleSendComment = async () => {
        if (!commentText.trim()) return;
        try {
            const res = await api.post(`/api/events/${activeEventId}/comments`, { content: commentText });
            setComments([...comments, res.data]);
            setCommentText("");
            toast.success("Пікір жазылды!");
        } catch (error) { toast.error("Жіберілмеді"); }
    };

    const openPaymentModal = (event) => {
        setSelectedEventForBuy(event);
        setPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async () => {
        if (!selectedEventForBuy) return;
        try {
            const res = await api.post(`/api/events/${selectedEventForBuy.id}/buy`);
            setPurchasedTicket(res.data);
            setShowTicketModal(true);
            toast.success("Билет сатып алынды! 🎉");
        } catch (error) {
            console.error(error);
            toast.error("Сатып алу кезінде қате шықты");
        }
    };

    if (loading) return <div className="pt-20 text-center text-white"><EventSkeleton /></div>;

    // --- 1. БҮЙІРДЕГІ МЕНЮ (SIDEBAR) ---
    const SideMenu = () => (
        <>
            {/* Қараңғы фон */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
            {/* Менюдің өзі */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-[#111] border-r border-gray-800 z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-5 flex justify-between items-center border-b border-gray-800">
                    <h2 className="text-xl font-bold italic text-white">MENU</h2>
                    <button onClick={() => setIsMenuOpen(false)}><X className="text-gray-400" /></button>
                </div>
                <div className="p-4 space-y-2">
                    <button
                        onClick={() => { setCurrentView('social'); setIsMenuOpen(false); }}
                        className={`w-full text-left p-3 rounded-xl font-bold ${currentView === 'social' ? 'bg-[#CCFF00] text-black' : 'text-white hover:bg-gray-800'}`}
                    >
                        📸 Social Feed
                    </button>
                    <button
                        onClick={() => { setCurrentView('events'); setIsMenuOpen(false); }}
                        className={`w-full text-left p-3 rounded-xl font-bold ${currentView === 'events' ? 'bg-[#CCFF00] text-black' : 'text-white hover:bg-gray-800'}`}
                    >
                        🎟 Events & Tickets
                    </button>
                </div>
            </div>
        </>
    );

    // --- 2. SOCIAL FEED VIEW (Instagram Style) ---
    const SocialView = () => (
        <div className="animate-fade-in">
            {/* STORIES HEADER */}
            <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide border-b border-gray-900 bg-black/80 backdrop-blur-md sticky top-14 z-10">
                <div className="flex flex-col items-center gap-1 min-w-[64px]">
                    <div className="w-16 h-16 rounded-full border-2 border-gray-700 p-[2px] flex items-center justify-center bg-gray-800">
                        <span className="text-2xl text-white">+</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Your Story</span>
                </div>
                {/* Fake Stories for Friends */}
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex flex-col items-center gap-1 min-w-[64px]">
                        <div className="w-16 h-16 rounded-full border-2 border-[#CCFF00] p-[2px]">
                            <img src={`https://placehold.co/100?text=Friend${i}`} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <span className="text-[10px] text-white truncate w-14 text-center">friend_{i}</span>
                    </div>
                ))}
            </div>

            {/* POSTS (Тек достардың посттары) */}
            <div className="pb-24">
                {events.map((post) => {
                    // Тек 'Post' категориясын немесе жай суреттерді көрсетеміз
                    if (post.category !== 'Post' && post.category !== 'Other') return null;

                    return (
                        <div key={post.id} className="border-b border-gray-900 pb-4 mb-4">
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                                        <img src={post.user?.avatarUrl || "https://placehold.co/100"} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-bold text-sm">{post.user?.firstname || "Unknown"}</span>
                                </div>
                                <MoreHorizontal size={20} className="text-gray-500" />
                            </div>
                            <div className="w-full aspect-square bg-gray-900 overflow-hidden">
                                <img src={post.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex justify-between items-center px-3 py-3">
                                <div className="flex gap-4">
                                    <button onClick={() => handleLike(post.id)}><Heart size={26} className={`transition ${post.likes > 0 ? 'fill-red-500 text-red-500' : 'text-white'}`} /></button>
                                    <button onClick={() => openCommentModal(post.id)}><MessageCircle size={26} className="text-white" /></button>
                                    <Share2 size={26} className="text-white" />
                                </div>
                            </div>
                            <div className="px-3">
                                <p className="font-bold text-sm mb-1">{post.likes || 0} likes</p>
                                <div className="text-sm">
                                    <span className="font-bold mr-2">{post.user?.firstname}</span>
                                    <span className="text-gray-300">{post.description}</span>
                                </div>
                                <p className="text-gray-500 text-[10px] mt-2 uppercase">{new Date(post.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // --- 3. EVENTS VIEW (Ticketon Style) ---
    const EventsView = () => (
        <div className="pb-24 px-4 pt-4 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-black italic text-[#CCFF00] mb-4">UPCOMING EVENTS</h2>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all border border-gray-700
                            ${selectedCategory === cat ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-gray-900 text-gray-400'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Event Cards */}
            <div className="space-y-6">
                {events.map((event) => {
                    // Тек Ивенттерді көрсетеміз
                    if (event.category === 'Post' || event.category === 'Other') return null;

                    return (
                        <div key={event.id} onClick={() => onEventClick(event.id)} className="group relative bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-[#CCFF00] transition-all duration-300 shadow-2xl cursor-pointer">
                            <div className="relative h-64 overflow-hidden">
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <span className="text-[#CCFF00] font-black text-xl">{event.price > 0 ? `${event.price} ₸` : 'FREE'}</span>
                                </div>
                                <div className="absolute top-4 left-4 bg-[#CCFF00]/20 backdrop-blur-md px-3 py-1 rounded-lg border border-[#CCFF00]/30">
                                    <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider">{event.category}</span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h2 className="text-2xl font-bold mb-2 uppercase text-white">{event.title}</h2>
                                <div className="flex flex-col gap-2 text-gray-400 text-sm mb-4">
                                    <div className="flex items-center gap-2"><MapPin size={18} className="text-[#CCFF00]" /> <span>{event.location}</span></div>
                                    <div className="flex items-center gap-2"><Calendar size={18} className="text-[#CCFF00]" /> <span>{formatDate(event.eventDate)}</span></div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); openPaymentModal(event); }} className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-[#CCFF00] transition-colors">
                                    БИЛЕТ АЛУ
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">

            {/* SIDE MENU COMPONENT */}
            <SideMenu />

            {/* TOP HEADER (Тұрақты) */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-900 sticky top-0 z-30 bg-black/90 backdrop-blur-md">
                {/* 3 СЫЗЫҚ (МЕНЮ) */}
                <button onClick={() => setIsMenuOpen(true)}>
                    <Menu size={28} className="text-white" />
                </button>

                {/* LOGO немесе ТЕКСТ (Режимге қарай өзгереді) */}
                <h1 className="text-lg font-bold italic tracking-wider">
                    {currentView === 'social' ? 'TUSA FEED' : 'EVENTS'}
                </h1>

                {/* SEARCH ICON */}
                <Search size={24} className="text-white" />
            </div>

            {/* MAIN CONTENT AREA */}
            {currentView === 'social' ? <SocialView /> : <EventsView />}

            {/* MODALS */}
            <CommentModal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} comments={comments} loading={commentsLoading} onSend={handleSendComment} commentText={commentText} setCommentText={setCommentText} />
            <PaymentModal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} onConfirm={handlePaymentSuccess} price={selectedEventForBuy?.price} eventName={selectedEventForBuy?.title} />
            <TicketSuccessModal isOpen={showTicketModal} onClose={() => setShowTicketModal(false)} ticket={purchasedTicket} />
        </div>
    );
};

export default FeedPage;