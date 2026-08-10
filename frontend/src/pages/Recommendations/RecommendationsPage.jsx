import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import recommendationService from '../../services/recommendationService'
import customerService from '../../services/customerService'

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([])
  const [customers, setCustomers] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [type, setType] = useState('sales')
  const [context, setContext] = useState('Increase upsells for active customers.')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [recsRes, custsRes] = await Promise.all([
        recommendationService.listRecommendations(),
        customerService.listCustomers(),
      ])
      setRecommendations(recsRes.data)
      setCustomers(custsRes.data)
      if (custsRes.data && custsRes.data.length > 0) {
        setSelectedCustomerId(custsRes.data[0].id)
      }
    } catch (err) {
      toast.error('Unable to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedCustomerId) {
      toast.error('Please select a valid customer.')
      return
    }

    setSubmitting(true)
    try {
      const response = await recommendationService.generateRecommendation(selectedCustomerId, type, context)
      setRecommendations((prev) => [response.data, ...prev])
      toast.success('Recommendation generated successfully!')
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = typeof detail === 'string' ? detail : 'Failed to generate recommendation.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const getCustomerLabel = (custId) => {
    const found = customers.find((c) => c.id === custId)
    if (found) {
      return `${found.name} ${found.company ? `(${found.company})` : ''}`
    }
    return `Customer #${custId}`
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Recommendations</h1>
        <p className="mt-2 text-sm text-slate-500">Review AI suggestions for customer outreach and growth campaigns.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-slate-900">Generate recommendation</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Select Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {customers.length === 0 ? (
                  <option value="">No customers available</option>
                ) : (
                  customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.name} {cust.company ? `(${cust.company})` : ''}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Recommendation type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="sales">Sales</option>
                <option value="renewal">Renewal</option>
                <option value="support">Support</option>
                <option value="upsell">Upsell</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Context</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !selectedCustomerId}
              className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Generating...' : 'Generate recommendation'}
            </button>
          </form>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-slate-900">Recent recommendations</h2>
          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">Loading recommendations...</div>
            ) : recommendations.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">No recommendations available.</div>
            ) : (
              recommendations.slice(0, 10).map((item) => (
                <div key={item.id} className="rounded-[24px] bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{getCustomerLabel(item.customer_id)}</p>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 uppercase">{item.type}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{item.recommendation}</p>
                  <p className="mt-3 text-xs text-slate-500">Created: {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
