import api from './api'

const customerService = {
  listCustomers(params) {
    return api.get('/customers', { params })
  },
}

export default customerService
