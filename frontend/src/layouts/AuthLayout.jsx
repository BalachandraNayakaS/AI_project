export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-soft">
        {children}
      </div>
    </div>
  )
}
