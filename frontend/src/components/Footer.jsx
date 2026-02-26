export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t-2 border-black bg-black text-white">

            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-white flex items-center justify-center">
                            <span className="text-black font-mono font-bold text-base">T</span>
                        </div>
                        <span className="font-mono font-bold text-2xl tracking-tighter">TUSA</span>
                    </div>
                    <p className="font-mono text-sm text-gray-400 leading-relaxed max-w-xs">
                        Алматыдағы ең жарқын ивенттер платформасы.<br />
                        Тусовкаңды бірге тап.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-5">Навигация</div>
                    <nav className="flex flex-col gap-3">
                        {['Home', 'Events', 'Artists', 'Venues', 'Login'].map(link => (
                            <a
                                key={link}
                                href="#"
                                className="font-mono text-sm text-gray-300 hover:text-white transition-colors duration-150 w-fit border-b border-transparent hover:border-white pb-0.5"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Social / Newsletter */}
                <div>
                    <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-5">Хабарлама алу</div>
                    <form className="flex gap-0 mb-6" onSubmit={e => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="email@mail.com"
                            className="flex-1 bg-white/10 border-2 border-white/20 text-white placeholder-gray-600 font-mono text-sm px-4 py-2.5 focus:outline-none focus:border-white transition-colors"
                        />
                        <button type="submit" className="bg-white text-black font-mono font-bold text-sm px-5 py-2.5 hover:bg-gray-200 transition-colors border-2 border-white">
                            →
                        </button>
                    </form>

                    <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Бізбен бол</div>
                    <div className="flex gap-3">
                        {['IG', 'TG', 'TK'].map(s => (
                            <a
                                key={s}
                                href="#"
                                className="w-9 h-9 border-2 border-white/20 flex items-center justify-center font-mono text-xs text-gray-400 hover:border-white hover:text-white transition-all duration-150"
                            >
                                {s}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t-2 border-white/10 px-6 py-5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
                <span className="font-mono text-xs text-gray-600">
                    © {year} TUSA. Барлық құқықтар қорғалған.
                </span>
                <span className="font-mono text-xs text-gray-600">
                    Made with ♥ · Алматы, Қазақстан
                </span>
            </div>
        </footer>
    )
}
