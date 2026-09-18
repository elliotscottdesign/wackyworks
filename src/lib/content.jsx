// ContentProvider + useContent hook + image value parser.
//
// The public site mounts <ContentProvider> near the root; on mount
// it fetches every row from page_content and stores them in a Map
// keyed by `key`. Components ask for content via useContent(),
// which returns a getter function `c(key, fallback)`.
//
// The fallback wins whenever the DB value is empty / missing / the
// Supabase client isn't configured. That guarantees the public site
// never renders blank strings, and lets us develop locally without
// a live Supabase.
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react'
import { supabase } from './supabase'

const ContentContext = createContext({
  map: new Map(),
  loaded: false,
  refresh: async () => {},
  setLocal: () => {},
})

// ─────────────────────────────────────────────────────────────
// Image value parser — matches nodice.bar's convention.
// An image field can be a plain URL string, or a JSON blob:
//   {"src":"…","fit":"cover","x":50,"y":50,"zoom":1}
// So the crop / focal point picker can survive the round trip.
// ─────────────────────────────────────────────────────────────
export function parseImageValue(v) {
  if (!v) return { src: '', fit: 'cover', x: 50, y: 50, zoom: 1 }
  if (typeof v !== 'string') return v
  const t = v.trim()
  if (t.startsWith('{')) {
    try {
      const j = JSON.parse(t)
      return {
        src: j.src || '',
        fit: j.fit === 'contain' ? 'contain' : 'cover',
        x: Number.isFinite(j.x) ? j.x : 50,
        y: Number.isFinite(j.y) ? j.y : 50,
        zoom: Number.isFinite(j.zoom) ? j.zoom : 1,
      }
    } catch {
      return { src: t, fit: 'cover', x: 50, y: 50, zoom: 1 }
    }
  }
  return { src: t, fit: 'cover', x: 50, y: 50, zoom: 1 }
}

export function serialiseImageValue(v) {
  if (!v) return ''
  if (typeof v === 'string') return v
  if (v.fit === 'cover' && v.x === 50 && v.y === 50 && v.zoom === 1) return v.src || ''
  return JSON.stringify(v)
}

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────
export function ContentProvider({ children }) {
  const [map, setMap] = useState(new Map())
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLoaded(true)
      return
    }
    const { data, error } = await supabase
      .from('page_content')
      .select('key, value, field_kind')
    if (error) {
      console.warn('[content] fetch failed', error)
      setLoaded(true)
      return
    }
    const next = new Map()
    for (const row of data || []) {
      if (row.value !== null && row.value !== '') next.set(row.key, row.value)
    }
    setMap(next)
    setLoaded(true)
  }, [])

  // Optimistic local update — used by inline editor after a save.
  const setLocal = useCallback((key, value) => {
    setMap((prev) => {
      const next = new Map(prev)
      if (value === null || value === '') next.delete(key)
      else next.set(key, value)
      return next
    })
  }, [])

  useEffect(() => {
    refresh()
    const onChange = () => refresh()
    window.addEventListener('wackyworks:content-changed', onChange)
    return () => window.removeEventListener('wackyworks:content-changed', onChange)
  }, [refresh])

  const value = useMemo(
    () => ({ map, loaded, refresh, setLocal }),
    [map, loaded, refresh, setLocal],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

// ─────────────────────────────────────────────────────────────
// Hook — returns a getter `c(key, fallback)`.
// Using a getter avoids calling hooks inside .map() loops, which
// would break the rules of hooks for lists of items.
// ─────────────────────────────────────────────────────────────
export function useContent() {
  const { map } = useContext(ContentContext)
  return useCallback(
    (key, fallback = '') => {
      const v = map.get(key)
      return v !== undefined && v !== '' ? v : fallback
    },
    [map],
  )
}

// Convenience wrapper for image fields — returns the parsed object.
export function useContentImage() {
  const c = useContent()
  return useCallback((key, fallback) => parseImageValue(c(key, fallback)), [c])
}

// Access the raw context (used by the admin edit tooling).
export function useContentContext() {
  return useContext(ContentContext)
}
