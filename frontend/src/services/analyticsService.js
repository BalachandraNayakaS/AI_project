import api from './api'

const analyticsService = {
  getDashboard() {
    return api.get('/analytics/dashboard')
  },
}

export default analyticsService
