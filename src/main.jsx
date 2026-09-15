import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import './App.css'

// Sin librería de rutas: /admin es la única dirección aparte del e-commerce,
// así que alcanza con mirar la URL una vez al cargar la página.
const isAdmin = window.location.pathname.startsWith('/admin')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </React.StrictMode>,
)
