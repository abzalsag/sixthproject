import { useState, useRef } from 'react'
import { createPost, createEvent, getMyTickets, likeEvent } from '../services/api'
import { MY_TICKETS } from '../data/mockData'

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

/* ════════════════════════════
   POST PANEL — нақты API
   POST /posts  (multipart)
   ════════════════════════════ */
function PostPanel() {
    const [caption, setCaption] = useState('')
    const [mediaType, setMediaType] = useState('photo')
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [done, setDone] = useState(false)
    const fileRef = useRef()

    const handleFile = (f) => {
        if (!f) return
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    const handleDrop = (e) => {
        e.preventDefault(); setDragOver(false)
        handleFile(e.dataTransfer.files?.[0])
    }

    const submit = async () => {
        if (!caption.trim() && !file) {
            setError('Сипаттама немесе файл қажет')
            return
        }
        setLoading(true); setError(null)
        try {
            if (file) {
                // Нақты бэкенд API
                await createPost(caption, file)
            } else {
                // Текст ғана — Event арқылы жариялаймыз
                await createEvent({ title: caption, description: caption, category: 'POST' })
            }
            setDone(true)
        } catch (e) {
            const msg = e?.response?.data?.message || e?.response?.data?.error || ''
            setError(msg || `Жариялау қатесі (${e?.response?.status || 'желі'})`)
        } finally {
            setLoading(false)
        }
    }

    if (done) return (
        <div className="pop-in" style={{ textAlign: 'center', padding: '52px 24px' }}>
            <div style={{ fontSize: 68, marginBottom: 16 }}>🖤</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 24, marginBottom: 8 }}>ЖАРИЯЛАНДЫ!</div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 28 }}>Постың лентаға қосылды.</div>
            <button className="btn btn-outline btn-full" onClick={() => { setDone(false); setCaption(''); setFile(null); setPreview(null) }} {...press}>
                + Тағы жариялау
            </button>
        </div>
    )

    return (
        <div style={{ padding: '20px' }} className="fade-up">
            {/* Error */}
            {error && (
                <div style={{ background: '#000', color: '#fff', padding: '10px 14px', marginBottom: 16, fontFamily: "'Space Mono',monospace", fontSize: 11, boxShadow: '3px 3px 0 #444' }}>
                    ✗ {error}
                </div>
            )}

            {/* Media type toggle */}
            <div style={{ display: 'flex', border: '2px solid #000', marginBottom: 20, boxShadow: '4px 4px 0 #000' }}>
                {[['photo', '📷 Фото'], ['video', '🎬 Видео']].map(([t, label], i) => (
                    <button key={t} onClick={() => setMediaType(t)} style={{
                        flex: 1, minHeight: 50, border: 'none', cursor: 'pointer',
                        borderRight: i === 0 ? '2px solid #000' : 'none',
                        background: mediaType === t ? '#000' : '#fff',
                        color: mediaType === t ? '#fff' : '#000',
                        fontFamily: "'Space Mono',monospace", fontSize: 12,
                        letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700,
                        transition: 'background 0.15s, color 0.15s',
                    }}>{label}</button>
                ))}
            </div>

            {/* Upload zone — file input */}
            <input
                ref={fileRef}
                type="file"
                accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files?.[0])}
            />

            <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                    border: `2.5px dashed ${dragOver ? '#000' : '#888'}`,
                    aspectRatio: mediaType === 'photo' ? '1' : '9/16',
                    maxHeight: 300,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 12,
                    background: dragOver ? '#f0f0f0' : '#fafafa',
                    marginBottom: 20,
                    transition: 'background 0.15s, border-color 0.15s, transform 0.12s',
                    transform: dragOver ? 'scale(0.98)' : 'scale(1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {preview ? (
                    <>
                        {mediaType === 'photo'
                            ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <video src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        }
                        {/* Change overlay */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'rgba(0,0,0,0.65)', color: '#fff',
                            fontFamily: "'Space Mono',monospace", fontSize: 10,
                            padding: '8px', textAlign: 'center', letterSpacing: '0.06em',
                        }}>
                            {file.name} · нұқып ауыстыру
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: 56 }}>{mediaType === 'photo' ? '📷' : '🎬'}</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#888', textAlign: 'center', lineHeight: 1.6 }}>
                            Файлды осында сүйреңіз<br />немесе
                        </div>
                        <button className="btn btn-outline btn-sm" {...pressSm} onClick={e => { e.stopPropagation(); fileRef.current?.click() }}>Жүктеу ↑</button>
                    </>
                )}
            </div>

            {/* Caption */}
            <div style={{ marginBottom: 16 }}>
                <div className="t-label" style={{ marginBottom: 8 }}>Сипаттама</div>
                <textarea className="input" rows={3} placeholder="Пост туралы жазыңыз... #tusa #almaty"
                    value={caption} onChange={e => setCaption(e.target.value)} style={{ resize: 'none' }} />
            </div>

            {/* Char counter */}
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#aaa', textAlign: 'right', marginTop: -10, marginBottom: 16 }}>
                {caption.length} / 500
            </div>

            <button className="btn btn-full" onClick={submit} disabled={loading} {...press}>
                {loading
                    ? <span style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
                        Жариялануда...
                    </span>
                    : 'Жариялау →'}
            </button>
        </div>
    )
}

/* ════════════════════════════
   EVENT PANEL — нақты API
   POST /api/events
   ════════════════════════════ */
function EventPanel() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [done, setDone] = useState(false)
    const [age, setAge] = useState('18+')
    const [form, setForm] = useState({
        title: '', description: '', location: '',
        price: '', capacity: '', genre: '',
        eventDate: '', eventTime: '',
    })

    const upd = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

    const submit = async () => {
        if (!form.title.trim()) { setError('Ивент атауы міндетті'); return }
        setLoading(true); setError(null)
        try {
            const dateStr = form.eventDate && form.eventTime
                ? new Date(`${form.eventDate}T${form.eventTime}`).toISOString()
                : new Date().toISOString()

            await createEvent({
                title: form.title,
                description: form.description,
                location: form.location,
                price: form.price ? parseFloat(form.price) : 0,
                capacity: form.capacity ? parseInt(form.capacity) : 100,
                category: form.genre || 'EVENT',
                ageLimit: age,
                eventDate: dateStr,
            })
            setDone(true)
        } catch (e) {
            const msg = e?.response?.data?.message || e?.response?.data?.error || ''
            setError(msg || `Қате (${e?.response?.status || 'желі'})`)
        } finally {
            setLoading(false)
        }
    }

    if (done) return (
        <div className="pop-in" style={{ textAlign: 'center', padding: '52px 24px' }}>
            <div style={{ fontSize: 68, marginBottom: 16 }}>🎟️</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 24, marginBottom: 8 }}>ЖІБЕРІЛДІ!</div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 28 }}>Ивент бэкендке сақталды ✓</div>
            <button className="btn btn-outline btn-full" onClick={() => { setDone(false); setForm({ title: '', description: '', location: '', price: '', capacity: '', genre: '', eventDate: '', eventTime: '' }) }} {...press}>
                + Тағы жасау
            </button>
        </div>
    )

    return (
        <div style={{ padding: '20px' }} className="fade-up">
            {/* Header */}
            <div style={{ background: '#000', color: '#fff', padding: '12px 16px', fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 22, boxShadow: '4px 4px 0 #444' }}>
                ⚡ ҰЙЫМДАСТЫРУШЫ ФОРМАСЫ
            </div>

            {error && (
                <div style={{ background: '#000', color: '#fff', padding: '10px 14px', marginBottom: 16, fontFamily: "'Space Mono',monospace", fontSize: 11, boxShadow: '3px 3px 0 #444' }}>
                    ✗ {error}
                </div>
            )}

            {/* Fields */}
            {[
                ['title', 'Ивент атауы *', 'FABRIC NIGHT Vol.4'],
                ['genre', 'Жанр / стиль', 'Techno · House · Dark Rave'],
                ['location', 'Venue (орын)', 'Fabric Club, Алматы'],
            ].map(([k, label, ph]) => (
                <div key={k} style={{ marginBottom: 14 }}>
                    <div className="t-label" style={{ marginBottom: 8 }}>{label}</div>
                    <input className="input" placeholder={ph} value={form[k]} onChange={upd(k)} />
                </div>
            ))}

            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                    <div className="t-label" style={{ marginBottom: 8 }}>Күні</div>
                    <input type="date" className="input" value={form.eventDate} onChange={upd('eventDate')} style={{ fontFamily: "'Space Mono',monospace" }} />
                </div>
                <div style={{ flex: 1 }}>
                    <div className="t-label" style={{ marginBottom: 8 }}>Уақыты</div>
                    <input type="time" className="input" value={form.eventTime} onChange={upd('eventTime')} style={{ fontFamily: "'Space Mono',monospace" }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                    <div className="t-label" style={{ marginBottom: 8 }}>Баға (₸)</div>
                    <input className="input" placeholder="5 000" type="number" value={form.price} onChange={upd('price')} />
                </div>
                <div style={{ flex: 1 }}>
                    <div className="t-label" style={{ marginBottom: 8 }}>Орын саны</div>
                    <input className="input" placeholder="500" type="number" value={form.capacity} onChange={upd('capacity')} />
                </div>
            </div>

            {/* Age chips */}
            <div style={{ marginBottom: 18 }}>
                <div className="t-label" style={{ marginBottom: 10 }}>Жас шегі</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['16+', '18+', '21+', 'Барлығы'].map(a => (
                        <button key={a} onClick={() => setAge(a)}
                            className={`tag ${age === a ? 'tag-filled' : 'tag-ghost'}`}
                            style={{ cursor: 'pointer', minHeight: 38, fontSize: 11 }}>
                            {a}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 24 }}>
                <div className="t-label" style={{ marginBottom: 8 }}>Сипаттама</div>
                <textarea className="input" rows={4} placeholder="Ивент туралы толық мәлімет..." value={form.description} onChange={upd('description')} style={{ resize: 'none' }} />
            </div>

            <button className="btn btn-full" onClick={submit} disabled={loading} {...press}>
                {loading
                    ? <span style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
                        Жіберілуде...
                    </span>
                    : 'Ивентті жіберу →'}
            </button>
        </div>
    )
}

/* ══════ CREATE PAGE ══════ */
export default function Create() {
    const [panel, setPanel] = useState('post')

    return (
        <>
            <header className="topbar">
                <span className="topbar-title">Жариялау</span>
                <span className="tag tag-filled tag-sm">{panel === 'post' ? 'ПОСТ' : 'ИВЕНТ'}</span>
            </header>

            <div className="page-shell">
                {/* Toggle — sticky */}
                <div style={{ display: 'flex', borderBottom: '2px solid #000', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
                    {[['post', '📱 Пост / Видео'], ['event', '🎟️ Ивент']].map(([id, label], i) => (
                        <button key={id} onClick={() => setPanel(id)} style={{
                            flex: 1, minHeight: 52, border: 'none', cursor: 'pointer',
                            borderRight: i === 0 ? '2px solid #000' : 'none',
                            background: panel === id ? '#000' : '#fff',
                            color: panel === id ? '#fff' : '#000',
                            fontFamily: "'Space Mono',monospace", fontSize: 11,
                            letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700,
                            transition: 'background 0.15s, color 0.15s',
                        }}
                            onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
                            onPointerUp={e => { e.currentTarget.style.transform = '' }}
                            onPointerLeave={e => { e.currentTarget.style.transform = '' }}
                        >{label}</button>
                    ))}
                </div>

                {panel === 'post' && <PostPanel />}
                {panel === 'event' && <EventPanel />}
            </div>
        </>
    )
}
