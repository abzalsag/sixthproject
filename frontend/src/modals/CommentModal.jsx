import React from 'react';
import { X, Send, User } from 'lucide-react';

const CommentModal = ({ isOpen, onClose, comments, loading, onSend, commentText, setCommentText }) => {
    if (!isOpen) return null;

    return (
        // 🔥 ӨЗГЕРІС 1: z-50 емес, z-[9999] қойдым. Енді бұл терезе БӘРІНІҢ үстінде тұрады.
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center pointer-events-none">

            {/* Қара фон */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity"
                onClick={onClose}
            ></div>

            {/* Модаль */}
            <div className="bg-gray-900 w-full max-w-lg h-[80vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl border-t sm:border border-gray-800 flex flex-col pointer-events-auto relative shadow-2xl animate-in slide-in-from-bottom-10">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-white font-bold text-lg">Пікірлер ({comments.length})</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Пікірлер */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {loading ? (
                        <div className="text-center text-gray-500 mt-10">Жүктелуде...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-center text-gray-600 mt-10 italic">
                            Әзірге пікір жоқ. Алғашқы болып жаз! 👇
                        </div>
                    ) : (
                        comments.map((comment, index) => (
                            <div key={index} className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#CCFF00] to-green-500 flex items-center justify-center shrink-0">
                                    <User size={20} className="text-black" />
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[#CCFF00] font-bold text-sm">
                                            {comment.user ? (comment.user.firstname || "Guest") : "Guest"}
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                        </span>
                                    </div>
                                    <p className="text-white text-sm mt-0.5">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer - Жазу өрісі */}
                {/* 🔥 ӨЗГЕРІС 2: pb-8 орнына pb-6 қойдым және input-қа autoFocus бердім */}
                <div className="p-4 border-t border-gray-800 bg-gray-900 pb-10">
                    <div className="flex gap-3 items-center">
                        <input
                            type="text"
                            autoFocus // Ашқанда бірден пернетақта шығу үшін
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSend()}
                            placeholder="Осы жерге жаз..."
                            className="flex-1 bg-black border border-gray-700 text-white rounded-full px-5 py-3 focus:border-[#CCFF00] outline-none transition-colors"
                        />
                        <button
                            onClick={onSend}
                            disabled={!commentText.trim()}
                            className="bg-[#CCFF00] text-black p-3 rounded-full hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CommentModal;