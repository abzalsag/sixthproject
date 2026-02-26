/**
 * useChats — /api/chats/my-chats
 * Нақты чат тізімін бэкендтен алады
 */
import { useState, useEffect, useCallback } from 'react'
import { getMyChats, getChatMessages, sendMessage as apiSend, createOrOpenChat } from '../services/api'
import { DMS, COMMUNITIES } from '../data/mockData'

export function useChats() {
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const [source, setSource] = useState('loading')

    const fetch = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getMyChats()

            // Бэкенд Chat объектін береді
            const mapped = (data || []).map(chat => {
                const other = chat.user1?.username === chat.currentUser
                    ? chat.user2 : chat.user1
                const lastMsg = chat.messages?.[chat.messages.length - 1]
                return {
                    id: chat.id,
                    user: other?.firstname || other?.username || 'User',
                    handle: '@' + (other?.username || 'user'),
                    emoji: '💬',
                    shade: '#e0e0e0',
                    time: formatTime(lastMsg?.sentAt),
                    last: lastMsg?.content || '...',
                    unread: chat.unreadCount || 0,
                    userId: other?.id,
                    raw: chat,
                }
            })

            if (mapped.length > 0) {
                setChats(mapped)
                setSource('backend')
            } else {
                setChats(DMS)
                setSource('mock-empty')
            }
        } catch (e) {
            console.warn('[useChats] mock fallback:', e?.message)
            setChats(DMS)
            setSource('mock')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetch() }, [fetch])

    return { chats, loading, source, refetch: fetch }
}

export function useChatMessages(chatId) {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchMsgs = useCallback(async () => {
        if (!chatId) return
        try {
            setLoading(true)
            const data = await getChatMessages(chatId)
            const mapped = (data || []).map(m => ({
                id: m.id,
                from: m.sender?.username,   // сравниваем с current user
                text: m.content,
                time: formatTime(m.sentAt),
                raw: m,
            }))
            setMessages(mapped)
        } catch (e) {
            console.warn('[useChatMessages] error:', e?.message)
        } finally {
            setLoading(false)
        }
    }, [chatId])

    useEffect(() => { fetchMsgs() }, [fetchMsgs])

    const send = async (content) => {
        try {
            const msg = await apiSend(chatId, content)
            setMessages(prev => [...prev, {
                id: msg.id || Date.now(),
                from: 'me',
                text: content,
                time: 'қазір',
            }])
        } catch (e) {
            // Offline — тек local-ға қосамыз
            setMessages(prev => [...prev, {
                id: Date.now(),
                from: 'me',
                text: content,
                time: 'қазір',
            }])
        }
    }

    return { messages, loading, send, refetch: fetchMsgs }
}

export function useOpenChat(userId) {
    const open = async () => {
        try {
            return await createOrOpenChat(userId)
        } catch (e) {
            console.warn('[useOpenChat]', e?.message)
            return null
        }
    }
    return { open }
}

function formatTime(iso) {
    if (!iso) return '...'
    const d = new Date(iso)
    const diff = (Date.now() - d.getTime()) / 1000
    if (diff < 60) return 'қазір'
    if (diff < 3600) return Math.floor(diff / 60) + ' мин'
    if (diff < 86400) return Math.floor(diff / 3600) + ' сағ'
    return Math.floor(diff / 86400) + ' күн'
}
