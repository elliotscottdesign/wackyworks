import { Link } from 'react-router-dom'
import { PAGES } from './AdminLayout.jsx'
import { ArrowRight } from 'lucide-react'

export default function AdminHome() {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: 8 }}>
        Wacky Works Admin
      </div>
      <h1 className="display" style={{ fontSize: 40, color: 'var(--cream)', marginBottom: 6 }}>
        Dashboard
      </h1>
      <p style={{ color: 'var(--cream-dim)', maxWidth: 640, marginBottom: 30 }}>
        Pick a section below to edit. Or open the live site with the inline editor for click-to-edit on the page itself.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {PAGES.map((p) => (
          <Link
            key={p.slug}
            to={`/admin/content/${p.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px',
              background: 'var(--ink-2)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              textDecoration: 'none',
              color: 'var(--cream)',
            }}
          >
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>
                Content
              </div>
              <div className="display" style={{ fontSize: 16, marginTop: 4 }}>
                {p.label}
              </div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--lime)' }} />
          </Link>
        ))}
      </div>
    </div>
  )
}
