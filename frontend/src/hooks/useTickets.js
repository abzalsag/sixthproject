/**
 * useTickets — /api/events/tickets/*
 * Менің билеттерім + сатып алу
 */
import { useState, useEffect, useCallback } from 'react'
import { getMyTickets, buyTicket } from '../services/api'
import { MY_TICKETS } from '../data/mockData'

export function useTickets() {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [source, setSource] = useState('loading')

    const fetch = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getMyTickets()

            const mapped = (data || []).map(t => ({
                id: t.id,
                title: t.event?.title || t.title || 'Ивент',
                date: t.event?.eventDate
                    ? new Date(t.event.eventDate).toLocaleDateString('kk-KZ') + ' · ' +
                    new Date(t.event.eventDate).toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
                    : t.date || '—',
                venue: t.event?.location || t.venue || '—',
                seat: t.seatInfo || 'GA · NO SEAT',
                code: t.qrCode || `TUS-${String(t.id).padStart(5, '0')}`,
            }))

            if (mapped.length > 0) {
                setTickets(mapped)
                setSource('backend')
            } else {
                setTickets(MY_TICKETS)
                setSource('mock-empty')
            }
        } catch (e) {
            console.warn('[useTickets] mock fallback:', e?.message)
            setTickets(MY_TICKETS)
            setSource('mock')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetch() }, [fetch])

    /** Билет сатып алу */
    const purchase = useCallback(async (eventId, quantity = 1) => {
        try {
            const result = await buyTicket(eventId, quantity)
            await fetch() // жаңарту
            return { success: true, data: result }
        } catch (e) {
            return { success: false, error: e?.response?.data?.message || e?.message || 'Қате' }
        }
    }, [fetch])

    return { tickets, loading, source, refetch: fetch, purchase }
}
