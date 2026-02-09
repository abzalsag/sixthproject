import React, { useEffect, useState } from 'react';
import { Settings, Grid, Bookmark, Ticket, LogOut, Edit2, Trash2, PlusSquare, MapPin, Calendar } from 'lucide-react'; // Жаңа иконкалар
import api from '../api/axiosConfig';
import EditProfileModal from '../modals/EditProfileModal';
import toast from 'react-hot-toast';
import SettingsModal from '../modals/SettingsModal';
import UserListModal from '../modals/UserListModal';
import CreatePostModal from '../modals/CreatePostModal'; // 🔥 1. Жаңа модаль

const ProfilePage = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 2. Екі бөлек State (Фотолар және Ивенттер)
    const [myPosts, setMyPosts] = useState([]);   // 1-таб: Фотолар
    const [myEvents, setMyEvents] = useState([]); // 2-таб: Тусалар

    const [activeTab, setActiveTab] = useState('GRID'); // 'GRID' | 'EVENTS' | 'TICKET'

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false); // 🔥 Пост салу модалы

    const [userListModal, setUserListModal] = useState({ isOpen: false, title: "", users: [] });
    const [listLoading, setListLoading] = useState(false);

    // Деректерді жүктеу
    const fetchData = async () => {
        try {
            const userRes = await api.get('/api/users/me');
            setUser(userRes.data);

            // 1. Фотоларды алу (/api/posts/my-posts - егер backend-те жасасаң)
            // Егер әлі жасамасаң, ескі '/api/events/my-posts' қала береді
            try {
                const postsRes = await api.get('/api/events/my-posts');
                setMyPosts(postsRes.data);
            } catch (e) {
                console.log("PostController жоқ, ескісін қосамын...");
                const oldRes = await api.get('/api/events/my-posts');
                setMyPosts(oldRes.data);
            }

            // 2. Тусаларды алу (/api/events/my-organized - егер backend-те жасасаң)
            try {
                const eventsRes = await api.get('/api/events/my-organized');
                setMyEvents(eventsRes.data);
            } catch (e) { console.log("Тусалар әлі жоқ"); }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Тізім ашу (Өзгерген жоқ)
    const openUserList = async (type) => {
        if (!user) return;
        setUserListModal({ isOpen: true, title: type === 'FOLLOWERS' ? "Подписчиктер" : "Жазылымдар", users: [] });
        setListLoading(true);
        try {
            const endpoint = type === 'FOLLOWERS' ? `/api/users/${user.id}/followers-list` : `/api/users/${user.id}/following-list`;
            const res = await api.get(endpoint);
            setUserListModal(prev => ({ ...prev, users: res.data }));
        } catch (error) { toast.error("Тізім жүктелмеді"); } finally { setListLoading(false); }
    };

    // Фото өшіру (1-таб)
    const handleDeletePost = async (postId) => {
        if (!window.confirm("Бұл фотоны өшіресіз бе?")) return;
        try {
            await api.delete(`/api/posts/${postId}`); // немесе /api/events/...
            setMyPosts(prev => prev.filter(e => e.id !== postId));
            toast.success("Өшірілді 🗑️");
        } catch (error) { toast.error("Қате"); }
    };

    // Туса өшіру (2-таб)
    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Бұл ивентті өшіресіз бе?")) return;
        try {
            await api.delete(`/api/events/${eventId}`);
            setMyEvents(prev => prev.filter(e => e.id !== eventId));
            toast.success("Өшірілді 🗑️");
        } catch (error) { toast.error("Қате"); }
    };

    if (loading) return <div className="text-white text-center mt-20">Жүктелуде...</div>;

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-900">
                <h1 className="text-xl font-bold italic">{user?.email?.split('@')[0]}</h1>
                <div className="flex gap-4">
                    {/* 🔥 3. ПЛЮС БАТЫРМАСЫ (Time Travel Post) */}
                    <button onClick={() => setIsCreatePostOpen(true)}>
                        <PlusSquare size={24} className="text-[#CCFF00]" />
                    </button>
                    <button onClick={onLogout}><LogOut size={24} className="text-red-500" /></button>
                    <button onClick={() => setIsSettingsOpen(true)}>
                        <Settings size={24} className="hover:text-[#CCFF00] transition" />
                    </button>
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#CCFF00] to-green-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black overflow-hidden">
                            <img src={user?.avatarUrl || "https://placehold.co/150"} alt="ava" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="flex gap-6 text-center">
                        <div><div className="font-bold text-lg">{myPosts.length}</div><div className="text-xs text-gray-500">Post</div></div>
                        <div onClick={() => openUserList('FOLLOWERS')} className="cursor-pointer hover:opacity-80 transition"><div className="font-bold text-lg">{user?.followersCount || 0}</div><div className="text-xs text-gray-500">Followers</div></div>
                        <div onClick={() => openUserList('FOLLOWING')} className="cursor-pointer hover:opacity-80 transition"><div className="font-bold text-lg">{user?.followingCount || 0}</div><div className="text-xs text-gray-500">Following</div></div>
                    </div>
                </div>

                {/* Name & Bio */}
                <div className="mb-6">
                    <h2 className="font-bold text-lg">{user?.firstname} {user?.lastname}</h2>
                    {user?.bio && <p className="text-sm text-gray-400 whitespace-pre-line">{user.bio}</p>}
                </div>

                <button onClick={() => setIsEditOpen(true)} className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 font-bold text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2">
                    <Edit2 size={16}/> Edit Profile
                </button>
            </div>

            {/* 🔥 4. ТАБТАР (Ауыстырғыш) */}
            <div className="flex border-t border-gray-900">
                <button onClick={() => setActiveTab('GRID')} className={`flex-1 py-3 flex justify-center ${activeTab === 'GRID' ? 'border-b-2 border-white' : 'text-gray-600'}`}><Grid size={24} /></button>
                <button onClick={() => setActiveTab('EVENTS')} className={`flex-1 py-3 flex justify-center ${activeTab === 'EVENTS' ? 'border-b-2 border-white' : 'text-gray-600'}`}><Bookmark size={24} /></button>
                <button onClick={() => setActiveTab('TICKET')} className={`flex-1 py-3 flex justify-center ${activeTab === 'TICKET' ? 'border-b-2 border-white' : 'text-gray-600'}`}><Ticket size={24} /></button>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[300px]">

                {/* 1-ТАБ: ФОТОЛАР (Time Travel) */}
                {activeTab === 'GRID' && (
                    <div className="grid grid-cols-3 gap-0.5">
                        {myPosts.map((post) => (
                            <div key={post.id} className="aspect-square relative group cursor-pointer bg-gray-800">
                                <img src={post.imageUrl || "https://placehold.co/300"} alt="post" className="w-full h-full object-cover" />

                                {/* Жылды көрсету (Time Travel) */}
                                {post.memoryDate && (
                                    <div className="absolute top-1 right-1 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        {post.memoryDate.split('-')[0]}
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }} className="bg-red-500/20 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition"><Trash2 size={20} /></button>
                                </div>
                            </div>
                        ))}
                        {myPosts.length === 0 && <div className="col-span-3 text-center py-10 text-gray-500 text-sm">Пост жоқ</div>}
                    </div>
                )}

                {/* 2-ТАБ: ТУСАЛАР (Bookmark) */}
                {activeTab === 'EVENTS' && (
                    <div className="flex flex-col gap-3 p-3">
                        {myEvents.map((event) => (
                            <div key={event.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-lg bg-gray-800 overflow-hidden shrink-0">
                                    <img src={event.imageUrl || "https://placehold.co/100"} alt="event" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-sm">{event.title}</h3>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Calendar size={12}/> {event.date}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={12}/> {event.location}</p>
                                </div>
                                <button onClick={() => handleDeleteEvent(event.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
                            </div>
                        ))}
                        {myEvents.length === 0 && <div className="text-center py-10 text-gray-500 text-sm">Ұйымдастырған ивенттер жоқ</div>}
                    </div>
                )}

                {/* 3-ТАБ: БИЛЕТТЕР (Ticket) */}
                {activeTab === 'TICKET' && (
                    <div className="text-center py-10 text-gray-500 text-sm">Билеттер жоқ</div>
                )}
            </div>

            {/* Модальдар */}
            <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={user} onUpdate={setUser} />
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} onUpdate={setUser} />
            <UserListModal isOpen={userListModal.isOpen} onClose={() => setUserListModal({ ...userListModal, isOpen: false })} title={userListModal.title} users={userListModal.users} loading={listLoading} />

            {/* 🔥 Жаңа Модаль */}
            <CreatePostModal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} onPostCreated={fetchData} />
        </div>
    );
};

export default ProfilePage;