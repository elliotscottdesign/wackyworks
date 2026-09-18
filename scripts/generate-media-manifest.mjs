#!/usr/bin/env node
// Scan public/ for images and write public/media-manifest.json so
// the admin MediaPicker can list every built-in asset without
// hitting Supabase Storage for the whole library. Runs from the
// npm "prebuild" script so the manifest is always up to date on
// GitHub Actions.
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(HERE, '..', 'public')
const OUT = path.join(PUBLIC, 'media-manifest.json')
const IMG_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i

const SKIP_DIRS = new Set([
  '.DS_Store',
  'media', // don't list Supabase-mirrored assets
])
const SKIP_FILES = new Set(['favicon.ico', 'media-manifest.json', 'CNAME'])

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      await walk(full, out)
    } else if (IMG_EXT.test(e.name) && !SKIP_FILES.has(e.name)) {
      out.push(full)
    }
  }
  return out
}

const files = await walk(PUBLIC)
const images = files
  .map((full) => {
    const rel = '/' + path.relative(PUBLIC, full).split(path.sep).join('/')
    const folder = path.dirname(rel).replace(/^\//, '') || 'root'
    return { path: rel, filename: path.basename(rel), folder }
  })
  .sort((a, b) => a.path.localeCompare(b.path))

const manifest = {
  generated_at: new Date().toISOString(),
  count: images.length,
  images,
}

await fs.writeFile(OUT, JSON.stringify(manifest, null, 2))
console.log(`[media-manifest] wrote ${images.length} images → ${OUT}`)
