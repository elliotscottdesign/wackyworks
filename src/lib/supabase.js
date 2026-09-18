// Single Supabase client instance for the whole app.
//
// The anon public key is safe to ship in the client bundle — Row
// Level Security enforces who can actually read/write. Env vars
// override the defaults so we can point a dev build at a different
// project without editing this file.
import { createClient } from '@supabase/supabase-js'

const DEFAULT_URL = 'https://vvsrtrjbedsnnmafcajj.supabase.co'
const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2c3J0cmpiZWRzbm5tYWZjYWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MTI1ODgsImV4cCI6MjEwNTI4ODU4OH0.ffmVFaOS9Ikq4Hd60htrcxOchcSnSmNyOD2sJ8VPCw8'

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: 'wackyworks.auth',
  },
})

export const hasSupabase = () => true
