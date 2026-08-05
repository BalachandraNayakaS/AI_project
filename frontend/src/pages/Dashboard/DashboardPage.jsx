import { useEffect, useMemo, useState } from 'react'
import { Doughnut, Line } from 'react-chartjs-2'
import { FiArrowUpRight, FiUsers, FiTrendingUp, FiDollarSign, FiShield } from 'react-icons/fi'
import analyticsService from '../../services/analyticsService'

const formatCurrency = (value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

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
      { label: 'Total Customers', value: dashboard.customers, icon: FiUsers, color: 'from-sky-500 to-indigo-500' },
      { label: "Today's Sales", value: formatCurrency(dashboard.today_sales), icon: FiDollarSign, color: 'from-emerald-500 to-teal-500' },
      { label: 'Lead Conversion', value: `${dashboard.lead_conversion.toFixed(0)}%`, icon: FiTrendingUp, color: 'from-violet-500 to-fuchsia-500' },
      { label: 'Open Tickets', value: dashboard.tickets, icon: FiShield, color: 'from-indigo-500 to-sky-500' },
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
          borderColor: '#5B5FF0',
          backgroundColor: 'rgba(91, 95, 240, 0.18)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
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
          backgroundColor: ['#5B5FF0', '#8A63FF', '#22C55E', '#F59E0B'],
          borderWidth: 0,
        },
      ],
    }
  }, [dashboard])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-72px)] place-items-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-slate-700 shadow-soft">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Dashboard</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Business intelligence overview</h1>
            <p className="mt-2 text-sm text-slate-500">Monitor customer support, sales performance, and AI insights in one place.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/30 transition hover:bg-indigo-700">
            <FiArrowUpRight className="h-4 w-4" />
            Review insights
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="grid gap-5 md:grid-cols-2">
          {kpis.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-soft">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid gap-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Customer sentiment</p>
                <p className="mt-2 text-sm text-slate-500">Sentiment distribution across recent reviews.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live</span>
            </div>
            <div className="mt-8">
              {sentimentData ? (
                <Doughnut data={sentimentData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} className="h-72" />
              ) : (
                <p className="text-sm text-slate-500">No sentiment data available.</p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold text-slate-900">Revenue trend</p>
            <div className="mt-6 h-80 rounded-[24px] bg-slate-50 p-5">
              {monthlySalesData ? (
                <Line data={monthlySalesData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { callback: (value) => `$${value}` } } } }} />
              ) : (
                <p className="text-sm text-slate-500">No revenue data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900">Lead score highlights</p>
          <p className="mt-2 text-sm text-slate-500">Top opportunities identified by AI.</p>
          <div className="mt-6 space-y-4">
            {dashboard.lead_scores.length > 0 ? (
              dashboard.lead_scores.map((item, index) => (
                <div key={index} className="rounded-[24px] bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Lead #{item.customer_id}</p>
                  <p className="mt-1 text-sm text-slate-500">Score: {item.score.toFixed(0)} · Probability: {(item.probability * 100).toFixed(0)}%</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No lead score data available.</p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900">Satisfaction score</p>
          <div className="mt-6 flex items-end gap-4">
            <div className="rounded-[24px] bg-slate-50 p-6 text-center flex-1">
              <p className="text-4xl font-semibold text-slate-900">{dashboard.satisfaction?.toFixed(0) ?? 0}%</p>
              <p className="mt-2 text-sm text-slate-500">Customer satisfaction</p>
            </div>
            <div className="rounded-[24px] bg-indigo-50 p-6 text-center text-indigo-700">
              <p className="text-4xl font-semibold">{dashboard.accuracy?.toFixed(0) ?? 0}%</p>
              <p className="mt-2 text-sm">Sentiment accuracy</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900">Action center</p>
          <div className="mt-6 grid gap-3">
            <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">Review customer feedback</button>
            <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">Assign support agents</button>
            <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">Approve sales forecasts</button>
          </div>
        </div>
      </div>
    </div>
  )
}
