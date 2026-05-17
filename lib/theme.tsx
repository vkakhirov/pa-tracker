'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type ThemeId = 'obsidian' | 'midnight' | 'forest' | 'warm'

export interface Theme {
  id: ThemeId
  label: string
  bg: string
  accent: string
  description: string
}

export const THEMES: Theme[] = [
  {
    id: 'obsidian',
    label: 'Obsidian',
    bg: '#060609',
    accent: '#4f8ef7',
    description: 'Cold blue-black',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    bg: '#020817',
    accent: '#818cf8',
    description: 'Deep navy',
  },
  {
    id: 'forest',
    label: 'Forest',
    bg: '#020d07',
    accent: '#34d399',
    description: 'Dark emerald',
  },
  {
    id: 'warm',
    label: 'Warm',
    bg: '#0d0905',
    accent: '#fb923c',
    description: 'Charcoal amber',
  },
]

const STORAGE_KEY = 'pa-tracker-theme'

const ThemeCtx = createContext<{
  theme: ThemeId
  setTheme: (t: ThemeId) => void
}>({ theme: 'obsidian', setTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('obsidian')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    if (stored && THEMES.find(t => t.id === stored)) setThemeState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return (
    <ThemeCtx.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeCtx)
}
