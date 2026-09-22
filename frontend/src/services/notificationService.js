import api from './api'

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'High-Score Lead Generated',
    message: 'AI scored prospect Lead #102 with 94% conversion probability.',
    type: 'lead',
    category: 'Lead Prioritization',
    read: false,
    timestamp: '10m ago',
    link: '/leads',
  },
  {
    id: 'notif-2',
    title: 'New Support Ticket Pending',
    message: 'Customer Apex Global opened an urgent billing inquiry ticket.',
    type: 'ticket',
    category: 'Customer Support',
    read: false,
    timestamp: '25m ago',
    link: '/customers',
  },
  {
    id: 'notif-3',
    title: 'AI Upsell Opportunity',
    message: 'New enterprise add-on recommendation available for TechCorp.',
    type: 'recommendation',
    category: 'AI Insights',
    read: false,
    timestamp: '1h ago',
    link: '/recommendations',
  },
  {
    id: 'notif-4',
    title: 'Monthly Target Achieved',
    message: 'Sales team reached 105% of Q3 revenue benchmark target.',
    type: 'sales',
    category: 'Sales Intelligence',
    read: true,
    timestamp: '3h ago',
    link: '/sales',
  },
  {
    id: 'notif-5',
    title: 'Executive Report Generated',
    message: 'Q3 Revenue & Lead Conversion Analysis PDF report is ready for export.',
    type: 'system',
    category: 'Reports',
    read: true,
    timestamp: '5h ago',
    link: '/reports',
  },
]

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications')
      if (response.data && Array.isArray(response.data)) {
        return response.data
      }
      return DEFAULT_NOTIFICATIONS
    } catch (error) {
      return DEFAULT_NOTIFICATIONS
    }
  },
}

export default notificationService
