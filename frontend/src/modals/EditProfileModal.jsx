
import React, { useState, useEffect } from 'react';
import { X, Camera, Save, User } from 'lucide-react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {

    // 🔥 BIO қосылды
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        bio: '' // ЖАҢА
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                bio: user.bio || '' // ЖАҢА
            });
        }
    }, [user]);

    if (!isOpen) return null;

    // --- Функциялар (ӨЗГЕРГЕН ЖОҚ) ---
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        const toastId = toast.loading("Сурет жүктелуде...");
        try {
            const res = await api.post('/api/files/upload', uploadData);
            const newAvatarUrl = res.data;

            await api.put('/api/users/me', { avatarUrl: newAvatarUrl });

            onUpdate({ ...user, avatarUrl: newAvatarUrl });
            toast.success("Аватар өзгерді!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Қате шықты", { id: toastId });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await api.put('/api/users/me', formData);

            onUpdate(res.data);
            toast.success("Профиль сақталды! ✅");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Сақталмады ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-gray-900 w-full max-w-sm rounded-3xl p-6 border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-white font-bold text-xl tracking-wide">Профильді өзгерту</h3>
                    <button onClick={onClose} className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
                        <X className="text-white" size={20} />
                    </button>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-28 h-28 group">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#CCFF00] shadow-xl">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <User size={40} className="text-gray-500" />
                                </div>
                            )}
                        </div>

                        <label className="absolute bottom-0 right-0 bg-white p-3 rounded-full cursor-pointer hover:scale-110 transition shadow-lg active:scale-95">
                            <Camera size={20} className="text-black" />
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                accept="image/*"
                            />
                        </label>
                    </div>
                    <p className="text-gray-500 text-xs mt-3">Суретті өзгерту үшін басыңыз</p>
                </div>

                {/* Inputs */}
                <div className="space-y-4 mb-8">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 ml-3">Аты</label>
                        <input
                            value={formData.firstname}
                            onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                            placeholder="Атыңыз"
                            className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-[#CCFF00] outline-none transition-colors font-bold"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 ml-3">Тегі</label>
                        <input
                            value={formData.lastname}
                            onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                            placeholder="Тегіңіз"
                            className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-[#CCFF00] outline-none transition-colors font-bold"
                        />
                    </div>

                    {/* 🔥 BIO ӨРІСІ (ЖАҢА) */}
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 ml-3">Өзім туралы</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            placeholder="Өзіңіз туралы жазыңыз..."
                            maxLength={150}
                            rows={3}
                            className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-[#CCFF00] outline-none transition-colors resize-none"
                        />
                        <p className="text-xs text-gray-600 text-right">{formData.bio.length}/150</p>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#CCFF00] text-black py-4 rounded-xl font-black text-lg flex justify-center items-center gap-2 hover:bg-[#b3ff00] transition active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                    {loading ? (
                        <span>ЖҮКТЕЛУДЕ...</span>
                    ) : (
                        <>
                            <Save size={20} /> САҚТАУ
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default EditProfileModal;