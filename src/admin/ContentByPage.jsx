import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Save, RotateCcw } from 'lucide-react'
import { fetchContentByPage, saveContentBatch } from '../lib/db/content.js'
import { PAGES } from './AdminLayout.jsx'

export default function ContentByPage() {
  const { page } = useParams()
  const meta = PAGES.find((p) => p.slug === page)

  const [rows, setRows] = useState([])
  const [values, setValues] = useState({}) // key → local edited value
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchContentByPage(page)
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setValues(Object.fromEntries(data.map((r) => [r.key, r.value ?? ''])))
        setLoading(false)
      })
      .catch((e) => {
        if (cancelled) return
        setMessage(`Load failed: ${e.message}`)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [page])

  const dirty = useMemo(
    () => rows.some((r) => (values[r.key] ?? '') !== (r.value ?? '')),
    [rows, values],
  )

  const save = async () => {
    setSaving(true)
    setMessage('')
    try {
      const updates = rows
        .filter((r) => (values[r.key] ?? '') !== (r.value ?? ''))
        .map((r) => ({ key: r.key, value: values[r.key] ?? '' }))
      await saveContentBatch(updates)
      setRows((prev) =>
        prev.map((r) =>
          updates.find((u) => u.key === r.key) ? { ...r, value: values[r.key] ?? '' } : r,
        ),
      )
      setMessage(`Saved ${updates.length} change${updates.length === 1 ? '' : 's'}.`)
      setTimeout(() => setMessage(''), 2500)
    } catch (e) {
      setMessage(`Save failed: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const revert = () => {
    setValues(Object.fromEntries(rows.map((r) => [r.key, r.value ?? ''])))
    setMessage('Reverted local changes.')
    setTimeout(() => setMessage(''), 2000)
  }

  if (loading) return <div style={{ color: 'var(--cream-dim)' }}>Loading…</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--lime)' }}>
            {rows.length} field{rows.length === 1 ? '' : 's'}
          </div>
          <h1 className="display" style={{ fontSize: 30, color: 'var(--cream)', marginTop: 4 }}>
            {meta?.label || page}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {message && <span style={{ color: 'var(--cream-dim)', fontSize: 13 }}>{message}</span>}
          <button onClick={revert} disabled={!dirty || saving} style={btnGhost}>
            <RotateCcw size={14} /> Revert
          </button>
          <button onClick={save} disabled={!dirty || saving} style={btnPrimary}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 18 }}>
        {rows.map((row) => (
          <Field
            key={row.key}
            row={row}
            value={values[row.key] ?? ''}
            onChange={(v) => setValues((prev) => ({ ...prev, [row.key]: v }))}
          />
        ))}
      </div>
    </div>
  )
}

function Field({ row, value, onChange }) {
  const wrap = { display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 18px' }
  const label = { fontSize: 13, color: 'var(--cream)' }
  const helper = { fontSize: 11.5, color: 'var(--cream-dim)' }
  const keyStyle = { fontSize: 10.5, color: 'var(--cream-dim)', fontFamily: 'monospace', letterSpacing: '0.02em' }

  return (
    <div style={wrap}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={label}>{row.label}</div>
        <div style={keyStyle}>{row.key}</div>
      </div>
      {row.helper && <div style={helper}>{row.helper}</div>}
      {renderInput(row.field_kind, value, onChange)}
    </div>
  )
}

function renderInput(kind, value, onChange) {
  if (kind === 'textarea' || kind === 'html') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={kind === 'html' ? 8 : 4}
        style={inputStyle}
      />
    )
  }
  if (kind === 'image') {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/catalog/pages/page-XX.jpg or full URL"
          style={inputStyle}
        />
        {value && (
          <img
            src={value.startsWith('{') ? tryParseSrc(value) : value}
            alt=""
            style={{ maxWidth: 240, maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--line)' }}
          />
        )}
      </div>
    )
  }
  return (
    <input
      type={kind === 'url' ? 'url' : 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
    />
  )
}

function tryParseSrc(v) {
  try {
    return JSON.parse(v).src || ''
  } catch {
    return v
  }
}

const inputStyle = {
  background: 'var(--ink-3)',
  color: 'var(--cream)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
  resize: 'vertical',
}
const btnGhost = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '9px 14px',
  background: 'transparent',
  color: 'var(--cream-dim)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 13,
}
const btnPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '9px 16px',
  background: 'var(--lime)',
  color: '#0e0f0c',
  border: 'none',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
}
