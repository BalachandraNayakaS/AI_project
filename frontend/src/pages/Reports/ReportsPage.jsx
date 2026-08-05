import { useState } from 'react'
import { toast } from 'react-hot-toast'
import reportService from '../../services/reportService'

export default function ReportsPage() {
  const [title, setTitle] = useState('Monthly sales summary')
  const [reportType, setReportType] = useState('financial')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [report, setReport] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleGenerate = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        title,
        report_type: reportType,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      }
      const response = await reportService.generateReport(payload)
      setReport(response.data)
      toast.success('Report generated successfully')
    } catch (err) {
      toast.error('Unable to generate report.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-2 text-sm text-slate-500">Generate executive reports and export intelligence snapshots.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-slate-900">Generate report</h2>
          <form onSubmit={handleGenerate} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="financial">Financial</option>
                <option value="operations">Operations</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">End date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Generating...' : 'Generate report'}
            </button>
          </form>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-slate-900">Latest report</h2>
          {report ? (
            <div className="mt-6 space-y-4 rounded-[24px] bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">{report.title}</p>
              <p className="text-sm text-slate-500">Type: {report.report_type}</p>
              <p className="text-sm text-slate-500">Generated on: {new Date(report.generated_date).toLocaleDateString()}</p>
              <p className="text-sm text-slate-500">File path: {report.file_path}</p>
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] bg-slate-50 p-6 text-sm text-slate-500">Generate a report to review the latest analytics snapshot.</div>
          )}
        </section>
      </div>
    </div>
  )
}
