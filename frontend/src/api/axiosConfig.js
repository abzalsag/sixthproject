import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    // 🔥 ӨЗГЕРІС: headers бөлігін толығымен алып тастадым.
    // Енді Axios файл жіберсең "multipart", мәтін жіберсең "json" деп өзі ауыстырады.
});

// 1. СҰРАНЫС ЖІБЕРГЕНДЕ (Request Interceptor)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. ЖАУАП КЕЛГЕНДЕ (Response Interceptor)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Егер сервер "Токен ескірді" (403) десе:
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            console.error("Токен ескірді! Автоматты түрде шығарылуда...");

            // 1. Ескі токенді өшіреміз
            localStorage.removeItem('token');

            // 2. Сайтты жаңартамыз
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default api;