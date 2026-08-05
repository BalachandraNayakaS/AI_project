import api from './api'

const salesService = {
  listSales(params) {
    return api.get('/sales', { params })
  },
}

export default salesService
