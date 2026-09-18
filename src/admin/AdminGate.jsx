import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import LoginForm from './LoginForm.jsx'

export default function AdminGate({ children }) {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data?.session ?? null)
        setReady(true)
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  if (!ready) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--cream-dim)' }}>
        Loading…
      </div>
    )
  }
  if (!session) return <LoginForm onSignedIn={setSession} />
  return children
}
