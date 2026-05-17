'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { THEMES, useTheme } from '@/lib/theme'

export function ThemePicker() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const current = THEMES.find(t => t.id === theme)!

  return (
    <div className="relative">
      {/* Trigger */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-all"
        style={{
          background: open ? 'var(--bg-hover)' : 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
        }}>
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: current.accent, boxShadow: `0 0 8px ${current.accent}80` }} />
        <span className="text-xs font-mono" style={{ color: 'var(--ink-dim)' }}>{current.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="text-xs" style={{ color: 'var(--ink-faint)', display: 'block' }}>▼</motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-full mt-2 z-50 rounded-xl p-2 min-w-[160px]"
              style={{
                background: 'rgba(12,14,20,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--border-bright)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
              }}>
              <div className="text-xs font-mono uppercase tracking-widest px-2 pb-2 mb-1"
                style={{ color: 'var(--ink-faint)', borderBottom: '1px solid var(--border)' }}>
                Accent
              </div>
              {THEMES.map(t => (
                <motion.button key={t.id} whileHover={{ x: 2 }} whileTap={{ scale: 0.96 }}
                  onClick={() => { setTheme(t.id); setOpen(false) }}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer text-left transition-colors"
                  style={{ background: theme === t.id ? 'rgba(255,255,255,0.06)' : 'transparent' }}>
                  <div className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ background: t.accent, boxShadow: `0 0 10px ${t.accent}60` }} />
                  <span className="text-sm font-medium flex-1" style={{ color: theme === t.id ? 'var(--ink)' : 'var(--ink-dim)' }}>
                    {t.label}
                  </span>
                  {theme === t.id && (
                    <span className="text-xs" style={{ color: t.accent }}>✓</span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
