/**
 * usePosts — /posts  (feed + all)
 * Нақты посттарды бэкендтен алады
 */
import { useState, useEffect, useCallback } from 'react'
import { getAllPosts, getFeedPosts } from '../services/api'
import { POSTS } from '../data/mockData'

export function usePosts(mode = 'all') {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [source, setSource] = useState('loading')

    const fetch = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = mode === 'feed' ? await getFeedPosts() : await getAllPosts()

            // Бэкенд Event объектін береді — frontend форматқа кеіру
            const mapped = (data || []).map(ev => ({
                id: ev.id,
                user: ev.organizer?.username || ev.organizer?.firstname || 'user',
                handle: '@' + (ev.organizer?.username || 'user'),
                time: formatTime(ev.createdAt),
                likes: ev.likes || 0,
                comments: ev.comments?.length || 0,
                caption: ev.description || ev.title || '',
                tag: ev.category || 'ПОСТ',
                emoji: '📷',
                shade: '#e0e0e0',
                imageUrl: ev.imageUrl || null,
                raw: ev,
            }))

            if (mapped.length > 0) {
                setPosts(mapped)
                setSource('backend')
            } else {
                // Бос болса mock
                setPosts(POSTS)
                setSource('mock-empty')
            }
        } catch (e) {
            console.warn('[usePosts] backend қол жетімсіз, mock қолданамыз:', e?.message)
            setPosts(POSTS)
            setSource('mock')
            setError({ message: e?.message, status: e?.response?.status })
        } finally {
            setLoading(false)
        }
    }, [mode])

    useEffect(() => { fetch() }, [fetch])

    return { posts, loading, error, source, refetch: fetch }
}

function formatTime(iso) {
    if (!iso) return '...'
    const d = new Date(iso)
    const diff = (Date.now() - d.getTime()) / 1000
    if (diff < 3600) return Math.floor(diff / 60) + ' мин'
    if (diff < 86400) return Math.floor(diff / 3600) + ' сағат'
    return Math.floor(diff / 86400) + ' күн'
}
