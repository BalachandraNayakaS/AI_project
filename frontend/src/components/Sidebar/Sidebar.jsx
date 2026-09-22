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
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white/80 backdrop-blur-xl px-5 py-6 lg:block dark:bg-slate-900/80 dark:border-slate-800">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3.5 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
          <FiCpu className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">AI Copilot</h1>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Business Intelligence</p>
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
                `flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-semibold translate-x-0.5'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
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
      <div className="mt-10 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-cyan-50/40 p-5 border border-indigo-100/80 dark:from-slate-800/80 dark:via-indigo-950/40 dark:to-slate-800/80 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <FiCpu className="h-5 w-5" />
          <p className="font-bold text-sm">Need AI Insights?</p>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">Use AI Chatbot to analyze revenue trends or prioritize hot leads instantly.</p>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={logout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-800/60 dark:border-slate-700/80 dark:text-slate-300 dark:hover:bg-rose-950/30 dark:hover:border-rose-800 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
      >
        <FiLogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  )
}
