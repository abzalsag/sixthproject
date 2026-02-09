import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // 🔥 Импорттауды ұмытпа

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter> {/* 🔥 App-ты осының ішіне саламыз */}
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)