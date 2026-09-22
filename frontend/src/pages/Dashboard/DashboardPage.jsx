import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Doughnut, Line } from 'react-chartjs-2'
import {
  FiArrowUpRight,
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiShield,
  FiMessageSquare,
  FiUserPlus,
  FiCheckCircle,
  FiCpu,
  FiX,
  FiCheck,
} from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import analyticsService from '../../services/analyticsService'

const formatCurrency = (value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const AVAILABLE_AGENTS = [
  { id: '1', name: 'Sarah Jenkins', role: 'Senior Support Lead', status: 'Available', avatar: 'SJ' },
  { id: '2', name: 'Alex Rivera', role: 'Technical Specialist', status: 'Available', avatar: 'AR' },
  { id: '3', name: 'David Chen', role: 'Customer Success', status: 'Busy', avatar: 'DC' },
  { id: '4', name: 'Marcus Vance', role: 'Sales & Support Engineer', status: 'Available', avatar: 'MV' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  // Action Center States
  const [showAgentModal, setShowAgentModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState('Sarah Jenkins')
  const [agentAssignCount, setAgentAssignCount] = useState(0)
  const [forecastApproved, setForecastApproved] = useState(false)

  useEffect(() => {
    analyticsService
      .getDashboard()
      .then((response) => setDashboard(response.data))
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false))
  }, [])

  const kpis = useMemo(() => {
    if (!dashboard) return []
    return [
      { label: 'Total Customers', value: dashboard.customers ?? 0, icon: FiUsers, color: 'from-indigo-600 via-indigo-500 to-cyan-500', glow: 'shadow-indigo-500/20' },
      { label: "Today's Sales", value: formatCurrency(dashboard.today_sales ?? 0), icon: FiDollarSign, color: 'from-emerald-600 via-teal-500 to-cyan-500', glow: 'shadow-emerald-500/20' },
      { label: 'Lead Conversion', value: `${(dashboard.lead_conversion ?? 0).toFixed(0)}%`, icon: FiTrendingUp, color: 'from-violet-600 via-purple-500 to-indigo-600', glow: 'shadow-purple-500/20' },
      { label: 'Open Tickets', value: dashboard.tickets ?? 0, icon: FiShield, color: 'from-amber-500 via-orange-500 to-rose-500', glow: 'shadow-amber-500/20' },
    ]
  }, [dashboard])

  const monthlySalesData = useMemo(() => {
    if (!dashboard) return null
    return {
      labels: dashboard.monthly_sales.map((_, index) => `Month ${index + 1}`),
      datasets: [
        {
          label: 'Revenue',
          data: dashboard.monthly_sales,
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#6366F1',
          pointHoverRadius: 6,
        },
      ],
    }
  }, [dashboard])

  const sentimentData = useMemo(() => {
    if (!dashboard) return null
    return {
      labels: dashboard.sentiment.map((item) => item.label),
      datasets: [
        {
          data: dashboard.sentiment.map((item) => item.value),
          backgroundColor: ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B'],
          borderWidth: 0,
        },
      ],
    }
  }, [dashboard])

  // Action Handlers
  const handleReviewFeedback = () => {
    toast.success('Navigating to Customer Feedback & Accounts...')
    navigate('/customers')
  }

  const handleConfirmAgentAssignment = () => {
    setShowAgentModal(false)
    setAgentAssignCount((prev) => prev + 1)
    toast.success(`Assigned ${selectedAgent} to pending support tickets!`)
  }

  const handleApproveForecast = () => {
    if (forecastApproved) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl p-4 flex items-center gap-3 text-slate-800 dark:text-slate-100 text-sm font-medium`}>
          <FiCheckCircle className="text-emerald-500 h-5 w-5 shrink-0" />
          Sales forecasts are already approved and locked.
        </div>
      ))
      return
    }

    const toastId = toast.loading('Approving Q3 sales forecast...')
    setTimeout(() => {
      setForecastApproved(true)
      toast.success('Sales forecasts approved and locked!', { id: toastId })
    }, 600)
  }

  const handleRunAiAudit = () => {
    toast.success('Launching AI Copilot Audit...')
    navigate('/chatbot', {
      state: { initialPrompt: 'Run an executive business audit based on today\'s sales and customer tickets.' },
    })
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-72px)] place-items-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-slate-700 shadow-soft">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft transition-colors">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Business intelligence overview</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor customer support, sales performance, and AI insights in one place.</p>
          </div>
          <button
            onClick={() => navigate('/analytics')}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 focus:outline-none"
          >
            <FiArrowUpRight className="h-4 w-4" />
            Review insights
          </button>
        </div>
      </div>

      {/* KPI Cards & Charts */}
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="grid gap-5 md:grid-cols-2">
          {kpis.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-lg dark:bg-slate-900/90 dark:border-slate-800">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md ${item.glow}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{item.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid gap-5">
          <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Customer sentiment</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sentiment distribution across recent reviews.</p>
              </div>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">Live</span>
            </div>
            <div className="mt-8">
              {sentimentData ? (
                <Doughnut data={sentimentData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} className="h-72" />
              ) : (
                <p className="text-sm text-slate-500">No sentiment data available.</p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Revenue trend</p>
            <div className="mt-6 h-80 rounded-[24px] bg-slate-50 dark:bg-slate-800/60 p-5">
              {monthlySalesData ? (
                <Line data={monthlySalesData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { callback: (value) => `$${value}` } } } }} />
              ) : (
                <p className="text-sm text-slate-500">No revenue data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Highlights & Action Center */}
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Lead score highlights</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Top opportunities identified by AI.</p>
          <div className="mt-6 space-y-3">
            {dashboard?.lead_scores && dashboard.lead_scores.length > 0 ? (
              dashboard.lead_scores.map((item, index) => (
                <div key={index} className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white">Lead #{item.customer_id}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Score: {item.score?.toFixed(0) ?? 0} · Probability: {((item.probability ?? 0) * 100).toFixed(0)}%</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No lead score data available.</p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Satisfaction score</p>
          <div className="mt-6 flex items-end gap-4">
            <div className="rounded-[24px] bg-slate-50 dark:bg-slate-800/60 p-6 text-center flex-1 border border-slate-100 dark:border-slate-800">
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{dashboard.satisfaction?.toFixed(0) ?? 0}%</p>
              <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">Customer satisfaction</p>
            </div>
            <div className="rounded-[24px] bg-indigo-50 dark:bg-indigo-950/60 p-6 text-center text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
              <p className="text-4xl font-extrabold">{dashboard.accuracy?.toFixed(0) ?? 0}%</p>
              <p className="mt-2 text-xs font-semibold">Sentiment accuracy</p>
            </div>
          </div>
        </div>

        {/* Action Center - Interactive Module */}
        <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Action center</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Automated workflow triggers & quick actions</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            </div>

            <div className="mt-6 grid gap-3">
              {/* Action 1: Review Feedback */}
              <button
                type="button"
                onClick={handleReviewFeedback}
                className="group flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 px-4 py-3 text-left transition duration-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 transition group-hover:scale-105">
                    <FiMessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Review customer feedback</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">View recent reviews & customer sentiment</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Action 2: Assign Support Agents */}
              <button
                type="button"
                onClick={() => setShowAgentModal(true)}
                className="group flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 px-4 py-3 text-left transition duration-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 transition group-hover:scale-105">
                    <FiUserPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Assign support agents</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {agentAssignCount > 0 ? `${agentAssignCount} assignment(s) completed` : 'Delegate open tickets to staff'}
                    </p>
                  </div>
                </div>
                {agentAssignCount > 0 ? (
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Done ✓
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                )}
              </button>

              {/* Action 3: Approve Sales Forecasts */}
              <button
                type="button"
                onClick={handleApproveForecast}
                className="group flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 px-4 py-3 text-left transition duration-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 transition group-hover:scale-105">
                    <FiCheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Approve sales forecasts</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {forecastApproved ? 'Q3 Forecast Approved & Locked' : 'Validate team revenue projections'}
                    </p>
                  </div>
                </div>
                {forecastApproved ? (
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Approved ✓
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                )}
              </button>

              {/* Action 4: Trigger AI Copilot Audit */}
              <button
                type="button"
                onClick={handleRunAiAudit}
                className="group flex items-center justify-between rounded-2xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/70 dark:bg-indigo-950/40 px-4 py-3 text-left transition duration-200 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-600 text-white transition group-hover:scale-105 shadow-sm">
                    <FiCpu className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Run AI Business Audit</p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400">Generate executive summary with AI</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Agent Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <FiUserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Assign Support Agent</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Select an agent for {dashboard?.tickets ?? 0} open tickets</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAgentModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1">
              {AVAILABLE_AGENTS.map((agent) => (
                <label
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.name)}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                    selectedAgent === agent.name
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 dark:border-indigo-500'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                      {agent.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{agent.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {agent.status}
                    </span>
                    {selectedAgent === agent.name && (
                      <div className="grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white">
                        <FiCheck className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setShowAgentModal(false)}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAgentAssignment}
                className="rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

