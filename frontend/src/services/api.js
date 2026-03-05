/**
 * TUSA API Service
 * Dev:  Vite proxy арқылы localhost:8080-ге жіберіледі
 * Prod: VITE_API_URL env variable (Railway backend URL)
 */
import axios from 'axios'

// Production-да: https://your-backend.railway.app/api
// Dev-та: '' (бос) → Vite proxy /api → localhost:8080/api
const BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api'

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

/* ── Auth interceptor ── */
api.interceptors.request.use(cfg => {
    const token = localStorage.getItem('tusa_token')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
})

api.interceptors.response.use(
    r => r,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('tusa_token')
            localStorage.removeItem('tusa_user')
        }
        return Promise.reject(err)
    }
)

/* ════════════════════════════════
   AUTH  /api/v1/auth/*
   ════════════════════════════════ */
export const register = (data) =>
    api.post('/v1/auth/register', data).then(r => {
        if (r.data.token) {
            localStorage.setItem('tusa_token', r.data.token)
            localStorage.setItem('tusa_user', JSON.stringify({
                email: data.email, username: data.username, firstname: data.firstname,
            }))
        }
        return r.data
    })

export const login = (username, password) =>
    api.post('/v1/auth/authenticate', { username, password }).then(r => {
        if (r.data.token) localStorage.setItem('tusa_token', r.data.token)
        return r.data
    })

export const logout = () => {
    localStorage.removeItem('tusa_token')
    localStorage.removeItem('tusa_user')
}

export const getToken = () => localStorage.getItem('tusa_token')
export const isLoggedIn = () => !!getToken()

/* ════════════════════════════════
   USERS  /api/v1/users/*
   ════════════════════════════════ */
/** Өзімнің профиль деректерім */
export const getMe = () =>
    api.get('/v1/users/me').then(r => r.data)

/** Профильді жаңарту */
export const updateMe = (data) =>
    api.put('/v1/users/me', data).then(r => r.data)

/** Аватар жүктеу */
export const uploadAvatar = (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/v1/users/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
}

/** Аватар URL */
export const getAvatarUrl = (filename) =>
    filename ? `${BASE_URL}/v1/users/avatar/${filename}` : null

/** Пайдаланушы іздеу */
export const searchUsers = (query) =>
    api.get('/v1/users/search', { params: { query } }).then(r => r.data)

/** Follow / Unfollow */
export const toggleFollow = (userId) =>
    api.post(`/v1/users/${userId}/follow`).then(r => r.data)

/** Басқаның профилі */
export const getUserById = (id) =>
    api.get(`/v1/users/${id}`).then(r => r.data)

/** Пароль өзгерту */
export const changePassword = (oldPassword, newPassword) =>
    api.put('/v1/users/password', { oldPassword, newPassword }).then(r => r.data)

/** Аккаунт жою */
export const deleteAccount = () =>
    api.delete('/v1/users/me').then(r => r.data)

/* ════════════════════════════════
   EVENTS  /api/events/*
   ════════════════════════════════ */
export const getEvents = () =>
    api.get('/events').then(r => r.data)

export const getEventById = (id) =>
    api.get(`/events/${id}`).then(r => r.data)

export const getFeedEvents = () =>
    api.get('/events/feed').then(r => r.data)

export const getTrendingEvents = () =>
    api.get('/events/trending').then(r => r.data)

export const searchEvents = (query) =>
    api.get('/events/search', { params: { query } }).then(r => r.data)

export const getMyEvents = () =>
    api.get('/events/my-posts').then(r => r.data)

export const createEvent = (data) =>
    api.post('/events', data).then(r => r.data)

export const likeEvent = (id) =>
    api.post(`/events/${id}/like`).then(r => r.data)

export const deleteEvent = (id) =>
    api.delete(`/events/${id}`).then(r => r.data)

/* ════════════════════════════════
   POSTS  /posts/*
   ════════════════════════════════ */
export const getAllPosts = () =>
    api.get('/posts').then(r => r.data)

export const getFeedPosts = () =>
    api.get('/posts/feed').then(r => r.data)

export const createPost = (caption, file) => {
    const fd = new FormData()
    fd.append('caption', caption || '')
    if (file) fd.append('file', file)
    return api.post('/posts', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
}

export const likePost = (id) =>
    api.post(`/likes/${id}`).then(r => r.data)

export const getSavedPosts = () =>
    api.get('/posts/saved').then(r => r.data)

export const toggleSavePost = (id) =>
    api.post(`/posts/${id}/save`).then(r => r.data)

/** Пайдаланушы посттары */
export const getUserPosts = (userId) =>
    api.get(`/posts/user/${userId}`).then(r => r.data).catch(() => [])

/* ════════════════════════════════
   TICKETS  /api/events/tickets/*
   ════════════════════════════════ */
export const getMyTickets = () =>
    api.get('/events/tickets/my').then(r => r.data)

export const buyTicket = (eventId, quantity) =>
    api.post('/events/tickets/buy', { eventId, quantity }).then(r => r.data)

/* ════════════════════════════════
   CHATS  /api/chats/*
   ════════════════════════════════ */
export const getMyChats = () =>
    api.get('/chats/my-chats').then(r => r.data)

export const createOrOpenChat = (userId) =>
    api.post('/chats/create', { userId }).then(r => r.data)

export const getChatMessages = (chatId) =>
    api.get(`/chats/${chatId}/messages`).then(r => r.data)

export const sendMessage = (chatId, content) =>
    api.post(`/chats/${chatId}/send`, { content }).then(r => r.data)

export const getUnreadCount = () =>
    api.get('/chats/unread-count').then(r => r.data)

/* ════════════════════════════════
   STORIES  /api/stories/*
   ════════════════════════════════ */
export const getStories = () =>
    api.get('/stories').then(r => r.data).catch(() => [])

export const createStory = (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/stories', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
}

/* ════════════════════════════════
   NOTIFICATIONS
   ════════════════════════════════ */
export const getNotifications = () =>
    api.get('/notifications').then(r => r.data).catch(() => [])

/* ════════════════════════════════
   COMMENTS  /api/comments/*
   ════════════════════════════════ */
export const getComments = (postId) =>
    api.get(`/comments/post/${postId}`).then(r => r.data).catch(() => [])

export const addComment = (postId, content) =>
    api.post(`/comments/${postId}`, { content }).then(r => r.data)

export const deleteComment = (commentId) =>
    api.delete(`/comments/${commentId}`).then(r => r.data)

/* ════════════════════════════════
   FOLLOW  /api/v1/users/*
   ════════════════════════════════ */
export const followUser = (userId) =>
    api.post(`/v1/users/${userId}/follow`).then(r => r.data)

export const unfollowUser = (userId) =>
    api.post(`/v1/users/${userId}/follow`).then(r => r.data)  // toggle

export const getFollowers = (userId) =>
    api.get(`/v1/users/${userId}/followers-list`).then(r => r.data).catch(() => [])

export const getFollowing = (userId) =>
    api.get(`/v1/users/${userId}/following-list`).then(r => r.data).catch(() => [])

export default api
