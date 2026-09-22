// In-place editable text wrapper. When edit mode is on, wraps its
// children in a contentEditable span with a dashed lime outline;
// click to type, blur / Enter to save straight to Supabase.
//
// Usage:
//   const c = useContent()
//   <h1><Editable k="hero.headline_1">{c('hero.headline_1', 'Default')}</Editable></h1>
//
// For multi-line fields pass multiline so newlines are preserved
// and Enter doesn't blur.
import { useEffect, useRef, useState } from 'react'
import { useEditMode } from './EditModeProvider.jsx'
import { useApplyContentEdit } from '../lib/content.jsx'
import { saveContentValue } from '../lib/db/content.js'

export default function Editable({ k, multiline = false, children }) {
  const { editMode } = useEditMode()
  const applyEdit = useApplyContentEdit()
  const ref = useRef(null)
  const initialRef = useRef('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Keep the contentEditable text in sync when children change from
  // outside (e.g. after another edit hydrates from Supabase). Skip
  // while the element is focused so we don't yank the cursor.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (document.activeElement === el) return
    const incoming = childrenToText(children)
    if (el.innerText !== incoming) el.innerText = incoming
  }, [children])

  if (!editMode) return <>{children}</>

  const commit = async () => {
    const el = ref.current
    if (!el) return
    const next = (el.innerText ?? '').trim()
    if (next === initialRef.current.trim()) return
    setSaving(true)
    try {
      await saveContentValue(k, next, multiline ? 'textarea' : 'text')
      applyEdit(k, next)
      setSaved(true)
      setTimeout(() => setSaved(false), 1200)
    } catch (e) {
      console.error('[Editable] save failed', k, e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-editable={k}
      onFocus={() => {
        initialRef.current = ref.current?.innerText ?? ''
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault()
          e.target.blur()
        }
        if (e.key === 'Escape') {
          if (ref.current) ref.current.innerText = initialRef.current
          e.target.blur()
        }
      }}
      title={`Edit ${k}`}
      style={{
        outline: `1px dashed ${saved ? 'var(--lime)' : 'rgba(200, 241, 58, 0.35)'}`,
        outlineOffset: 2,
        borderRadius: 3,
        cursor: 'text',
        opacity: saving ? 0.7 : 1,
        background: saved ? 'rgba(200, 241, 58, 0.08)' : undefined,
        transition: 'background 0.2s, outline-color 0.2s',
      }}
    >
      {children}
    </span>
  )
}

function childrenToText(children) {
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(childrenToText).join('')
  return ''
}
