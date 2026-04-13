import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localstorage
    const token = localStorage.getItem('token')

    // Kalau ada token, masukin ke header Authorization
    if(token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
);

// Response Interceptor
api.interceptors.response.use(
  // Jika response berhasil, teruskan
  (response) => {
    return response;
  },
  // Jika response gagal, cek statusnya
  (error) => {
    // Jika status 401 (Unauthorized), hapus token dan redirect ke login
    // Kecuali jika user sedang di halaman login/register
    if(error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register'
      
      if (!isAuthPage) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
);

export default api;
