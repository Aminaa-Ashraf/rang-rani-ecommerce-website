import { useState, type FormEvent } from 'react'

interface AdminLoginPageProps {
  error: string | null
  onLogin: (password: string) => Promise<void>
}

export function AdminLoginPage({ error, onLogin }: AdminLoginPageProps) {
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setSaving(true)
    try {
      await onLogin(password)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page page-shell admin-login">
      <form className="lift-card admin-card" onSubmit={(event) => void handleSubmit(event)}>
        <p className="eyebrow">Studio</p>
        <h2 className="has-rule">Admin sign in</h2>
        <p className="lede">Only the studio can add or change jewelry. The shop stays public.</p>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? 'Checking...' : 'Enter studio'}
        </button>
      </form>
    </main>
  )
}
