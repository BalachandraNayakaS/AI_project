import { FiBell, FiMoon, FiSearch, FiSun, FiUser } from 'react-icons/fi'
import useTheme from '../../hooks/useTheme'
import useAuth from '../../hooks/useAuth'

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-slate-700">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-600 shadow-sm">
            <FiSearch className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">Search AI platform</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            aria-label="Notifications"
          >
            <FiBell className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FiUser className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{user?.username || 'User'}</p>
              <button type="button" onClick={logout} className="text-xs text-slate-500 hover:text-slate-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
