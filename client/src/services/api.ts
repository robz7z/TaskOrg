import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3035/api',
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response, // sucesso: só retorna a resposta
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado → fazer logout e redirecionar
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)