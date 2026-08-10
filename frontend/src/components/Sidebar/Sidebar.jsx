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
  FiCpu,
  FiAward,
} from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'

const navItems = [
  { label: 'Dashboard', to: '/', icon: FiBarChart2 },
  { label: 'AI Chatbot', to: '/chatbot', icon: FiMessageCircle },
  { label: 'Customers', to: '/customers', icon: FiUsers },
  { label: 'Sales', to: '/sales', icon: FiShoppingCart },
  { label: 'Leads', to: '/leads', icon: FiTrendingUp },
  { label: 'Analytics', to: '/analytics', icon: FiStar },
  { label: 'Recommendations', to: '/recommendations', icon: FiAward },
  { label: 'Reports', to: '/reports', icon: FiFileText },
  { label: 'Settings', to: '/settings', icon: FiSettings },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white/80 backdrop-blur-lg px-5 py-6 lg:block">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
          <FiCpu className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-slate-900">AI Copilot</h1>
          <p className="text-xs text-slate-500 font-medium">Business Intelligence</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* AI Assistance Promo Box */}
      <div className="mt-10 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 p-5 border border-indigo-100/60 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-700">
          <FiCpu className="h-5 w-5" />
          <p className="font-bold text-sm">Need AI Insights?</p>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">Use AI Chatbot to analyze revenue trends or prioritize hot leads instantly.</p>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={logout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
      >
        <FiLogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  )
}
