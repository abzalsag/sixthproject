/* ══════════════════════════════════
   TUSA Bottom Navigation
   True iOS-style — pill indicator top,
   spring bounce, Space Mono labels
   ══════════════════════════════════ */

const ICONS = {
    home: {
        outline: (
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3V9.5z" />
            </svg>
        ),
        filled: (
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3V9.5z" />
            </svg>
        ),
    },
    chats: {
        outline: (
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
        ),
        filled: (
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
        ),
    },
    explore: {
        outline: (
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
        filled: (
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
    },
    profile: {
        outline: (
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        filled: (
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 0114 0H5z" />
            </svg>
        ),
    },
}

const LABELS = {
    home: 'Home',
    chats: 'Chats',
    create: 'Create',
    explore: 'Explore',
    profile: 'Profile',
}

export default function BottomNavigation({ current, onChange }) {
    return (
        <nav className="bottom-nav">

            {/* ── HOME & CHATS ── */}
            {['home', 'chats'].map(id => (
                <button
                    key={id}
                    onClick={() => onChange(id)}
                    className={`nav-btn${current === id ? ' active' : ''}`}
                    aria-label={LABELS[id]}
                >
                    {current === id ? ICONS[id].filled : ICONS[id].outline}
                    <span className="nav-btn-label">{LABELS[id]}</span>
                </button>
            ))}

            {/* ── CREATE — center ── */}
            <button
                onClick={() => onChange('create')}
                className="nav-create-btn"
                aria-label="Create"
            >
                <div
                    className="nav-create-inner"
                    style={{
                        transform: current === 'create'
                            ? 'rotate(45deg) scale(0.9)'
                            : 'rotate(0deg) scale(1)',
                        background: current === 'create' ? '#222' : '#000',
                    }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="square">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </div>
                <span className="nav-create-label">{LABELS['create']}</span>
            </button>

            {/* ── EXPLORE & PROFILE ── */}
            {['explore', 'profile'].map(id => (
                <button
                    key={id}
                    onClick={() => onChange(id)}
                    className={`nav-btn${current === id ? ' active' : ''}`}
                    aria-label={LABELS[id]}
                >
                    {current === id ? ICONS[id].filled : ICONS[id].outline}
                    <span className="nav-btn-label">{LABELS[id]}</span>
                </button>
            ))}

        </nav>
    )
}
