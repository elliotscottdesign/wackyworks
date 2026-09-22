// CRUD helpers for the page_content table.
import { supabase } from '../supabase'

export async function fetchContentByPage(page) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('page_content')
    .select('key, value, page, field_kind, label, helper, sort_order')
    .eq('page', page)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function fetchAllContent() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('page_content')
    .select('key, value, page, field_kind, label, helper, sort_order')
    .order('page', { ascending: true })
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function saveContentValue(key, value, fieldKind) {
  if (!supabase) throw new Error('Supabase client not configured')
  // Try update first (avoids overwriting label/helper/sort_order on
  // seeded rows). If no row exists yet, upsert one with a sensible
  // default so a rogue key doesn't silently no-op the save.
  const { data, error } = await supabase
    .from('page_content')
    .update({ value: value ?? '' })
    .eq('key', key)
    .select('key')
  if (error) throw error
  if (!data || data.length === 0) {
    // Row didn't exist — insert it. Page inferred from the key prefix
    // ("home.hero.headline_1" → "home").
    const page = key.split('.')[0] || 'misc'
    const { error: insErr } = await supabase.from('page_content').insert({
      key,
      value: value ?? '',
      page,
      field_kind: fieldKind || 'text',
      label: key,
    })
    if (insErr) throw insErr
  }
  window.dispatchEvent(new CustomEvent('wackyworks:content-changed', { detail: { key } }))
}

export async function saveContentBatch(updates) {
  if (!supabase) throw new Error('Supabase client not configured')
  // Supabase-js has no bulk update by primary key — do them in parallel.
  await Promise.all(
    updates.map(({ key, value }) =>
      supabase.from('page_content').update({ value: value ?? '' }).eq('key', key),
    ),
  )
  window.dispatchEvent(new CustomEvent('wackyworks:content-changed'))
}

export function groupByPage(rows) {
  const pages = new Map()
  for (const row of rows) {
    if (!pages.has(row.page)) pages.set(row.page, [])
    pages.get(row.page).push(row)
  }
  return pages
}
