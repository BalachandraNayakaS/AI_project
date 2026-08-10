import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FiDownload, FiFileText, FiPlusCircle } from 'react-icons/fi'
import reportService from '../../services/reportService'

export default function ReportsPage() {
  const [title, setTitle] = useState('Monthly sales summary')
  const [reportType, setReportType] = useState('financial')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reportsList, setReportsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchReports = async () => {
    setLoading(true)
    try {
      const response = await reportService.listReports()
      setReportsList(response.data || [])
    } catch (err) {
      toast.error('Unable to load existing reports.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

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
      setReportsList((prev) => [response.data, ...prev])
      toast.success('Report generated successfully!')
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = typeof detail === 'string' ? detail : 'Unable to generate report.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownload = (reportId) => {
    const downloadUrl = reportService.getDownloadUrl(reportId)
    window.open(downloadUrl, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Executive Reports</h1>
        <p className="mt-2 text-sm text-slate-500">Generate executive business reports and export live intelligence snapshots.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        
        {/* Report Generation Form */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <FiPlusCircle className="text-indigo-600" />
            Generate New Report
          </h2>
          <form onSubmit={handleGenerate} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Report Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q3 Executive Sales Performance"
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Report Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="financial">Financial Performance</option>
                <option value="operations">Operations & Support</option>
                <option value="customer">Customer Growth & Leads</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">End Date</label>
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
              className="w-full inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 shadow-md shadow-indigo-500/20"
            >
              {submitting ? 'Generating Report...' : 'Generate Executive Report'}
            </button>
          </form>
        </section>

        {/* Generated Reports List & Downloads */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <FiFileText className="text-indigo-600" />
            Generated Reports History
          </h2>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">Loading reports history...</div>
            ) : reportsList.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">
                No reports generated yet. Click "Generate Executive Report" to compile live database analytics.
              </div>
            ) : (
              reportsList.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[24px] bg-slate-50 p-5 border border-slate-100 transition hover:bg-slate-100/70">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-700 uppercase">
                        {item.report_type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Generated: {new Date(item.generated_date).toLocaleString()}
                    </p>
                    <p className="text-xs font-mono text-slate-400 truncate max-w-md">
                      File: {item.file_path}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(item.id)}
                    className="inline-flex items-center gap-2 shrink-0 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    <FiDownload className="h-4 w-4" />
                    Download Report
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
