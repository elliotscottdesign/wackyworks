import { useEffect, useState } from 'react'
import { X, ArrowUpRight, Mail } from 'lucide-react'
import { PROJECTS, CONTACT } from './catalog'

export default function App() {
  const [openProject, setOpenProject] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpenProject(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <Header />
      <Hero />
      <Catalog onOpen={setOpenProject} />
      <Footer />
      {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
    </>
  )
}

// ─────────────────────────────────────────────────────────────

function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(14, 15, 12, 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        className="wrap"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
        }}
      >
        <div className="display" style={{ fontSize: 22, color: 'var(--lime)' }}>
          WACKY <span style={{ color: 'var(--cream)' }}>WORKS</span>
        </div>
        <a
          href={`mailto:${CONTACT.email}`}
          style={{
            fontSize: 13,
            color: 'var(--cream-dim)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Mail size={14} />
          <span style={{ display: 'inline-block' }}>{CONTACT.displayEmail}</span>
        </a>
      </div>
    </header>
  )
}

// ─────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="fade-up"
      style={{
        padding: '90px 0 60px',
        borderBottom: '1px solid var(--line)',
        background:
          'radial-gradient(120% 90% at 15% 0%, rgba(200, 241, 58, 0.08) 0%, transparent 55%)',
      }}
    >
      <div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 22 }}>
          Adventure Golf · Design · Build · Theme
        </div>
        <h1
          className="display"
          style={{
            fontSize: 'clamp(48px, 9vw, 128px)',
            color: 'var(--cream)',
            marginBottom: 30,
            maxWidth: 1100,
          }}
        >
          We build worlds
          <br />
          <span style={{ color: 'var(--lime)' }}>you play through.</span>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: 'var(--cream-dim)',
            maxWidth: 640,
            marginBottom: 34,
          }}
        >
          Wacky Works designs and builds immersive adventure golf courses — from the
          first sketch to the last painted mural. Themed holes, hand-crafted
          fittings, delivered to your venue and installed with our team.
        </p>
        <a
          href={`mailto:${CONTACT.email}?subject=Adventure%20Golf%20Enquiry`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--lime)',
            color: '#0e0f0c',
            padding: '14px 22px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Start a project <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────

function Catalog({ onOpen }) {
  return (
    <section style={{ padding: '80px 0 40px' }}>
      <div className="wrap">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 30, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              Selected Work
            </div>
            <h2 className="display" style={{ fontSize: 40, color: 'var(--cream)' }}>
              The Catalog
            </h2>
          </div>
          <div style={{ color: 'var(--cream-dim)', fontSize: 13 }}>
            {PROJECTS.length} project{PROJECTS.length === 1 ? '' : 's'} · more coming
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 22,
          }}
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.slug} project={p} onClick={() => onOpen(p)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        textAlign: 'left',
        padding: 0,
        background: 'var(--ink-2)',
        color: 'inherit',
        cursor: 'pointer',
      }}
    >
      <div style={{ aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--ink-3)' }}>
        <img
          src={project.cover}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--lime)' }}>
            {project.status}
          </div>
          <div style={{ fontSize: 12, color: 'var(--cream-dim)' }}>{project.year}</div>
        </div>
        <h3 className="display" style={{ fontSize: 22, color: 'var(--cream)', marginBottom: 6 }}>
          {project.title}
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--cream-dim)' }}>{project.tag}</p>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 5, 3, 0.85)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '24px 16px',
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up"
        style={{
          background: 'var(--ink-2)',
          border: '1px solid var(--line)',
          borderRadius: 18,
          width: '100%',
          maxWidth: 960,
          overflow: 'hidden',
          margin: '24px 0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div className="eyebrow">{project.status} · {project.year}</div>
            <h2 className="display" style={{ fontSize: 28, color: 'var(--cream)', marginTop: 6 }}>
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'transparent', color: 'var(--cream)', padding: 4 }}
          >
            <X size={22} />
          </button>
        </div>

        <div style={{ padding: '22px' }}>
          <p style={{ color: 'var(--cream-dim)', fontSize: 15.5, marginBottom: 22, maxWidth: 720 }}>
            {project.summary}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 14,
            }}
          >
            {project.gallery.map((img) => (
              <img
                key={img}
                src={img}
                alt=""
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  objectFit: 'cover',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', padding: '40px 0 32px', marginTop: 40 }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div className="display" style={{ fontSize: 22, color: 'var(--lime)' }}>
          WACKY <span style={{ color: 'var(--cream)' }}>WORKS</span>
        </div>
        <div style={{ display: 'flex', gap: 30, fontSize: 13, color: 'var(--cream-dim)', flexWrap: 'wrap' }}>
          <a href={`mailto:${CONTACT.email}`} style={{ textDecoration: 'none' }}>
            {CONTACT.displayEmail}
          </a>
          <span>{CONTACT.address}</span>
          <span>© {new Date().getFullYear()} {CONTACT.company}</span>
        </div>
      </div>
    </footer>
  )
}
