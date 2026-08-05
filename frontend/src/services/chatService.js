import api from './api'

const chatService = {
  sendMessage(message) {
    return api.post('/chat', { message })
  },
}

export default chatService
