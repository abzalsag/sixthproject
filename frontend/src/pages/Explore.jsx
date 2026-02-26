import { useState, useEffect, useRef } from 'react'
import { EXPLORE_POSTS } from '../data/mockData'
import { searchUsers, toggleFollow } from '../services/api'

const PEOPLE = [
    { id: 1, user: 'aizat_k', name: 'Aizat K', emoji: '🎧', shade: '#e8e8e8', followers: '2.1K', isOrg: false },
    { id: 2, user: 'miras.djz', name: 'DJ Miras', emoji: '🎛️', shade: '#c8c8c8', followers: '8.4K', isOrg: false },
    { id: 3, user: 'fabric_kz', name: 'Fabric Club', emoji: '🔊', shade: '#b0b0b0', followers: '12K', isOrg: true },
    { id: 4, user: 'jake_live', name: 'Jake Live', emoji: '🎸', shade: '#e4e4e4', followers: '4.7K', isOrg: false },
    { id: 5, user: 'capitol', name: 'Capitol Hall', emoji: '🎤', shade: '#d0d0d0', followers: '9K', isOrg: true },
]

const TRENDING = ['#алматы', '#rave', '#techno', '#concert', '#event', '#club', '#indie', '#tusa', '#afro', '#djset']

/* ── Masonry grid ── */
function Masonry({ posts }) {
    const [big, setBig] = useState(null)
    const left = posts.filter((_, i) => i % 2 === 0)
    const right = posts.filter((_, i) => i % 2 !== 0)

    const col = (items) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {items.map(p => (
                <div
                    key={p.id}
                    onClick={() => setBig(p)}
                    style={{
                        background: p.shade,
                        height: p.h,
                        border: '2px solid #000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: Math.floor(p.h / 3.5),
                        cursor: 'pointer',
                        transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1), opacity 0.12s, box-shadow 0.12s',
                        boxShadow: '3px 3px 0 #000',
                    }}
                    onPointerDown={e => {
                        e.currentTarget.style.transform = 'scale(0.93) translate(2px,2px)'
                        e.currentTarget.style.opacity = '0.85'
                        e.currentTarget.style.boxShadow = '1px 1px 0 #000'
                    }}
                    onPointerUp={e => {
                        e.currentTarget.style.transform = ''
                        e.currentTarget.style.opacity = '1'
                        e.currentTarget.style.boxShadow = '3px 3px 0 #000'
                    }}
                    onPointerLeave={e => {
                        e.currentTarget.style.transform = ''
                        e.currentTarget.style.opacity = '1'
                        e.currentTarget.style.boxShadow = '3px 3px 0 #000'
                    }}
                >
                    {p.emoji}
                </div>
            ))}
        </div>
    )

    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, padding: 3 }}>
                {col(left)}
                {col(right)}
            </div>

            {big && (
                <div
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.86)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 20,
                    }}
                    onClick={() => setBig(null)}
                >
                    <div
                        className="pop-in"
                        style={{ background: '#fff', border: '2px solid #000', boxShadow: '8px 8px 0 #000', width: '100%' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '2px solid #000' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 32, height: 32, background: big.shade, border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{big.emoji}</div>
                                <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13 }}>@{big.user}</span>
                            </div>
                            <button
                                onClick={() => setBig(null)}
                                style={{ border: '2px solid #000', background: '#fff', width: 36, height: 36, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0 #000', transition: 'transform 0.1s, box-shadow 0.1s' }}
                                onPointerDown={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'none' }}
                                onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '2px 2px 0 #000' }}
                            >✕</button>
                        </div>
                        <div style={{ background: big.shade, height: 270, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90, borderBottom: '2px solid #000' }}>
                            {big.emoji}
                        </div>
                        <div style={{ padding: '14px 16px' }}>
                            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>
                                <strong style={{ fontFamily: "'Space Mono',monospace" }}>@{big.user}</strong> #алматы #tusa {big.emoji}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

/* ══════ EXPLORE PAGE ══════ */
export default function Explore() {
    const [q, setQ] = useState('')
    const [filter, setFilter] = useState('all')
    const [following, setFollowing] = useState({})
    const [apiUsers, setApiUsers] = useState(null)   // null = жүктелген, [] = бос, data = нәтиже
    const [searching, setSearching] = useState(false)
    const timerRef = useRef(null)

    // Debounced backend search
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        if (!q.trim() || q.startsWith('#')) {
            setApiUsers(null)
            return
        }
        timerRef.current = setTimeout(async () => {
            try {
                setSearching(true)
                const data = await searchUsers(q.trim())
                setApiUsers(data || [])
            } catch {
                setApiUsers(null)   // fallback local
            } finally {
                setSearching(false)
            }
        }, 400)
        return () => clearTimeout(timerRef.current)
    }, [q])

    // Follow handler — real API
    const handleFollow = async (userId, localId) => {
        try {
            await toggleFollow(userId)
        } catch { }
        setFollowing(prev => ({ ...prev, [localId]: !prev[localId] }))
    }

    // Нәтиже: API болса сол әлдеқа́йда local PEOPLE
    const displayUsers = apiUsers !== null
        ? apiUsers.map(u => ({
            id: u.id,
            user: u.username,
            name: `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.username,
            emoji: '👤',
            shade: '#e8e8e8',
            followers: u.followersCount ?? 0,
            isOrg: false,
            realId: u.id,
        }))
        : PEOPLE.filter(p => {
            const match = !q || p.user.includes(q) || p.name.toLowerCase().includes(q.toLowerCase()) || q.startsWith('#')
            const filt = filter === 'all' || (filter === 'people' && !p.isOrg) || (filter === 'org' && p.isOrg)
            return match && filt
        })

    return (
        <>
            <header className="topbar">
                <span className="topbar-title">Іздеу</span>
            </header>

            <div className="page-shell">
                {/* Search bar — sticky */}
                <div style={{
                    padding: '12px 20px',
                    borderBottom: '2px solid #000',
                    position: 'sticky', top: 0,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(16px)',
                    zIndex: 10,
                }}>
                    <div className="search-bar" style={{ marginBottom: 10 }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            placeholder="Адам немесе ұйымдастырушы іздеу..."
                            autoComplete="off"
                        />
                        {q && (
                            <button
                                onClick={() => setQ('')}
                                style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#666', minWidth: 32, minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s' }}
                                onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.82)' }}
                                onPointerUp={e => { e.currentTarget.style.transform = '' }}
                            >✕</button>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[['all', 'Барлығы'], ['people', 'Адамдар'], ['org', 'Ұйымдар']].map(([f, label]) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`tag ${filter === f ? 'tag-filled' : 'tag-ghost'}`}
                                style={{ cursor: 'pointer', minHeight: 36 }}
                            >{label}</button>
                        ))}
                    </div>
                </div>

                {/* Search results */}
                {q ? (
                    <div className="fade-up">
                        {searching && (
                            <div style={{ padding: '8px 20px', fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#888', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
                                Бакендтен ізделуде...
                            </div>
                        )}
                        {displayUsers.length === 0 && !searching ? (
                            <div style={{ padding: '56px 20px', textAlign: 'center' }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: '#888' }}>«{q}» табылмады</div>
                            </div>
                        ) : displayUsers.map(p => (
                            <div
                                key={p.id}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '14px 20px', borderBottom: '1.5px solid #e0e0e0', minHeight: 72,
                                    transition: 'background 0.1s, transform 0.12s',
                                    cursor: 'pointer',
                                }}
                                onPointerDown={e => { e.currentTarget.style.background = '#f0f0f0'; e.currentTarget.style.transform = 'scale(0.985)' }}
                                onPointerUp={e => { e.currentTarget.style.background = ''; e.currentTarget.style.transform = '' }}
                                onPointerLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.transform = '' }}
                            >
                                <div style={{ width: 50, height: 50, background: p.shade, border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '3px 3px 0 #000' }}>{p.emoji}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#888' }}>@{p.user} · {p.followers} жазылушы</div>
                                </div>
                                <button
                                    onClick={() => handleFollow(p.realId || p.id, p.id)}
                                    className={`btn btn-sm ${following[p.id] ? 'btn-outline' : ''}`}
                                    style={{ flexShrink: 0 }}
                                    onPointerDown={e => {
                                        e.stopPropagation()
                                        e.currentTarget.style.transform = 'translate(2px,2px) scale(0.97)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                    onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                                    onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                                >
                                    {following[p.id] ? '✓ Жазылдым' : '+ Жазыл'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Trending tags */}
                        <div style={{ padding: '16px 20px', borderBottom: '2px solid #000' }}>
                            <div className="t-label" style={{ marginBottom: 12 }}>Трендтегі тегтер</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {TRENDING.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setQ(t)}
                                        className="tag tag-ghost"
                                        style={{ cursor: 'pointer', minHeight: 36, fontSize: 11 }}
                                    >{t}</button>
                                ))}
                            </div>
                        </div>

                        {/* Masonry */}
                        <Masonry posts={EXPLORE_POSTS} />
                    </>
                )}
            </div>
        </>
    )
}
