import { useState } from 'react'
import { COMMUNITIES, DMS } from '../data/mockData'
import { useChats, useChatMessages } from '../hooks/useChats'

/* ── Press helpers ── */
const pressBtn = {
    onPointerDown: e => {
        e.currentTarget.style.transform = 'translate(3px,3px) scale(0.97)'
        e.currentTarget.style.boxShadow = '1px 1px 0 #000'
    },
    onPointerUp: e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' },
    onPointerLeave: e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' },
}

/* ── Chat Window — real messages ── */
function ChatWindow({ dm, currentUsername, onClose }) {
    const chatId = dm.raw?.id || null
    const { messages: backendMsgs, send: backendSend } = useChatMessages(chatId)
    const [localMsgs, setLocalMsgs] = useState([
        { id: 1, from: 'them', text: 'Сәлем! Ивентке барасың ба?' },
        { id: 2, from: 'me', text: 'Иә! Fabric Night-қа барамын 🖤' },
        { id: 3, from: 'them', text: dm.last || '...' },
    ])
    const [input, setInput] = useState('')
    const [sending, setSending] = useState(false)
    const msgEndRef = useState(null)[0]

    // Нақты backend messages-ті me/them деп белгілейміз
    const displayMsgs = chatId && backendMsgs.length > 0
        ? backendMsgs.map(m => ({
            ...m,
            from: m.from === currentUsername ? 'me' : 'them'
        }))
        : localMsgs

    const doSend = async () => {
        if (!input.trim()) return
        const text = input.trim()
        setInput('')
        setSending(true)

        if (chatId) {
            // Нақты backend-ке жіберу
            await backendSend(text)
        } else {
            // Mock — жергілікті ғана
            setLocalMsgs(prev => [...prev, { id: Date.now(), from: 'me', text }])
            // Жалған жауап (2 секундтан кейін)
            setTimeout(() => {
                setLocalMsgs(prev => [...prev, {
                    id: Date.now() + 1, from: 'them',
                    text: ['👍', 'Түсіндім!', 'Окей, мақұл!', 'Болады 🎉'][Math.floor(Math.random() * 4)]
                }])
            }, 1500)
        }
        setSending(false)
    }

    return (
        <div className="pop-in" style={{
            position: 'fixed', inset: 0, background: '#fff',
            zIndex: 700, display: 'flex', flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                height: 56, background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(16px)',
                borderBottom: '2px solid #000',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px', flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        style={{
                            minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 20, transition: 'transform 0.1s',
                        }}
                        onClick={onClose}
                        onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.82)' }}
                        onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
                    >←</button>
                    <div style={{
                        width: 38, height: 38, background: dm.shade,
                        border: '2px solid #000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, boxShadow: '2px 2px 0 #000',
                    }}>{dm.emoji}</div>
                    <div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 14 }}>{dm.user}</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#888' }}>{dm.handle}</div>
                    </div>
                </div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: chatId ? '#000' : '#bbb', letterSpacing: '0.06em' }}>
                    {chatId ? '✓ БЕКЕНД' : '○ DEMO'}
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto',
                padding: '16px 16px',
                display: 'flex', flexDirection: 'column', gap: 10,
                background: '#f8f8f8',
                WebkitOverflowScrolling: 'touch',
            }}>
                {displayMsgs.map((m, i) => (
                    <div key={m.id || i} className="fade-up" style={{
                        display: 'flex',
                        justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start',
                    }}>
                        <div style={{
                            maxWidth: '72%', padding: '11px 15px',
                            background: m.from === 'me' ? '#000' : '#fff',
                            color: m.from === 'me' ? '#fff' : '#000',
                            border: '2px solid #000',
                            fontSize: 14, lineHeight: 1.5,
                            boxShadow: m.from === 'me' ? 'none' : '3px 3px 0 #000',
                        }}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input bar */}
            <div style={{ borderTop: '2px solid #000', display: 'flex', background: '#fff', flexShrink: 0 }}>
                <input
                    className="input"
                    style={{ flex: 1, border: 'none', borderRadius: 0, minHeight: 54 }}
                    placeholder="Хабарлама жазыңыз..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && doSend()}
                />
                <button
                    onClick={doSend}
                    disabled={sending || !input.trim()}
                    style={{
                        background: input.trim() ? '#000' : '#888', color: '#fff',
                        border: 'none', borderLeft: '2px solid #000',
                        minHeight: 54, padding: '0 22px',
                        fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 18,
                        cursor: input.trim() ? 'pointer' : 'default',
                        transition: 'transform 0.1s, background 0.12s',
                    }}
                    onPointerDown={e => { if (input.trim()) e.currentTarget.style.transform = 'scale(0.9)' }}
                    onPointerUp={e => { e.currentTarget.style.transform = '' }}
                    onPointerLeave={e => { e.currentTarget.style.transform = '' }}
                >{sending ? '⟳' : '→'}</button>
            </div>
        </div>
    )
}

/* ── New Group Modal ── */
function NewGroupModal({ onClose }) {
    const [name, setName] = useState('')
    const [selected, setSelected] = useState(new Set())
    const toggle = (id) => setSelected(s => {
        const n = new Set(s)
        n.has(id) ? n.delete(id) : n.add(id)
        return n
    })

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-sheet slide-up">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
                    <div style={{ width: 40, height: 4, background: '#000' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '2px solid #000' }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 16 }}>ТОП АШУ</div>
                    <button
                        style={{ border: '2px solid #000', background: '#fff', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0 #000', fontSize: 16, transition: 'transform 0.1s, box-shadow 0.1s' }}
                        onClick={onClose}
                        onPointerDown={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'none' }}
                        onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '2px 2px 0 #000' }}
                    >✕</button>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <div className="t-label" style={{ marginBottom: 8 }}>Топ атауы</div>
                        <input className="input" placeholder="Мысалы: Raver Squad 🖤" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <div className="t-label" style={{ marginBottom: 12 }}>Қатысушылар</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                            {DMS.map(d => (
                                <button key={d.id} onClick={() => toggle(d.id)} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                                    transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                                }}
                                    onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.88)' }}
                                    onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
                                    onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                                >
                                    <div style={{
                                        width: 52, height: 52, background: d.shade,
                                        border: '2px solid #000',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 22,
                                        boxShadow: selected.has(d.id) ? '4px 4px 0 #000' : '2px 2px 0 #000',
                                        outline: selected.has(d.id) ? '3px solid #000' : 'none',
                                        outlineOffset: 2,
                                        transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                                        transform: selected.has(d.id) ? 'scale(1.08)' : 'scale(1)',
                                    }}>{d.emoji}</div>
                                    <span style={{
                                        fontFamily: "'Space Mono',monospace", fontSize: 9,
                                        maxWidth: 56, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        fontWeight: selected.has(d.id) ? 700 : 400,
                                    }}>{d.user}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {selected.size > 0 && (
                        <div style={{
                            background: '#000', color: '#fff',
                            padding: '10px 14px',
                            fontFamily: "'Space Mono',monospace", fontSize: 11,
                            textAlign: 'center',
                            boxShadow: '3px 3px 0 #444',
                        }}>
                            {selected.size} адам таңдалды
                        </div>
                    )}
                    <button className="btn btn-full" onClick={onClose} {...pressBtn}>
                        Топ жасау →
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ══════ CHATS PAGE ══════ */
export default function Chats() {
    const [tab, setTab] = useState('dms')
    const [showGroup, setShowGroup] = useState(false)
    const [openChat, setOpenChat] = useState(null)
    const { chats, loading, source } = useChats()

    return (
        <>
            <header className="topbar">
                <span className="topbar-title">Хабарламалар</span>
                <button
                    className="btn btn-sm"
                    onClick={() => setShowGroup(true)}
                    {...pressBtn}
                >+ Топ</button>
            </header>

            <div className="page-shell">
                <div className="tabs">
                    <button className={`tab-btn${tab === 'dms' ? ' active' : ''}`} onClick={() => setTab('dms')}>💬 Жеке</button>
                    <button className={`tab-btn${tab === 'communities' ? ' active' : ''}`} onClick={() => setTab('communities')}>🎪 Қауымдастықтар</button>
                </div>

                {tab === 'dms' && (
                    <div className="fade-up">
                        {/* Search */}
                        <div style={{ padding: '12px 20px', borderBottom: '1.5px solid #e0e0e0' }}>
                            <div className="search-bar">
                                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input placeholder="Чат іздеу..." />
                            </div>
                        </div>

                        {/* Source badge */}
                        {source === 'backend' && (
                            <div style={{ padding: '6px 20px', background: '#000', color: '#fff', fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.06em' }}>
                                ✓ БЕКЕНД · {chats.length} ЧАТ
                            </div>
                        )}

                        {loading ? (
                            [1, 2, 3].map(n => (
                                <div key={n} style={{ display: 'flex', gap: 14, padding: '14px 20px', borderBottom: '1.5px solid #e0e0e0', alignItems: 'center' }}>
                                    <div className="skeleton" style={{ width: 50, height: 50, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 8 }} />
                                        <div className="skeleton" style={{ height: 12, width: '80%' }} />
                                    </div>
                                </div>
                            ))
                        ) : chats.map(d => (
                            <div
                                key={d.id}
                                className="chat-row"
                                onClick={() => setOpenChat(d)}
                            >
                                <div style={{
                                    width: 50, height: 50, background: d.shade,
                                    border: '2px solid #000',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 24, flexShrink: 0,
                                    boxShadow: '3px 3px 0 #000',
                                }}>
                                    {d.emoji}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                                        <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 14 }}>{d.user}</span>
                                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#888', flexShrink: 0, marginLeft: 8 }}>{d.time}</span>
                                    </div>
                                    <div style={{ fontSize: 13, color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.last}</div>
                                </div>
                                {d.unread > 0 && (
                                    <div style={{
                                        background: '#000', color: '#fff',
                                        minWidth: 22, height: 22,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10, fontFamily: "'Space Mono',monospace", fontWeight: 700,
                                        padding: '0 4px', flexShrink: 0,
                                    }}>
                                        {d.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'communities' && (
                    <div className="fade-up">
                        <div style={{ padding: '12px 20px', background: '#fafafa', borderBottom: '2px solid #000' }}>
                            <span className="t-label">Ивент чаттары · тек билет иелеріне</span>
                        </div>
                        {COMMUNITIES.map(c => (
                            <div
                                key={c.id}
                                className="chat-row"
                                style={{ alignItems: 'flex-start', paddingTop: 16, paddingBottom: 16 }}
                            >
                                <div style={{
                                    width: 50, height: 50, background: '#000',
                                    border: '2px solid #000',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 24, flexShrink: 0,
                                    boxShadow: '3px 3px 0 #000',
                                }}>{c.emoji}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{c.name}</div>
                                    <div style={{ fontSize: 13, color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.last}</div>
                                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#bbb', marginTop: 5 }}>{c.members.toLocaleString()} мүше</div>
                                </div>
                                <button
                                    className="tag tag-filled tag-sm"
                                    style={{ cursor: 'pointer', flexShrink: 0, minHeight: 34, alignSelf: 'center' }}
                                >Қосылу</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showGroup && <NewGroupModal onClose={() => setShowGroup(false)} />}
            {openChat && <ChatWindow dm={openChat} onClose={() => setOpenChat(null)} />}
        </>
    )
}
