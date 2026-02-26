/**
 * useExplore — /api/events/search + /api/v1/users/search
 * Іздеу: events + users, mock fallback
 */
import { useState, useCallback } from 'react'
import { searchEvents, searchUsers, getTrendingEvents } from '../services/api'
import { EXPLORE_POSTS } from '../data/mockData'

export function useExplore() {
    const [results, setResults] = useState([])
    const [users, setUsers] = useState([])
    const [trending, setTrending] = useState([])
    const [loading, setLoading] = useState(false)
    const [source, setSource] = useState('idle')

    /** Іздеу (events + users) */
    const search = useCallback(async (query) => {
        if (!query || query.trim().length < 2) {
            setResults([])
            setUsers([])
            setSource('idle')
            return
        }
        try {
            setLoading(true)
            const [eventData, userData] = await Promise.allSettled([
                searchEvents(query),
                searchUsers(query),
            ])

            const events = eventData.status === 'fulfilled' ? (eventData.value || []) : []
            const usrs = userData.status === 'fulfilled' ? (userData.value || []) : []

            const mappedEvents = events.map(ev => ({
                id: ev.id,
                type: 'event',
                title: ev.title,
                subtitle: ev.location || ev.category || '',
                emoji: '🎟️',
                shade: '#e0e0e0',
                raw: ev,
            }))

            const mappedUsers = usrs.map(u => ({
                id: u.id,
                type: 'user',
                title: u.username || u.firstname,
                subtitle: `@${u.username}`,
                emoji: '👤',
                shade: '#f0f0f0',
                avatarUrl: u.avatarUrl,
                raw: u,
            }))

            setResults(mappedEvents)
            setUsers(mappedUsers)
            setSource(mappedEvents.length > 0 || mappedUsers.length > 0 ? 'backend' : 'backend-empty')
        } catch (e) {
            console.warn('[useExplore] search error:', e?.message)
            setSource('error')
        } finally {
            setLoading(false)
        }
    }, [])

    /** Trending ивенттер */
    const fetchTrending = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getTrendingEvents()
            const mapped = (data || []).map((ev, i) => ({
                id: ev.id || i + 1,
                type: 'event',
                title: ev.title,
                subtitle: ev.location || ev.category || '',
                emoji: ev.emoji || ['🎧', '🎸', '🎛️', '📸', '🌃', '🎤'][i % 6],
                shade: ['#f5f5f5', '#e8e8e8', '#d0d0d0', '#b8b8b8', '#a0a0a0', '#888'][i % 6],
                h: [120, 180, 140, 200, 130, 160][i % 6],
                raw: ev,
            }))

            if (mapped.length > 0) {
                setTrending(mapped)
                setSource('backend')
            } else {
                setTrending(EXPLORE_POSTS)
                setSource('mock-empty')
            }
        } catch {
            setTrending(EXPLORE_POSTS)
            setSource('mock')
        } finally {
            setLoading(false)
        }
    }, [])

    return { results, users, trending, loading, source, search, fetchTrending }
}
