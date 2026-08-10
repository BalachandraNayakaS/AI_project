import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate('/', { replace: true })
    } catch (err) {
      const detail = err.response?.data?.detail
      const errorMsg = typeof detail === 'string' ? detail : 'Invalid username or password'
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Welcome Back</h2>
        <p className="mt-2 text-sm text-slate-400">Sign in to your AI Business Copilot platform to manage customer insights & analytics.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Email or Username</label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <FiMail className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. user1@example.com"
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-800/80 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <FiLock className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-800/80 py-3.5 pl-12 pr-12 text-sm text-white placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-200 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500" />
            Remember me
          </label>
          <button type="button" className="font-medium text-indigo-400 hover:text-indigo-300">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition duration-200 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Signing in...' : 'Sign In to Dashboard'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-400">
        Don’t have an account?{' '}
        <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </div>
  )
}
