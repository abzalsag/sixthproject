/**
 * useDarkMode — Dark mode hook
 * localStorage-да сақтайды, html-ға data-theme="dark" қояды
 */
import { useState, useEffect } from 'react'

export function useDarkMode() {
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem('tusa_dark')
        if (saved !== null) return saved === 'true'
        // System preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        const root = document.documentElement
        if (dark) {
            root.setAttribute('data-theme', 'dark')
        } else {
            root.removeAttribute('data-theme')
        }
        localStorage.setItem('tusa_dark', String(dark))
    }, [dark])

    return [dark, setDark]
}
