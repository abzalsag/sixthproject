/**
 * useEvents — SixthProject backend-тен ивенттер алатын hook
 * ─────────────────────────────────────────────────────────────
 * GET /api/events — JWT Bearer token қажет
 *
 * Backend Event entity өрістері:
 *   id, title, location (venue), category, eventDate,
 *   price (BigDecimal), likes, averageRating, tickets[]
 *
 * Бекенд жауап бермесе — mockData-дан fallback жасайды.
 */

import { useState, useEffect, useCallback } from 'react'
import { getEvents } from '../services/api'
import { EVENTS as MOCK_EVENTS } from '../data/mockData'

/**
 * Backend Event объектін TUSA UI форматына айналдыру
 */
function normalizeEvent(ev) {
    // price: BigDecimal → "5 000 ₸" форматы
    const rawPrice = ev.price ?? ev.ticketPrice ?? 0
    const priceNum = typeof rawPrice === 'object' ? Number(rawPrice) : Number(rawPrice)
    const priceStr = priceNum > 0
        ? `${priceNum.toLocaleString('kk-KZ')} ₸`
        : 'Тегін'

    // eventDate: "2025-03-15T23:00:00" → "15 наурыз" / "23:00"
    let dateStr = '–'
    let timeStr = '–'
    if (ev.eventDate) {
        const d = new Date(ev.eventDate)
        dateStr = d.toLocaleDateString('kk-KZ', { day: 'numeric', month: 'long' })
        timeStr = d.toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
    } else if (ev.date) {
        dateStr = ev.date
        timeStr = ev.time || '–'
    }

    // sold % — билет толғандығын есептеу
    const soldTickets = ev.tickets?.length ?? 0
    const totalTickets = ev.maxTickets ?? ev.capacity ?? 100
    const soldPct = Math.min(Math.round((soldTickets / totalTickets) * 100), 100)

    return {
        id: ev.id,
        title: ev.title || ev.name || 'Белгісіз ивент',
        genre: ev.category || ev.genre || '–',
        venue: ev.location || ev.venue || '–',
        date: dateStr,
        time: timeStr,
        price: priceStr,
        sold: ev.soldPercentage ?? soldPct,
        tag: (ev.category || 'EVENT').toUpperCase().slice(0, 8),
        likes: ev.likes ?? 0,
        rating: ev.averageRating ?? 0,
        imageUrl: ev.imageUrl || null,
        // raw для других полей
        _raw: ev,
    }
}

export function useEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [source, setSource] = useState('loading') // 'backend' | 'mock' | 'loading'

    const fetchEvents = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            console.log(
                '%c[useEvents] Бекендтен ивенттер жүктелуде... GET /api/events',
                'color: #FF9800; font-weight: bold; font-family: monospace'
            )

            const data = await getEvents()

            const normalized = Array.isArray(data)
                ? data.map(normalizeEvent)
                : []

            console.log(
                `%c[useEvents] ✓ Бекендтен ${normalized.length} ивент алынды`,
                'color: #4CAF50; font-weight: bold; font-family: monospace',
                normalized
            )

            setEvents(normalized)
            setSource('backend')

        } catch (err) {
            const status = err?.response?.status
            const msg = err?.response?.data?.message || err?.message || 'Белгісіз қате'

            /* ── console.error — ҚЫЗЫЛ ── */
            console.error(
                `%c[useEvents] ✗ БЕКЕНД ҚАТЕСІ [${status || 'NETWORK'}]: ${msg}`,
                'color: red; font-size: 13px; font-weight: bold; font-family: monospace; background: #fff0f0; padding: 2px 6px;',
                '\nDetails:', err?.response?.data || err?.message
            )

            setError({ message: msg, status: status || 'NETWORK_ERROR' })

            // Fallback to mock data
            console.warn(
                '%c[useEvents] ⚠ Mock деректер қолданылды',
                'color: #FF9800; font-family: monospace; font-weight: bold'
            )
            setEvents(MOCK_EVENTS)
            setSource('mock')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchEvents() }, [fetchEvents])

    return { events, loading, error, source, refetch: fetchEvents }
}
