import { useState, useRef, useEffect } from 'react'
import { PROFILE_POSTS, POLAROIDS } from '../data/mockData'
import { useProfile } from '../hooks/useProfile'

/* ══════════════════════════════════════════
   POLAROID COLLAGE
   Физикалық суреттер: қисайған, қалың
   қара көлеңке, нұқыған кезде lift-up
   ══════════════════════════════════════════ */
function PolaroidCollage() {
    const [active, setActive] = useState(null)

    /* Each polaroid: absolute position + initial rotation */
    const layout = [
        { top: '3%', left: '4%', rotate: '-7deg', scale: 1.0, z: 1 },
        { top: '1%', left: '48%', rotate: '5deg', scale: 1.05, z: 2 },
        { top: '33%', left: '6%', rotate: '4deg', scale: 0.98, z: 3 },
        { top: '30%', left: '46%', rotate: '-5deg', scale: 1.02, z: 4 },
        { top: '63%', left: '3%', rotate: '-2deg', scale: 1.0, z: 5 },
        { top: '61%', left: '49%', rotate: '7deg', scale: 0.97, z: 6 },
    ]

    return (
        <div style={{
            position: 'relative',
            height: 520,
            background: '#f0f0f0',
            overflow: 'hidden',
            border: '2px solid #000',
        }}>
            {/* Grid paper background */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage:
                    'linear-gradient(to right, #d4d4d4 1px, transparent 1px),' +
                    'linear-gradient(to bottom, #d4d4d4 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                opacity: 0.55,
            }} />

            {/* Film grain overlay */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
                opacity: 0.4,
            }} />

            {POLAROIDS.map((p, i) => {
                const pos = layout[i] || {}
                const isActive = active === p.id

                return (
                    <div
                        key={p.id}
                        onClick={() => setActive(isActive ? null : p.id)}
                        style={{
                            position: 'absolute',
                            top: pos.top,
                            left: pos.left,
                            width: '44%',
                            /* Hard shadow — brutalist */
                            background: '#fff',
                            border: '2.5px solid #000',
                            padding: '8px 8px 40px',
                            boxShadow: isActive
                                ? '8px 8px 0px 2px #000, 0 20px 36px rgba(0,0,0,0.25)'
                                : '5px 5px 0px 0px #000',
                            transform: isActive
                                ? `rotate(0deg) scale(1.12) translateY(-6px)`
                                : `rotate(${pos.rotate}) scale(${pos.scale})`,
                            zIndex: isActive ? 20 : pos.z,
                            cursor: 'pointer',
                            transition:
                                'transform 0.3s cubic-bezier(0.34,1.56,0.64,1),' +
                                'box-shadow 0.25s ease',
                            willChange: 'transform',
                        }}
                    >
                        {/* Photo area */}
                        <div style={{
                            width: '100%',
                            aspectRatio: '1',
                            background: p.shade,
                            border: '1.5px solid #ccc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 42,
                            overflow: 'hidden',
                            /* Vintage tint */
                            filter: isActive ? 'none' : 'sepia(8%) contrast(0.95)',
                            transition: 'filter 0.25s ease',
                        }}>
                            {p.emoji}
                        </div>

                        {/* Handwritten-style caption */}
                        <div style={{
                            position: 'absolute',
                            bottom: 9,
                            left: 8,
                            right: 8,
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 9,
                            color: '#444',
                            textAlign: 'center',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: 1.3,
                        }}>
                            {p.caption}
                        </div>

                        {/* Tape strip on top */}
                        {i % 3 === 0 && (
                            <div style={{
                                position: 'absolute',
                                top: -10,
                                left: '50%',
                                transform: 'translateX(-50%) rotate(-2deg)',
                                width: 36,
                                height: 16,
                                background: 'rgba(220,220,180,0.7)',
                                border: '1px solid rgba(0,0,0,0.15)',
                            }} />
                        )}
                    </div>
                )
            })}

            {/* Corner stamp */}
            <div style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                background: '#000',
                color: '#fff',
                fontFamily: "'Space Mono',monospace",
                fontSize: 8,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '5px 11px',
                transform: 'rotate(-3deg)',
                zIndex: 15,
                boxShadow: '2px 2px 0 #fff',
            }}>
                MEMORIES ♥
            </div>

            {/* Total count badge */}
            <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: '#000',
                color: '#fff',
                fontFamily: "'Space Mono',monospace",
                fontSize: 9,
                padding: '4px 10px',
                boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
                zIndex: 15,
            }}>
                {POLAROIDS.length} PCS
            </div>
        </div>
    )
}

/* ── Post Grid ── */
function PostGrid() {
    const [sel, setSel] = useState(null)

    return (
        <>
            <div className="profile-grid">
                {PROFILE_POSTS.map(p => (
                    <div
                        key={p.id}
                        className="profile-grid-item"
                        onClick={() => setSel(p)}
                        style={{
                            background: p.shade,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            border: '1px solid #ddd',
                            transition: 'transform 0.12s cubic-bezier(0.34,1.56,0.64,1), opacity 0.12s',
                        }}
                        onPointerDown={e => {
                            e.currentTarget.style.opacity = '0.7'
                            e.currentTarget.style.transform = 'scale(0.92)'
                        }}
                        onPointerUp={e => {
                            e.currentTarget.style.opacity = '1'
                            e.currentTarget.style.transform = 'scale(1)'
                        }}
                        onPointerLeave={e => {
                            e.currentTarget.style.opacity = '1'
                            e.currentTarget.style.transform = 'scale(1)'
                        }}
                    >
                        {p.emoji}
                    </div>
                ))}
            </div>

            {sel && (
                <div
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 20,
                    }}
                    onClick={() => setSel(null)}
                >
                    <div
                        className="pop-in"
                        style={{ background: '#fff', border: '2px solid #000', boxShadow: '8px 8px 0 #000', width: '100%' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '2px solid #000' }}>
                            <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13 }}>@senin_atin</span>
                            <button
                                onClick={() => setSel(null)}
                                style={{ border: '2px solid #000', background: '#fff', width: 36, height: 36, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0 #000', transition: 'transform 0.1s, box-shadow 0.1s' }}
                                onPointerDown={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'none' }}
                                onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '2px 2px 0 #000' }}
                            >✕</button>
                        </div>
                        <div style={{ background: sel.shade, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, borderBottom: '2px solid #000' }}>
                            {sel.emoji}
                        </div>
                        <div style={{ padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', gap: 6, transition: 'transform 0.1s' }}
                                onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.82)' }}
                                onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
                            >
                                <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#000" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                            </button>
                            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.5, flex: 1 }}>
                                <strong style={{ fontFamily: "'Space Mono',monospace" }}>@senin_atin</strong> #tusa #almaty {sel.emoji}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

/* ── Edit Profile Modal — real API ── */
function EditModal({ user, onClose, onSave }) {
    const [form, setForm] = useState({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        bio: user?.bio || '',
        city: user?.city || '',
    })
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState(null)
    const { update, uploadAv } = useProfile()
    const fileRef = useRef()

    const save = async () => {
        try {
            setSaving(true); setErr(null)
            await update(form)
            onSave?.(); onClose()
        } catch (e) {
            setErr(e?.response?.data?.message || 'Сақтау қатесі')
        } finally {
            setSaving(false)
        }
    }

    const handleAvatar = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        try { await uploadAv(file) } catch { }
    }

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-sheet slide-up">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
                    <div style={{ width: 40, height: 4, background: '#000' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '2px solid #000' }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 16 }}>ПРОФИЛЬДІ ӨҢДЕУ</div>
                    <button className="btn-icon btn-outline"
                        style={{ minWidth: 40, minHeight: 40, border: '2px solid #000', boxShadow: '2px 2px 0 #000' }}
                        onClick={onClose}
                        onPointerDown={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'none' }}
                        onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '2px 2px 0 #000' }}
                    >✕</button>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '65dvh', overflowY: 'auto' }}>
                    {err && <div style={{ background: '#000', color: '#fff', padding: '10px 14px', fontFamily: "'Space Mono',monospace", fontSize: 11 }}>✗ {err}</div>}

                    {/* Avatar upload */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1.5px solid #e0e0e0' }}>
                        <div style={{ width: 60, height: 60, background: '#000', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '3px 3px 0 #000' }}>🖤</div>
                        <button className="btn btn-outline btn-sm"
                            onClick={() => fileRef.current?.click()}
                            onPointerDown={e => { e.currentTarget.style.transform = 'translate(2px,2px) scale(0.97)'; e.currentTarget.style.boxShadow = 'none' }}
                            onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                        >📷 Аватар жүктеу</button>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
                    </div>

                    {[['firstname', 'Аты'], ['lastname', 'Тегі'], ['city', 'Қала (мыс. Алматы)']].map(([k, label]) => (
                        <div key={k}>
                            <div className="t-label" style={{ marginBottom: 8 }}>{label}</div>
                            <input className="input" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                        </div>
                    ))}
                    <div>
                        <div className="t-label" style={{ marginBottom: 8 }}>Биография</div>
                        <textarea className="input" rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} style={{ resize: 'none' }} />
                    </div>
                    <button className="btn btn-full" onClick={save} disabled={saving}
                        onPointerDown={e => { if (!saving) { e.currentTarget.style.transform = 'translate(3px,3px) scale(0.97)'; e.currentTarget.style.boxShadow = '1px 1px 0 #000' } }}
                        onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                    >{saving ? '⟳ Сақталуда...' : 'Сақтау →'}</button>
                </div>
            </div>
        </div>
    )
}

/* ── Followers/Following Modal ── */
function FollowListModal({ userId, type, onClose }) {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const { getFollowers, getFollowing } = await import('../services/api')
                const data = type === 'followers' ? await getFollowers(userId) : await getFollowing(userId)
                setUsers(data || [])
            } catch { setUsers([]) }
            finally { setLoading(false) }
        }
        load()
    }, [userId, type])

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-sheet slide-up" style={{ maxHeight: '70dvh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
                    <div style={{ width: 40, height: 4, background: '#000' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '2px solid #000' }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 16 }}>
                        {type === 'followers' ? '👥 ЖАЗЫЛУШЫЛАР' : '➡️ ЖАЗЫЛҒАНДАР'}
                    </div>
                    <button style={{ border: '2px solid #000', background: '#fff', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0 #000', fontSize: 16 }}
                        onClick={onClose}>✕</button>
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {loading ? (
                        [1, 2, 3].map(n => (
                            <div key={n} style={{ display: 'flex', gap: 12, padding: '14px 20px', borderBottom: '1.5px solid #e0e0e0', alignItems: 'center' }}>
                                <div className="skeleton" style={{ width: 44, height: 44, flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 6 }} />
                                    <div className="skeleton" style={{ height: 11, width: '25%' }} />
                                </div>
                            </div>
                        ))
                    ) : users.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#888' }}>
                            {type === 'followers' ? 'Жазылушы жоқ әлі' : 'Ешкімге жазылмадыңыз әлі'}
                        </div>
                    ) : users.map(u => (
                        <div key={u.id} style={{ display: 'flex', gap: 12, padding: '12px 20px', borderBottom: '1.5px solid #e0e0e0', alignItems: 'center' }}>
                            <div style={{ width: 44, height: 44, background: '#000', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff', flexShrink: 0, boxShadow: '3px 3px 0 #000' }}>
                                {(u.firstname || u.username || '?')[0]?.toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 14 }}>
                                    {u.firstname ? `${u.firstname} ${u.lastname || ''}`.trim() : u.username}
                                </div>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#888' }}>@{u.username}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ══════ PROFILE PAGE ══════ */
export default function Profile() {
    const [tab, setTab] = useState('memories')
    const [editOpen, setEditOpen] = useState(false)
    const [followModal, setFollowModal] = useState(null) // 'followers' | 'following' | null
    const { user, loading, refetch } = useProfile()

    const name = user ? `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.username : '...'
    const username = user?.username || '...'
    const bio = user?.bio || '🎧 Алматы рейв культурасы · 🎟️ ивент коллекционері'
    const followers = user?.followersCount ?? 0
    const following = user?.followingCount ?? 0

    const STATS = [
        { label: 'Посттар', value: loading ? '—' : (user?.postsCount ?? '—') },
        { label: 'Жазылушы', value: loading ? '—' : followers, action: () => user && setFollowModal('followers') },
        { label: 'Жазылған', value: loading ? '—' : following, action: () => user && setFollowModal('following') },
    ]

    return (
        <>
            <header className="topbar">
                <span className="topbar-title">Профиль</span>
                <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setEditOpen(true)}
                    onPointerDown={e => { e.currentTarget.style.transform = 'translate(2px,2px) scale(0.97)'; e.currentTarget.style.boxShadow = 'none' }}
                    onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                >✏️ Өңдеу</button>
            </header>

            <div className="page-shell">
                {/* ── Profile Header ── */}
                <div style={{ padding: '20px 20px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: 82, height: 82,
                                background: '#000',
                                border: '3px solid #000',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 38,
                                outline: '3px solid #000',
                                outlineOffset: 4,
                                flexShrink: 0,
                                boxShadow: '4px 4px 0 #000',
                                transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                                cursor: 'pointer',
                            }}
                                onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.93)' }}
                                onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
                                onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                            >
                                {user?.avatarUrl
                                    ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : (user?.firstname || '🖤')[0]?.toUpperCase()}
                            </div>
                            <div style={{
                                position: 'absolute', bottom: -4, right: -4,
                                width: 24, height: 24,
                                background: '#000', border: '2.5px solid #fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14, color: '#fff', cursor: 'pointer',
                                boxShadow: '2px 2px 0 #000',
                            }}
                                onClick={() => setEditOpen(true)}
                            >+</div>
                        </div>

                        {/* Stats row */}
                        <div style={{ flex: 1, display: 'flex' }}>
                            {STATS.map((s, i) => (
                                <div key={s.label} style={{
                                    flex: 1, textAlign: 'center',
                                    borderLeft: i > 0 ? '1.5px solid #e0e0e0' : 'none',
                                    cursor: s.action ? 'pointer' : 'default',
                                    transition: 'transform 0.12s',
                                }}
                                    onClick={s.action}
                                    onPointerDown={e => { if (s.action) e.currentTarget.style.transform = 'scale(0.92)' }}
                                    onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
                                    onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                                >
                                    <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 19, letterSpacing: '-0.02em' }}>{s.value}</div>
                                    <div className="t-label" style={{ fontSize: 8.5, marginTop: 2 }}>{s.label}</div>
                                    {s.action && <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, color: '#bbb', marginTop: 1 }}>↑ тізім</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Name & bio */}
                    <div style={{ marginBottom: 10 }}>
                        {loading ? (
                            <>
                                <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 6 }} />
                                <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
                                <div className="skeleton" style={{ height: 14, width: '90%' }} />
                            </>
                        ) : (
                            <>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', marginBottom: 2 }}>{name.toUpperCase()}</div>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#888', marginBottom: 8 }}>@{username}</div>
                                <p style={{ fontSize: 14, lineHeight: 1.55, color: '#333' }}>{bio}</p>
                            </>
                        )}
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                        <span className="tag tag-filled tag-sm">{user?.city || 'АЛМАТЫ'}</span>
                        <span className="tag tag-ghost tag-sm">TUSA</span>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 10, paddingBottom: 20, borderBottom: '2px solid #000' }}>
                        <button
                            className="btn btn-outline"
                            style={{ flex: 1, fontSize: 11 }}
                            onPointerDown={e => { e.currentTarget.style.transform = 'translate(3px,3px) scale(0.97)'; e.currentTarget.style.boxShadow = '1px 1px 0 #000' }}
                            onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                            onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                        >Профиль бөлісу</button>
                        <button
                            className="btn"
                            style={{ flex: 1, fontSize: 11 }}
                            onPointerDown={e => { e.currentTarget.style.transform = 'translate(3px,3px) scale(0.97)'; e.currentTarget.style.boxShadow = '1px 1px 0 #000' }}
                            onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                            onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                        >+ Достар</button>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="tabs">
                    <button className={`tab-btn${tab === 'memories' ? ' active' : ''}`} onClick={() => setTab('memories')}>
                        📷 Естеліктер
                    </button>
                    <button className={`tab-btn${tab === 'feed' ? ' active' : ''}`} onClick={() => setTab('feed')}>
                        ⊞ Лента
                    </button>
                </div>

                {/* ── Tab Content ── */}
                {tab === 'memories' ? (
                    <div className="fade-up">
                        <div style={{ padding: '14px 20px', borderBottom: '1.5px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="t-label">Полароид коллаж · {POLAROIDS.length} естелік</span>
                            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#aaa', letterSpacing: '0.05em' }}>↺ нұқып ашыңыз</span>
                        </div>
                        <PolaroidCollage />
                        <div style={{ padding: '16px 20px' }}>
                            <button
                                className="btn btn-outline btn-full btn-sm"
                                onPointerDown={e => { e.currentTarget.style.transform = 'translate(2px,2px) scale(0.97)'; e.currentTarget.style.boxShadow = 'none' }}
                                onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                                onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                            >+ Жаңа естелік қосу</button>
                        </div>
                    </div>
                ) : (
                    <div className="fade-up">
                        <PostGrid />
                    </div>
                )}
            </div>

            {editOpen && <EditModal user={user} onClose={() => setEditOpen(false)} onSave={refetch} />}
            {followModal && (
                <FollowListModal
                    userId={user?.id}
                    type={followModal}
                    onClose={() => setFollowModal(null)}
                />
            )}
        </>
    )
}
