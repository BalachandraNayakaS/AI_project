import { useEffect, useMemo, useState } from 'react'
import analyticsService from '../../services/analyticsService'

export default function LeadsPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLeadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await analyticsService.getDashboard()
        setDashboard(response.data)
      } catch (err) {
        setError('Unable to load lead pipeline data.')
      } finally {
        setLoading(false)
      }
    }
    fetchLeadData()
  }, [])

  const topLeads = useMemo(() => dashboard?.lead_scores ?? [], [dashboard])

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Leads</h1>
        <p className="mt-2 text-sm text-slate-500">Manage and nurture qualified opportunities with AI insights.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900">Lead conversion</p>
          <p className="mt-5 text-4xl font-semibold text-slate-900">{dashboard ? `${dashboard.lead_conversion.toFixed(0)}%` : '--'}</p>
          <p className="mt-3 text-sm text-slate-500">Percent of qualified leads converted this cycle.</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900">Active lead scores</p>
          <p className="mt-5 text-4xl font-semibold text-slate-900">{dashboard ? dashboard.lead_scores.length : '--'}</p>
          <p className="mt-3 text-sm text-slate-500">Top predicted opportunities in the funnel.</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900">Customer satisfaction</p>
          <p className="mt-5 text-4xl font-semibold text-slate-900">{dashboard ? `${dashboard.satisfaction.toFixed(0)}%` : '--'}</p>
          <p className="mt-3 text-sm text-slate-500">Sentiment score for recent support reviews.</p>
        </div>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Lead pipeline</p>
            <p className="mt-1 text-sm text-slate-500">Review the highest-priority opportunities and recommended actions.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">Loading lead data...</div>
          ) : error ? (
            <div className="rounded-3xl bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
          ) : topLeads.length === 0 ? (
            <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">No lead score metrics available.</div>
          ) : (
            topLeads.map((lead, index) => (
              <div key={index} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">Lead #{lead.customer_id}</p>
                    <p className="mt-1 text-sm text-slate-500">Probability: {(lead.probability * 100).toFixed(0)}% · Score: {lead.score.toFixed(0)}</p>
                  </div>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">High priority</span>
                </div>
                <p className="mt-4 text-sm text-slate-600">Recommended next step: reach out to convert the opportunity while sentiment remains positive.</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
