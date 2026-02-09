import React from 'react';
import { X, UserMinus, UserPlus } from 'lucide-react';

const UserListModal = ({ isOpen, onClose, title, users, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#1a1a1a] w-full max-w-sm rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h3 className="font-bold text-lg text-white">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full transition">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* List */}
                <div className="max-h-96 overflow-y-auto p-2">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Жүктелуде...</div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">Тізім бос 🤷‍♂️</div>
                    ) : (
                        users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-xl transition cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border border-gray-600">
                                        <img
                                            src={user.avatarUrl || "https://placehold.co/100"}
                                            alt={user.firstname}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-white">{user.firstname}</p>
                                        <p className="text-xs text-gray-500">@{user.email.split('@')[0]}</p>
                                    </div>
                                </div>

                                {/* Кнопка (дизайн үшін ғана, функциясын кейін қосуға болады) */}
                                <button className="bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-gray-600">
                                    Profile
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserListModal;