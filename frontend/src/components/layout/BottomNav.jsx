import React from 'react';
// 🔥 'PlusSquare' орнына 'Plus' қойдым (домалақ батырмаға әдемірек)
import { Home, MessageCircle, Plus, Search, User } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
    const activeColor = "text-[#CCFF00]";
    const inactiveColor = "text-gray-500 hover:text-white transition";

    return (
        <div className="w-full flex justify-center pb-6 pt-4 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-auto">
            <div className="flex justify-between items-center bg-[#111] border border-gray-800 rounded-full px-6 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] gap-6 relative">

                {/* 1. HOME */}
                <button onClick={() => setActiveTab('home')} className={`p-2 ${activeTab === 'home' ? activeColor : inactiveColor}`}>
                    <Home size={26} />
                </button>

                {/* 2. CHAT */}
                <button onClick={() => setActiveTab('chat')} className={`p-2 ${activeTab === 'chat' ? activeColor : inactiveColor}`}>
                    <MessageCircle size={26} />
                </button>

                {/* 3. CREATE (ОРТАДАҒЫ ПЛЮС) */}
                <div className="relative -top-6 mx-2">
                    <button
                        onClick={() => setActiveTab('create')}
                        className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.4)] border-[6px] border-black hover:scale-110 transition active:scale-95"
                    >
                        <Plus size={32} strokeWidth={3} />
                    </button>
                </div>

                {/* 4. SEARCH */}
                <button onClick={() => setActiveTab('search')} className={`p-2 ${activeTab === 'search' ? activeColor : inactiveColor}`}>
                    <Search size={26} />
                </button>

                {/* 5. PROFILE */}
                <button onClick={() => setActiveTab('profile')} className={`p-2 ${activeTab === 'profile' ? activeColor : inactiveColor}`}>
                    <User size={26} />
                </button>

            </div>
        </div>
    );
};

export default BottomNav;