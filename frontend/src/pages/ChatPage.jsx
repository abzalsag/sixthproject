import React, { useState, useEffect, useRef } from 'react';
import { Send, User, BarChart2, ArrowRight, MessageCircle } from 'lucide-react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    // 🔥 ТАБТАР: Енді 3 бөлім бар
    const [activeTab, setActiveTab] = useState('DIRECT'); // 'DIRECT', 'CHAT', 'COMMUNITY'

    // --- 1. GLOBAL CHAT STATE ---
    const [globalMessages, setGlobalMessages] = useState([]);
    const [globalText, setGlobalText] = useState("");
    const globalEndRef = useRef(null);

    // --- 2. COMMUNITY STATE ---
    const [communityPosts, setCommunityPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [isPollMode, setIsPollMode] = useState(false);
    const [pollOptions, setPollOptions] = useState(["", ""]);

    // --- 3. DIRECT (PRIVATE) CHAT STATE (ЖАҢА) ---
    const [myPrivateChats, setMyPrivateChats] = useState([]); // Чаттар тізімі
    const [activePrivateChat, setActivePrivateChat] = useState(null); // Ашық тұрған жеке чат
    const [privateMessages, setPrivateMessages] = useState([]); // Жеке хабарламалар
    const [privateText, setPrivateText] = useState(""); // Жеке жазу
    const [targetUserId, setTargetUserId] = useState(""); // Жаңа чат ашу үшін ID
    const privateEndRef = useRef(null);

    // Мен кіммін?
    useEffect(() => {
        api.get('/api/users/me').then(res => setCurrentUser(res.data)).catch(console.error);
    }, []);

    // ===========================
    // LOGIC: TABS SWITCHING
    // ===========================
    useEffect(() => {
        if (activeTab === 'CHAT') fetchGlobalMessages();
        if (activeTab === 'COMMUNITY') fetchCommunityPosts();
        if (activeTab === 'DIRECT') fetchPrivateChats();
    }, [activeTab]);

    // ===========================
    // 1. GLOBAL CHAT FUNCTIONS
    // ===========================
    const fetchGlobalMessages = async () => {
        try {
            const res = await api.get('/api/chat');
            setGlobalMessages(res.data);
            setTimeout(() => globalEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        } catch (error) { console.error(error); }
    };

    const sendGlobalMessage = async (e) => {
        e.preventDefault();
        if (!globalText.trim()) return;
        try {
            await api.post('/api/chat', { content: globalText });
            setGlobalText("");
            fetchGlobalMessages();
        } catch (error) { toast.error("Жіберілмеді"); }
    };

    // ===========================
    // 2. COMMUNITY FUNCTIONS
    // ===========================
    const fetchCommunityPosts = async () => {
        try {
            const res = await api.get('/api/community');
            setCommunityPosts(res.data);
        } catch (error) { console.error(error); }
    };

    const createCommunityPost = async () => {
        if (!newPostContent.trim()) return;
        const postData = {
            content: newPostContent,
            type: isPollMode ? "POLL" : "DISCUSSION",
            pollOptions: isPollMode ? pollOptions.filter(o => o.trim() !== "") : null
        };
        try {
            await api.post('/api/community', postData);
            setNewPostContent("");
            setIsPollMode(false);
            setPollOptions(["", ""]);
            fetchCommunityPosts();
            toast.success("Жарияланды!");
        } catch (error) { toast.error("Қате"); }
    };

    const votePoll = async (postId, option) => {
        try {
            await api.post(`/api/community/${postId}/vote?option=${option}`);
            fetchCommunityPosts();
            toast.success("Дауыс қабылданды");
        } catch (error) { toast.error("Қате"); }
    };

    // ===========================
    // 3. DIRECT (PRIVATE) CHAT FUNCTIONS 🔥
    // ===========================

    // Барлық жеке чаттарды алу
    const fetchPrivateChats = async () => {
        try {
            const res = await api.get('/api/chats/my-chats');
            setMyPrivateChats(res.data);
        } catch (error) { console.error("Жеке чаттарды алу қатесі", error); }
    };

    // Нақты бір чатты ашу
    const openPrivateChat = async (chat) => {
        setActivePrivateChat(chat);
        try {
            const res = await api.get(`/api/chats/${chat.id}/messages`);
            setPrivateMessages(res.data);
            setTimeout(() => privateEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        } catch (error) { console.error("Хабарлама қатесі", error); }
    };

    // Жеке хабарлама жазу
    const sendPrivateMessage = async (e) => {
        e.preventDefault();
        if (!privateText.trim() || !activePrivateChat) return;

        try {
            const res = await api.post(`/api/chats/${activePrivateChat.id}/send`, { content: privateText });
            setPrivateMessages([...privateMessages, res.data]);
            setPrivateText("");
            setTimeout(() => privateEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        } catch (error) { toast.error("Жіберілмеді"); }
    };

    // Жаңа чат бастау (ID арқылы)
    const startNewChat = async () => {
        if (!targetUserId) return;
        try {
            const res = await api.post('/api/chats/create', { userId: Number(targetUserId) });
            setMyPrivateChats([...myPrivateChats, res.data]);
            openPrivateChat(res.data);
            setTargetUserId("");
            toast.success("Чат ашылды!");
        } catch (error) { toast.error("Адам табылмады"); }
    };


    return (
        <div className="flex flex-col h-screen bg-black pb-24 font-sans text-white">

            {/* --- HEADER --- */}
            <div className="bg-black/90 backdrop-blur sticky top-0 z-20 border-b border-gray-800">
                <div className="p-3 text-center">
                    <h1 className="font-black italic text-xl tracking-wider">MESSENGER</h1>
                </div>
                {/* 3 TABS SWITCHER */}
                <div className="flex px-2 pb-0">
                    <button onClick={() => setActiveTab('DIRECT')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${activeTab === 'DIRECT' ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-transparent text-gray-500'}`}>
                        DIRECT (Жеке)
                    </button>
                    <button onClick={() => setActiveTab('CHAT')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${activeTab === 'CHAT' ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-transparent text-gray-500'}`}>
                        GLOBAL
                    </button>
                    <button onClick={() => setActiveTab('COMMUNITY')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${activeTab === 'COMMUNITY' ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-transparent text-gray-500'}`}>
                        COMMUNITY
                    </button>
                </div>
            </div>

            {/* ===========================
                VIEW 1: DIRECT MESSAGES (ЖЕКЕ ЧАТ) 🔥
               =========================== */}
            {activeTab === 'DIRECT' && (
                <div className="flex flex-1 overflow-hidden">
                    {/* ТІЗІМ (LIST) */}
                    <div className={`${activePrivateChat ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 flex-col border-r border-gray-800 bg-black`}>
                        <div className="p-3 border-b border-gray-800 flex gap-2">
                            <input
                                type="number"
                                placeholder="ID жазып бастау..."
                                value={targetUserId}
                                onChange={(e) => setTargetUserId(e.target.value)}
                                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-[#CCFF00]"
                            />
                            <button onClick={startNewChat} className="bg-[#CCFF00] text-black px-3 rounded font-bold">+</button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {myPrivateChats.length === 0 && <p className="text-gray-600 text-center mt-5 text-sm">Чаттар жоқ</p>}
                            {myPrivateChats.map(chat => {
                                // Кіммен сөйлесіп жатырмын?
                                const otherUser = chat.user1.email === currentUser?.email ? chat.user2 : chat.user1;
                                return (
                                    <div key={chat.id} onClick={() => openPrivateChat(chat)} className="p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900 transition flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                                            {otherUser.avatarUrl ? <img src={otherUser.avatarUrl} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={18}/></div>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-white">{otherUser.firstname} {otherUser.lastname}</p>
                                            <p className="text-xs text-gray-500">Чатты ашу</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ДИАЛОГ (CHAT WINDOW) */}
                    <div className={`${!activePrivateChat ? 'hidden md:flex' : 'flex'} w-full md:w-2/3 flex-col bg-[#0a0a0a]`}>
                        {activePrivateChat ? (
                            <>
                                <div className="p-3 border-b border-gray-800 flex items-center gap-3 bg-black">
                                    <button onClick={() => setActivePrivateChat(null)} className="md:hidden text-gray-400">←</button>
                                    <span className="font-bold text-[#CCFF00]">Жеке чат #{activePrivateChat.id}</span>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {privateMessages.map((msg, idx) => {
                                        const isMe = msg.sender.email === currentUser?.email;
                                        return (
                                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isMe ? 'bg-[#CCFF00] text-black rounded-tr-none' : 'bg-gray-800 text-white rounded-tl-none'}`}>
                                                    {msg.content}
                                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-black/60' : 'text-gray-400'}`}>{formatDate(msg.timestamp)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={privateEndRef}/>
                                </div>

                                <form onSubmit={sendPrivateMessage} className="p-3 bg-black border-t border-gray-800 flex gap-2">
                                    <input
                                        value={privateText}
                                        onChange={(e) => setPrivateText(e.target.value)}
                                        placeholder="Хабарлама..."
                                        className="flex-1 bg-gray-900 border border-gray-800 rounded-full px-4 py-3 outline-none focus:border-[#CCFF00]"
                                    />
                                    <button type="submit" className="bg-[#CCFF00] text-black p-3 rounded-full"><Send size={18}/></button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-600">
                                <div className="text-center">
                                    <MessageCircle size={48} className="mx-auto mb-2 opacity-50"/>
                                    <p>Чат таңдаңыз</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===========================
                VIEW 2: GLOBAL CHAT (ЕСКІ)
               =========================== */}
            {activeTab === 'CHAT' && (
                <div className="flex flex-col flex-1 h-full">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {globalMessages.map((msg) => {
                            const isMe = msg.sender?.email === currentUser?.email;
                            return (
                                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden shrink-0">
                                        {msg.sender?.avatarUrl ? <img src={msg.sender.avatarUrl} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full"><User size={14}/></div>}
                                    </div>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-[#CCFF00] text-black rounded-tr-none' : 'bg-gray-800 text-white rounded-tl-none'}`}>
                                        <p className="text-xs font-bold mb-1 opacity-70">{msg.sender?.firstname}</p>
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={globalEndRef}/>
                    </div>
                    <form onSubmit={sendGlobalMessage} className="p-3 bg-black border-t border-gray-800 flex gap-2">
                        <input value={globalText} onChange={(e) => setGlobalText(e.target.value)} placeholder="Global Chat..." className="flex-1 bg-gray-900 border border-gray-800 rounded-full px-4 py-3 outline-none focus:border-[#CCFF00]"/>
                        <button type="submit" className="bg-[#CCFF00] text-black p-3 rounded-full"><Send size={18}/></button>
                    </form>
                </div>
            )}

            {/* ===========================
                VIEW 3: COMMUNITY (ЕСКІ)
               =========================== */}
            {activeTab === 'COMMUNITY' && (
                <div className="flex flex-col flex-1 h-full overflow-y-auto p-4 space-y-6">
                    <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-gray-800">
                        <textarea className="w-full bg-transparent text-white outline-none resize-none mb-3 placeholder-gray-500" placeholder="Идея / Сұрақ..." rows={2} value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)}/>
                        {isPollMode && (
                            <div className="space-y-2 mb-3 pl-2 border-l-2 border-[#CCFF00]">
                                {pollOptions.map((opt, idx) => (
                                    <input key={idx} placeholder={`Вариант ${idx + 1}`} value={opt} onChange={(e) => {const n = [...pollOptions]; n[idx]=e.target.value; setPollOptions(n)}} className="w-full bg-[#333] rounded p-2 text-sm outline-none"/>
                                ))}
                                <button onClick={() => setPollOptions([...pollOptions, ""])} className="text-xs text-blue-400">+ Add Option</button>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                            <button onClick={() => setIsPollMode(!isPollMode)} className={`p-2 rounded text-xs font-bold flex items-center gap-2 ${isPollMode ? 'text-[#CCFF00]' : 'text-gray-500'}`}><BarChart2 size={16}/> Poll</button>
                            <button onClick={createCommunityPost} className="bg-[#CCFF00] text-black px-4 py-1.5 rounded font-bold text-sm">Post</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {communityPosts.map(post => (
                            <div key={post.id} className="bg-[#1a1a1a] p-4 rounded-2xl border border-gray-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs text-white">{post.author?.firstname?.[0]}</div>
                                    <div><h3 className="font-bold text-sm">{post.author?.firstname}</h3><span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span></div>
                                </div>
                                <p className="mb-3 whitespace-pre-wrap text-sm">{post.content}</p>
                                {post.type === "POLL" && (
                                    <div className="space-y-2 mb-3 bg-black/30 p-3 rounded">
                                        {Object.entries(post.pollVotes || {}).map(([opt, count]) => (
                                            <button key={opt} onClick={() => votePoll(post.id, opt)} className="w-full flex justify-between bg-[#333] p-2 rounded text-xs hover:bg-[#444]"><span className="text-white">{opt}</span><span className="bg-[#CCFF00] text-black px-1.5 rounded font-bold">{count}</span></button>
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-end pt-2 border-t border-gray-800">
                                    <button onClick={() => navigate('/create', { state: { prefillTitle: post.content } })} className="text-[#CCFF00] text-xs font-bold flex items-center gap-1">Make Event <ArrowRight size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;