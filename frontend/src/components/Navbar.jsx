import { useState } from 'react'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-black">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <a href="#" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 bg-black flex items-center justify-center transition-transform duration-200 group-hover:rotate-6">
                        <span className="text-white font-mono font-bold text-sm tracking-tight">T</span>
                    </div>
                    <span className="font-mono font-bold text-xl tracking-tighter uppercase select-none">TUSA</span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10">
                    <a href="#" className="nav-link">Home</a>
                    <a href="#events" className="nav-link">Events</a>
                    <a href="#login" className="nav-link">Login</a>
                </nav>

                {/* CTA + Burger */}
                <div className="flex items-center gap-4">
                    <a href="#login" className="hidden md:block btn-brutal btn-brutal-outline text-sm py-2 px-5 box-shadow-sm">
                        Кіру
                    </a>

                    {/* Burger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-1 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 bg-black transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-black transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-black transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64 border-t-2 border-black' : 'max-h-0'}`}>
                <nav className="flex flex-col px-6 py-4 gap-5 bg-white">
                    <a href="#" onClick={() => setMenuOpen(false)} className="nav-link text-base">Home</a>
                    <a href="#events" onClick={() => setMenuOpen(false)} className="nav-link text-base">Events</a>
                    <a href="#login" onClick={() => setMenuOpen(false)} className="nav-link text-base">Login</a>
                    <a href="#login" className="btn-brutal btn-brutal-outline py-3 text-center mt-2">Кіру</a>
                </nav>
            </div>
        </header>
    )
}
