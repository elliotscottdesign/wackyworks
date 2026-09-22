// Floating admin toolbar. Renders at the bottom of any public page
// ONLY when a Supabase user is signed in. Gives the admin a one-tap
// "Edit on page" toggle plus a jump straight to the matching admin
// content route + a "Hide" pill for guest-facing screen recordings.
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, Pencil, PencilOff, LayoutGrid, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { useEditMode } from './EditModeProvider.jsx'

const HIDDEN_KEY = 'wackyworks.adminbar.hidden'

// Map a public path to the matching /admin/content/* editor.
function targetFor(pathname) {
  const p = pathname.replace(/\/$/, '') || '/'
  if (p === '/') return { href: '/admin/content/home', label: 'Home' }
  return { href: '/admin', label: 'Admin' }
}

export default function AdminBar() {
  const location = useLocation()
  const { editMode, canEdit, toggle } = useEditMode()
  const [email, setEmail] = useState(null)
  const [ready, setReady] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setEmail(data?.session?.user?.email ?? null)
        setReady(true)
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setEmail(s?.user?.email ?? null)
    })
    try {
      if (localStorage.getItem(HIDDEN_KEY) === '1') setHidden(true)
    } catch {}
    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const hide = () => {
    try {
      localStorage.setItem(HIDDEN_KEY, '1')
    } catch {}
    setHidden(true)
  }
  const show = () => {
    try {
      localStorage.removeItem(HIDDEN_KEY)
    } catch {}
    setHidden(false)
  }
  const signOut = async () => {
    await supabase.auth.signOut()
    setEmail(null)
  }

  if (!ready || !email || !canEdit) return null

  if (hidden) {
    return (
      <button
        onClick={show}
        title="Show admin bar"
        style={{
          position: 'fixed',
          bottom: 12,
          right: 12,
          zIndex: 60,
          padding: '6px 12px',
          borderRadius: 999,
          border: '1px solid var(--line)',
          background: 'rgba(14, 15, 12, 0.9)',
          color: 'var(--cream-dim)',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 700,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}
      >
        Admin ↑
      </button>
    )
  }

  const t = targetFor(location.pathname)

  return (
    <div
      role="region"
      aria-label="Admin tools"
      style={{
        position: 'fixed',
        insetInline: 0,
        bottom: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        flexWrap: 'wrap',
        padding: '10px 16px',
        borderTop: '1px solid rgba(200, 241, 58, 0.25)',
        background: 'rgba(14, 15, 12, 0.94)',
        color: 'var(--cream)',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={badge}>Admin</span>
        <span style={{ fontSize: 12, color: 'var(--cream-dim)' }}>
          Logged in as <span style={{ color: 'var(--cream)' }}>{email}</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={toggle}
          title="Toggle in-place editing — click any text or image on the page to edit it"
          style={{
            ...pill,
            background: editMode ? 'var(--lime)' : 'transparent',
            color: editMode ? '#0e0f0c' : 'var(--cream)',
            border: editMode ? 'none' : '1px solid var(--line)',
          }}
        >
          {editMode ? <PencilOff size={12} /> : <Pencil size={12} />}
          {editMode ? 'Editing — click to stop' : 'Edit on page'}
        </button>
        <Link to={t.href} style={{ ...pill, background: 'var(--lime)', color: '#0e0f0c', textDecoration: 'none' }}>
          <LayoutGrid size={12} /> Open editor → {t.label}
        </Link>
        <Link to="/admin" style={{ ...pill, textDecoration: 'none' }}>
          Dashboard
        </Link>
        <button onClick={hide} style={pill} title="Hide the bar on this device">
          <EyeOff size={12} /> Hide
        </button>
        <button onClick={signOut} style={pill}>
          <LogOut size={12} /> Sign out
        </button>
      </div>
    </div>
  )
}

const badge = {
  padding: '3px 10px',
  borderRadius: 999,
  background: 'var(--lime)',
  color: '#0e0f0c',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
}
const pill = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 999,
  border: '1px solid var(--line)',
  background: 'transparent',
  color: 'var(--cream-dim)',
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
}
