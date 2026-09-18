import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginForm({ onSignedIn }) {
  const [email, setEmail] = useState('admin@wackyworks.co.uk')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) {
      setError(error.message || 'Sign-in failed')
      return
    }
    onSignedIn?.(data.session)
  }

  return (
    <div style={wrap}>
      <form onSubmit={submit} style={card}>
        <div className="display" style={{ fontSize: 22, color: 'var(--lime)', textAlign: 'center' }}>
          WACKY <span style={{ color: 'var(--cream)' }}>WORKS</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: 10 }}>
          Admin sign in
        </div>
        <label style={label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
          autoComplete="email"
        />
        <label style={label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
          autoComplete="current-password"
          autoFocus
        />
        {error && <div style={{ color: '#e0876f', fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={busy} style={btn}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

const wrap = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  background: 'var(--ink)',
}
const card = {
  width: 'min(360px, 100%)',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 26,
  background: 'var(--ink-2)',
  border: '1px solid var(--line)',
  borderRadius: 14,
}
const label = { fontSize: 12, color: 'var(--cream-dim)', marginTop: 6 }
const input = {
  padding: '11px 12px',
  background: 'var(--ink-3)',
  color: 'var(--cream)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
}
const btn = {
  marginTop: 10,
  padding: '12px 14px',
  background: 'var(--lime)',
  color: '#0e0f0c',
  border: 'none',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 14,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  cursor: 'pointer',
}
