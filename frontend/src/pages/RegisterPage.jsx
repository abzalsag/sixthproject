import React, { useState, useEffect } from 'react'; // 🔥 useEffect қосуды ұмытпа!
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const RegisterPage = ({ onLoginSuccess }) => {
    const navigate = useNavigate();

    // 🔥 ЖАҢА ҚОСЫЛҒАН БӨЛІК:
    // Бет ашылғанда ескі "қоқыс" токенді өшіреміз
    useEffect(() => {
        localStorage.removeItem('token');
        console.log("Таза парақтан бастадық: Ескі токен өшірілді 🗑️");
    }, []);

    // Форма деректері
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    // Input-қа жазғанда state-ті өзгерту
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Тіркелу батырмасын басқанда
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Backend-ке жіберу
            const response = await api.post('/api/auth/register', formData);

            // 2. Токенді алу және сақтау
            const { token } = response.data;
            localStorage.setItem('token', token); // Жаңа, таза токен сақталды ✅

            // 3. Сәтті хабарлама
            toast.success(`Қош келдің, ${formData.firstname}! 🎉`);

            // 4. Басты бетке өту
            if (onLoginSuccess) onLoginSuccess();
            navigate('/');

        } catch (error) {
            console.error(error);
            // Қате шықса, нақтырақ түсіндіреміз
            if (error.response && error.response.status === 403) {
                toast.error("Бұл email тіркеліп қойған сияқты!");
            } else {
                toast.error("Тіркелу кезінде қате шықты!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Неон эффектілері */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#CCFF00] rounded-full blur-[150px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20"></div>

            <div className="z-10 w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-5xl font-black italic tracking-tighter mb-2">JOIN TUSA</h1>
                    <p className="text-gray-400">Ең мықты тусовкалар осында</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Аты және Тегі */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="absolute left-4 top-4 text-gray-500" size={20} />
                            <input
                                type="text" name="firstname" placeholder="Атың" required
                                value={formData.firstname} onChange={handleChange}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-[#CCFF00] outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="text" name="lastname" placeholder="Тегің" required
                                value={formData.lastname} onChange={handleChange}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 pl-4 pr-4 focus:border-[#CCFF00] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-gray-500" size={20} />
                        <input
                            type="email" name="email" placeholder="Email" required
                            value={formData.email} onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-[#CCFF00] outline-none transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-gray-500" size={20} />
                        <input
                            type="password" name="password" placeholder="Құпия сөз" required
                            value={formData.password} onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-[#CCFF00] outline-none transition-all"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-[#CCFF00] text-black py-4 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? "ТІРКЕЛУДЕ..." : (
                            <>ТІРКЕЛУ <ArrowRight size={24} /></>
                        )}
                    </button>
                </form>

                {/* 🔥 ЛОГИНГЕ ӨТУ */}
                <p className="text-center text-gray-500">
                    Аккаунтың бар ма?
                    <span
                        onClick={() => navigate('/login')}
                        className="text-[#CCFF00] cursor-pointer hover:underline ml-2 font-bold"
                    >
                        Кіру
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;