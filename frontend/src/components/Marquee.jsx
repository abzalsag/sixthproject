import { useEffect, useRef } from 'react'

const WORDS = [
    'АЛМАТЫ', '•', 'EVENTS', '•', 'КЛУБ', '•', 'КОНЦЕРТ', '•',
    'TUSA', '•', 'НОЧЬ', '•', 'МУЗЫКА', '•', 'БИЛЕТ', '•',
    'АЛМАТЫ', '•', 'EVENTS', '•', 'КЛУБ', '•', 'КОНЦЕРТ', '•',
    'TUSA', '•', 'НОЧЬ', '•', 'МУЗЫКА', '•', 'БИЛЕТ', '•',
]

export default function Marquee() {
    return (
        <div className="border-y-2 border-black bg-black overflow-hidden py-3">
            <div className="marquee-track">
                {WORDS.map((word, i) => (
                    <span key={i} className="text-white font-mono text-sm font-bold tracking-widest uppercase px-4">
                        {word}
                    </span>
                ))}
            </div>
        </div>
    )
}
