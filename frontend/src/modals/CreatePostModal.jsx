import React, { useState } from 'react';
import { X, Calendar, Upload, Camera } from 'lucide-react'; // Camera иконкасын қостық
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [caption, setCaption] = useState("");

    // 🔥 1. URL емес, ФАЙЛ ұстаймыз
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // Экранда көрсету үшін
    const [loading, setLoading] = useState(false);

    // Default = Бүгінгі күн
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // 🔥 2. Файл таңдағанда істейтін функция
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Сурет таңдаңыз!");

        setLoading(true);

        try {
            // А) Суретті серверге жүктейміз
            const uploadData = new FormData();
            uploadData.append('file', file);

            const uploadRes = await api.post('/api/files/upload', uploadData);
            const uploadedImageUrl = uploadRes.data; // Серверден ссылка келді

            // Б) Сол ссылкамен Пост жасаймыз (Time Travel)
            await api.post('/api/posts', null, {
                params: {
                    imageUrl: uploadedImageUrl,
                    caption: caption,
                    date: selectedDate
                }
            });

            toast.success("Естелік сақталды! 📸");

            // Тазалау
            setCaption("");
            setFile(null);
            setPreviewUrl(null);
            onPostCreated();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Қате шықты! (Сервер қосулы ма?)");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-gray-800 p-6">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white font-bold text-xl">Жаңа естелік салу</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* 🔥 3. СУРЕТ ЖҮКТЕУ АЙМАҒЫ (Click жасағанда Галерея/Камера ашылады) */}
                    <div className="relative w-full h-56 bg-black/50 rounded-xl border-2 border-dashed border-gray-700 hover:border-[#CCFF00] transition flex flex-col items-center justify-center overflow-hidden group">

                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                    <p className="text-white text-xs font-bold flex items-center gap-2">
                                        <Camera size={16}/> Басқасын таңдау
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-gray-500">
                                <Upload size={32} className="mb-2 text-[#CCFF00]"/>
                                <p className="text-sm font-bold text-white">Сурет жүктеу</p>
                                <p className="text-xs text-gray-500">Галерея немесе Камера</p>
                            </div>
                        )}

                        {/* 🔥 ОСЫ INPUT ТЕЛЕФОНДА КАМЕРАНЫ АШАДЫ */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    {/* Описание */}
                    <textarea
                        placeholder="Бұл қандай сәт еді?..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full bg-[#333] text-white rounded-lg p-3 outline-none resize-none h-24 border border-transparent focus:border-[#CCFF00]"
                    />

                    {/* Time Travel */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-xs font-bold flex items-center gap-2">
                            <Calendar size={14} className="text-[#CCFF00]"/>
                            ҚАЙ УАҚЫТТА БОЛҒАН?
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-[#333] text-white p-3 rounded-lg outline-none focus:border-[#CCFF00] border border-transparent w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#CCFF00] text-black font-bold py-3 rounded-xl hover:scale-105 transition active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Жүктелуде..." : "Жариялау"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;