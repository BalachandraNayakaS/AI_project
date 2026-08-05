import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import customerService from '../../services/customerService'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCustomers = async (query = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await customerService.listCustomers({ search: query })
      setCustomers(response.data)
    } catch (err) {
      setError('Unable to load customers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    fetchCustomers(search)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
        <p className="mt-2 text-sm text-slate-500">Search, filter, and manage customer records from one place.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Customer database</p>
              <p className="mt-1 text-sm text-slate-500">Browse customers and view contact details.</p>
            </div>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or company"
                className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <FiSearch className="h-4 w-4" />
                Search
              </button>
            </form>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-4 font-medium text-slate-900">Name</th>
                  <th className="px-4 py-4 font-medium text-slate-900">Company</th>
                  <th className="px-4 py-4 font-medium text-slate-900">Email</th>
                  <th className="px-4 py-4 font-medium text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-sm text-slate-500">
                      Loading customers...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-sm text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-sm text-slate-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">{customer.name}</td>
                      <td className="px-4 py-4">{customer.company || '—'}</td>
                      <td className="px-4 py-4">{customer.email}</td>
                      <td className="px-4 py-4">{customer.status || 'Active'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-900">Customer insights</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Use filters and search to quickly locate accounts, verify contact details, and route customer activity to sales or support.
          </p>
        </aside>
      </div>
    </div>
  )
}
