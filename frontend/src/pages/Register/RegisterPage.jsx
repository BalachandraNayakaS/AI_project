import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FiBriefcase, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi'
import authService from '../../services/authService'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', companyName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords must match')
      return
    }

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setSubmitting(true)
    try {
      await authService.register({
        username: form.email,
        email: form.email,
        password: form.password,
        company: form.companyName || undefined,
      })
      toast.success('Account created successfully!')
      navigate('/login', { replace: true })
    } catch (error) {
      const detail = error.response?.data?.detail
      let errorMsg = 'Registration failed, please try again'
      if (typeof detail === 'string') {
        errorMsg = detail
      } else if (Array.isArray(detail) && detail.length > 0) {
        errorMsg = detail[0]?.msg || detail[0]?.message || errorMsg
      }
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Create an Account</h2>
        <p className="mt-2 text-sm text-slate-400">Join AI Business Copilot for sales intelligence and support automation.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Full Name</label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <FiUser className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Alex Morgan"
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-800/80 py-3 pl-12 pr-4 text-sm text-white placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Company Name</label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <FiBriefcase className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="e.g. Acme Corp"
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-800/80 py-3 pl-12 pr-4 text-sm text-white placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Email Address</label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <FiMail className="h-5 w-5" />
            </div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="alex@company.com"
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-800/80 py-3 pl-12 pr-4 text-sm text-white placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <FiLock className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-800/80 py-3 pl-12 pr-12 text-sm text-white placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20"
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Confirm Password</label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <FiLock className="h-5 w-5" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-800/80 py-3 pl-12 pr-12 text-sm text-white placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-200 focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition duration-200 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Registering...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
          Login
        </Link>
      </p>
    </div>
  )
}
