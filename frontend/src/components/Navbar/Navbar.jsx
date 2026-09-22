import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBell,
  FiCheckCircle,
  FiCpu,
  FiDollarSign,
  FiHelpCircle,
  FiMoon,
  FiSearch,
  FiSun,
  FiTrendingUp,
  FiUser,
  FiX,
  FiCheck,
} from 'react-icons/fi'
import useTheme from '../../hooks/useTheme'
import useAuth from '../../hooks/useAuth'
import customerService from '../../services/customerService'
import notificationService from '../../services/notificationService'

const PLATFORM_PAGES = [
  { name: 'Dashboard', path: '/', desc: 'Overview of business metrics, sales & tickets' },
  { name: 'AI Chatbot', path: '/chatbot', desc: 'Ask AI assistant questions about sales & support' },
  { name: 'Customers', path: '/customers', desc: 'Manage accounts, contact details & profiles' },
  { name: 'Sales Intelligence', path: '/sales', desc: 'Track deals, product revenue & sales trends' },
  { name: 'Lead Prioritization', path: '/leads', desc: 'View AI scored leads and high-intent prospects' },
  { name: 'Analytics', path: '/analytics', desc: 'Deep dive into revenue charts & performance' },
  { name: 'Recommendations', path: '/recommendations', desc: 'AI generated upsell & renewal recommendations' },
  { name: 'Reports', path: '/reports', desc: 'Export executive business & sales reports' },
  { name: 'Settings', path: '/settings', desc: 'Manage application preferences & profile' },
]

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [matchingCustomers, setMatchingCustomers] = useState([])
  const [searchingCust, setSearchingCust] = useState(false)
  const searchRef = useRef(null)

  // Notification States
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifications, setNotifications] = useState([])
  const notifRef = useRef(null)

  // Fetch notifications on mount
  useEffect(() => {
    notificationService.getNotifications().then((data) => {
      setNotifications(data || [])
    })
  }, [])

  // Compute unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  // Filter pages based on query
  const filteredPages = PLATFORM_PAGES.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase()),
  )

  // Search customers when query length >= 2
  useEffect(() => {
    if (query.trim().length < 2) {
      setMatchingCustomers([])
      return
    }

    const timer = setTimeout(async () => {
      setSearchingCust(true)
      try {
        const res = await customerService.listCustomers({ search: query.trim() })
        setMatchingCustomers(res.data || [])
      } catch (err) {
        setMatchingCustomers([])
      } finally {
        setSearchingCust(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectPage = (path) => {
    setIsOpen(false)
    setQuery('')
    navigate(path)
  }

  const handleSelectCustomer = (customerName) => {
    setIsOpen(false)
    setQuery('')
    navigate(`/customers?search=${encodeURIComponent(customerName)}`)
  }

  const handleAskAI = () => {
    setIsOpen(false)
    const prompt = query.trim()
    setQuery('')
    navigate('/chatbot', { state: { initialPrompt: prompt } })
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleSelectNotif = (notif) => {
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)))
    setShowNotifs(false)
    if (notif.link) {
      navigate(notif.link)
    }
  }

  const getNotifIcon = (type) => {
    switch (type) {
      case 'lead':
        return <FiTrendingUp className="h-4 w-4 text-emerald-600" />
      case 'ticket':
        return <FiHelpCircle className="h-4 w-4 text-amber-600" />
      case 'recommendation':
        return <FiCpu className="h-4 w-4 text-indigo-600" />
      case 'sales':
        return <FiDollarSign className="h-4 w-4 text-sky-600" />
      default:
        return <FiCheckCircle className="h-4 w-4 text-slate-600" />
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Search Bar Container */}
        <div ref={searchRef} className="relative w-full max-w-md">
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3.5 text-slate-400 dark:text-slate-500">
              <FiSearch className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search platform, customers, sales or ask AI..."
              className="w-full rounded-full border border-slate-200/90 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/90 py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setMatchingCustomers([])
                }}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown Overlay */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 max-h-[460px] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-xl">
              
              {/* Ask AI Copilot Option */}
              {query.trim().length > 0 && (
                <div className="mb-2 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={handleAskAI}
                    className="flex w-full items-center gap-3 rounded-2xl bg-indigo-50 px-3.5 py-2.5 text-left text-sm text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <div className="grid h-7 w-7 place-items-center rounded-xl bg-indigo-600 text-white">
                      <FiCpu className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Ask AI Copilot about "{query}"</p>
                      <p className="text-xs text-indigo-500">Analyze sales, support tickets & lead data with AI</p>
                    </div>
                  </button>
                </div>
              )}

              {/* Matching Customers */}
              {query.trim().length >= 2 && (
                <div className="mb-3">
                  <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Customers {searchingCust && '(searching...)'}
                  </p>
                  {matchingCustomers.length === 0 && !searchingCust ? (
                    <p className="px-3 text-xs text-slate-500">No matching customers found</p>
                  ) : (
                    matchingCustomers.map((cust) => (
                      <button
                        key={cust.id}
                        type="button"
                        onClick={() => handleSelectCustomer(cust.name)}
                        className="flex w-full items-center justify-between rounded-2xl px-3.5 py-2 text-left transition hover:bg-slate-100"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{cust.name}</p>
                          <p className="text-xs text-slate-500">{cust.company || cust.email}</p>
                        </div>
                        <span className="text-xs font-medium text-indigo-600">View Account →</span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Matching Platform Features & Pages */}
              <div>
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Features</p>
                {filteredPages.length === 0 ? (
                  <p className="px-3 text-xs text-slate-500">No matching features found</p>
                ) : (
                  filteredPages.map((page) => (
                    <button
                      key={page.path}
                      type="button"
                      onClick={() => handleSelectPage(page.path)}
                      className="flex w-full items-center justify-between rounded-2xl px-3.5 py-2 text-left transition hover:bg-slate-100"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{page.name}</p>
                        <p className="text-xs text-slate-500">{page.desc}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

        {/* Right Header Navigation Icons */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          {/* Notifications Dropdown Container */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setShowNotifs((prev) => !prev)}
              className="relative grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 focus:outline-none"
              aria-label="Notifications"
            >
              <FiBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Drawer */}
            {showNotifs && (
              <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      <FiCheck className="h-3.5 w-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-400">No notifications available</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleSelectNotif(n)}
                        className={`group flex cursor-pointer gap-3 rounded-2xl p-3 transition ${
                          n.read ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/60 hover:bg-indigo-50'
                        }`}
                      >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-sm border border-slate-100">
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-xs font-semibold truncate ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>
                              {n.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{n.message}</p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider">
                              {n.category}
                            </span>
                            {!n.read && (
                              <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifs(false)
                      navigate('/settings')
                    }}
                    className="text-xs font-medium text-slate-500 hover:text-slate-700"
                  >
                    Notification Settings →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
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
