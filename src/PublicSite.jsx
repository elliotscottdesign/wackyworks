import { useEffect, useState } from 'react'
import { X, ArrowUpRight, Mail, Check } from 'lucide-react'
import {
  CONTACT,
  INTRO,
  OBSTACLES,
  FINISHES,
  SERVICES,
  PACKAGES,
  PACKAGE_NOTES,
  PRICING_SHEET,
} from './catalog'

export default function PublicSite() {
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <Header />
      <Hero />
      <TheCraft onImage={setLightbox} />
      <Obstacles onImage={setLightbox} />
      <Finishes onImage={setLightbox} />
      <Services onImage={setLightbox} />
      <Packages onImage={setLightbox} />
      <CTA />
      <Footer />
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </>
  )
}

// ────────── HEADER ──────────

function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(14, 15, 12, 0.88)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="wrap" style={headerRow}>
        <div className="display" style={{ fontSize: 22, color: 'var(--lime)' }}>
          WACKY <span style={{ color: 'var(--cream)' }}>WORKS</span>
        </div>
        <nav style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          <NavLink href="#obstacles">Obstacles</NavLink>
          <NavLink href="#finishes">Finishes</NavLink>
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#packages">Packages</NavLink>
          <a
            href={`mailto:${CONTACT.email}`}
            style={{ fontSize: 13, color: 'var(--cream-dim)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Mail size={14} />
            {CONTACT.displayEmail}
          </a>
        </nav>
      </div>
    </header>
  )
}

const headerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  gap: 16,
  flexWrap: 'wrap',
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      style={{
        fontSize: 12,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--cream-dim)',
        textDecoration: 'none',
      }}
    >
      {children}
    </a>
  )
}

// ────────── HERO ──────────

function Hero() {
  return (
    <section
      className="fade-up"
      style={{
        padding: '100px 0 70px',
        borderBottom: '1px solid var(--line)',
        background: 'radial-gradient(120% 90% at 15% 0%, rgba(200, 241, 58, 0.09) 0%, transparent 55%)',
      }}
    >
      <div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 22 }}>
          Adventure Golf · Designed · Built · Themed
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
        <p style={{ fontSize: 18, color: 'var(--cream-dim)', maxWidth: 660, marginBottom: 34 }}>
          Wacky Works designs and builds crazy golf courses — modular, shippable, and hand-finished.
          From the natural finish to fully themed sculpted worlds, every course installs with local labour
          and stands the test of a busy venue.
        </p>
        <a href={`mailto:${CONTACT.email}?subject=Adventure%20Golf%20Enquiry`} style={ctaBtn}>
          Start a project <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  )
}

const ctaBtn = {
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
}

// ────────── THE CRAFT (intro) ──────────

function TheCraft({ onImage }) {
  return (
    <section style={{ padding: '90px 0', borderBottom: '1px solid var(--line)' }}>
      <div
        className="wrap"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            {INTRO.eyebrow}
          </div>
          <div style={{ marginBottom: 24 }}>
            <div className="display" style={{ fontSize: 'clamp(52px, 6vw, 84px)', color: 'var(--lime)' }}>
              {INTRO.stat}
            </div>
            <div style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginTop: 6 }}>
              {INTRO.statLabel}
            </div>
          </div>
          {INTRO.body.split('\n\n').map((p, i) => (
            <p key={i} style={{ color: 'var(--cream)', opacity: 0.9, marginBottom: 14, fontSize: 15.5 }}>
              {p}
            </p>
          ))}
        </div>
        <figure onClick={() => onImage(INTRO.layout)} style={{ cursor: 'zoom-in', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)' }}>
          <img src={INTRO.layout} alt="Layout ideas" style={{ width: '100%' }} />
        </figure>
      </div>
    </section>
  )
}

// ────────── OBSTACLES ──────────

function Obstacles({ onImage }) {
  return (
    <section id="obstacles" style={{ padding: '90px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <SectionHead
          eyebrow="Modular obstacles"
          title="The Obstacles"
          intro="Fourteen tried-and-tested pieces. Arrange them any way you like — swap holes in later years, retrofit new theming, keep customers coming back."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {OBSTACLES.map((o) => (
            <button
              key={o.name}
              onClick={() => onImage(o.img)}
              className="card"
              style={{ textAlign: 'left', padding: 0, background: 'var(--ink-2)', color: 'inherit' }}
            >
              <div style={{ aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--ink-3)' }}>
                <img src={o.img} alt={o.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                  <h3 className="display" style={{ fontSize: 20, color: 'var(--cream)' }}>
                    {o.name}
                  </h3>
                  <span style={{ fontSize: 11, color: 'var(--lime)', letterSpacing: '0.1em' }}>{o.size}</span>
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--cream-dim)', lineHeight: 1.55 }}>{o.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────── FINISHES ──────────

function Finishes({ onImage }) {
  return (
    <section id="finishes" style={{ padding: '90px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <SectionHead
          eyebrow="Theming & finishing"
          title="Three Finishes"
          intro="Pick a finish for the course. Move up a tier later — every finish sits on the same modular obstacles."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {FINISHES.map((f) => (
            <div key={f.name} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => onImage(f.img)}
                style={{ padding: 0, background: 'transparent', textAlign: 'left', width: '100%' }}
              >
                <div style={{ aspectRatio: '5 / 4', overflow: 'hidden' }}>
                  <img src={f.img} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </button>
              <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                <div>
                  <h3 className="display" style={{ fontSize: 24, color: 'var(--cream)' }}>
                    {f.name}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--lime)', fontStyle: 'italic', marginTop: 4 }}>{f.tagline}</p>
                </div>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 8, margin: '4px 0' }}>
                  {f.includes.map((inc) => (
                    <li key={inc} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--cream-dim)' }}>
                      <Check size={16} style={{ color: 'var(--lime)', flexShrink: 0, marginTop: 2 }} />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--line)', fontSize: 13, color: 'var(--cream-dim)' }}>
                  {f.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────── SERVICES ──────────

function Services({ onImage }) {
  return (
    <section id="services" style={{ padding: '90px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <SectionHead
          eyebrow="Beyond the course"
          title="Additional Services"
          intro="From branding a single hole to designing the whole venue — bar, garden, signage and all."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {SERVICES.map((s) => (
            <button
              key={s.name}
              onClick={() => onImage(s.img)}
              className="card"
              style={{ textAlign: 'left', padding: 0, background: 'var(--ink-2)', color: 'inherit' }}
            >
              <div style={{ aspectRatio: '5 / 4', overflow: 'hidden' }}>
                <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '18px 20px' }}>
                <h3 className="display" style={{ fontSize: 20, color: 'var(--cream)', marginBottom: 8 }}>
                  {s.name}
                </h3>
                <p style={{ fontSize: 13.5, color: 'var(--cream-dim)', lineHeight: 1.55 }}>{s.detail}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────── PACKAGES ──────────

function Packages({ onImage }) {
  return (
    <section id="packages" style={{ padding: '90px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <SectionHead
          eyebrow="9-hole course · turn-key"
          title="Packages"
          intro="Three turn-key packages for a 9-hole course. Every line is cherry-pickable — take the whole pack or only the pieces you need."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 22 }}>
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} />
          ))}
        </div>

        <ul style={{ listStyle: 'none', display: 'grid', gap: 8, marginBottom: 24 }}>
          {PACKAGE_NOTES.map((n) => (
            <li key={n} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--cream-dim)' }}>
              <span style={{ color: 'var(--lime)' }}>◆</span>
              {n}
            </li>
          ))}
        </ul>

        <figure onClick={() => onImage(PRICING_SHEET)} style={{ cursor: 'zoom-in', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--line)' }}>
          <img src={PRICING_SHEET} alt="Full pricing sheet" style={{ width: '100%' }} />
          <figcaption style={{ padding: '12px 16px', fontSize: 12, color: 'var(--cream-dim)' }}>
            Full pricing sheet (from the catalogue).
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function PackageCard({ pkg }) {
  const accent = pkg.tone === 'accent'
  const premium = pkg.tone === 'premium'
  return (
    <div
      className="card"
      style={{
        padding: '24px 22px 22px',
        background: accent ? 'rgba(200, 241, 58, 0.06)' : premium ? 'rgba(255, 106, 61, 0.06)' : 'var(--ink-2)',
        borderColor: accent ? 'rgba(200, 241, 58, 0.35)' : premium ? 'rgba(255, 106, 61, 0.35)' : 'var(--line)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div>
        <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: premium ? 'var(--coral)' : 'var(--lime)' }}>
          Package
        </div>
        <h3 className="display" style={{ fontSize: 22, color: 'var(--cream)', marginTop: 6 }}>
          {pkg.name}
        </h3>
      </div>
      <div>
        <div className="display" style={{ fontSize: 44, color: 'var(--cream)', lineHeight: 1 }}>
          {pkg.total}
        </div>
        <div style={{ fontSize: 12, color: 'var(--cream-dim)', marginTop: 4 }}>+ VAT · turn-key</div>
      </div>
      <ul style={{ listStyle: 'none', display: 'grid', gap: 8, paddingTop: 6, borderTop: '1px solid var(--line)' }}>
        {pkg.lines.map((l) => (
          <li key={l.item} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 13.5 }}>
            <span style={{ color: 'var(--cream-dim)' }}>{l.item}</span>
            <span style={{ color: 'var(--cream)' }}>{l.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ────────── CLOSING CTA ──────────

function CTA() {
  return (
    <section style={{ padding: '80px 0', textAlign: 'center' }}>
      <div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          Ready when you are
        </div>
        <h2 className="display" style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--cream)', marginBottom: 14 }}>
          No project is <span style={{ color: 'var(--lime)' }}>too ambitious.</span>
        </h2>
        <p style={{ fontSize: 16, color: 'var(--cream-dim)', maxWidth: 560, margin: '0 auto 28px' }}>
          Every course starts with a conversation. Tell us the space, the vibe and the budget — we'll design around it.
        </p>
        <a href={`mailto:${CONTACT.email}?subject=Adventure%20Golf%20Enquiry`} style={ctaBtn}>
          Email {CONTACT.displayEmail} <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  )
}

// ────────── LIGHTBOX ──────────

function Lightbox({ src, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 5, 3, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        zIndex: 100,
        cursor: 'zoom-out',
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{ position: 'absolute', top: 18, right: 18, background: 'transparent', color: 'var(--cream)' }}
      >
        <X size={26} />
      </button>
      <img
        src={src}
        alt=""
        style={{ maxWidth: '100%', maxHeight: '92vh', borderRadius: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.55)' }}
      />
    </div>
  )
}

// ────────── FOOTER ──────────

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', padding: '40px 0 32px' }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div className="display" style={{ fontSize: 22, color: 'var(--lime)' }}>
          WACKY <span style={{ color: 'var(--cream)' }}>WORKS</span>
        </div>
        <div style={{ display: 'flex', gap: 30, fontSize: 13, color: 'var(--cream-dim)', flexWrap: 'wrap' }}>
          <a href={`mailto:${CONTACT.email}`} style={{ textDecoration: 'none' }}>{CONTACT.displayEmail}</a>
          <span>{CONTACT.address}</span>
          <span>© {new Date().getFullYear()} {CONTACT.company}</span>
        </div>
      </div>
    </footer>
  )
}

// ────────── shared ──────────

function SectionHead({ eyebrow, title, intro }) {
  return (
    <div style={{ marginBottom: 34, maxWidth: 720 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>
      <h2 className="display" style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: 'var(--cream)', marginBottom: 12 }}>
        {title}
      </h2>
      <p style={{ color: 'var(--cream-dim)', fontSize: 15.5 }}>{intro}</p>
    </div>
  )
}
