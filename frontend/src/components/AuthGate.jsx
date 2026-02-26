import { useState } from 'react'
import { login, register } from '../services/api'

/* ══════════════════════════════════════════
   TUSA Auth Gate v2 — Login / Register
   Mobile: орталыққа тік форма
   Desktop: сол жақ — қара брендинг, оң жақ — форма
   ══════════════════════════════════════════ */

/* Лейбл стиль */
const labelStyle = {
    fontFamily: "'Space Mono',monospace",
    fontSize: 9,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: 6,
}

export default function AuthGate({ onSuccess }) {
    const [mode, setMode] = useState('login')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const [loginForm, setLoginForm] = useState({ username: '', password: '' })
    const [regForm, setRegForm] = useState({ firstname: '', lastname: '', email: '', username: '', password: '' })

    const upd = (setter) => (field) => (e) =>
        setter(prev => ({ ...prev, [field]: e.target.value }))

    /* Login */
    const handleLogin = async (e) => {
        e.preventDefault()
        if (!loginForm.username || !loginForm.password) {
            setError('Барлық өрістерді толтырыңыз'); return
        }
        setLoading(true); setError(null)
        try {
            const data = await login(loginForm.username, loginForm.password)
            setSuccess('Сәтті кірдіңіз!')
            setTimeout(() => onSuccess(data), 600)
        } catch (err) {
            const status = err?.response?.status
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error || ''
            let msg
            if (!err?.response) msg = 'Бекенд қосылмаған (localhost:8080)'
            else if (status === 401) msg = 'Қате пайдаланушы аты немесе пароль'
            else if (status === 403) msg = 'Рұқсат жоқ (403 Forbidden)'
            else if (status === 404) msg = 'Пайдаланушы табылмады'
            else if (serverMsg) msg = serverMsg
            else msg = `Қате: ${status || 'белгісіз'}`
            setError(msg)
        } finally { setLoading(false) }
    }

    /* Register */
    const handleRegister = async (e) => {
        e.preventDefault()
        const { firstname, email, username, password } = regForm
        if (!firstname || !email || !username || !password) {
            setError('Барлық * өрістерді толтырыңыз'); return
        }
        if (password.length < 6) {
            setError('Пароль кемінде 6 символ болуы керек'); return
        }
        setLoading(true); setError(null)
        try {
            const data = await register(regForm)
            setSuccess('Тіркелдіңіз! Кіруде...')
            setTimeout(() => onSuccess(data), 700)
        } catch (err) {
            const status = err?.response?.status
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error || ''
            let msg
            if (!err?.response) msg = 'Бекенд қосылмаған (localhost:8080)'
            else if (status === 409 || serverMsg.toLowerCase().includes('exist') || serverMsg.toLowerCase().includes('already'))
                msg = 'Бұл email немесе username бұрыннан тіркелген'
            else if (serverMsg) msg = serverMsg
            else msg = `Тіркелу қателігі (${status ?? 'желі қатесі'})`
            setError(msg)
        } finally { setLoading(false) }
    }

    /* ── Auth Card (form) ── */
    const AuthCard = () => (
        <div style={{
            width: '100%',
            maxWidth: 420,
            border: '2px solid #000',
            background: '#fff',
            boxShadow: '7px 7px 0px 0px #000',
        }}>
            {/* Mode tabs */}
            <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
                {[['login', '→ Кіру'], ['register', '+ Тіркелу']].map(([m, label]) => (
                    <button key={m} onClick={() => { setMode(m); setError(null); setSuccess(null) }}
                        style={{
                            flex: 1, minHeight: 50,
                            borderRight: m === 'login' ? '2px solid #000' : 'none',
                            border: 'none',
                            background: mode === m ? '#000' : '#fff',
                            color: mode === m ? '#fff' : '#888',
                            fontFamily: "'Space Mono',monospace",
                            fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.06em', textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'background 0.15s, color 0.15s',
                        }}
                    >{label}</button>
                ))}
            </div>

            <div style={{ padding: '24px 24px 22px' }}>
                {/* Error banner */}
                {error && (
                    <div style={{
                        background: '#000', color: '#fff',
                        padding: '11px 14px', marginBottom: 16,
                        fontFamily: "'Space Mono',monospace", fontSize: 11,
                        border: '2px solid #000', boxShadow: '3px 3px 0 #444',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                    }}>
                        <span>✗ {error}</span>
                        <button onClick={() => setError(null)}
                            style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>✕</button>
                    </div>
                )}

                {/* Success banner */}
                {success && (
                    <div style={{
                        background: '#000', color: '#fff',
                        padding: '11px 14px', marginBottom: 16,
                        fontFamily: "'Space Mono',monospace", fontSize: 11, boxShadow: '3px 3px 0 #444',
                    }}>✓ {success}</div>
                )}

                {/* LOGIN FORM */}
                {mode === 'login' && (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <div style={labelStyle}>Пайдаланушы аты</div>
                            <input className="input" type="text" placeholder="username"
                                value={loginForm.username} onChange={upd(setLoginForm)('username')}
                                autoComplete="username" autoCapitalize="none" />
                        </div>
                        <div>
                            <div style={labelStyle}>Пароль</div>
                            <input className="input" type="password" placeholder="••••••••"
                                value={loginForm.password} onChange={upd(setLoginForm)('password')}
                                autoComplete="current-password" />
                        </div>
                        <button type="submit" className="btn btn-full" style={{ marginTop: 6 }}
                            disabled={loading}
                            onPointerDown={e => { if (!loading) { e.currentTarget.style.transform = 'translate(3px,3px) scale(0.97)'; e.currentTarget.style.boxShadow = '1px 1px 0 #000' } }}
                            onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                            onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                        >
                            {loading
                                ? <span style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
                                    Кіруде...
                                </span>
                                : 'Кіру →'}
                        </button>
                    </form>
                )}

                {/* REGISTER FORM */}
                {mode === 'register' && (
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <div style={{ flex: 1 }}>
                                <div style={labelStyle}>Аты *</div>
                                <input className="input" placeholder="Абзал"
                                    value={regForm.firstname} onChange={upd(setRegForm)('firstname')} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={labelStyle}>Тегі</div>
                                <input className="input" placeholder="Сейтжанов"
                                    value={regForm.lastname} onChange={upd(setRegForm)('lastname')} />
                            </div>
                        </div>
                        <div>
                            <div style={labelStyle}>Email *</div>
                            <input className="input" type="email" placeholder="you@tusa.kz"
                                value={regForm.email} onChange={upd(setRegForm)('email')} autoComplete="email" />
                        </div>
                        <div>
                            <div style={labelStyle}>Пайдаланушы аты *</div>
                            <input className="input" placeholder="username"
                                value={regForm.username} onChange={upd(setRegForm)('username')}
                                autoComplete="username" autoCapitalize="none" />
                        </div>
                        <div>
                            <div style={labelStyle}>Пароль * <span style={{ color: '#bbb', fontWeight: 400 }}>(мин. 6 символ)</span></div>
                            <input className="input" type="password" placeholder="••••••••"
                                value={regForm.password} onChange={upd(setRegForm)('password')} autoComplete="new-password" />
                        </div>
                        <button type="submit" className="btn btn-full" style={{ marginTop: 6 }}
                            disabled={loading}
                            onPointerDown={e => { if (!loading) { e.currentTarget.style.transform = 'translate(3px,3px) scale(0.97)'; e.currentTarget.style.boxShadow = '1px 1px 0 #000' } }}
                            onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                            onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                        >
                            {loading
                                ? <span style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
                                    Тіркелуде...
                                </span>
                                : 'Тіркелу →'}
                        </button>
                    </form>
                )}

                <div style={{
                    marginTop: 20, paddingTop: 14, borderTop: '1.5px solid #e0e0e0',
                    fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#ccc',
                    textAlign: 'center', letterSpacing: '0.06em',
                }}>
                    BACKEND · localhost:8080 · JWT Auth
                </div>
            </div>
        </div>
    )

    /* ════════════════════════════════════════
       RENDER — mobile + desktop split
       ════════════════════════════════════════ */
    return (
        <>
            {/* ── MOBILE (<1024px) ── */}
            <div style={{
                display: 'flex',
                minHeight: '100dvh',
                background: '#fff',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 24px calc(24px + env(safe-area-inset-bottom))',
            }}
                className="auth-mobile-only"
            >
                <div style={{ marginBottom: 32, textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 48, letterSpacing: '-0.07em', lineHeight: 1 }}>TUSA</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.18em', color: '#888', marginTop: 8, textTransform: 'uppercase' }}>
                        Өз Тусовкаңды Тап
                    </div>
                </div>
                <AuthCard />
            </div>

            {/* ── DESKTOP (≥1024px) ── */}
            <div className="auth-desktop-only" style={{
                display: 'none',
                minHeight: '100dvh',
            }}>
                {/* Left panel — black branding */}
                <div style={{
                    background: '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '60px 56px',
                    borderRight: '2px solid #000',
                    minHeight: '100dvh',
                }}>
                    {/* Top logo */}
                    <div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 36, letterSpacing: '-0.07em', color: '#fff', lineHeight: 1 }}>
                            TUSA
                        </div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.18em', color: '#666', marginTop: 10, textTransform: 'uppercase' }}>
                            Өз Тусовкаңды Тап
                        </div>
                    </div>

                    {/* Center content */}
                    <div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 42, color: '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.03em' }}>
                            Алматының<br />ең жарқын<br />ивенттері.
                        </div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#555', lineHeight: 1.8, maxWidth: 340 }}>
                            Концерттер, клубтық кештер,<br />
                            rave-лар, билеттер — бәрі бір платформада.
                        </div>
                    </div>

                    {/* Bottom stats */}
                    <div style={{ display: 'flex', gap: 40 }}>
                        {[['500+', 'Ивент'], ['10K+', 'Пайдаланушы'], ['50+', 'Ұйымдастырушы']].map(([val, label]) => (
                            <div key={label}>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: '-0.03em' }}>{val}</div>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right panel — form */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px',
                    background: '#f8f8f8',
                    minHeight: '100dvh',
                }}>
                    <div style={{ width: '100%', maxWidth: 440 }}>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 28, textTransform: 'uppercase' }}>
                            {mode === 'login' ? 'Жүйеге кіру' : 'Тіркелу'}
                        </div>
                        <AuthCard />
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (min-width: 1024px) {
          .auth-mobile-only { display: none !important; }
          .auth-desktop-only {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
        </>
    )
}
