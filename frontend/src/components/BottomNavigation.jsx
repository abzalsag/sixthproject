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

export default function BottomNavigation({ current, onChange, dark, onDarkToggle }) {
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
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </div>
                <span className="nav-create-label">{LABELS['create']}</span>
            </button>

            {/* ── EXPLORE ── */}
            <button
                onClick={() => onChange('explore')}
                className={`nav-btn${current === 'explore' ? ' active' : ''}`}
                aria-label="Explore"
            >
                {current === 'explore' ? ICONS.explore.filled : ICONS.explore.outline}
                <span className="nav-btn-label">Explore</span>
            </button>

            {/* ── DARK MODE toggle (Profile орнына) ── */}
            <button
                onClick={onDarkToggle}
                className="nav-btn"
                aria-label={dark ? 'Light mode' : 'Dark mode'}
                style={{ color: dark ? '#ffd700' : 'var(--text-muted)' }}
            >
                {dark ? (
                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                    </svg>
                ) : (
                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                )}
                <span className="nav-btn-label">{dark ? 'Жарық' : 'Күн/Түн'}</span>
            </button>

        </nav>
    )
}
