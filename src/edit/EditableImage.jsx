// In-place editable image wrapper. When edit mode is on, wraps its
// children in a click target with a lime dashed outline; clicking
// opens a small chooser (Reposition existing / Replace with new).
//
// Usage:
//   <EditableImage k="obstacles.item_1.image" aspect="4/3" currentValue={raw}>
//     <img src={display.src} style={imgStyle(display)} />
//   </EditableImage>
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useEditMode } from './EditModeProvider.jsx'
import {
  useApplyContentEdit,
  parseImageValue,
  serialiseImageValue,
} from '../lib/content.jsx'
import { saveContentValue } from '../lib/db/content.js'
import MediaPicker from './MediaPicker.jsx'
import ImagePositioner from './ImagePositioner.jsx'

export default function EditableImage({ k, aspect = '1/1', currentValue, children }) {
  const { editMode } = useEditMode()
  const applyEdit = useApplyContentEdit()
  const [mode, setMode] = useState('closed') // closed | chooser | replace | reposition
  const [saving, setSaving] = useState(false)

  const initial = currentValue ? parseImageValue(currentValue) : undefined
  const currentSrc = initial?.src || ''

  const save = async (value) => {
    setSaving(true)
    try {
      const stored = typeof value === 'string' ? value : serialiseImageValue(value)
      await saveContentValue(k, stored, 'image')
      applyEdit(k, stored)
    } catch (e) {
      console.error('[EditableImage] save failed', k, e)
    } finally {
      setSaving(false)
      setMode('closed')
    }
  }

  if (!editMode) return <>{children}</>

  return (
    <span
      onClick={(e) => {
        if (mode !== 'closed') return
        e.preventDefault()
        e.stopPropagation()
        setMode('chooser')
      }}
      title={`Edit ${k}`}
      style={{
        display: 'block',
        position: 'relative',
        cursor: 'pointer',
        outline: '2px dashed rgba(200, 241, 58, 0.5)',
        outlineOffset: 2,
        borderRadius: 4,
        opacity: saving ? 0.7 : 1,
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          insetInline: 0,
          bottom: 0,
          background: 'rgba(14, 15, 12, 0.88)',
          color: 'var(--cream)',
          padding: '6px 12px',
          textAlign: 'center',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 700,
          pointerEvents: 'none',
        }}
      >
        Click to edit image
      </span>
      {mode === 'chooser' && (
        <ChooserModal
          canReposition={!!currentSrc}
          onReposition={() => setMode('reposition')}
          onReplace={() => setMode('replace')}
          onClose={() => setMode('closed')}
        />
      )}
      {mode === 'replace' && (
        <MediaPicker
          onPick={save}
          onClose={() => setMode('closed')}
          aspect={aspect}
          initial={initial}
        />
      )}
      {mode === 'reposition' && currentSrc && (
        <RepositionModal
          src={currentSrc}
          aspect={aspect}
          initial={initial}
          onSave={save}
          onCancel={() => setMode('closed')}
        />
      )}
    </span>
  )
}

function ChooserModal({ canReposition, onReposition, onReplace, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  if (typeof document === 'undefined') return null
  return createPortal(
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(4, 5, 3, 0.88)',
        padding: 16,
      }}
    >
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
          <h3 className="display" style={{ fontSize: 18, color: 'var(--cream)' }}>Edit image</h3>
          <button onClick={onClose} style={closeBtn}>Close</button>
        </div>
        <div style={{ padding: 18, display: 'grid', gap: 10 }}>
          <button
            onClick={onReposition}
            disabled={!canReposition}
            style={{ ...bigChoice, opacity: canReposition ? 1 : 0.35, cursor: canReposition ? 'pointer' : 'not-allowed' }}
          >
            <span style={choiceEyebrow}>Reposition this image</span>
            <span style={choiceBody}>Crop, zoom or slide the image you already have.</span>
          </button>
          <button onClick={onReplace} style={bigChoice}>
            <span style={choiceEyebrow}>Replace with a different image</span>
            <span style={choiceBody}>Open the media library to pick or upload a new file.</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function RepositionModal({ src, aspect, initial, onSave, onCancel }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])
  if (typeof document === 'undefined') return null
  return createPortal(
    <div
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 140,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        background: 'rgba(4, 5, 3, 0.9)',
        padding: 12,
      }}
    >
      <div style={{ width: '100%', maxWidth: 800, background: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
          <div>
            <h3 className="display" style={{ fontSize: 20, color: 'var(--cream)' }}>Position image</h3>
            <p style={{ fontSize: 12, color: 'var(--cream-dim)', marginTop: 2 }}>Drag to reposition · zoom to enlarge · save when happy.</p>
          </div>
          <button onClick={onCancel} style={closeBtn}>Close</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <ImagePositioner src={src} aspect={aspect} initial={initial} onSave={onSave} onCancel={onCancel} />
        </div>
      </div>
    </div>,
    document.body,
  )
}

const closeBtn = {
  padding: '6px 12px',
  border: '1px solid var(--line)',
  background: 'transparent',
  color: 'var(--cream-dim)',
  borderRadius: 999,
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontWeight: 700,
  cursor: 'pointer',
}
const bigChoice = {
  display: 'block',
  width: '100%',
  padding: 16,
  textAlign: 'left',
  background: 'var(--ink-2)',
  border: '1px solid var(--line)',
  borderRadius: 12,
  color: 'var(--cream)',
  cursor: 'pointer',
  fontFamily: 'inherit',
}
const choiceEyebrow = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--lime)',
}
const choiceBody = { display: 'block', marginTop: 4, fontSize: 13, color: 'var(--cream-dim)' }
