/* ── Shared mock data & tiny helpers ── */

// Palette of greyscale "avatar" colors
export const BG_SHADES = ['#f5f5f5', '#e8e8e8', '#d0d0d0', '#b8b8b8', '#a0a0a0', '#888', '#222']

// Stories
export const STORIES = [
    { id: 1, user: 'aizat_k', seen: false, emoji: '🎧' },
    { id: 2, user: 'miras.djz', seen: false, emoji: '🎪' },
    { id: 3, user: 'dima_rave', seen: true, emoji: '🎵' },
    { id: 4, user: 'sana_alm', seen: true, emoji: '🌃' },
    { id: 5, user: 'fabric_kz', seen: false, emoji: '🔊' },
    { id: 6, user: 'jake_live', seen: true, emoji: '🎤' },
]

// Feed posts
export const POSTS = [
    { id: 1, user: 'aizat_k', handle: '@aizat_k', time: '2 сағат', likes: 214, comments: 18, caption: 'Кешегі рейв — өмірімдегі ең жақшы түн 🖤 #fabricnight #almaty', tag: 'КЛУБ', emoji: '🎧', shade: '#e0e0e0' },
    { id: 2, user: 'miras.djz', handle: '@miras.djz', time: '5 сағат', likes: 887, comments: 43, caption: 'Жаңа сет жазып болдым. Тыңда 👂 link in bio', tag: 'DJ SET', emoji: '🎛️', shade: '#c8c8c8' },
    { id: 3, user: 'jake_live', handle: '@jake_live', time: '1 күн', likes: 1204, comments: 92, caption: 'Алматы, сен дайынсың ба? 8 наурыз концерте кездесеміз 🎸', tag: 'КОНЦЕРТ', emoji: '🎸', shade: '#e8e8e8' },
    { id: 4, user: 'sana_alm', handle: '@sana_alm', time: '1 күн', likes: 339, comments: 27, caption: 'Ачем кофесі + ивент билеті = мінсіз күн ☕🎟️', tag: 'LIFESTYLE', emoji: '📸', shade: '#d4d4d4' },
    { id: 5, user: 'fabric_kz', handle: '@fabric_kz', time: '2 күн', likes: 568, comments: 51, caption: 'Келесі жұма — B2B Sessions. Билет саны шектеулі!', tag: 'EVENT', emoji: '🔊', shade: '#bdbdbd' },
]

// Events (Ticketon mode)
export const EVENTS = [
    { id: 1, title: 'FABRIC NIGHT', genre: 'Techno · House', date: '1 МАР', time: '23:00', venue: 'Fabric Club', price: '5 000 ₸', sold: 73, tag: 'КЛУБ' },
    { id: 2, title: 'JAKE × ALMATY', genre: 'Indie · Акустика', date: '8 МАР', time: '20:00', venue: 'Capitol Hall', price: '8 500 ₸', sold: 91, tag: 'КОНЦЕРТ' },
    { id: 3, title: 'B2B SESSIONS', genre: 'Deep House · Afro', date: '15 МАР', time: '22:00', venue: 'Mojo Bar', price: '3 000 ₸', sold: 55, tag: 'КЛУБ' },
    { id: 4, title: 'SYNTHWAVE NIGHT', genre: 'Synth · Retro', date: '22 МАР', time: '21:00', venue: 'Vortex Lounge', price: '4 500 ₸', sold: 40, tag: 'КЛУБ' },
]

// My tickets
export const MY_TICKETS = [
    { id: 1, title: 'FABRIC NIGHT', date: '1 МАР · 23:00', venue: 'Fabric Club', seat: 'GA · NO SEAT', code: 'TUS-00123' },
    { id: 2, title: 'B2B SESSIONS', date: '15 МАР · 22:00', venue: 'Mojo Bar', seat: 'GA · ROOFTOP', code: 'TUS-00456' },
]

// DMs
export const DMS = [
    { id: 1, user: 'Aizat K', handle: '@aizat_k', time: '14:32', last: 'Кешегі рейвтан кейін...', unread: 3, emoji: '🎧', shade: '#e0e0e0' },
    { id: 2, user: 'DJ Miras', handle: '@miras.djz', time: '12:01', last: 'Сен де сол жерде болдың ба?', unread: 0, emoji: '🎛️', shade: '#c8c8c8' },
    { id: 3, user: 'Jake', handle: '@jake_live', time: 'Кеше', last: 'Билетің дайын!', unread: 1, emoji: '🎸', shade: '#e8e8e8' },
    { id: 4, user: 'Sana', handle: '@sana_alm', time: 'Күн', last: '👍', unread: 0, emoji: '📸', shade: '#d4d4d4' },
    { id: 5, user: 'Fabric Club', handle: '@fabric_kz', time: 'Кеше', last: 'Рахмет! Ивентте кездесеміз', unread: 0, emoji: '🔊', shade: '#bdbdbd' },
]

// Communities
export const COMMUNITIES = [
    { id: 1, name: 'FABRIC NIGHT — 1 Нар', members: 412, last: '23:00де есік ашылады', emoji: '🔊' },
    { id: 2, name: 'JAKE × ALMATY Fans', members: 1204, last: 'Бүгін сахна схемасы жарияланды', emoji: '🎸' },
    { id: 3, name: 'B2B SESSIONS', members: 239, last: 'VIP орындар бар ма?', emoji: '🎤' },
]

// Explore posts (masonry)
export const EXPLORE_POSTS = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    h: [120, 180, 140, 200, 130, 160, 190, 120, 150, 170, 130, 140, 200, 120, 180, 160, 140, 170][i] || 140,
    shade: BG_SHADES[i % BG_SHADES.length],
    emoji: ['🎧', '🎸', '🎛️', '📸', '🌃', '🎤', '🔊', '🎹', '🎪', '🎵', '💫', '🖤', '✨', '🎶', '🎻', '🎺', '🥁', '🎼'][i] || '🎵',
    user: ['aizat_k', 'miras.djz', 'jake_live', 'sana_alm', 'fabric_kz'][i % 5],
}))

// Profile grid posts
export const PROFILE_POSTS = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    shade: BG_SHADES[i % BG_SHADES.length],
    emoji: ['🎧', '🌃', '🎸', '🎛️', '📸', '🔊', '🎤', '💫', '🖤', '✨', '🎵', '🎪'][i],
}))

// Polaroid memories
export const POLAROIDS = [
    { id: 1, emoji: '🎧', caption: 'Fabric Night — Желтоқсан', rotate: '-3deg', shade: '#e0e0e0' },
    { id: 2, emoji: '🎸', caption: 'Jake Concert — Қаңтар', rotate: '2deg', shade: '#c8c8c8' },
    { id: 3, emoji: '🌃', caption: 'Rooftop B2B — Ақпан', rotate: '-1.5deg', shade: '#d4d4d4' },
    { id: 4, emoji: '📸', caption: 'Afterparty @ Mojo', rotate: '3deg', shade: '#e8e8e8' },
    { id: 5, emoji: '🎤', caption: 'Open Mic — Алматы Arts', rotate: '-2deg', shade: '#b8b8b8' },
    { id: 6, emoji: '🎛️', caption: 'DJ Miras seti — Studio', rotate: '1.5deg', shade: '#d0d0d0' },
]
