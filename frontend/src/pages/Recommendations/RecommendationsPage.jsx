import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import recommendationService from '../../services/recommendationService'

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [type, setType] = useState('sales')
  const [context, setContext] = useState('Increase upsells for active customers.')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const response = await recommendationService.listRecommendations()
      setRecommendations(response.data)
    } catch (err) {
      toast.error('Unable to load recommendations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!customerId) {
      toast.error('Please provide a customer ID.')
      return
    }

    setSubmitting(true)
    try {
      const response = await recommendationService.generateRecommendation(customerId, type, context)
      setRecommendations((prev) => [response.data, ...prev])
      toast.success('Recommendation generated successfully')
    } catch (err) {
      toast.error('Failed to generate recommendation.')
    } finally {
      setSubmitting(false)
    }
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Customer ID</label>
              <input
                type="number"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
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
              disabled={submitting}
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
              recommendations.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-[24px] bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">Customer #{item.customer_id}</p>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">{item.type}</span>
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
