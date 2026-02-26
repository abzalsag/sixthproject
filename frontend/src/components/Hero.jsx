import { useState, useEffect } from 'react'

export default function Hero() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 200)
        return () => clearTimeout(t)
    }, [])

    return (
        <section className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-20">
            {/* Grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Big background letters */}
            <div
                className="absolute select-none pointer-events-none left-0 right-0 text-center font-mono font-bold text-[22vw] leading-none text-black opacity-[0.04]"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                aria-hidden="true"
            >
                TUSA
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                    {/* Tag */}
                    <div className="mb-8 flex items-center gap-3">
                        <span className="tag tag-filled">Алматы · 2025</span>
                        <span className="tag">Event Platform</span>
                    </div>

                    {/* BIG TITLE */}
                    <h1 className="hero-title text-[clamp(3.5rem,10vw,9rem)] mb-6 max-w-5xl">
                        ӨЗ
                        <br />
                        ТУСОВ<span className="inline-block bg-black text-white px-3">КАҢДЫ</span>
                        <br />
                        <span className="relative inline-block">
                            ТАП
                            <span className="blink ml-2 text-black">_</span>
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="font-mono text-base md:text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
                        Алматыдағы ең жарқын ивенттер, концерттер және клубтық кештер — барлығы бір платформада. Билетіңді бүгін ал.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-5">
                        <a href="#events" className="btn-brutal text-base">
                            Билет алу →
                        </a>
                        <a href="#events" className="btn-brutal btn-brutal-outline text-base">
                            Ивенттерді қарау
                        </a>
                    </div>

                    {/* Stats row */}
                    <div className="mt-16 pt-8 border-t-2 border-black flex flex-wrap gap-10">
                        {[
                            { value: '50+', label: 'Ай сайын ивент' },
                            { value: '12K+', label: 'Сатылған билет' },
                            { value: '30+', label: 'Серіктес клуб' },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="fade-up"
                                style={{ animationDelay: `${0.3 + i * 0.15}s`, animationFillMode: 'both', opacity: 0 }}
                            >
                                <div className="font-mono font-bold text-4xl tracking-tight">{stat.value}</div>
                                <div className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-mono">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
                <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
                <div className="w-px h-10 bg-black animate-pulse" />
            </div>
        </section>
    )
}
