/**
 * useStories — /api/stories
 * Бэкендтен stories тізімін алады, mock fallback бар
 */
import { useState, useEffect, useCallback } from 'react'
import { getStories } from '../services/api'
import { STORIES as MOCK_STORIES } from '../data/mockData'

export function useStories() {
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)
    const [source, setSource] = useState('loading')

    const fetch = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getStories()

            const mapped = (data || []).map(s => ({
                id: s.id,
                user: s.user?.username || s.username || 'user',
                emoji: s.emoji || s.mediaUrl ? null : '📷',
                imageUrl: s.mediaUrl || s.imageUrl || null,
                seen: s.seen ?? false,
                createdAt: s.createdAt,
                userId: s.user?.id || s.userId,
            }))

            if (mapped.length > 0) {
                setStories(mapped)
                setSource('backend')
            } else {
                setStories(MOCK_STORIES)
                setSource('mock-empty')
            }
        } catch (e) {
            console.warn('[useStories] mock fallback:', e?.message)
            setStories(MOCK_STORIES)
            setSource('mock')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetch() }, [fetch])

    return { stories, loading, source, refetch: fetch }
}
