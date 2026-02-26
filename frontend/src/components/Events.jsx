import { useState } from 'react'

const EVENTS = [
    {
        id: 1,
        type: 'КЛУБ',
        title: 'FABRIC NIGHT',
        subtitle: 'Techno · House · Dark Rave',
        venue: 'Fabric Club',
        address: 'Достық даңғылы, 85',
        date: '1 НАУРЫЗ',
        time: '23:00',
        price: '5 000 ₸',
        tags: ['18+', 'Қосымша жарық жоқ', 'Dress code'],
        sold: 73,
        description: 'Алматының ең кірпік рейвы. DJ Мирас мен Alina K — эксклюзив сет. Кіруге тек брауния болады.',
        gradient: 'from-gray-50 to-gray-100',
    },
    {
        id: 2,
        type: 'КОНЦЕРТ',
        title: 'JAKE × ALMATY',
        subtitle: 'Indie · Lo-fi · Акустика',
        venue: 'Capitol Hall',
        address: 'Сейфуллин к-сі, 502',
        date: '8 НАУРЫЗ',
        time: '20:00',
        price: '8 500 ₸',
        tags: ['16+', 'Live band', '1200 орын'],
        sold: 91,
        description: 'Сезоның тамаша концерті. Жанды дауысы мен 7 музыканттан тұратын топ — Алматыға алғаш рет.',
        gradient: 'from-white to-gray-50',
    },
    {
        id: 3,
        type: 'КЛУБ',
        title: 'B2B SESSIONS',
        subtitle: 'Deep House · Afro',
        venue: 'Mojo Bar',
        address: 'Панфилов к-сі, 98',
        date: '15 НАУРЫЗ',
        time: '22:00',
        price: '3 000 ₸',
        tags: ['21+', 'Rooftop', '400 орын'],
        sold: 55,
        description: 'Алматының бас жерінде, шатырда — Deep House-тың ең жарқын B2B сессиясы. Шексіз ауа мен эмоция.',
        gradient: 'from-gray-50 to-white',
    },
]

function SoldBar({ percent }) {
    return (
        <div className="w-full h-1.5 bg-gray-200 mt-3">
            <div
                className="h-full bg-black transition-all duration-700"
                style={{ width: `${percent}%` }}
            />
        </div>
    )
}

function EventCard({ event, index }) {
    const [hovered, setHovered] = useState(false)

    return (
        <article
            className="card-brutal overflow-hidden fade-up"
            style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'both', opacity: 0 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Top bar */}
            <div className="border-b-2 border-black px-6 py-3 flex items-center justify-between bg-black">
                <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">{event.type}</span>
                <span className="font-mono text-xs text-gray-400">{event.date} · {event.time}</span>
            </div>

            {/* Image placeholder area */}
            <div className={`relative h-52 bg-gradient-to-br ${event.gradient} border-b-2 border-black flex items-center justify-center overflow-hidden`}>
                {/* Abstract geometric shape */}
                <div className={`absolute transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}>
                    <div className="w-28 h-28 border-2 border-black rotate-12 absolute -top-6 -left-6" />
                    <div className="w-20 h-20 bg-black rotate-45 opacity-10" />
                    <div className="w-16 h-16 border-2 border-black -rotate-12 absolute -bottom-8 right-4" />
                </div>

                {/* Big number */}
                <span className="font-mono font-bold text-8xl text-black opacity-[0.06] select-none">{String(event.id).padStart(2, '0')}</span>

                {/* Price badge */}
                <div className="absolute top-4 right-4 bg-black text-white font-mono font-bold text-sm px-3 py-1">
                    {event.price}
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
                <h3 className="font-mono font-bold text-2xl tracking-tight leading-none mb-1">{event.title}</h3>
                <p className="text-gray-400 text-sm font-mono mb-4">{event.subtitle}</p>

                <p className="text-sm leading-relaxed text-gray-600 mb-5">{event.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {event.tags.map(tag => (
                        <span key={tag} className="tag text-xs">{tag}</span>
                    ))}
                </div>

                {/* Venue */}
                <div className="border-t-2 border-black pt-4 mb-4">
                    <div className="flex items-start gap-2">
                        <span className="font-mono text-xs text-gray-400 uppercase tracking-widest mt-0.5">📍</span>
                        <div>
                            <div className="font-mono font-bold text-sm">{event.venue}</div>
                            <div className="text-xs text-gray-400 font-mono">{event.address}</div>
                        </div>
                    </div>
                </div>

                {/* Sold indicator */}
                <div className="mb-5">
                    <div className="flex justify-between font-mono text-xs text-gray-400 mb-1">
                        <span>Сатылды</span>
                        <span>{event.sold}%</span>
                    </div>
                    <SoldBar percent={event.sold} />
                </div>

                {/* CTA */}
                <a href="#" className={`btn-brutal w-full text-center block text-sm ${event.sold >= 90 ? 'opacity-60 pointer-events-none' : ''}`}>
                    {event.sold >= 90 ? 'Таусылуға жақын ⚡' : 'Билет алу →'}
                </a>
            </div>
        </article>
    )
}

export default function Events() {
    return (
        <section id="events" className="py-24 border-t-2 border-black">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                    <div>
                        <div className="tag tag-filled mb-4">Жақындағы ивенттер</div>
                        <h2 className="font-mono font-bold text-5xl md:text-6xl tracking-tighter leading-none uppercase">
                            EVENT<br />
                            <span className="text-gray-300">BOARD</span>
                        </h2>
                    </div>
                    <div className="max-w-xs">
                        <p className="font-mono text-sm text-gray-500 leading-relaxed">
                            Алматының ең сапалы ивенттері — фильтр, іздеу, лезде сатып алу.
                        </p>
                    </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {EVENTS.map((event, i) => (
                        <EventCard key={event.id} event={event} index={i} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-14 flex justify-center">
                    <a href="#" className="btn-brutal btn-brutal-outline text-sm">
                        Барлық ивенттер →
                    </a>
                </div>
            </div>
        </section>
    )
}
