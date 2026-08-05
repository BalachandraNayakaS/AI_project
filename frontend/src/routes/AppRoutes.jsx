import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/Login/LoginPage'
import RegisterPage from '../pages/Register/RegisterPage'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import ChatbotPage from '../pages/Chatbot/ChatbotPage'
import CustomersPage from '../pages/Customers/CustomersPage'
import SalesPage from '../pages/Sales/SalesPage'
import LeadsPage from '../pages/Leads/LeadsPage'
import AnalyticsPage from '../pages/Analytics/AnalyticsPage'
import RecommendationsPage from '../pages/Recommendations/RecommendationsPage'
import ReportsPage from '../pages/Reports/ReportsPage'
import SettingsPage from '../pages/Settings/SettingsPage'
import NotFoundPage from '../pages/NotFound/NotFoundPage'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

      <Route path="/" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/chatbot" element={<ProtectedRoute><DashboardLayout><ChatbotPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><DashboardLayout><CustomersPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><DashboardLayout><SalesPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><DashboardLayout><LeadsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><AnalyticsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><DashboardLayout><RecommendationsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><DashboardLayout><ReportsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
