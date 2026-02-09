import React, { useState, useEffect } from 'react';
import { X, Save, User, Lock, Bell, Trash2, Key, Mail, ShieldAlert } from 'lucide-react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const SettingsModal = ({ isOpen, onClose, user, onUpdate }) => {
    // 3 Таб: Профиль, Аккаунт (Жаңа), Құпиялылық/Хабарлама
    const [activeTab, setActiveTab] = useState('PROFILE');
    const [loading, setLoading] = useState(false);

    // НЕГІЗГІ ДЕРЕКТЕР
    const [formData, setFormData] = useState({
        firstname: '', lastname: '', city: '', bio: '',
        interests: [],
        isPrivate: false, showOnlineStatus: true,
        pushNotifications: true, emailNotifications: false
    });

    // ПАРОЛЬ АУЫСТЫРУ ҮШІН (Бөлек state)
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                city: user.city || '',
                bio: user.bio || '',
                interests: user.interests ? user.interests.split(',') : [],
                isPrivate: user.isPrivate || false,
                showOnlineStatus: user.showOnlineStatus !== false,
                pushNotifications: user.pushNotifications !== false,
                emailNotifications: user.emailNotifications || false
            });
        }
    }, [user]);

    if (!isOpen) return null;

    // 1. ПРОФИЛЬДІ САҚТАУ
    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const dataToSend = { ...formData, interests: formData.interests.join(',') };
            const res = await api.put('/api/users/settings', dataToSend);
            onUpdate(res.data);
            toast.success("Баптаулар сақталды! ✅");

            // Егер "Приват" қосылса, ескерту береміз
            if (formData.isPrivate) toast("Профиль жабылды 🔒", { icon: '🛡️' });

        } catch (error) {
            toast.error("Сақталмады ❌");
        } finally {
            setLoading(false);
        }
    };

    // 2. ПАРОЛЬДІ ӨЗГЕРТУ
    const handleChangePassword = async () => {
        if (!passData.oldPassword || !passData.newPassword) return toast.error("Барлық өрісті толтырыңыз");
        try {
            await api.put('/api/users/password', passData);
            toast.success("Пароль өзгерді! Жаңасын ұмытпаңыз. 🔑");
            setPassData({ oldPassword: '', newPassword: '' });
        } catch (error) {
            toast.error("Ескі пароль қате!");
        }
    };

    // 3. АККАУНТТЫ ӨШІРУ
    const handleDeleteAccount = async () => {
        const confirmText = prompt("Өшіру үшін 'DELETE' деп жазыңыз:");
        if (confirmText !== 'DELETE') return toast.error("Қате сөз! Өшірілмеді.");

        try {
            await api.delete('/api/users/me');
            toast.success("Аккаунт өшірілді. Сау болыңыз! 👋");
            window.location.reload(); // Сайтты жаңартып жібереміз (Login бетіне шығады)
        } catch (error) {
            toast.error("Өшіру мүмкін болмады");
        }
    };

    const toggleInterest = (interest) => {
        const currentInterests = formData.interests || [];
        if (currentInterests.includes(interest)) {
            setFormData({ ...formData, interests: currentInterests.filter(i => i !== interest) });
        } else {
            setFormData({ ...formData, interests: [...currentInterests, interest] });
        }
    };

    const interestOptions = ["Music 🎵", "Sport ⚽", "Travel ✈️", "Art 🎨", "Tech 💻", "Party 🎉", "Food 🍔", "Movies 🎬"];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] w-full max-w-4xl h-[85vh] rounded-3xl border border-gray-800 flex overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

                {/* SIDEBAR */}
                <div className="w-1/4 bg-black border-r border-gray-800 p-6 flex flex-col gap-2">
                    <h2 className="text-white font-bold text-xl mb-6 px-2">Баптаулар</h2>

                    <button onClick={() => setActiveTab('PROFILE')} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition ${activeTab === 'PROFILE' ? 'bg-[#CCFF00] text-black' : 'text-gray-400 hover:bg-gray-900'}`}>
                        <User size={18} /> Профиль
                    </button>
                    <button onClick={() => setActiveTab('ACCOUNT')} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition ${activeTab === 'ACCOUNT' ? 'bg-[#CCFF00] text-black' : 'text-gray-400 hover:bg-gray-900'}`}>
                        <Key size={18} /> Аккаунт
                    </button>
                    <button onClick={() => setActiveTab('PRIVACY')} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition ${activeTab === 'PRIVACY' ? 'bg-[#CCFF00] text-black' : 'text-gray-400 hover:bg-gray-900'}`}>
                        <ShieldAlert size={18} /> Құпиялылық
                    </button>
                </div>

                {/* CONTENT */}
                <div className="w-3/4 p-8 overflow-y-auto custom-scrollbar text-white relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold uppercase tracking-wide text-[#CCFF00]">
                            {activeTab === 'PROFILE' && "Профильді өңдеу"}
                            {activeTab === 'ACCOUNT' && "Қауіпсіздік және Логин"}
                            {activeTab === 'PRIVACY' && "Құпиялылық және Хабарламалар"}
                        </h3>
                        <button onClick={onClose} className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* --- 1. TAB: PROFILE (5 Пункт) --- */}
                    {activeTab === 'PROFILE' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-xs text-gray-500 font-bold">АТЫ</label><input value={formData.firstname} onChange={(e) => setFormData({...formData, firstname: e.target.value})} className="input-style" /></div>
                                <div className="space-y-1"><label className="text-xs text-gray-500 font-bold">ТЕГІ</label><input value={formData.lastname} onChange={(e) => setFormData({...formData, lastname: e.target.value})} className="input-style" /></div>
                            </div>
                            <div className="space-y-1"><label className="text-xs text-gray-500 font-bold">ҚАЛА</label><input value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="input-style" /></div>
                            <div className="space-y-1"><label className="text-xs text-gray-500 font-bold">БИО</label><textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="input-style h-24 resize-none" /></div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-bold">ҚЫЗЫҒУШЫЛЫҚТАР</label>
                                <div className="flex flex-wrap gap-2">
                                    {interestOptions.map((interest) => (
                                        <button key={interest} onClick={() => toggleInterest(interest)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${(formData.interests || []).includes(interest) ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-transparent text-gray-400 border-gray-700'}`}>{interest}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- 2. TAB: ACCOUNT (3 Пункт) --- */}
                    {activeTab === 'ACCOUNT' && (
                        <div className="space-y-8">
                            {/* Email (Read Only) */}
                            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 flex items-center gap-4 opacity-70">
                                <Mail className="text-gray-500" />
                                <div><p className="text-xs text-gray-500 font-bold">POCHTA</p><p className="font-mono">{user?.email}</p></div>
                            </div>

                            {/* Change Password */}
                            <div className="space-y-4 border-t border-gray-800 pt-6">
                                <h4 className="font-bold flex items-center gap-2"><Key size={18} className="text-[#CCFF00]"/> Парольді өзгерту</h4>
                                <input type="password" placeholder="Ескі пароль" value={passData.oldPassword} onChange={(e) => setPassData({...passData, oldPassword: e.target.value})} className="input-style" />
                                <input type="password" placeholder="Жаңа пароль" value={passData.newPassword} onChange={(e) => setPassData({...passData, newPassword: e.target.value})} className="input-style" />
                                <button onClick={handleChangePassword} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700">Өзгерту</button>
                            </div>

                            {/* Delete Account */}
                            <div className="space-y-4 border-t border-red-900/30 pt-6">
                                <h4 className="font-bold text-red-500 flex items-center gap-2"><Trash2 size={18}/> Қауіпті аймақ</h4>
                                <p className="text-xs text-gray-500">Аккаунтты өшірсеңіз, барлық деректер жойылады.</p>
                                <button onClick={handleDeleteAccount} className="bg-red-500/10 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition">Аккаунтты өшіру</button>
                            </div>
                        </div>
                    )}

                    {/* --- 3. TAB: PRIVACY & NOTIFICATIONS (4 Пункт) --- */}
                    {activeTab === 'PRIVACY' && (
                        <div className="space-y-4">
                            {[
                                { title: "Жабық профиль", desc: "Тек подписчиктер көре алады", key: 'isPrivate' },
                                { title: "Онлайн статус", desc: "Желіде екеніңізді көрсету", key: 'showOnlineStatus' },
                                { title: "Push хабарламалар", desc: "Жаңа лайктар туралы ескерту", key: 'pushNotifications' },
                                { title: "Email хабарламалар", desc: "Жаңалықтарды поштаға жіберу", key: 'emailNotifications' }
                            ].map((item) => (
                                <div key={item.key} className="flex justify-between items-center p-4 bg-gray-900 rounded-xl border border-gray-800">
                                    <div><h4 className="font-bold text-sm">{item.title}</h4><p className="text-xs text-gray-500">{item.desc}</p></div>
                                    <input type="checkbox" checked={formData[item.key]} onChange={(e) => setFormData({...formData, [item.key]: e.target.checked})} className="accent-[#CCFF00] w-5 h-5 cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SAVE BUTTON (Тек Profile және Privacy үшін) */}
                    {activeTab !== 'ACCOUNT' && (
                        <div className="mt-8 pt-4 border-t border-gray-800">
                            <button onClick={handleSaveProfile} disabled={loading} className="w-full bg-[#CCFF00] text-black py-3 rounded-xl font-bold hover:scale-[1.02] transition active:scale-95 disabled:opacity-50">
                                {loading ? "Сақталуда..." : "БАРЛЫҒЫН САҚТАУ"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <style>{`.input-style { width: 100%; background: #111; border: 1px solid #333; border-radius: 8px; padding: 12px; color: white; outline: none; transition: 0.2s; } .input-style:focus { border-color: #CCFF00; }`}</style>
        </div>
    );
};

export default SettingsModal;