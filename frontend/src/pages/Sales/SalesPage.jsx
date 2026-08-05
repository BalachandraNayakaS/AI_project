import { useEffect, useMemo, useState } from 'react'
import { FiDollarSign, FiTrendingUp, FiClock } from 'react-icons/fi'
import salesService from '../../services/salesService'

const formatCurrency = (amount) =>
  amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export default function SalesPage() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await salesService.listSales()
        setSales(response.data)
      } catch (err) {
        setError('Unable to load sales data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchSales()
  }, [])

  const totalRevenue = useMemo(
    () => sales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0),
    [sales],
  )

  const averageSale = useMemo(
    () => (sales.length ? totalRevenue / sales.length : 0),
    [sales, totalRevenue],
  )

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Sales</h1>
        <p className="mt-2 text-sm text-slate-500">Track revenue, performance, and recent deals across the business.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900">Total revenue</p>
          <p className="mt-5 text-3xl font-semibold text-slate-900">{formatCurrency(totalRevenue)}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <FiDollarSign className="h-4 w-4" />
            Revenue from latest records
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900">Average deal</p>
          <p className="mt-5 text-3xl font-semibold text-slate-900">{formatCurrency(averageSale)}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <FiTrendingUp className="h-4 w-4" />
            Calculated across recent sales
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900">Recent activity</p>
          <p className="mt-5 text-3xl font-semibold text-slate-900">{sales.length}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <FiClock className="h-4 w-4" />
            Latest deals processed
          </div>
        </div>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Recent sales</p>
            <p className="mt-1 text-sm text-slate-500">View the latest sales records with customer context.</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-4 font-medium text-slate-900">Customer</th>
                <th className="px-4 py-4 font-medium text-slate-900">Product</th>
                <th className="px-4 py-4 font-medium text-slate-900">Amount</th>
                <th className="px-4 py-4 font-medium text-slate-900">Quantity</th>
                <th className="px-4 py-4 font-medium text-slate-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-sm text-slate-500">
                    Loading sales...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-sm text-slate-500">
                    No sales records found.
                  </td>
                </tr>
              ) : (
                sales.slice(0, 10).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">{sale.customer_name || `Customer #${sale.customer_id}`}</td>
                    <td className="px-4 py-4">{sale.product}</td>
                    <td className="px-4 py-4">{formatCurrency(Number(sale.amount))}</td>
                    <td className="px-4 py-4">{sale.quantity}</td>
                    <td className="px-4 py-4">{new Date(sale.sales_date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
