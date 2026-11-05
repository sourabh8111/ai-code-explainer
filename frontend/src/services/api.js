import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 60000,
})

export async function explainCode(language, code) {
  const response = await api.post('/explain', { language, code })
  return response.data.data
}

export async function fetchHistory() {
  const response = await api.get('/history')
  return response.data.data
}
