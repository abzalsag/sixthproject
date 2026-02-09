import React, { useState } from 'react';
import { X, CreditCard, Calendar, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, onConfirm, price, eventName }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handlePay = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Төлемді имитация жасау (2 секунд күту)
        setTimeout(() => {
            setLoading(false);
            onConfirm(); // Төлем сәтті өтті
            toast.success("Төлем қабылданды! ✅");
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-3xl p-6 relative shadow-[0_0_50px_rgba(204,255,0,0.1)]">

                {/* Жабу батырмасы */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-black italic text-white mb-1">САТЫП АЛУ</h2>
                <p className="text-gray-400 mb-6">{eventName} — <span className="text-[#CCFF00] font-bold">{price} ₸</span></p>

                <form onSubmit={handlePay} className="space-y-4">

                    {/* Карта номері */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Карта нөмірі</label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-3.5 text-gray-500" size={20} />
                            <input
                                type="text" placeholder="0000 0000 0000 0000" required maxLength="19"
                                className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#CCFF00] outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Мерзімі */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">Мерзімі</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-3.5 text-gray-500" size={20} />
                                <input
                                    type="text" placeholder="MM/YY" required maxLength="5"
                                    className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#CCFF00] outline-none"
                                />
                            </div>
                        </div>
                        {/* CVV */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">CVV</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                                <input
                                    type="password" placeholder="123" required maxLength="3"
                                    className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#CCFF00] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-[#CCFF00] text-black py-4 rounded-xl font-black text-lg hover:bg-[#b3ff00] transition active:scale-95 mt-4"
                    >
                        {loading ? "ТӨЛЕМ ЖҮРУДЕ..." : `ТӨЛЕУ ${price} ₸`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;