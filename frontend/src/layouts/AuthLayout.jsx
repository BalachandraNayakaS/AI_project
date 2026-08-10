import { FiCpu } from 'react-icons/fi'

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-4 py-12">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="absolute left-1/3 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header Badge */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <FiCpu className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AI Business Copilot</span>
        </div>

        {/* Glassmorphic Container Card with High Contrast */}
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl shadow-black/60">
          {children}
        </div>
      </div>
    </div>
  )
}
