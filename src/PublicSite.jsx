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
import { useContent, useContentImage, parseImageValue } from './lib/content.jsx'

// Fallback lookup so every reference-by-key resolves to a sensible
// default even before anything has been saved through the admin.
const F = {
  'header.wordmark_1': 'WACKY',
  'header.wordmark_2': 'WORKS',
  'header.email': CONTACT.displayEmail,
  'hero.eyebrow': 'Adventure Golf · Designed · Built · Themed',
  'hero.headline_1': 'We build worlds',
  'hero.headline_2': 'you play through.',
  'hero.subhead':
    'Wacky Works designs and builds crazy golf courses — modular, shippable, and hand-finished. From the natural finish to fully themed sculpted worlds, every course installs with local labour and stands the test of a busy venue.',
  'hero.cta_label': 'Start a project',
  'craft.eyebrow': INTRO.eyebrow,
  'craft.stat': INTRO.stat,
  'craft.stat_label': INTRO.statLabel,
  'craft.body': INTRO.body,
  'craft.layout_image': INTRO.layout,
  'obstacles.eyebrow': 'Modular obstacles',
  'obstacles.title': 'The Obstacles',
  'obstacles.intro':
    'Fourteen tried-and-tested pieces. Arrange them any way you like — swap holes in later years, retrofit new theming, keep customers coming back.',
  'finishes.eyebrow': 'Theming & finishing',
  'finishes.title': 'Three Finishes',
  'finishes.intro':
    'Pick a finish for the course. Move up a tier later — every finish sits on the same modular obstacles.',
  'services.eyebrow': 'Beyond the course',
  'services.title': 'Additional Services',
  'services.intro':
    'From branding a single hole to designing the whole venue — bar, garden, signage and all.',
  'packages.eyebrow': '9-hole course · turn-key',
  'packages.title': 'Packages',
  'packages.intro':
    'Three turn-key packages for a 9-hole course. Every line is cherry-pickable — take the whole pack or only the pieces you need.',
  'packages.notes': PACKAGE_NOTES.join('\n'),
  'packages.reference_sheet': PRICING_SHEET,
  'cta.eyebrow': 'Ready when you are',
  'cta.headline_1': 'No project is',
  'cta.headline_2': 'too ambitious.',
  'cta.body':
    "Every course starts with a conversation. Tell us the space, the vibe and the budget — we'll design around it.",
  'footer.address': CONTACT.address,
  'footer.company': CONTACT.company,
}

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
  const c = useContent()
  const email = c('header.email', F['header.email'])
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
          {c('header.wordmark_1', F['header.wordmark_1'])}{' '}
          <span style={{ color: 'var(--cream)' }}>{c('header.wordmark_2', F['header.wordmark_2'])}</span>
        </div>
        <nav style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          <NavLink href="#obstacles">Obstacles</NavLink>
          <NavLink href="#finishes">Finishes</NavLink>
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#packages">Packages</NavLink>
          <a
            href={`mailto:${email}`}
            style={{ fontSize: 13, color: 'var(--cream-dim)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Mail size={14} />
            {email}
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
  const c = useContent()
  const email = c('header.email', F['header.email'])
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
          {c('hero.eyebrow', F['hero.eyebrow'])}
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(48px, 9vw, 128px)', color: 'var(--cream)', marginBottom: 30, maxWidth: 1100 }}>
          {c('hero.headline_1', F['hero.headline_1'])}
          <br />
          <span style={{ color: 'var(--lime)' }}>{c('hero.headline_2', F['hero.headline_2'])}</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--cream-dim)', maxWidth: 660, marginBottom: 34, whiteSpace: 'pre-line' }}>
          {c('hero.subhead', F['hero.subhead'])}
        </p>
        <a href={`mailto:${email}?subject=Adventure%20Golf%20Enquiry`} style={ctaBtn}>
          {c('hero.cta_label', F['hero.cta_label'])} <ArrowUpRight size={16} />
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

// ────────── THE CRAFT ──────────

function TheCraft({ onImage }) {
  const c = useContent()
  const img = useContentImage()
  const layout = img('craft.layout_image', F['craft.layout_image']).src || F['craft.layout_image']
  const body = c('craft.body', F['craft.body'])
  return (
    <section style={{ padding: '90px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            {c('craft.eyebrow', F['craft.eyebrow'])}
          </div>
          <div style={{ marginBottom: 24 }}>
            <div className="display" style={{ fontSize: 'clamp(52px, 6vw, 84px)', color: 'var(--lime)' }}>
              {c('craft.stat', F['craft.stat'])}
            </div>
            <div style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginTop: 6 }}>
              {c('craft.stat_label', F['craft.stat_label'])}
            </div>
          </div>
          {body.split('\n\n').map((p, i) => (
            <p key={i} style={{ color: 'var(--cream)', opacity: 0.9, marginBottom: 14, fontSize: 15.5 }}>
              {p}
            </p>
          ))}
        </div>
        <figure onClick={() => onImage(layout)} style={{ cursor: 'zoom-in', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)' }}>
          <img src={layout} alt="Layout ideas" style={{ width: '100%' }} />
        </figure>
      </div>
    </section>
  )
}

// ────────── OBSTACLES ──────────

function Obstacles({ onImage }) {
  const c = useContent()
  return (
    <section id="obstacles" style={{ padding: '90px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <SectionHead
          eyebrow={c('obstacles.eyebrow', F['obstacles.eyebrow'])}
          title={c('obstacles.title', F['obstacles.title'])}
          intro={c('obstacles.intro', F['obstacles.intro'])}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {OBSTACLES.map((o, i) => {
            const n = i + 1
            const name = c(`obstacles.item_${n}.name`, o.name)
            const size = c(`obstacles.item_${n}.size`, o.size)
            const image = c(`obstacles.item_${n}.image`, o.img)
            const blurb = c(`obstacles.item_${n}.blurb`, o.blurb)
            const d = parseImg(image)
            return (
              <button
                key={n}
                onClick={() => onImage(d.src)}
                className="card"
                style={{ textAlign: 'left', padding: 0, background: 'var(--ink-2)', color: 'inherit' }}
              >
                <div style={{ aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--ink-3)' }}>
                  <img src={d.src} alt={name} style={imgStyle(d)} />
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                    <h3 className="display" style={{ fontSize: 20, color: 'var(--cream)' }}>{name}</h3>
                    <span style={{ fontSize: 11, color: 'var(--lime)', letterSpacing: '0.1em' }}>{size}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--cream-dim)', lineHeight: 1.55 }}>{blurb}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ────────── FINISHES ──────────

function Finishes({ onImage }) {
  const c = useContent()
  return (
    <section id="finishes" style={{ padding: '90px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <SectionHead
          eyebrow={c('finishes.eyebrow', F['finishes.eyebrow'])}
          title={c('finishes.title', F['finishes.title'])}
          intro={c('finishes.intro', F['finishes.intro'])}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {FINISHES.map((f, i) => {
            const n = i + 1
            const name = c(`finishes.item_${n}.name`, f.name)
            const d = parseImg(c(`finishes.item_${n}.image`, f.img))
            const tagline = c(`finishes.item_${n}.tagline`, f.tagline)
            const price = c(`finishes.item_${n}.price`, f.price)
            const includes = c(`finishes.item_${n}.includes`, f.includes.join('\n'))
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
            return (
              <div key={n} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => onImage(d.src)} style={{ padding: 0, background: 'transparent', textAlign: 'left', width: '100%' }}>
                  <div style={{ aspectRatio: '5 / 4', overflow: 'hidden' }}>
                    <img src={d.src} alt={name} style={imgStyle(d)} />
                  </div>
                </button>
                <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  <div>
                    <h3 className="display" style={{ fontSize: 24, color: 'var(--cream)' }}>{name}</h3>
                    <p style={{ fontSize: 14, color: 'var(--lime)', fontStyle: 'italic', marginTop: 4 }}>{tagline}</p>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'grid', gap: 8, margin: '4px 0' }}>
                    {includes.map((inc) => (
                      <li key={inc} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--cream-dim)' }}>
                        <Check size={16} style={{ color: 'var(--lime)', flexShrink: 0, marginTop: 2 }} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--line)', fontSize: 13, color: 'var(--cream-dim)' }}>
                    {price}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ────────── SERVICES ──────────

function Services({ onImage }) {
  const c = useContent()
  return (
    <section id="services" style={{ padding: '90px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <SectionHead
          eyebrow={c('services.eyebrow', F['services.eyebrow'])}
          title={c('services.title', F['services.title'])}
          intro={c('services.intro', F['services.intro'])}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {SERVICES.map((s, i) => {
            const n = i + 1
            const name = c(`services.item_${n}.name`, s.name)
            const d = parseImg(c(`services.item_${n}.image`, s.img))
            const detail = c(`services.item_${n}.detail`, s.detail)
            return (
              <button key={n} onClick={() => onImage(d.src)} className="card" style={{ textAlign: 'left', padding: 0, background: 'var(--ink-2)', color: 'inherit' }}>
                <div style={{ aspectRatio: '5 / 4', overflow: 'hidden' }}>
                  <img src={d.src} alt={name} style={imgStyle(d)} />
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <h3 className="display" style={{ fontSize: 20, color: 'var(--cream)', marginBottom: 8 }}>{name}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--cream-dim)', lineHeight: 1.55 }}>{detail}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ────────── PACKAGES ──────────

function Packages({ onImage }) {
  const c = useContent()
  const notes = c('packages.notes', F['packages.notes']).split('\n').filter(Boolean)
  const refD = parseImg(c('packages.reference_sheet', F['packages.reference_sheet']))
  return (
    <section id="packages" style={{ padding: '90px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <SectionHead
          eyebrow={c('packages.eyebrow', F['packages.eyebrow'])}
          title={c('packages.title', F['packages.title'])}
          intro={c('packages.intro', F['packages.intro'])}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 22 }}>
          {PACKAGES.map((pkg, i) => {
            const n = i + 1
            const name = c(`packages.item_${n}.name`, pkg.name)
            const total = c(`packages.item_${n}.total`, pkg.total)
            const rawLines = c(`packages.item_${n}.lines`, pkg.lines.map((l) => `${l.item} | ${l.amount}`).join('\n'))
            const lines = rawLines.split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line) => {
                const [item, amount] = line.split('|').map((s) => (s || '').trim())
                return { item: item || '', amount: amount || '' }
              })
            return <PackageCard key={n} pkg={{ ...pkg, name, total, lines }} />
          })}
        </div>
        <ul style={{ listStyle: 'none', display: 'grid', gap: 8, marginBottom: 24 }}>
          {notes.map((note) => (
            <li key={note} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--cream-dim)' }}>
              <span style={{ color: 'var(--lime)' }}>◆</span>
              {note}
            </li>
          ))}
        </ul>
        <figure onClick={() => onImage(refD.src)} style={{ cursor: 'zoom-in', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--line)' }}>
          <img src={refD.src} alt="Full pricing sheet" style={{ width: '100%' }} />
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
        <h3 className="display" style={{ fontSize: 22, color: 'var(--cream)', marginTop: 6 }}>{pkg.name}</h3>
      </div>
      <div>
        <div className="display" style={{ fontSize: 44, color: 'var(--cream)', lineHeight: 1 }}>{pkg.total}</div>
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
  const c = useContent()
  const email = c('header.email', F['header.email'])
  return (
    <section style={{ padding: '80px 0', textAlign: 'center' }}>
      <div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          {c('cta.eyebrow', F['cta.eyebrow'])}
        </div>
        <h2 className="display" style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--cream)', marginBottom: 14 }}>
          {c('cta.headline_1', F['cta.headline_1'])} <span style={{ color: 'var(--lime)' }}>{c('cta.headline_2', F['cta.headline_2'])}</span>
        </h2>
        <p style={{ fontSize: 16, color: 'var(--cream-dim)', maxWidth: 560, margin: '0 auto 28px' }}>
          {c('cta.body', F['cta.body'])}
        </p>
        <a href={`mailto:${email}?subject=Adventure%20Golf%20Enquiry`} style={ctaBtn}>
          Email {email} <ArrowUpRight size={16} />
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
      <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 18, right: 18, background: 'transparent', color: 'var(--cream)' }}>
        <X size={26} />
      </button>
      <img src={src} alt="" style={{ maxWidth: '100%', maxHeight: '92vh', borderRadius: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.55)' }} />
    </div>
  )
}

// ────────── FOOTER ──────────

function Footer() {
  const c = useContent()
  const email = c('header.email', F['header.email'])
  return (
    <footer style={{ borderTop: '1px solid var(--line)', padding: '40px 0 32px' }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div className="display" style={{ fontSize: 22, color: 'var(--lime)' }}>
          {c('header.wordmark_1', F['header.wordmark_1'])}{' '}
          <span style={{ color: 'var(--cream)' }}>{c('header.wordmark_2', F['header.wordmark_2'])}</span>
        </div>
        <div style={{ display: 'flex', gap: 30, fontSize: 13, color: 'var(--cream-dim)', flexWrap: 'wrap' }}>
          <a href={`mailto:${email}`} style={{ textDecoration: 'none' }}>{email}</a>
          <span>{c('footer.address', F['footer.address'])}</span>
          <span>© {new Date().getFullYear()} {c('footer.company', F['footer.company'])}</span>
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
      <h2 className="display" style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: 'var(--cream)', marginBottom: 12 }}>{title}</h2>
      <p style={{ color: 'var(--cream-dim)', fontSize: 15.5 }}>{intro}</p>
    </div>
  )
}

// Image values in page_content can be either a plain URL string or
// a JSON blob {src, fit, x, y, zoom}. parseImg returns the full
// display object; parseImgSrc extracts just the URL for the
// lightbox (which ignores crop/zoom).
function parseImg(v) {
  return parseImageValue(v)
}
function parseImgSrc(v) {
  return parseImg(v).src
}
// Style object to apply the stored crop/zoom to an <img> element.
function imgStyle(d) {
  return {
    width: '100%',
    height: '100%',
    objectFit: d.fit,
    objectPosition: `${d.x}% ${d.y}%`,
    transform: d.zoom && d.zoom !== 1 ? `scale(${d.zoom})` : undefined,
    transformOrigin: `${d.x}% ${d.y}%`,
  }
}
