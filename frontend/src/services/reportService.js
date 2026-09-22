import api from './api'

const reportService = {
  listReports(params) {
    return api.get('/reports', { params })
  },
  generateReport(payload) {
    return api.post('/reports/generate', payload)
  },
  downloadReport(reportId) {
    return api.get(`/reports/${reportId}/download`, {
      responseType: 'blob',
    })
  },
  getDownloadUrl(reportId) {
    const token = localStorage.getItem('auth_token')
    return `${api.defaults.baseURL}/reports/${reportId}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`
  },
}

export default reportService

