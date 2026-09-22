import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowLeft, Check } from 'lucide-react'
import { supabase } from './lib/supabase.js'
import { CONTACT } from './catalog'

// ── Start-a-project enquiry form ─────────────────────────────────────────────
// Fields mirror the Plonk Golf Studios enquiry form. On submit the whole thing is
// sent to the `send-enquiry` edge function, which stores it and emails it to
// elliot@wackyworks.co.uk. Everything is required — it's a qualifying brief.

const RADIO = {
  venue_setting: { label: 'Is your planned venue indoors or outdoors?', options: ['Indoors', 'Outdoors', 'Both'] },
  venue_status:  { label: 'Do you have an existing venue, or is this for a new venue?', options: ['Existing venue', 'New venue'] },
  holes:         { label: 'How many holes are you interested in?', options: ['9', '18', '27', '36'], help: 'We recommend a minimum of 150m² for 9 holes.' },
  heard:         { label: 'Where did you hear about us?', options: ['Word of mouth', 'Google', 'Social media', 'Other'] },
}

const EMPTY = {
  venue_setting: '', venue_status: '', location: '', holes: '', opening_date: '',
  budget: '', heard: '', first_name: '', last_name: '', email: '', phone: '',
}

export default function StartProject() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle')   // idle | sending | done | error
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const missing = Object.entries(form).filter(([, v]) => !String(v).trim()).map(([k]) => k)
  const valid = missing.length === 0 && emailOk

  const submit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    setStatus('sending'); setError('')
    try {
      const { error: fnErr } = await supabase.functions.invoke('send-enquiry', { body: form })
      if (fnErr) throw fnErr
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err?.message || 'Something went wrong. Please email us directly.')
    }
  }

  if (status === 'done') {
    return (
      <Shell>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Enquiry received</div>
        <h1 className="display" style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--cream)', marginBottom: 16 }}>
          Thanks — <span style={{ color: 'var(--lime)' }}>we'll be in touch.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--cream-dim)', maxWidth: 560, marginBottom: 30 }}>
          Your brief has landed with the Wacky Works team. We read every one and usually reply within a couple of working days.
        </p>
        <Link to="/" style={backBtn}><ArrowLeft size={16} /> Back to the site</Link>
      </Shell>
    )
  }

  return (
    <Shell>
      <Link to="/" style={{ ...backLink, marginBottom: 26 }}><ArrowLeft size={15} /> Back</Link>
      <div className="eyebrow" style={{ marginBottom: 16 }}>Start a project</div>
      <h1 className="display" style={{ fontSize: 'clamp(38px, 7vw, 82px)', color: 'var(--cream)', marginBottom: 18, lineHeight: 1.02 }}>
        Tell us about <span style={{ color: 'var(--lime)' }}>your course.</span>
      </h1>
      <p style={{ fontSize: 17, color: 'var(--cream-dim)', maxWidth: 620, marginBottom: 40 }}>
        Interested in a crazy golf course for your business or venue? Fill in the form below to help us understand your basic
        requirements, and a member of our team will be in touch.
      </p>

      <form onSubmit={submit} noValidate style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 30 }}>
        {Object.entries(RADIO).slice(0, 2).map(([k, cfg]) => (
          <RadioField key={k} cfg={cfg} value={form[k]} onChange={set(k)} invalid={touched && !form[k]} />
        ))}

        <TextField label="Location in the UK?" value={form.location} onChange={set('location')} invalid={touched && !form.location.trim()} placeholder="Town / city" />

        <RadioField cfg={RADIO.holes} value={form.holes} onChange={set('holes')} invalid={touched && !form.holes} />

        <TextField label="Opening date for the project?" value={form.opening_date} onChange={set('opening_date')} invalid={touched && !form.opening_date.trim()} placeholder="e.g. Spring 2027" />
        <TextField label="Approximate budget for the course?" value={form.budget} onChange={set('budget')} invalid={touched && !form.budget.trim()} placeholder="A rough figure is fine" />

        <RadioField cfg={RADIO.heard} value={form.heard} onChange={set('heard')} invalid={touched && !form.heard} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          <TextField label="First name" value={form.first_name} onChange={set('first_name')} invalid={touched && !form.first_name.trim()} />
          <TextField label="Last name" value={form.last_name} onChange={set('last_name')} invalid={touched && !form.last_name.trim()} />
          <TextField label="Email" type="email" value={form.email} onChange={set('email')} invalid={touched && (!form.email.trim() || !emailOk)} />
          <TextField label="Telephone" type="tel" value={form.phone} onChange={set('phone')} invalid={touched && !form.phone.trim()} />
        </div>

        {touched && !valid && (
          <div style={{ fontSize: 13.5, color: '#ff6b6b' }}>Please fill in every field with a valid email before sending.</div>
        )}
        {status === 'error' && (
          <div style={{ fontSize: 13.5, color: '#ff6b6b' }}>
            {error} You can also email <a href={`mailto:${CONTACT.email}`} style={{ color: 'var(--lime)' }}>{CONTACT.email}</a>.
          </div>
        )}

        <button type="submit" disabled={status === 'sending'} style={{ ...submitBtn, opacity: status === 'sending' ? 0.6 : 1, cursor: status === 'sending' ? 'default' : 'pointer' }}>
          {status === 'sending' ? 'Sending…' : <>Send enquiry <ArrowUpRight size={16} /></>}
        </button>
      </form>
    </Shell>
  )
}

// ── Layout + fields ──────────────────────────────────────────────────────────

function Shell({ children }) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--ink)' }}>
      <section className="fade-up" style={{ padding: '70px 0 90px', background: 'radial-gradient(120% 90% at 15% 0%, rgba(200, 241, 58, 0.09) 0%, transparent 55%)' }}>
        <div className="wrap" style={{ maxWidth: 900 }}>{children}</div>
      </section>
    </main>
  )
}

function TextField({ label, value, onChange, invalid, type = 'text', placeholder }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <span style={fieldLabel}>{label}</span>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, borderColor: invalid ? '#ff6b6b' : 'var(--line)' }}
      />
    </label>
  )
}

function RadioField({ cfg, value, onChange, invalid }) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <legend style={{ ...fieldLabel, padding: 0, color: invalid ? '#ff6b6b' : 'var(--cream)' }}>{cfg.label}</legend>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {cfg.options.map((opt) => {
          const on = value === opt
          return (
            <button
              key={opt} type="button" onClick={() => onChange(opt)}
              style={{
                padding: '11px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                background: on ? 'var(--lime)' : 'var(--ink-2)',
                color: on ? '#0e0f0c' : 'var(--cream)',
                border: `1px solid ${on ? 'var(--lime)' : 'var(--line)'}`,
                display: 'inline-flex', alignItems: 'center', gap: 7,
              }}
            >
              {on && <Check size={14} />}{opt}
            </button>
          )
        })}
      </div>
      {cfg.help && <span style={{ fontSize: 12.5, color: 'var(--cream-dim)' }}>{cfg.help}</span>}
    </fieldset>
  )
}

const fieldLabel = { fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream)', fontWeight: 600 }
const inputStyle = {
  background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 12,
  padding: '14px 16px', fontSize: 15, color: 'var(--cream)', fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box',
}
const submitBtn = {
  alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8,
  background: 'var(--lime)', color: '#0e0f0c', padding: '16px 28px', borderRadius: 999,
  fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', border: 'none',
}
const backLink = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--cream-dim)', textDecoration: 'none' }
const backBtn = { ...backLink, padding: '13px 22px', borderRadius: 999, border: '1px solid var(--line)', background: 'var(--ink-2)', color: 'var(--cream)' }
