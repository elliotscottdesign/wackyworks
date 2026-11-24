import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, ExternalLink, Eye, Presentation as PresentIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { PRESENTATIONS } from '../presentations.js'

const PAGES = [
  { slug: 'header', label: 'Header + Nav' },
  { slug: 'home', label: 'Homepage — Hero / Craft / CTA' },
  { slug: 'obstacles', label: 'Obstacles (14)' },
  { slug: 'finishes', label: 'Finishes (3)' },
  { slug: 'services', label: 'Services (3)' },
  { slug: 'packages', label: 'Packages (3)' },
  { slug: 'footer', label: 'Footer' },
]

const PRESENTATION_LIST = Object.entries(PRESENTATIONS).map(([slug, p]) => ({
  slug,
  client: p.client,
}))

export default function AdminLayout() {
  const navigate = useNavigate()

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
      <aside style={{ background: 'var(--ink-2)', borderRight: '1px solid var(--line)', padding: '22px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div className="display" style={{ fontSize: 20, color: 'var(--lime)', marginBottom: 4 }}>
          WACKY <span style={{ color: 'var(--cream)' }}>WORKS</span>
        </div>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: 24 }}>
          Admin
        </div>

        <NavLink to="/admin" end style={navStyle}>
          Dashboard
        </NavLink>
        <div style={{ margin: '18px 0 6px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>
          Content
        </div>
        {PAGES.map((p) => (
          <NavLink key={p.slug} to={`/admin/content/${p.slug}`} style={navStyle}>
            {p.label}
          </NavLink>
        ))}

        <div style={{ margin: '18px 0 6px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>
          Client presentations
        </div>
        {PRESENTATION_LIST.map((p) => (
          <div key={p.slug} style={{ marginBottom: 4 }}>
            <NavLink to={`/admin/content/present.${p.slug}`} style={navStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PresentIcon size={13} /> {p.client}
              </span>
            </NavLink>
            <a
              href={`/present/${p.slug}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                padding: '0 12px 8px 32px',
                fontSize: 10.5,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--cream-dim)',
                textDecoration: 'none',
              }}
            >
              /present/{p.slug} ↗
            </a>
          </div>
        ))}

        <div style={{ margin: '18px 0 6px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>
          Media
        </div>
        <NavLink to="/admin/media" style={navStyle}>
          Media library
        </NavLink>

        <div style={{ margin: '28px 0 6px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>
          Live site
        </div>
        <a href="/?edit=1" style={{ ...navStyle({ isActive: false }), display: 'flex', alignItems: 'center', gap: 8 }}>
          <Eye size={14} /> Open with inline editor
        </a>
        <a href="/" target="_blank" rel="noreferrer" style={{ ...navStyle({ isActive: false }), display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExternalLink size={14} /> Open public site
        </a>

        <button onClick={signOut} style={{ ...navStyle({ isActive: false }), display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer', width: '100%', textAlign: 'left', marginTop: 30 }}>
          <LogOut size={14} /> Sign out
        </button>
      </aside>
      <main style={{ padding: '32px 40px', background: 'var(--ink)' }}>
        <Outlet />
      </main>
    </div>
  )
}

function navStyle({ isActive } = {}) {
  return {
    display: 'block',
    padding: '9px 12px',
    borderRadius: 8,
    fontSize: 13.5,
    color: isActive ? 'var(--lime)' : 'var(--cream)',
    background: isActive ? 'rgba(200, 241, 58, 0.08)' : 'transparent',
    textDecoration: 'none',
    marginBottom: 2,
  }
}

export { PAGES }
