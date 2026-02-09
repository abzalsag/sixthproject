import React, { useState } from 'react';
import { MapPin, Calendar, Tag, UploadCloud, X, ArrowLeft, Layers, DollarSign, Camera } from 'lucide-react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const CATEGORIES = ["Party", "Concert", "Cinema", "Sport", "Meetup", "Other"];

const CreatePage = ({ onCreated, onBack }) => {
    // 🔥 1. ЖАҢА STATE: Режим (Пост па әлде Ивент пе?)
    const [mode, setMode] = useState('POST'); // 'POST' or 'EVENT'

    // Ескі деректер сол күйінде
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        eventDate: '',
        price: '',
        description: '',
        category: 'Party'
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => { // Form submit емес, кнопка басқанда
        if (!image) return toast.error("Суретті жүктеңіз!");

        // Егер EVENT болса, тақырып міндетті
        if (mode === 'EVENT' && !formData.title) return toast.error("Тақырыпты жазыңыз!");

        setLoading(true);
        try {
            // 1. Суретті серверге жүктеу (Сенің ескі кодың)
            const fileData = new FormData();
            fileData.append('file', image);
            const uploadRes = await api.post('/api/files/upload', fileData);
            const imageUrl = uploadRes.data;

            // 2. Деректерді дайындау
            const payload = {
                imageUrl: imageUrl,
                description: formData.description,
                // Егер POST болса, кейбір өрістерді автоматты толтырамыз
                title: mode === 'POST' ? "New Post" : formData.title,
                location: mode === 'POST' ? "" : formData.location,
                eventDate: mode === 'POST' ? new Date().toISOString() : formData.eventDate,
                price: mode === 'POST' ? 0 : formData.price,
                category: mode === 'POST' ? "Other" : formData.category
            };

            await api.post('/api/events', payload);

            toast.success(mode === 'EVENT' ? "TUSA құрылды! 🔥" : "Пост жарияланды! ✅");
            if (onCreated) onCreated();
        } catch (error) {
            console.error(error);
            toast.error("Қате шықты");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col z-50">

            {/* --- HEADER (Instagram Style) --- */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={onBack} className="p-2 rounded-full bg-black/30 backdrop-blur-md">
                    <X size={24} />
                </button>
                <h3 className="font-bold tracking-widest text-sm drop-shadow-md">NEW {mode}</h3>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="text-[#CCFF00] font-bold text-sm bg-gray-900/50 px-4 py-2 rounded-full backdrop-blur-md hover:bg-[#CCFF00] hover:text-black transition"
                >
                    {loading ? "..." : "SHARE"}
                </button>
            </div>

            {/* --- MEDIA AREA (ФОТО ТАҢДАУ) --- */}
            <div className="relative flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
                {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center text-gray-500 flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full border-2 border-gray-700 flex items-center justify-center mb-2">
                            <Camera size={40} className="opacity-50" />
                        </div>
                        <p className="text-sm font-bold">Сурет таңдау</p>
                    </div>
                )}

                {/* Жасырын Input (Бүкіл экранды басып тұрады) */}
                {!preview && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                )}

                {/* Егер сурет таңдалса, ауыстыру кнопкасы */}
                {preview && (
                    <div className="absolute bottom-4 right-4 z-10">
                        <label className="bg-black/50 p-2 rounded-full text-white cursor-pointer backdrop-blur-md flex items-center gap-2 px-4">
                            <UploadCloud size={16}/> <span className="text-xs font-bold">Change</span>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>
                )}
            </div>

            {/* --- BOTTOM SHEET (ФОРМАЛАР) --- */}
            <div className="bg-[#111] border-t border-gray-800 rounded-t-3xl -mt-6 relative z-10 flex flex-col max-h-[50vh]">

                {/* TABS SWITCHER */}
                <div className="flex justify-center pt-2">
                    <div className="w-12 h-1 bg-gray-700 rounded-full mb-2"></div>
                </div>
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => setMode('POST')}
                        className={`flex-1 py-4 text-center font-black text-sm transition tracking-wider ${mode === 'POST' ? 'text-white border-b-2 border-[#CCFF00]' : 'text-gray-500'}`}
                    >
                        POST
                    </button>
                    <button
                        onClick={() => setMode('EVENT')}
                        className={`flex-1 py-4 text-center font-black text-sm transition tracking-wider ${mode === 'EVENT' ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]' : 'text-gray-500'}`}
                    >
                        EVENT
                    </button>
                </div>

                {/* SCROLLABLE FORM AREA */}
                <div className="overflow-y-auto p-5 space-y-4 pb-10">

                    {/* 1. СИПАТТАМА (Ортақ) */}
                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex-shrink-0 overflow-hidden">
                            {preview ? <img src={preview} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gray-700"></div>}
                        </div>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Сипаттама немесе ойыңыз..."
                            className="w-full bg-transparent text-white outline-none resize-none h-20 text-sm pt-2 placeholder-gray-600"
                        />
                    </div>

                    {/* 2. ТЕК EVENT БОЛСА ШЫҒАТЫН ПОЛЯЛАР */}
                    {mode === 'EVENT' && (
                        <div className="space-y-4 animate-fade-in border-t border-gray-800 pt-4">

                            {/* Title */}
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <Tag size={18} className="text-[#CCFF00]" />
                                <input
                                    type="text"
                                    placeholder="Тусаның аты"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="bg-transparent text-white w-full outline-none text-sm font-bold"
                                />
                            </div>

                            {/* Date & Time */}
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <Calendar size={18} className="text-[#CCFF00]" />
                                <input
                                    type="datetime-local"
                                    value={formData.eventDate}
                                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                                    className="bg-transparent text-white w-full outline-none text-sm"
                                />
                            </div>

                            {/* Location */}
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <MapPin size={18} className="text-[#CCFF00]" />
                                <input
                                    type="text"
                                    placeholder="Орны (Мекен-жай)"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    className="bg-transparent text-white w-full outline-none text-sm"
                                />
                            </div>

                            {/* Price */}
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <DollarSign size={18} className="text-[#CCFF00]" />
                                <input
                                    type="number"
                                    placeholder="Бағасы (0 = Тегін)"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    className="bg-transparent text-white w-full outline-none text-sm font-bold"
                                />
                            </div>

                            {/* Categories */}
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFormData({...formData, category: cat})}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition ${formData.category === cat ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-transparent text-gray-400 border-gray-700'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePage;