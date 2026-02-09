import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import CreatePage from './pages/CreatePage';
import TicketsPage from './pages/TicketsPage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import ChatPage from './pages/ChatPage';
import EventDetailsPage from './pages/EventDetailsPage';
import BottomNav from './components/layout/BottomNav';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [activeTab, setActiveTab] = useState('home');
    const [selectedEventId, setSelectedEventId] = useState(null);

    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    const handleLogout = () => {
        setToken(null);
        setActiveTab('home');
    };

    const handleEventClick = (id) => {
        setSelectedEventId(id);
        setActiveTab('event-details');
    };

    if (!token) {
        return (
            <>
                <Toaster position="top-center" />
                <AuthPage onLogin={(newToken) => setToken(newToken)} />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Toaster position="top-center" />

            {/* --- 1. FULL SCREEN PAGES --- */}

            {activeTab === 'create' && (
                <CreatePage onCreated={() => setActiveTab('home')} onBack={() => setActiveTab('home')} />
            )}

            {activeTab === 'tickets' && (
                <TicketsPage onBack={() => setActiveTab('home')} />
            )}

            {activeTab === 'event-details' && (
                <EventDetailsPage
                    eventId={selectedEventId}
                    onBack={() => setActiveTab('home')}
                />
            )}

            {/* --- 2. MAIN TABS --- */}
            {(activeTab === 'home' || activeTab === 'profile' || activeTab === 'search' || activeTab === 'chat') && (
                <>
                    {/* HOME */}
                    {activeTab === 'home' && (
                        <>
                            <FeedPage
                                onOpenTickets={() => setActiveTab('tickets')}
                                onEventClick={handleEventClick}
                            />

                            {/* 🔥 ӨЗГЕРІС: ОСЫ ЖЕРДЕГІ АРТЫҚ "CREATE +" БАТЫРМАСЫН АЛЫП ТАСТАДЫМ.
                                Енді ол кедергі жасамайды. */}
                        </>
                    )}

                    {activeTab === 'profile' && <ProfilePage onLogout={handleLogout} />}
                    {activeTab === 'search' && <ExplorePage />}
                    {activeTab === 'chat' && <ChatPage />}

                    <div className="fixed bottom-0 left-0 right-0 z-50">
                        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                </>
            )}
        </div>
    );
}

export default App;