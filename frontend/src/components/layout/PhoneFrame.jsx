import React from 'react';

const PhoneFrame = ({ children }) => {
    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
            {/* Компьютерде (md:screens): Телефон рамкасы көрінеді
         Телефонда: Рамка жоғалып, толық экран болады
      */}
            <div className="relative w-full max-w-[400px] h-[850px] bg-black md:rounded-[3rem] md:border-[8px] md:border-gray-800 shadow-2xl overflow-hidden flex flex-col">

                {/* Dynamic Island (тек компьютерде көрінеді) */}
                <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>

                {/* Screen Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative bg-black text-white">
                    {children}
                </div>

                {/* Home Indicator (iOS сызығы) */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full md:block hidden"></div>
            </div>
        </div>
    );
};

export default PhoneFrame;