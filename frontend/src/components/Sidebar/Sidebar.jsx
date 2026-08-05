import { NavLink } from 'react-router-dom'
import {
  FiBarChart2,
  FiMessageCircle,
  FiUsers,
  FiShoppingCart,
  FiTrendingUp,
  FiStar,
  FiFileText,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'

const navItems = [
  { label: 'Dashboard', to: '/', icon: FiBarChart2 },
  { label: 'AI Chatbot', to: '/chatbot', icon: FiMessageCircle },
  { label: 'Customers', to: '/customers', icon: FiUsers },
  { label: 'Sales', to: '/sales', icon: FiShoppingCart },
  { label: 'Leads', to: '/leads', icon: FiTrendingUp },
  { label: 'Analytics', to: '/analytics', icon: FiStar },
  { label: 'Recommendations', to: '/recommendations', icon: FiFileText },
  { label: 'Reports', to: '/reports', icon: FiFileText },
  { label: 'Settings', to: '/settings', icon: FiSettings },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:block">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-semibold text-slate-900">AI Business Copilot</h1>
        <p className="mt-1 text-sm text-slate-500">Sales and support intelligence dashboard</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-14 rounded-3xl bg-indigo-50 p-5 text-sm text-slate-700 shadow-soft">
        <p className="font-semibold text-slate-900">Need help?</p>
        <p className="mt-2 text-sm text-slate-600">Use AI assistant to review leads or generate reports faster.</p>
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <FiLogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  )
}
