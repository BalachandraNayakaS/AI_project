import { useEffect, useMemo, useState } from 'react'
import { Doughnut, Line } from 'react-chartjs-2'
import analyticsService from '../../services/analyticsService'

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await analyticsService.getDashboard()
        setDashboard(response.data)
      } catch (err) {
        setError('Unable to load analytics data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const salesChartData = useMemo(() => {
    if (!dashboard) return null
    return {
      labels: dashboard.monthly_sales.map((_, index) => `M${index + 1}`),
      datasets: [
        {
          label: 'Sales',
          data: dashboard.monthly_sales,
          borderColor: '#5B5FF0',
          backgroundColor: 'rgba(91, 95, 240, 0.2)',
          fill: true,
          tension: 0.35,
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
        },
      ],
    }
  }, [dashboard])

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
        <p className="mt-2 text-sm text-slate-500">Explore dashboards, trends, and AI-driven metrics.</p>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Performance overview</p>
            <p className="mt-1 text-sm text-slate-500">Review sales and sentiment trends across recent periods.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          <div className="rounded-[24px] bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Customers</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{dashboard?.customers ?? '-'}</p>
            <p className="mt-2 text-sm text-slate-500">Active accounts tracked</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Today’s revenue</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">${dashboard?.today_sales?.toFixed(0) ?? '0'}</p>
            <p className="mt-2 text-sm text-slate-500">Revenue captured today</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Satisfaction</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{dashboard ? `${dashboard.satisfaction.toFixed(0)}%` : '-'}</p>
            <p className="mt-2 text-sm text-slate-500">Customer sentiment score</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          <div className="rounded-[24px] bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Monthly sales</p>
            <div className="mt-6 h-72">
              {salesChartData ? (
                <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }} />
              ) : (
                <p className="text-sm text-slate-500">Loading chart...</p>
              )}
            </div>
          </div>

          <div className="rounded-[24px] bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Sentiment distribution</p>
            <div className="mt-6 h-72">
              {sentimentData ? (
                <Doughnut data={sentimentData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              ) : (
                <p className="text-sm text-slate-500">Loading sentiment...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {error && <div className="rounded-[24px] bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
    </div>
  )
}
