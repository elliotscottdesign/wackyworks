import { useEffect, useRef, useState } from 'react'
import { Upload, Trash2, Copy } from 'lucide-react'
import { listMediaLibrary, uploadImage, deleteMediaItem, updateMediaAlt } from '../lib/db/media.js'

export default function MediaLibrary() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const refresh = () =>
    listMediaLibrary()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))

  useEffect(() => {
    refresh()
  }, [])

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setBusy(true)
    setError('')
    try {
      for (const f of files) await uploadImage(f)
      await refresh()
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const del = async (item) => {
    if (!confirm(`Delete ${item.filename}? This cannot be undone.`)) return
    try {
      await deleteMediaItem(item)
      await refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  const copyUrl = (url) => navigator.clipboard?.writeText(url)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--lime)' }}>
            {items.length} file{items.length === 1 ? '' : 's'}
          </div>
          <h1 className="display" style={{ fontSize: 30, color: 'var(--cream)', marginTop: 4 }}>
            Media Library
          </h1>
        </div>
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            background: 'var(--lime)',
            color: '#0e0f0c',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <Upload size={14} />
          {busy ? 'Uploading…' : 'Upload files'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onUpload}
          />
        </label>
      </div>
      {error && <div style={{ color: '#e0876f', marginBottom: 14 }}>{error}</div>}
      {loading ? (
        <div style={{ color: 'var(--cream-dim)' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ color: 'var(--cream-dim)', padding: 40, textAlign: 'center', border: '1px dashed var(--line)', borderRadius: 12 }}>
          No files yet. Click Upload to add images.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
              <img src={item.public_url} alt={item.alt || ''} style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover' }} />
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--cream)', wordBreak: 'break-all' }}>{item.filename}</div>
                <input
                  defaultValue={item.alt || ''}
                  onBlur={(e) => {
                    if ((e.target.value || '') !== (item.alt || '')) {
                      updateMediaAlt(item.id, e.target.value).catch((err) => setError(err.message))
                    }
                  }}
                  placeholder="Alt text"
                  style={{ background: 'var(--ink-3)', border: '1px solid var(--line)', color: 'var(--cream)', padding: '6px 8px', borderRadius: 6, fontSize: 12, fontFamily: 'inherit' }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => copyUrl(item.public_url)} style={smallBtn}>
                    <Copy size={12} /> URL
                  </button>
                  <button onClick={() => del(item)} style={{ ...smallBtn, color: '#e0876f' }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const smallBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '5px 9px',
  background: 'var(--ink-3)',
  border: '1px solid var(--line)',
  color: 'var(--cream-dim)',
  borderRadius: 6,
  fontSize: 11,
  cursor: 'pointer',
}
