import api from './api'

const reportService = {
  listReports(params) {
    return api.get('/reports', { params })
  },
  generateReport(payload) {
    return api.post('/reports/generate', payload)
  },
  getDownloadUrl(reportId) {
    return `${api.defaults.baseURL}/reports/${reportId}/download`
  },
}

export default reportService
