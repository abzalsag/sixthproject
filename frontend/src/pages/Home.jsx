import { useState, useEffect, useCallback } from 'react'
import { useEvents } from '../hooks/useEvents'
import { usePosts } from '../hooks/usePosts'
import { useStories } from '../hooks/useStories'
import { useTickets } from '../hooks/useTickets'
import { likeEvent, likePost } from '../services/api'

/* ── Press helpers ── */
const press = {
    onPointerDown: e => { e.currentTarget.style.transform = 'translate(3px,3px) scale(0.97)'; e.currentTarget.style.boxShadow = '1px 1px 0 #000' },
    onPointerUp: e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' },
    onPointerLeave: e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' },
}
const pressSm = {
    onPointerDown: e => { e.currentTarget.style.transform = 'translate(2px,2px) scale(0.97)'; e.currentTarget.style.boxShadow = 'none' },
    onPointerUp: e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' },
    onPointerLeave: e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' },
}

/* ── QR Code ── */
const QR_P = [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1]
function QRCode({ code }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div className="qr-box">
                {QR_P.map((v, i) => <div key={i} className={`qr-cell${v ? '' : ' w'}`} />)}
            </div>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#666' }}>{code}</span>
        </div>
    )
}

/* ── Sold Bar ── */
function SoldBar({ pct }) {
    return (
        <div className="sold-bar-track">
            <div className="sold-bar-fill" style={{ width: `${pct}%` }} />
        </div>
    )
}

/* ── Story Bubble ── */
function StoryBubble({ s }) {
    return (
        <button style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 5, background: 'none', border: 'none', cursor: 'pointer',
            flexShrink: 0, WebkitTapHighlightColor: 'transparent',
            transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
        }}
            onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.88)' }}
            onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
            <div style={{
                width: 62, height: 62, background: '#f2f2f2',
                border: '2px solid #000', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 28, flexShrink: 0,
                outline: s.seen ? '2.5px solid #ddd' : '2.5px solid #000',
                outlineOffset: 2,
                boxShadow: s.seen ? 'none' : '2px 2px 0 #000',
            }}>{s.emoji}</div>
            <span style={{
                fontFamily: "'Space Mono',monospace", fontSize: 9,
                letterSpacing: '0.03em', maxWidth: 64,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                color: s.seen ? '#aaa' : '#000', fontWeight: s.seen ? 400 : 700,
            }}>{s.user}</span>
        </button>
    )
}

/* ── Post Card ── */
function PostCard({ p, delay = 0 }) {
    const [liked, setLiked] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')
    const [loadingCmts, setLoadingCmts] = useState(false)
    const [sendingCmt, setSendingCmt] = useState(false)

    const loadComments = async () => {
        if (!p.id || typeof p.id !== 'number') return
        setLoadingCmts(true)
        try {
            const { getComments } = await import('../services/api')
            const data = await getComments(p.id)
            setComments(data || [])
        } catch { setComments([]) }
        finally { setLoadingCmts(false) }
    }

    const toggleComments = () => {
        if (!showComments) loadComments()
        setShowComments(v => !v)
    }

    const submitComment = async () => {
        if (!commentText.trim() || !p.id) return
        setSendingCmt(true)
        try {
            const { addComment } = await import('../services/api')
            const newCmt = await addComment(p.id, commentText.trim())
            setComments(prev => [...prev, newCmt])
            setCommentText('')
        } catch (e) {
            // offline fallback — жергілікті қосамыз
            setComments(prev => [...prev, { id: Date.now(), content: commentText.trim(), user: { username: 'мен' } }])
            setCommentText('')
        } finally { setSendingCmt(false) }
    }

    return (
        <article className="fade-up" style={{ borderBottom: '2px solid #000', animationDelay: `${delay}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 38, height: 38, background: p.shade, border: '2px solid #000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, flexShrink: 0, boxShadow: '3px 3px 0 #000',
                    }}>{p.emoji}</div>
                    <div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>{p.user}</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#888', letterSpacing: '0.03em' }}>{p.time} бұрын</div>
                    </div>
                </div>
                <span className="tag tag-filled tag-sm">{p.tag}</span>
            </div>

            <div style={{
                width: '100%', aspectRatio: '1', background: p.shade,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 80, borderTop: '2px solid #000', borderBottom: '2px solid #000',
                transition: 'opacity 0.12s', cursor: 'pointer',
            }}
                onPointerDown={e => { e.currentTarget.style.opacity = '0.88' }}
                onPointerUp={e => { e.currentTarget.style.opacity = '1' }}
                onPointerLeave={e => { e.currentTarget.style.opacity = '1' }}
            >{p.emoji}</div>

            <div style={{ padding: '12px 20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                    <button className="action-btn" onClick={() => setLiked(l => !l)} style={{ color: '#000' }}>
                        <svg viewBox="0 0 24 24" width={22} height={22} fill={liked ? '#000' : 'none'} stroke="#000" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700 }}>
                            {liked ? p.likes + 1 : p.likes}
                        </span>
                    </button>
                    {/* 💬 Коммент батырмасы */}
                    <button className="action-btn" onClick={toggleComments} style={{ color: showComments ? '#000' : '#666' }}>
                        <svg viewBox="0 0 24 24" width={22} height={22} fill={showComments ? '#000' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700 }}>{(p.comments || 0) + comments.filter(c => c.id > 1000000000).length}</span>
                    </button>
                    <button className="action-btn" style={{ marginLeft: 'auto' }}>
                        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#000" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#222' }}>
                    <strong style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{p.user}</strong>&nbsp;{p.caption}
                </p>
            </div>

            {/* 💬 COMMENT SECTION */}
            {showComments && (
                <div className="fade-up" style={{ borderTop: '2px solid #000', background: '#fafafa' }}>
                    {/* Comments list */}
                    <div style={{ maxHeight: 200, overflowY: 'auto', padding: '8px 16px' }}>
                        {loadingCmts ? (
                            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#888', padding: '8px 0' }}>жүктелуде...</div>
                        ) : comments.length === 0 ? (
                            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#bbb', padding: '8px 0', textAlign: 'center' }}>
                                Бірінші болып комментарий жазыңыз 💬
                            </div>
                        ) : comments.map((c, i) => (
                            <div key={c.id || i} style={{ padding: '6px 0', borderBottom: '1px solid #eee', display: 'flex', gap: 8 }}>
                                <div style={{ width: 26, height: 26, background: '#000', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', flexShrink: 0 }}>
                                    {(c.user?.username || c.user?.firstname || '?')[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 11 }}>@{c.user?.username || 'user'} </span>
                                    <span style={{ fontSize: 13 }}>{c.content}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Comment input */}
                    <div style={{ display: 'flex', borderTop: '1.5px solid #e0e0e0' }}>
                        <input
                            style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 14px', fontFamily: "'Space Mono',monospace", fontSize: 12, background: '#fafafa' }}
                            placeholder="Комментарий жазыңыз..."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && submitComment()}
                        />
                        <button
                            onClick={submitComment}
                            disabled={sendingCmt || !commentText.trim()}
                            style={{
                                background: commentText.trim() ? '#000' : '#e0e0e0', color: '#fff', border: 'none',
                                padding: '0 16px', fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13,
                                cursor: commentText.trim() ? 'pointer' : 'default', transition: 'background 0.15s',
                            }}
                        >{sendingCmt ? '...' : '→'}</button>
                    </div>
                </div>
            )}
        </article>
    )
}

/* ── Event Row ── */
function EventRow({ ev, onBuy }) {
    const [pressed, setPressed] = useState(false)
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(ev.likes || 0)

    const handleLike = async (e) => {
        e.stopPropagation()
        const wasLiked = liked
        setLiked(!wasLiked)
        setLikes(n => wasLiked ? n - 1 : n + 1)
        try { await likeEvent(ev.id) } catch {
            setLiked(wasLiked)
            setLikes(n => wasLiked ? n + 1 : n - 1)
        }
    }

    return (
        <div className="card" style={{
            marginBottom: 16, cursor: 'pointer',
            transform: pressed ? 'translate(4px,4px) scale(0.98)' : 'none',
            boxShadow: pressed ? '1px 1px 0 #000' : '6px 6px 0 #000',
            transition: 'transform 0.12s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.12s ease',
        }}
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
        >
            <div style={{ background: '#000', padding: '9px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tag tag-filled tag-sm" style={{ border: '1px solid #444' }}>{ev.tag}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", color: '#aaa', fontSize: 10, letterSpacing: '0.04em' }}>
                    {ev.date} · {ev.time}
                </span>
            </div>
            <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{ev.title}</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#666', marginTop: 3 }}>{ev.genre}</div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>📍 {ev.venue}</div>
                    </div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 18, textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>{ev.price}</div>
                </div>
                <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Сатылды</span>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, fontWeight: 700 }}>{ev.sold}%</span>
                    </div>
                    <SoldBar pct={ev.sold} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button onClick={handleLike} style={{
                        minWidth: 56, minHeight: 42, border: '2px solid #000',
                        background: liked ? '#000' : '#fff', color: liked ? '#fff' : '#000',
                        fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: 5,
                        boxShadow: '3px 3px 0 #000', cursor: 'pointer', flexShrink: 0, padding: '0 12px',
                        transition: 'background 0.15s, color 0.15s',
                    }}
                        onPointerDown={e => { e.stopPropagation(); e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'none' }}
                        onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #000' }}
                        onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #000' }}
                    >
                        <svg viewBox="0 0 24 24" width={14} height={14} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        {likes > 0 && <span>{likes}</span>}
                    </button>
                    <button className="btn btn-sm" style={{ flex: 1 }}
                        onClick={e => { e.stopPropagation(); onBuy(ev) }}
                        onPointerDown={e => { e.stopPropagation(); e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'none' }}
                        onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                        onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                    >{ev.sold >= 90 ? '⚡ Таусылуға жақын' : 'Билет алу →'}</button>
                </div>
            </div>
        </div>
    )
}

/* ── Ticket Card ── */
function TicketCard({ t }) {
    const [showQR, setShowQR] = useState(false)
    return (
        <div className="ticket-card" style={{ marginBottom: 14, padding: 0, cursor: 'pointer' }}
            onClick={() => setShowQR(q => !q)}
            onPointerDown={e => { e.currentTarget.style.transform = 'translate(3px,3px) scale(0.97)'; e.currentTarget.style.boxShadow = '1px 1px 0 #000' }}
            onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
            <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                        <span className="tag tag-filled tag-sm" style={{ marginBottom: 8, display: 'block', width: 'fit-content' }}>БИЛЕТІМ</span>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>{t.title}</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#666', marginTop: 3 }}>{t.date} · {t.venue}</div>
                    </div>
                    <span className="tag tag-ghost" style={{ flexShrink: 0 }}>{t.seat}</span>
                </div>
                {showQR ? (
                    <div className="pop-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 8px' }}>
                        <QRCode code={t.code} />
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#888', marginTop: 12 }}>жабу үшін басыңыз ↑</span>
                    </div>
                ) : (
                    <div className="ticket-perforation" style={{ paddingTop: 12, textAlign: 'center' }}>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#aaa' }}>QR код үшін басыңыз →</span>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ── Buy Modal ── */
function BuyModal({ event, onClose }) {
    const [step, setStep] = useState(1)
    const [qty, setQty] = useState(1)
    const [card, setCard] = useState({ num: '', exp: '', cvv: '', name: '' })

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-sheet slide-up">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
                    <div style={{ width: 40, height: 4, background: '#000', borderRadius: 0 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px 20px', borderBottom: '2px solid #000' }}>
                    <div>
                        <div className="t-label" style={{ marginBottom: 6 }}>Билет алу — TUSA</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>{event.title}</div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>{event.date} · {event.venue}</div>
                    </div>
                    <button className="btn-icon btn-outline"
                        style={{ minWidth: 40, minHeight: 40, border: '2px solid #000', boxShadow: '2px 2px 0 #000', flexShrink: 0 }}
                        onClick={onClose} {...pressSm}>✕</button>
                </div>
                <div style={{ padding: '20px', overflowY: 'auto', maxHeight: '60dvh' }}>
                    {step === 1 && (
                        <div className="fade-up">
                            <div className="t-label" style={{ marginBottom: 12 }}>Саны</div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                                {[1, 2, 3, 4].map(n => (
                                    <button key={n} onClick={() => setQty(n)} style={{
                                        flex: 1, minHeight: 50, border: '2px solid #000',
                                        fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 18,
                                        background: qty === n ? '#000' : '#fff', color: qty === n ? '#fff' : '#000',
                                        boxShadow: qty === n ? 'none' : '3px 3px 0 #000',
                                        transition: 'all 0.13s', cursor: 'pointer',
                                        transform: qty === n ? 'translate(3px,3px)' : 'none',
                                    }}>{n}</button>
                                ))}
                            </div>
                            <div className="card" style={{ padding: '14px 16px', marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="t-label">Жалпы сома</span>
                                    <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 22 }}>
                                        {(parseInt(event.price) * qty).toLocaleString()} ₸
                                    </span>
                                </div>
                            </div>
                            <button className="btn btn-full" onClick={() => setStep(2)} {...press}>Картамен төлеу →</button>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="fade-up">
                            <div style={{
                                background: '#000', color: '#fff', padding: '22px 18px', marginBottom: 20,
                                border: '2px solid #000', boxShadow: '5px 5px 0 #000', fontFamily: "'Space Mono',monospace",
                            }}>
                                <div style={{ fontSize: 9, opacity: 0.4, letterSpacing: '0.1em', marginBottom: 18 }}>TUSA · PAYMENT</div>
                                <div style={{ fontSize: 17, letterSpacing: '0.18em', marginBottom: 22, minHeight: 24 }}>
                                    {card.num || '•••• •••• •••• ••••'}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.7 }}>
                                    <span>{card.name || 'АТЫҢЫЗ'}</span>
                                    <span>{card.exp || 'MM/YY'}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <input className="input" placeholder="1234 5678 9012 3456" maxLength={19}
                                    value={card.num} onChange={e => setCard(p => ({ ...p, num: e.target.value }))} />
                                <input className="input" placeholder="АТЫҢЫЗ (ЛАТЫН)"
                                    value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value.toUpperCase() }))} />
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <input className="input" placeholder="MM/YY" maxLength={5} style={{ flex: 1 }}
                                        value={card.exp} onChange={e => setCard(p => ({ ...p, exp: e.target.value }))} />
                                    <input className="input" placeholder="CVV" maxLength={3} type="password" style={{ flex: 1 }}
                                        value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value }))} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)} {...press}>← Артқа</button>
                                <button className="btn" style={{ flex: 2 }} onClick={() => setStep(3)} {...press}>Растау →</button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="pop-in" style={{ textAlign: 'center', padding: '28px 0' }}>
                            <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
                            <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 22, marginBottom: 6 }}>СӘТТІ!</div>
                            <div style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.5 }}>Билетіңіз email-ге жіберілді.</div>
                            <QRCode code="TUS-00789" />
                            <button className="btn btn-full" style={{ marginTop: 24 }} onClick={onClose} {...press}>Жабу</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ── EventsContent — shared between mobile and desktop sidebar ── */
function EventsContent({ ticketTab, source, eventsError, sorted, eventsLoading,
    myTickets, ticketsLoading, ticketSource, refetch, setBuyEvent,
    sort, setSort, compact }) {

    if (ticketTab === 'mine') {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span className="t-label">{ticketsLoading ? '...' : myTickets.length} белсенді билет</span>
                    {ticketSource === 'backend' && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#888' }}>✓ БЕКЕНД</span>}
                </div>
                {ticketsLoading
                    ? [1, 2].map(n => <div key={n} className="skeleton" style={{ height: 120, marginBottom: 14, border: '2px solid #000' }} />)
                    : myTickets.map(t => <TicketCard key={t.id} t={t} />)
                }
            </>
        )
    }

    return (
        <>
            {source === 'mock' && eventsError && (
                <div className="fade-up" style={{
                    border: '2px solid #000', background: '#fff',
                    padding: '10px 14px', marginBottom: 16,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    boxShadow: '4px 4px 0 #000',
                }}>
                    <div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
                            ⚠ Бекенд қол жетімсіз
                        </div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#666' }}>
                            Mock деректер қолданылуда
                        </div>
                    </div>
                    <button className="btn btn-sm btn-outline"
                        style={{ flexShrink: 0, fontSize: 9, boxShadow: 'none' }}
                        onClick={refetch}
                        {...pressSm}>↺ Қайта</button>
                </div>
            )}
            {!compact && source === 'backend' && (
                <div style={{ background: '#000', color: '#fff', padding: '9px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.06em' }}>✓ БЕКЕНД · {sorted.length} ИВЕНТ</span>
                    <button style={{ background: 'none', border: '1px solid #666', color: '#ccc', padding: '2px 8px', fontFamily: "'Space Mono',monospace", fontSize: 9, cursor: 'pointer' }} onClick={refetch}>↺ Жаңарту</button>
                </div>
            )}
            {!compact && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 18, overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {[['date', 'Күні'], ['price', 'Бағасы'], ['sold', 'Сұраныс']].map(([val, label]) => (
                        <button key={val} onClick={() => setSort(val)}
                            className={`tag ${sort === val ? 'tag-filled' : 'tag-ghost'}`}
                            style={{ cursor: 'pointer', minHeight: 36, fontSize: 10 }}>
                            {label}
                        </button>
                    ))}
                </div>
            )}
            {eventsLoading
                ? [1, 2, 3].map(n => <div key={n} className="skeleton" style={{ height: compact ? 140 : 190, marginBottom: 16, border: '2px solid #000' }} />)
                : sorted.length === 0
                    ? <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#888' }}>Ивент табылмады</div>
                    </div>
                    : sorted.map(ev => <EventRow key={ev.id} ev={ev} onBuy={setBuyEvent} />)
            }
        </>
    )
}

/* ══════════════════════════════════
   HOME PAGE
   ══════════════════════════════════ */
export default function Home() {
    const [mode, setMode] = useState('feed')
    const [menuOpen, setMenuOpen] = useState(false)
    const [sort, setSort] = useState('date')
    const [buyEvent, setBuyEvent] = useState(null)
    const [ticketTab, setTicketTab] = useState('all')

    const { events, loading: eventsLoading, error: eventsError, source, refetch } = useEvents()
    const { posts, loading: postsLoading, source: postSource } = usePosts('all')
    const { stories, loading: storiesLoading, source: storiesSource } = useStories()
    const { tickets: myTickets, loading: ticketsLoading, source: ticketSource, purchase } = useTickets()

    const sorted = [...events].sort((a, b) => {
        if (sort === 'price') return parseInt(a.price) - parseInt(b.price)
        if (sort === 'sold') return b.sold - a.sold
        return a.id - b.id
    })

    /* Common EventsContent props */
    const eventsProps = {
        ticketTab, source, eventsError, sorted, eventsLoading,
        myTickets, ticketsLoading, ticketSource,
        refetch, setBuyEvent, sort, setSort,
    }

    return (
        <>
            {/* ── TOPBAR ── */}
            <header className="topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 22, letterSpacing: '-0.05em' }}>TUSA</span>
                    {mode === 'events' && <span className="tag tag-filled tag-sm">TICKETON</span>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Desktop: mode toggle кнопкалары */}
                    <div className="home-desktop-tabs">
                        {[['feed', '📱 Лента'], ['events', '🎟️ Ивенттер']].map(([id, label]) => (
                            <button key={id} onClick={() => setMode(id)} style={{
                                fontFamily: "'Space Mono',monospace", fontSize: 10, fontWeight: 700,
                                letterSpacing: '0.04em', textTransform: 'uppercase', padding: '6px 14px',
                                border: '2px solid #000',
                                background: mode === id ? '#000' : '#fff',
                                color: mode === id ? '#fff' : '#000',
                                cursor: 'pointer',
                                boxShadow: mode === id ? '3px 3px 0 #000' : 'none',
                                transition: 'all 0.12s',
                            }}>{label}</button>
                        ))}
                    </div>

                    {/* Mobile: hamburger */}
                    <button className="home-mobile-menu"
                        style={{
                            display: 'flex', flexDirection: 'column', gap: 5, padding: 8,
                            background: 'none', border: 'none', cursor: 'pointer',
                            minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center',
                            transition: 'transform 0.1s',
                        }}
                        onClick={() => setMenuOpen(o => !o)}
                        onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.88)' }}
                        onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
                        onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                    >
                        {[0, 1, 2].map(i => (
                            <span key={i} style={{
                                display: 'block', width: 22, height: 2.5, background: '#000',
                                transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                                transform: menuOpen
                                    ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                                        : i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'none'
                                    : 'none',
                                opacity: menuOpen && i === 1 ? 0 : 1,
                            }} />
                        ))}
                    </button>
                </div>
            </header>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="pop-in home-mobile-menu" style={{
                    position: 'fixed', top: 'calc(var(--top-h) + 6px)',
                    right: 16, zIndex: 600,
                    border: '2px solid #000', background: '#fff',
                    minWidth: 210, boxShadow: '5px 5px 0 #000',
                }}>
                    {[
                        { id: 'feed', label: '📱 Лента режимі' },
                        { id: 'events', label: '🎟️ Ивент & Билет' },
                    ].map(o => (
                        <button key={o.id}
                            onClick={() => { setMode(o.id); setMenuOpen(false) }}
                            style={{
                                display: 'block', width: '100%', padding: '15px 18px', textAlign: 'left',
                                fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.04em',
                                textTransform: 'uppercase', border: 'none',
                                borderBottom: o.id === 'feed' ? '2px solid #000' : 'none',
                                background: mode === o.id ? '#000' : '#fff',
                                color: mode === o.id ? '#fff' : '#000',
                                cursor: 'pointer', minHeight: 52, transition: 'background 0.12s',
                            }}
                            onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
                            onPointerUp={e => { e.currentTarget.style.transform = '' }}
                            onPointerLeave={e => { e.currentTarget.style.transform = '' }}
                        >{o.label}</button>
                    ))}
                </div>
            )}

            {/* ══════════════════════════════════════
                MAIN LAYOUT
                Mobile: single column (feed / events toggle)
                Desktop: feed (left) + events sidebar (right)
                ══════════════════════════════════════ */}
            <div className="home-layout" onClick={() => menuOpen && setMenuOpen(false)}>

                {/* ── LEFT: Feed Column ── */}
                <div className="home-feed-col">

                    {/* Stories Row */}
                    <div style={{
                        display: 'flex', gap: 14, overflowX: 'auto',
                        padding: '14px 20px', borderBottom: '2px solid #000',
                        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
                    }}>
                        <button style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            gap: 5, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
                            transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                            onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.88)' }}
                            onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
                            onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                        >
                            <div style={{
                                width: 62, height: 62, border: '2.5px dashed #000',
                                background: '#fafafa', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: 26, color: '#000',
                            }}>+</div>
                            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#000', fontWeight: 700 }}>СЕН</span>
                        </button>
                        {stories.map(s => <StoryBubble key={s.id} s={s} />)}
                    </div>

                    {/* Posts — desktop-та қашанда көрінеді, mobile-да тек feed режимінде */}
                    <div className={mode === 'events' ? 'home-feed-posts-mobile-hidden' : ''}>
                        {postSource === 'backend' && (
                            <div style={{ padding: '6px 20px', background: '#000', color: '#fff', fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.06em' }}>
                                ✓ БЕКЕНД · {posts.length} ПОСТ
                            </div>
                        )}
                        {postsLoading
                            ? [1, 2, 3].map(n => (
                                <div key={n} style={{ margin: '12px 20px', border: '2px solid #000', boxShadow: '4px 4px 0 #000', padding: 16 }}>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                                        <div className="skeleton" style={{ width: 40, height: 40, flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div className="skeleton" style={{ height: 13, width: '50%', marginBottom: 6 }} />
                                            <div className="skeleton" style={{ height: 10, width: '30%' }} />
                                        </div>
                                    </div>
                                    <div className="skeleton" style={{ height: 180, marginBottom: 12 }} />
                                    <div className="skeleton" style={{ height: 12, width: '80%' }} />
                                </div>
                            ))
                            : posts.map((p, i) => <PostCard key={p.id} p={p} delay={i * 0.06} />)
                        }
                    </div>

                    {/* Mobile: Events mode content */}
                    {mode === 'events' && (
                        <div className="home-events-mobile fade-up" style={{ padding: '16px 20px' }}>
                            <div className="tabs" style={{ marginBottom: 16, marginLeft: -20, marginRight: -20 }}>
                                <button className={`tab-btn${ticketTab === 'all' ? ' active' : ''}`} onClick={() => setTicketTab('all')}>
                                    🎟️ Ивенттер
                                </button>
                                <button className={`tab-btn${ticketTab === 'mine' ? ' active' : ''}`} onClick={() => setTicketTab('mine')}>
                                    📲 Менің билеттерім
                                </button>
                            </div>
                            <EventsContent {...eventsProps} />
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Events Sidebar (desktop only) ── */}
                <aside className="home-events-sidebar">
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px', borderBottom: '2px solid #000',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        position: 'sticky', top: 0, background: '#fff', zIndex: 10,
                    }}>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                            🎟️ Ивенттер
                        </span>
                        {source === 'backend' && (
                            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: '#888', letterSpacing: '0.06em' }}>✓ LIVE</span>
                        )}
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
                        {[['all', 'Барлығы'], ['mine', 'Менікі']].map(([val, label]) => (
                            <button key={val} onClick={() => setTicketTab(val)} style={{
                                flex: 1, minHeight: 40,
                                fontFamily: "'Space Mono',monospace", fontSize: 9,
                                fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                                border: 'none',
                                borderBottom: ticketTab === val ? '3px solid #000' : '3px solid transparent',
                                marginBottom: -2, background: 'none', cursor: 'pointer',
                                color: ticketTab === val ? '#000' : '#9e9e9e',
                                transition: 'color 0.15s, border-color 0.15s',
                            }}>{label}</button>
                        ))}
                    </div>

                    {/* Sort chips */}
                    <div style={{
                        display: 'flex', gap: 6, padding: '10px 16px',
                        overflowX: 'auto', scrollbarWidth: 'none',
                        borderBottom: '1.5px solid #e0e0e0',
                    }}>
                        {[['date', 'Күні'], ['price', 'Бағасы'], ['sold', 'Сұраныс']].map(([val, label]) => (
                            <button key={val} onClick={() => setSort(val)}
                                className={`tag tag-sm ${sort === val ? 'tag-filled' : 'tag-ghost'}`}
                                style={{ cursor: 'pointer', fontSize: 8, flexShrink: 0 }}>
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '12px 16px', overflowY: 'auto', flex: 1 }}>
                        <EventsContent {...eventsProps} compact={true} />
                    </div>
                </aside>
            </div>

            {/* Buy Modal */}
            {buyEvent && <BuyModal event={buyEvent} onClose={() => setBuyEvent(null)} />}

            <style>{`
                /* ── Home Layout ── */
                .home-layout {
                    display: flex;
                    flex-direction: column;
                }
                .home-feed-col { flex: 1; }
                .home-events-sidebar { display: none; }
                .home-desktop-tabs { display: none; }

                @media (min-width: 1024px) {
                    .home-layout {
                        flex-direction: row;
                        align-items: flex-start;
                        min-height: calc(100dvh - var(--top-h));
                    }
                    .home-feed-col {
                        flex: 1;
                        min-width: 0;
                        border-right: 2px solid #000;
                        min-height: calc(100dvh - var(--top-h));
                    }
                    .home-events-sidebar {
                        display: flex;
                        flex-direction: column;
                        width: 300px;
                        flex-shrink: 0;
                        min-height: calc(100dvh - var(--top-h));
                    }
                    .home-events-mobile { display: none !important; }
                    .home-feed-posts-mobile-hidden { display: block !important; }
                    .home-desktop-tabs { display: flex; gap: 6px; }
                    .home-mobile-menu { display: none !important; }
                }

                @media (max-width: 1023px) {
                    .home-feed-posts-mobile-hidden { display: none; }
                }
            `}</style>
        </>
    )
}
