/**
 * useProfile — /api/v1/users/me
 * Нақты пайдаланушы деректерін JWT арқылы алады
 */
import { useState, useEffect, useCallback } from 'react'
import { getMe, updateMe, uploadAvatar, getAvatarUrl, toggleFollow, changePassword } from '../services/api'

export function useProfile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchMe = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getMe()
            setUser(data)
        } catch (e) {
            setError(e?.response?.data?.message || 'Профиль жүктелмеді')
            console.error('[useProfile] error:', e)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchMe() }, [fetchMe])

    const update = async (fields) => {
        const updated = await updateMe(fields)
        setUser(updated)
        return updated
    }

    const uploadAv = async (file) => {
        await uploadAvatar(file)
        await fetchMe()
    }

    const follow = async (userId) => {
        const res = await toggleFollow(userId)
        return res
    }

    const changePass = async (oldPassword, newPassword) => {
        return await changePassword(oldPassword, newPassword)
    }

    return {
        user, loading, error, refetch: fetchMe,
        update, uploadAv, follow, changePass,
        avatarUrl: user?.avatarUrl ? getAvatarUrl(user.avatarUrl) : null,
    }
}
