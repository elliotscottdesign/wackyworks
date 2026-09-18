// Crop / zoom / fit picker. After choosing an image the admin lands
// here to drag it around inside the target aspect box, zoom in/out,
// and toggle cover vs. contain. Output shape:
//   { src, fit, x, y, zoom }
// Rendered by the public site via CSS object-fit / object-position /
// transform: scale — matches nodice.bar / plonkgolf behaviour.
import { useRef, useState } from 'react'

export default function ImagePositioner({ src, aspect = '1/1', initial, onSave, onCancel }) {
  const [fit, setFit] = useState(initial?.fit || 'cover')
  const [x, setX] = useState(initial?.x ?? 50)
  const [y, setY] = useState(initial?.y ?? 50)
  const [zoom, setZoom] = useState(initial?.zoom ?? 1)

  const boxRef = useRef(null)
  const dragRef = useRef(null)

  const startDrag = (e) => {
    if (fit === 'contain') return
    const box = boxRef.current
    if (!box) return
    box.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, posX: x, posY: y }
  }
  const moveDrag = (e) => {
    const d = dragRef.current
    const box = boxRef.current
    if (!d || !box) return
    const rect = box.getBoundingClientRect()
    const dx = ((e.clientX - d.startX) / rect.width) * 100
    const dy = ((e.clientY - d.startY) / rect.height) * 100
    setX(clamp(d.posX - dx, 0, 100))
    setY(clamp(d.posY - dy, 0, 100))
  }
  const endDrag = (e) => {
    const box = boxRef.current
    if (box?.hasPointerCapture(e.pointerId)) box.releasePointerCapture(e.pointerId)
    dragRef.current = null
  }
  const reset = () => {
    setFit('cover')
    setX(50)
    setY(50)
    setZoom(1)
  }

  return (
    <div style={{ padding: '18px 22px', display: 'grid', gap: 18 }}>
      <div>
        <div className="eyebrow">Position image in slot</div>
        <p style={{ marginTop: 6, fontSize: 12.5, color: 'var(--cream-dim)' }}>
          Drag to reposition · slider to zoom · toggle Fit if you want the whole image visible.
        </p>
      </div>

      <div
        ref={boxRef}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          position: 'relative',
          margin: '0 auto',
          width: '100%',
          maxWidth: 640,
          aspectRatio: aspect,
          overflow: 'hidden',
          borderRadius: 12,
          border: '1px solid var(--line)',
          background: 'var(--ink-3)',
          userSelect: 'none',
          touchAction: 'none',
          cursor: fit === 'cover' ? 'grab' : 'default',
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fit,
            objectPosition: `${x}% ${y}%`,
            transform: `scale(${zoom})`,
            transformOrigin: `${x}% ${y}%`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        <span
          style={{
            position: 'absolute',
            insetInline: 0,
            bottom: 0,
            background: 'rgba(14, 15, 12, 0.7)',
            padding: '5px 12px',
            textAlign: 'center',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--cream-dim)',
            pointerEvents: 'none',
          }}
        >
          Live preview · slot aspect {aspect.replace('/', ' : ')}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <Slider label={`Zoom · ${zoom.toFixed(2)}×`} min={1} max={3} step={0.05} value={zoom} onChange={setZoom} />
        <Slider label={`Horizontal · ${Math.round(x)}%`} min={0} max={100} step={1} value={x} onChange={setX} />
        <Slider label={`Vertical · ${Math.round(y)}%`} min={0} max={100} step={1} value={y} onChange={setY} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>Fit:</span>
          <PillButton active={fit === 'cover'} onClick={() => setFit('cover')}>Fill</PillButton>
          <PillButton active={fit === 'contain'} onClick={() => setFit('contain')}>Fit whole</PillButton>
          <PillButton onClick={reset}>Reset</PillButton>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <PillButton onClick={onCancel}>Back</PillButton>
          <PillButton primary onClick={() => onSave({ src, fit, x, y, zoom })}>Save image</PillButton>
        </div>
      </div>
    </div>
  )
}

function Slider({ label, ...props }) {
  return (
    <label style={{ display: 'block', fontSize: 12, color: 'var(--cream)' }}>
      <span style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>
        {label}
      </span>
      <input {...props} type="range" onChange={(e) => props.onChange(parseFloat(e.target.value))} style={{ display: 'block', width: '100%', marginTop: 8, accentColor: 'var(--lime)' }} />
    </label>
  )
}

function PillButton({ active, primary, onClick, children }) {
  const base = {
    padding: '7px 14px',
    borderRadius: 999,
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid var(--line)',
    background: 'transparent',
    color: 'var(--cream-dim)',
  }
  const on = { background: 'var(--lime)', color: '#0e0f0c', border: 'none' }
  return (
    <button type="button" onClick={onClick} style={active || primary ? { ...base, ...on } : base}>
      {children}
    </button>
  )
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n))
}
