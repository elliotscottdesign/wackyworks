// Full-screen media picker. Lists (a) every image scanned into
// public/media-manifest.json at build time, and (b) every upload
// held in the Supabase `media_library` table. Handles drag-and-
// drop upload plus an in-modal ImagePositioner step for crop/zoom.
//
// Mirrors nodice.bar / plonkgolf behaviour so the founder gets an
// identical UX across all three sites.
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { listMediaLibrary, uploadImage } from '../lib/db/media.js'
import ImagePositioner from './ImagePositioner.jsx'

export default function MediaPicker({ onPick, onClose, aspect = '1/1', initial }) {
  const [staged, setStaged] = useState(null)   // image URL the admin is positioning
  const [repoImages, setRepoImages] = useState([])
  const [uploads, setUploads] = useState([])
  const [err, setErr] = useState('')
  const [query, setQuery] = useState('')
  const [activeFolder, setActiveFolder] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  // Load both sources on mount.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/media-manifest.json?t=${Date.now()}`)
        if (!res.ok) throw new Error(`Manifest fetch failed: ${res.status}`)
        const json = await res.json()
        if (cancelled) return
        setRepoImages(
          (json.images || []).map((i) => ({
            path: i.path,
            filename: i.filename,
            folder: i.folder,
            source: 'repo',
          })),
        )
      } catch (e) {
        if (!cancelled) setErr(`Couldn't load built-in image list: ${e.message}`)
      }
    })()
    ;(async () => {
      try {
        const rows = await listMediaLibrary()
        if (cancelled) return
        setUploads(
          rows.map((r) => ({
            path: r.public_url,
            filename: r.filename,
            folder: 'Uploads',
            source: 'upload',
          })),
        )
      } catch {
        /* uploads list is optional — repo images alone are still useful */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const all = useMemo(() => [...uploads, ...repoImages], [uploads, repoImages])
  const folders = useMemo(() => {
    const set = new Set()
    for (const img of all) set.add(img.folder)
    return Array.from(set).sort()
  }, [all])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter((img) => {
      if (activeFolder !== 'all' && img.folder !== activeFolder) return false
      if (!q) return true
      return img.filename.toLowerCase().includes(q) || img.folder.toLowerCase().includes(q)
    })
  }, [all, query, activeFolder])

  const handleUpload = async (file) => {
    setUploading(true)
    setErr('')
    try {
      const { public_url, filename } = await uploadImage(file)
      setUploads((prev) => [
        { path: public_url, filename, folder: 'Uploads', source: 'upload' },
        ...prev,
      ])
      // Fresh uploads bypass the positioner — a naive canvas load
      // on multi-megapixel PNGs used to crash the parent modal on
      // nodice.bar. Caller can re-open the picker to fine-tune.
      onPick(public_url)
    } catch (e) {
      setErr(`Upload failed: ${e.message || e}`)
    } finally {
      setUploading(false)
    }
  }

  const onFileChosen = (e) => {
    const f = e.target.files?.[0]
    if (f) handleUpload(f)
    if (fileRef.current) fileRef.current.value = ''
  }
  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleUpload(f)
  }
  const handlePick = (path) => {
    // Ask for positioning before saving so admin can crop/zoom.
    setStaged(path)
  }
  const closeAll = () => {
    setStaged(null)
    onClose()
  }

  // Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (staged) setStaged(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [staged, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      onClick={(e) => e.target === e.currentTarget && closeAll()}
      style={backdropStyle}
    >
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={(e) => e.currentTarget === e.target && setDragOver(false)}
        onDrop={onDrop}
        style={panelStyle}
      >
        {/* Header */}
        <div style={headerRow}>
          <div style={{ minWidth: 0 }}>
            <h3 className="display" style={{ fontSize: 22, color: 'var(--cream)' }}>
              {staged ? 'Position image' : 'Media library'}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--cream-dim)', marginTop: 2 }}>
              {staged
                ? 'Drag to reposition · zoom to enlarge · save when happy.'
                : `${repoImages.length + uploads.length} images${uploads.length > 0 ? ` · ${uploads.length} uploaded` : ''}`}
            </p>
          </div>
          <button onClick={closeAll} style={closeBtn}>Close</button>
        </div>

        {staged ? (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ImagePositioner
              src={staged}
              aspect={aspect}
              initial={initial}
              onCancel={() => setStaged(null)}
              onSave={(d) => {
                onPick(d)
                setStaged(null)
              }}
            />
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div style={toolbar}>
              <label style={{ ...uploadBtn, ...(uploading ? { opacity: 0.6, pointerEvents: 'none' } : null) }}>
                {uploading ? 'Uploading…' : '+ Upload image'}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChosen}
                  style={{ display: 'none' }}
                />
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by filename or folder…"
                style={{ ...input, flex: 1, minWidth: 180 }}
              />
              <select
                value={activeFolder}
                onChange={(e) => setActiveFolder(e.target.value)}
                style={{ ...input, minWidth: 160 }}
              >
                <option value="all">All folders</option>
                {folders.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {dragOver && (
              <div style={dropHint}>Drop image to upload</div>
            )}

            {/* Grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {err && <div style={errBox}>{err}</div>}
              {all.length === 0 && !err && (
                <p style={{ color: 'var(--cream-dim)' }}>Loading media library…</p>
              )}
              {filtered.length === 0 && all.length > 0 && !err && (
                <p style={{ color: 'var(--cream-dim)' }}>No images match your search.</p>
              )}
              <div style={grid}>
                {filtered.map((img) => (
                  <button
                    key={img.path}
                    type="button"
                    onClick={() => handlePick(img.path)}
                    style={thumbBtn}
                    title={img.path}
                  >
                    <img
                      src={img.path}
                      alt=""
                      loading="lazy"
                      style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={thumbMeta}>
                      <span style={thumbName}>{img.filename}</span>
                      {img.source === 'upload' && <span style={newTag}>New</span>}
                    </div>
                    <div style={thumbFolder}>{img.folder}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

const backdropStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 150,
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
  background: 'rgba(4, 5, 3, 0.9)',
  padding: 12,
}
const panelStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 1100,
  background: 'var(--ink)',
  border: '1px solid var(--line)',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
}
const headerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '14px 20px',
  borderBottom: '1px solid var(--line)',
}
const closeBtn = {
  padding: '7px 14px',
  border: '1px solid var(--line)',
  background: 'transparent',
  color: 'var(--cream-dim)',
  borderRadius: 999,
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  fontWeight: 600,
}
const toolbar = {
  display: 'flex',
  gap: 10,
  padding: '14px 20px',
  borderBottom: '1px solid var(--line)',
  flexWrap: 'wrap',
  alignItems: 'center',
}
const uploadBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  background: 'var(--lime)',
  color: '#0e0f0c',
  borderRadius: 999,
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  fontWeight: 600,
}
const input = {
  padding: '8px 12px',
  background: 'var(--ink-3)',
  color: 'var(--cream)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  fontSize: 13,
  outline: 'none',
  fontFamily: 'inherit',
}
const dropHint = {
  position: 'absolute',
  inset: 16,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px dashed var(--lime)',
  background: 'rgba(200, 241, 58, 0.08)',
  color: 'var(--lime)',
  fontSize: 14,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontWeight: 700,
  borderRadius: 14,
  pointerEvents: 'none',
}
const errBox = {
  marginBottom: 14,
  padding: '10px 14px',
  border: '1px solid rgba(224, 135, 111, 0.3)',
  background: 'rgba(224, 135, 111, 0.06)',
  color: '#e0876f',
  fontSize: 13,
  borderRadius: 8,
}
const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: 12,
}
const thumbBtn = {
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  overflow: 'hidden',
  border: '1px solid var(--line)',
  background: 'var(--ink-2)',
  borderRadius: 10,
  textAlign: 'left',
  cursor: 'pointer',
  color: 'var(--cream)',
}
const thumbMeta = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 6,
  padding: '6px 8px 2px',
}
const thumbName = { fontSize: 11, color: 'var(--cream)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const newTag = {
  fontSize: 9,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  fontWeight: 700,
  color: 'var(--lime)',
  background: 'rgba(200, 241, 58, 0.16)',
  padding: '2px 6px',
  borderRadius: 999,
  flexShrink: 0,
}
const thumbFolder = { padding: '0 8px 8px', fontSize: 10, color: 'var(--cream-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
