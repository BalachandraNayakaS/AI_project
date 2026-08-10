import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBell, FiCpu, FiMoon, FiSearch, FiSun, FiUser, FiX } from 'react-icons/fi'
import useTheme from '../../hooks/useTheme'
import useAuth from '../../hooks/useAuth'
import customerService from '../../services/customerService'

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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false)
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

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Search Bar Container */}
        <div ref={searchRef} className="relative w-full max-w-md">
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3.5 text-slate-400">
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
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setMatchingCustomers([])
                }}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
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
