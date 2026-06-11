import React, { createContext, useContext, useState, useCallback } from 'react'

const ModeContext = createContext(null)

const MODE_STORAGE_KEY = 'agri_mode'

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    const stored = localStorage.getItem(MODE_STORAGE_KEY)
    return stored === 'b2b' || stored === 'b2c' ? stored : 'b2c'
  })

  const setMode = useCallback((m) => {
    if (m === 'b2b' || m === 'b2c') {
      localStorage.setItem(MODE_STORAGE_KEY, m)
      setModeState(m)
    }
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'b2c' ? 'b2b' : 'b2c'
      localStorage.setItem(MODE_STORAGE_KEY, next)
      return next
    })
  }, [])

  const isB2B = mode === 'b2b'
  const isB2C = mode === 'b2c'

  const value = {
    mode,
    isB2B,
    isB2C,
    toggleMode,
    setMode,
  }

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export function useMode() {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}
