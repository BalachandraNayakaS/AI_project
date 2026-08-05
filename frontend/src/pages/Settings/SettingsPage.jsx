import useAuth from '../../hooks/useAuth'
import useTheme from '../../hooks/useTheme'

export default function SettingsPage() {
  const { user } = useAuth()
  const { darkMode, toggleTheme } = useTheme()

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">Adjust account preferences, security, and workspace options.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-slate-900">Profile</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Username</p>
              <p className="mt-1 text-sm text-slate-500">{user?.username || '–'}</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Email</p>
              <p className="mt-1 text-sm text-slate-500">{user?.email || '–'}</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Company</p>
              <p className="mt-1 text-sm text-slate-500">{user?.company || 'Not provided'}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-slate-900">Display preferences</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Theme mode</p>
                  <p className="mt-1 text-sm text-slate-500">Toggle between light and dark interfaces.</p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  {darkMode ? 'Switch to light' : 'Switch to dark'}
                </button>
              </div>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Workspace preferences</p>
              <p className="mt-1 text-sm text-slate-500">Manage visibility, notifications, and data refresh settings.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
