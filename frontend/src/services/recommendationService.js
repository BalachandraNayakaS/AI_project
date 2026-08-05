import api from './api'

const recommendationService = {
  listRecommendations(params) {
    return api.get('/recommendations', { params })
  },
  generateRecommendation(customerId, type, context) {
    return api.post('/recommendations/generate', null, {
      params: { customer_id: customerId, type, context },
    })
  },
}

export default recommendationService
