// Upload / list / delete helpers for the media bucket.
import { supabase } from '../supabase'

const BUCKET = 'media'

// Upload a File/Blob into the bucket. Returns { public_url, storage_path }.
export async function uploadImage(file, folder = 'uploads') {
  if (!supabase) throw new Error('Supabase not configured')
  const ext = (file.name?.split('.').pop() || 'bin').toLowerCase()
  const safeBase = (file.name?.replace(/\.[^.]+$/, '') || 'image')
    .replace(/[^a-z0-9-_]+/gi, '-')
    .slice(0, 40)
  const path = `${folder}/${Date.now()}-${safeBase}.${ext}`

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (upErr) throw upErr

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)

  const row = {
    filename: file.name || path,
    storage_path: path,
    public_url: pub.publicUrl,
    alt: '',
    bytes: file.size ?? null,
  }
  const { error: insErr } = await supabase.from('media_library').insert(row)
  if (insErr) throw insErr

  return row
}

export async function listMediaLibrary() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('media_library')
    .select('id, filename, storage_path, public_url, alt, bytes, uploaded_at')
    .order('uploaded_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function deleteMediaItem(item) {
  if (!supabase) throw new Error('Supabase not configured')
  await supabase.storage.from(BUCKET).remove([item.storage_path])
  await supabase.from('media_library').delete().eq('id', item.id)
}

export async function updateMediaAlt(id, alt) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('media_library').update({ alt }).eq('id', id)
  if (error) throw error
}
