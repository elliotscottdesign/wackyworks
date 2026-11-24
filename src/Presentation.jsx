// Client-facing, code-gated presentation. One URL per client:
//   wackyworks.co.uk/present/<slug>
// Access code stored (plaintext for v1) at
//   present.<slug>.code
// Everything else is editable via inline edit mode + the admin
// Content pages under page = "present.<slug>".
import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { X, ArrowUpRight, ChevronRight } from 'lucide-react'
import { getPresentation } from './presentations.js'
import { useContent, parseImageValue } from './lib/content.jsx'
import Editable from './edit/Editable.jsx'
import EditableImage from './edit/EditableImage.jsx'
import AdminBar from './edit/AdminBar.jsx'
import { useEditMode } from './edit/EditModeProvider.jsx'
import { supabase } from './lib/supabase.js'

const TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'photos', label: 'The London Course' },
  { id: 'holes', label: 'The Nine Holes' },
  { id: 'scale', label: 'Scale & Install' },
  { id: 'costs', label: 'Costs' },
]

export default function Presentation() {
  const { slug } = useParams()
  const fallback = getPresentation(slug)
  const c = useContent()
  const { canEdit } = useEditMode()

  // Admin bypass: if logged in, skip the code gate.
  const [signedIn, setSignedIn] = useState(false)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data?.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s))
    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  const expectedCode = c(`present.${slug}.code`, fallback?.code || '').trim()
  const unlockedKey = `wackyworks.present.${slug}.unlocked`
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(unlockedKey) === '1'
    } catch {
      return false
    }
  })
  const [active, setActive] = useState('intro')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!fallback) {
    return (
      <div style={missingWrap}>
        <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--lime)' }}>
          Wacky Works
        </div>
        <h1 className="display" style={{ fontSize: 48, marginTop: 8, color: 'var(--cream)' }}>
          Presentation not found
        </h1>
        <p style={{ color: 'var(--cream-dim)', maxWidth: 420, marginTop: 10 }}>
          No presentation is configured at this URL.
        </p>
        <Link to="/" style={{ marginTop: 20, color: 'var(--lime)' }}>
          ← Back to wackyworks.co.uk
        </Link>
      </div>
    )
  }

  const gateOpen = unlocked || signedIn
  if (!gateOpen) {
    return (
      <CodeGate
        slug={slug}
        fallback={fallback}
        expectedCode={expectedCode}
        onUnlock={() => {
          try {
            sessionStorage.setItem(unlockedKey, '1')
          } catch {}
          setUnlocked(true)
        }}
      />
    )
  }

  return (
    <>
      <Header slug={slug} fallback={fallback} active={active} setActive={setActive} />
      <main style={{ minHeight: '60vh', padding: '36px 24px 100px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div key={active} className="fade-up">
            {active === 'intro' && <IntroTab slug={slug} fallback={fallback} onImage={setLightbox} />}
            {active === 'photos' && <PhotosTab slug={slug} fallback={fallback} onImage={setLightbox} />}
            {active === 'holes' && <HolesTab slug={slug} fallback={fallback} onImage={setLightbox} />}
            {active === 'scale' && <ScaleTab slug={slug} fallback={fallback} onImage={setLightbox} />}
            {active === 'costs' && <CostsTab slug={slug} fallback={fallback} />}
          </div>
        </div>
      </main>
      <Footer slug={slug} fallback={fallback} />
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      <AdminBar />
    </>
  )
}

// ─────────────── Code gate ───────────────

function CodeGate({ slug, fallback, expectedCode, onUnlock }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (value.trim().toUpperCase() === (expectedCode || '').toUpperCase()) {
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div style={gateWrap}>
      <div className="fade-up" style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          Wacky Works · Private Presentation
        </div>
        <h1 className="display" style={{ fontSize: 34, lineHeight: 1.1, color: 'var(--cream)' }}>
          {fallback.client}
        </h1>
        <p style={{ color: 'var(--cream-dim)', marginTop: 10, fontSize: 14 }}>
          {fallback.tagline}
        </p>
        <hr style={{ height: 1, border: 0, background: 'var(--line)', margin: '28px 0' }} />
        <form onSubmit={submit}>
          <label style={{ display: 'block', fontSize: 13, color: 'var(--cream-dim)', marginBottom: 10 }}>
            Enter your access code
          </label>
          <input
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(false)
            }}
            placeholder="Access code"
            style={{
              width: '100%',
              padding: '13px 16px',
              fontSize: 16,
              letterSpacing: '0.18em',
              textAlign: 'center',
              textTransform: 'uppercase',
              background: 'var(--ink-2)',
              border: `1px solid ${error ? '#c2533f' : 'var(--line)'}`,
              borderRadius: 10,
              color: 'var(--cream)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {error && (
            <div style={{ color: '#e0876f', fontSize: 13, marginTop: 10 }}>
              That code didn't match.
            </div>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: 14,
              padding: '13px 16px',
              fontSize: 13,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: 'var(--lime)',
              color: '#0e0f0c',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Unlock
          </button>
        </form>
        <div style={{ marginTop: 22, fontSize: 11, color: 'var(--cream-dim)', letterSpacing: '0.1em' }}>
          Prepared by Wacky Works Ltd
        </div>
      </div>
    </div>
  )
}

// ─────────────── Header ───────────────

function Header({ slug, fallback, active, setActive }) {
  const c = useContent()
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(14, 15, 12, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, minWidth: 0 }}>
          <span className="display" style={{ fontSize: 20, color: 'var(--lime)' }}>
            WACKY <span style={{ color: 'var(--cream)' }}>WORKS</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--cream-dim)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            ·{' '}
            <Editable k={`present.${slug}.client_name`}>
              {c(`present.${slug}.client_name`, fallback.client)}
            </Editable>
          </span>
        </div>
      </div>

      <nav
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
        }}
      >
        {TABS.map((t) => {
          const on = t.id === active
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: on ? 'var(--lime)' : 'var(--cream-dim)',
                padding: '12px 14px',
                borderBottom: `2px solid ${on ? 'var(--lime)' : 'transparent'}`,
                whiteSpace: 'nowrap',
                fontSize: 12,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}

// ─────────────── Tabs ───────────────

function IntroTab({ slug, fallback, onImage }) {
  const c = useContent()
  const heroRaw = c(`present.${slug}.hero_image`, fallback.heroImage)
  const heroD = parseImg(heroRaw)
  const body = c(`present.${slug}.intro.body`, fallback.intro.body)
  return (
    <div>
      <figure
        onClick={() => onImage(heroD.src)}
        style={{ cursor: 'zoom-in', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)' }}
      >
        <EditableImage k={`present.${slug}.hero_image`} aspect="3/2" currentValue={heroRaw}>
          <div style={{ aspectRatio: '3 / 2', overflow: 'hidden', background: 'var(--ink-3)' }}>
            <img src={heroD.src} alt="" style={imgStyle(heroD)} />
          </div>
        </EditableImage>
      </figure>

      <div style={{ textAlign: 'center', margin: '40px 0 28px' }}>
        <div className="eyebrow">
          <Editable k={`present.${slug}.intro.eyebrow`}>
            {c(`present.${slug}.intro.eyebrow`, fallback.intro.eyebrow)}
          </Editable>
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.05, margin: '14px 0', color: 'var(--cream)' }}>
          <Editable k={`present.${slug}.intro.headline`}>
            {c(`present.${slug}.intro.headline`, fallback.intro.headline)}
          </Editable>
        </h1>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <Editable k={`present.${slug}.intro.body`} multiline>
          <div style={{ whiteSpace: 'pre-wrap', color: 'var(--cream)', opacity: 0.92, fontSize: 16.5, lineHeight: 1.6 }}>
            {body}
          </div>
        </Editable>
      </div>
    </div>
  )
}

function PhotosTab({ slug, fallback, onImage }) {
  const c = useContent()
  return (
    <div>
      <SectionHead
        slug={slug}
        titleKey={`present.${slug}.photos.title`}
        titleFallback="The London Course"
        introKey={`present.${slug}.photos.intro`}
        introFallback={fallback.photos.intro}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {fallback.photos.images.map((src, i) => {
          const key = `present.${slug}.photos.item_${i + 1}`
          const raw = c(key, src)
          const d = parseImg(raw)
          return (
            <figure
              key={i}
              onClick={() => onImage(d.src)}
              style={{ cursor: 'zoom-in', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--ink-2)' }}
            >
              <EditableImage k={key} aspect="3/2" currentValue={raw}>
                <div style={{ aspectRatio: '3 / 2', overflow: 'hidden' }}>
                  <img src={d.src} alt="" style={imgStyle(d)} />
                </div>
              </EditableImage>
            </figure>
          )
        })}
      </div>
    </div>
  )
}

function HolesTab({ slug, fallback, onImage }) {
  const c = useContent()
  return (
    <div>
      <SectionHead
        slug={slug}
        titleKey={`present.${slug}.holes.title`}
        titleFallback="The Nine Holes"
        introKey={`present.${slug}.holes.intro`}
        introFallback={fallback.holes.intro}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {fallback.holes.items.map((h) => {
          const imageKey = `present.${slug}.holes.item_${h.n}.image`
          const nameKey = `present.${slug}.holes.item_${h.n}.name`
          const copyKey = `present.${slug}.holes.item_${h.n}.copy`
          const titleKey = `present.${slug}.holes.item_${h.n}.catalogue_title`
          const raw = c(imageKey, h.image)
          const d = parseImg(raw)
          return (
            <div
              key={h.n}
              className="card"
              style={{
                background: 'var(--ink-2)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Catalogue title above the image */}
              <div style={{ padding: '16px 18px 10px' }}>
                <h3
                  className="display"
                  style={{
                    fontSize: 22,
                    color: 'var(--cream)',
                    lineHeight: 1.05,
                    textTransform: 'uppercase',
                    letterSpacing: '0.01em',
                  }}
                >
                  <Editable k={titleKey}>{c(titleKey, h.catalogueTitle || h.name)}</Editable>
                </h3>
              </div>

              {/* 3D render only, on white */}
              <div
                style={{ cursor: 'zoom-in', aspectRatio: '1192 / 1333', background: '#fff', overflow: 'hidden' }}
                onClick={() => onImage(d.src)}
              >
                <EditableImage k={imageKey} aspect="1192/1333" currentValue={raw}>
                  <img src={d.src} alt="" style={imgStyle(d)} />
                </EditableImage>
              </div>

              {/* Hole N · Name · copy */}
              <div style={{ padding: '14px 18px 18px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span
                    className="display"
                    style={{
                      fontSize: 12,
                      color: 'var(--lime)',
                      letterSpacing: '0.14em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Hole {h.n}
                  </span>
                  <span style={{ fontSize: 15, color: 'var(--cream)', fontWeight: 600, lineHeight: 1.2 }}>
                    <Editable k={nameKey}>{c(nameKey, h.name)}</Editable>
                  </span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--cream-dim)', lineHeight: 1.55 }}>
                  <Editable k={copyKey} multiline>{c(copyKey, h.copy || '')}</Editable>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ScaleTab({ slug, fallback, onImage }) {
  const c = useContent()
  const planRaw = c(`present.${slug}.scale.plan_image`, fallback.scale.planImage)
  const planD = parseImg(planRaw)
  return (
    <div>
      <SectionHead
        slug={slug}
        eyebrowKey={`present.${slug}.scale.eyebrow`}
        eyebrowFallback={fallback.scale.eyebrow}
        titleKey={`present.${slug}.scale.headline`}
        titleFallback={fallback.scale.headline}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28, alignItems: 'start' }}>
        <div>
          <Editable k={`present.${slug}.scale.body`} multiline>
            <div style={{ whiteSpace: 'pre-wrap', color: 'var(--cream)', opacity: 0.9, fontSize: 15.5, lineHeight: 1.6 }}>
              {c(`present.${slug}.scale.body`, fallback.scale.body)}
            </div>
          </Editable>
        </div>
        <figure
          onClick={() => onImage(planD.src)}
          style={{ cursor: 'zoom-in', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)' }}
        >
          <EditableImage k={`present.${slug}.scale.plan_image`} aspect="4/3" currentValue={planRaw}>
            <div style={{ aspectRatio: '4 / 3', background: 'var(--ink-3)', overflow: 'hidden' }}>
              <img src={planD.src} alt="" style={imgStyle(planD)} />
            </div>
          </EditableImage>
        </figure>
      </div>
    </div>
  )
}

function CostsTab({ slug, fallback }) {
  const c = useContent()
  return (
    <div>
      <SectionHead
        slug={slug}
        eyebrowKey={`present.${slug}.costs.eyebrow`}
        eyebrowFallback={fallback.costs.eyebrow}
        titleKey={`present.${slug}.costs.headline`}
        titleFallback={fallback.costs.headline}
        introKey={`present.${slug}.costs.body`}
        introFallback={fallback.costs.body}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        {fallback.costs.packages.map((p, i) => {
          const n = i + 1
          return (
            <div
              key={n}
              style={{
                background: i === 1 ? 'rgba(200, 241, 58, 0.06)' : 'var(--ink-2)',
                border: i === 1 ? '1px solid rgba(200, 241, 58, 0.35)' : '1px solid var(--line)',
                borderRadius: 14,
                padding: '22px 22px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--lime)' }}>
                  Option {n}
                </div>
                <h3 className="display" style={{ fontSize: 22, color: 'var(--cream)', marginTop: 4 }}>
                  <Editable k={`present.${slug}.costs.pkg_${n}.name`}>
                    {c(`present.${slug}.costs.pkg_${n}.name`, p.name)}
                  </Editable>
                </h3>
              </div>
              <div>
                <div className="display" style={{ fontSize: 44, color: 'var(--cream)', lineHeight: 1 }}>
                  <Editable k={`present.${slug}.costs.pkg_${n}.total`}>
                    {c(`present.${slug}.costs.pkg_${n}.total`, p.total)}
                  </Editable>
                </div>
                <div style={{ fontSize: 12, color: 'var(--cream-dim)', marginTop: 4 }}>+ VAT</div>
              </div>
              <div style={{ color: 'var(--cream-dim)', fontSize: 14, lineHeight: 1.55 }}>
                <Editable k={`present.${slug}.costs.pkg_${n}.blurb`} multiline>
                  {c(`present.${slug}.costs.pkg_${n}.blurb`, p.blurb)}
                </Editable>
              </div>
              {p.lines && p.lines.length > 0 && (
                <ul style={{ listStyle: 'none', display: 'grid', gap: 7, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                  {p.lines.map((l, li) => (
                    <li key={li} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 13 }}>
                      <span style={{ color: 'var(--cream-dim)' }}>{l.item}</span>
                      <span style={{ color: 'var(--cream)', whiteSpace: 'nowrap' }}>{l.amount}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
      <p style={{ color: 'var(--cream-dim)', fontSize: 13, marginTop: 20, fontStyle: 'italic', textAlign: 'center' }}>
        <Editable k={`present.${slug}.costs.footnote`} multiline>
          {c(`present.${slug}.costs.footnote`, fallback.costs.footnote)}
        </Editable>
      </p>
    </div>
  )
}

// ─────────────── Shared ───────────────

function SectionHead({ slug, eyebrowKey, eyebrowFallback, titleKey, titleFallback, introKey, introFallback }) {
  const c = useContent()
  return (
    <div style={{ marginBottom: 28, maxWidth: 820 }}>
      {eyebrowKey && (
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          <Editable k={eyebrowKey}>{c(eyebrowKey, eyebrowFallback)}</Editable>
        </div>
      )}
      <h2 className="display" style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', color: 'var(--cream)', marginBottom: 12 }}>
        <Editable k={titleKey}>{c(titleKey, titleFallback)}</Editable>
      </h2>
      {introKey && (
        <div style={{ color: 'var(--cream-dim)', fontSize: 15.5, lineHeight: 1.55 }}>
          <Editable k={introKey} multiline>
            {c(introKey, introFallback)}
          </Editable>
        </div>
      )}
    </div>
  )
}

function Footer({ slug, fallback }) {
  const c = useContent()
  return (
    <footer style={{ borderTop: '1px solid var(--line)', padding: '26px 20px', textAlign: 'center' }}>
      <div className="display" style={{ fontSize: 16, color: 'var(--lime)' }}>
        WACKY <span style={{ color: 'var(--cream)' }}>WORKS</span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--cream-dim)', marginTop: 6, letterSpacing: '0.1em' }}>
        Private presentation for{' '}
        <Editable k={`present.${slug}.client_name`}>
          {c(`present.${slug}.client_name`, fallback.client)}
        </Editable>
        {' · '}
        <Link to="/" style={{ color: 'var(--cream-dim)', textDecoration: 'none' }}>
          wackyworks.co.uk
        </Link>
      </div>
    </footer>
  )
}

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
        style={{ position: 'absolute', top: 18, right: 18, background: 'transparent', color: 'var(--cream)', border: 'none', cursor: 'pointer' }}
      >
        <X size={26} />
      </button>
      <img src={src} alt="" style={{ maxWidth: '100%', maxHeight: '92vh', borderRadius: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.55)' }} />
    </div>
  )
}

// ─────────────── Styles ───────────────

const gateWrap = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  background: 'radial-gradient(120% 90% at 50% 0%, rgba(200, 241, 58, 0.06) 0%, var(--ink) 55%)',
}

const missingWrap = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  textAlign: 'center',
}

function parseImg(v) {
  return parseImageValue(v)
}
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
