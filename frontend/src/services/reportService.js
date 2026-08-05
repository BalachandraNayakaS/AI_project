import api from './api'

const reportService = {
  generateReport(payload) {
    return api.post('/reports/generate', payload)
  },
}

export default reportService
