import React, { useState } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

const AuthPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true); // Login немесе Register ауыстыру
    const [loading, setLoading] = useState(false);

    // Форма деректері
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Қай url-ге жібереміз?
        const endpoint = isLogin ? '/api/v1/auth/authenticate' : '/api/v1/auth/register';

        try {
            const res = await api.post(endpoint, formData);

            // Токенді сақтау
            const token = res.data.token;
            localStorage.setItem('token', token);

            toast.success(isLogin ? "Қош келдіңіз! 👋" : "Тіркелу сәтті өтті! ✅");
            onLogin(token); // App.jsx-ке хабарлау

        } catch (error) {
            console.error(error);
            toast.error("Қате! Логин немесе пароль дұрыс емес.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">

            {/* Логотип */}
            <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-5xl font-black italic tracking-tighter text-white mb-2">
                    ALMATY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-green-500">TONIGHT</span>
                </h1>
                <p className="text-gray-400 font-medium">Түнгі қала сені күтуде</p>
            </div>

            {/* Форма картасы */}
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-[0_0_50px_rgba(204,255,0,0.1)]">

                {/* Ауыстырғыш (Tabs) */}
                <div className="flex bg-black p-1 rounded-xl mb-8 border border-gray-800">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all ${isLogin ? 'bg-[#CCFF00] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        КІРУ
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all ${!isLogin ? 'bg-[#CCFF00] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        ТІРКЕЛУ
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Тіркелу кезінде аты-жөнін сұрау */}
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-300">
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
                                <input
                                    name="firstname" placeholder="Аты" required
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#CCFF00] outline-none"
                                />
                            </div>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
                                <input
                                    name="lastname" placeholder="Тегі" required
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#CCFF00] outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
                        <input
                            name="email" type="email" placeholder="Email" required
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#CCFF00] outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                        <input
                            name="password" type={showPassword ? "text" : "password"} placeholder="Құпия сөз" required
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-12 text-white focus:border-[#CCFF00] outline-none"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-white">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-[#CCFF00] text-black py-4 rounded-xl font-black text-lg hover:bg-[#b3ff00] transition active:scale-95 mt-4 flex justify-center items-center"
                    >
                        {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div> : (isLogin ? "КІРУ" : "ТІРКЕЛУ")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;