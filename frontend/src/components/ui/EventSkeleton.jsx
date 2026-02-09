import React from 'react';

const EventSkeleton = () => {
    return (
        <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl animate-pulse">
            {/* Сурет орны (Сұр блок) */}
            <div className="h-80 bg-gray-800 w-full" />

            {/* Мәтіндер орны */}
            <div className="p-6 space-y-4">
                {/* Title (Тақырып) */}
                <div className="h-8 bg-gray-800 rounded-lg w-3/4" />

                {/* Location & Date */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-800 rounded-full" />
                        <div className="h-4 bg-gray-800 rounded w-1/2" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-800 rounded-full" />
                        <div className="h-4 bg-gray-800 rounded w-1/3" />
                    </div>
                </div>

                {/* Buttons (Астыңғы батырмалар) */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-gray-800 rounded-full" />
                        <div className="w-8 h-8 bg-gray-800 rounded-full" />
                        <div className="w-8 h-8 bg-gray-800 rounded-full" />
                    </div>
                    <div className="w-32 h-10 bg-gray-800 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default EventSkeleton;