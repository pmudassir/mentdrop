export default function AdminSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-headline-lg text-on-surface">Settings</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Store configuration and preferences.
        </p>
      </div>

      <div className="rounded-2xl bg-surface-container-lowest shadow-md p-8 flex flex-col items-center justify-center gap-3 min-h-48">
        <p className="text-title-lg text-on-surface">Coming Soon</p>
        <p className="text-body-md text-on-surface-variant text-center max-w-sm">
          Store settings, notification preferences, and integrations will be available here.
        </p>
      </div>
    </div>
  )
}
