'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type ThemeId = 'obsidian' | 'violet' | 'emerald' | 'rose'

export interface Theme {
  id: ThemeId
  label: string
  accent: string
  preview: string
}

export const THEMES: Theme[] = [
  { id: 'obsidian', label: 'Obsidian', accent: '#4f8ef7', preview: '#4f8ef7' },
  { id: 'violet',   label: 'Violet',   accent: '#8b5cf6', preview: '#8b5cf6' },
  { id: 'emerald',  label: 'Emerald',  accent: '#10b981', preview: '#10b981' },
  { id: 'rose',     label: 'Rose',     accent: '#f43f5e', preview: '#f43f5e' },
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
