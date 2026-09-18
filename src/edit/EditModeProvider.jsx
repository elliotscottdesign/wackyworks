// Edit-mode context. Adding ?edit=1 to any URL flips edit mode on
// and stores the flag in sessionStorage so navigations within the
// site keep it on. Only fires the switch if a Supabase session is
// present — no random visitor can turn on edit mode themselves.
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const KEY = 'wackyworks.editMode'
const EditModeContext = createContext({ editMode: false, canEdit: false, toggle: () => {} })

export function EditModeProvider({ children }) {
  const [canEdit, setCanEdit] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Track auth session (any signed-in user can edit — RLS also enforces).
  useEffect(() => {
    let mounted = true
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (mounted) setCanEdit(!!data?.session)
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setCanEdit(!!session)
    })
    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  // Read initial edit state from URL (?edit=1) or sessionStorage.
  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.get('edit') === '1') {
        sessionStorage.setItem(KEY, '1')
      }
      setEditMode(sessionStorage.getItem(KEY) === '1')
    } catch {
      /* private mode etc. */
    }
  }, [])

  const toggle = useCallback(() => {
    setEditMode((prev) => {
      const next = !prev
      try {
        if (next) sessionStorage.setItem(KEY, '1')
        else sessionStorage.removeItem(KEY)
      } catch {}
      return next
    })
  }, [])

  const on = canEdit && editMode
  return (
    <EditModeContext.Provider value={{ editMode: on, canEdit, toggle }}>
      {children}
    </EditModeContext.Provider>
  )
}

export const useEditMode = () => useContext(EditModeContext)
