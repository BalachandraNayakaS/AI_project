import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">404 error</p>
      <h1 className="mt-6 text-4xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-sm text-slate-500">The page you were looking for doesn’t exist or may have moved.</p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Return home
      </Link>
    </div>
  )
}
