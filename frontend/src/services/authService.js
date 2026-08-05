import api from './api'

const authService = {
  setToken(token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  },
  clearToken() {
    delete api.defaults.headers.common.Authorization
  },
  login(credentials) {
    return api.post('/auth/login', credentials)
  },
  register(payload) {
    return api.post('/auth/register', payload)
  },
  getProfile() {
    return api.get('/auth/profile')
  },
}

export default authService
