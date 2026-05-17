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
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer"
        style={{
          background: open ? 'var(--bg-hover)' : 'var(--bg-glass)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(8px)',
        }}>
        {/* Mini bg + accent preview */}
        <div className="relative w-4 h-4 rounded-md overflow-hidden flex-shrink-0 border"
          style={{ borderColor: 'var(--border-bright)' }}>
          <div className="absolute inset-0" style={{ background: current.bg }} />
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-tl-sm" style={{ background: current.accent }} />
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--ink-dim)' }}>{current.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          style={{ color: 'var(--ink-faint)', fontSize: '10px', display: 'block' }}>▼</motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-full mt-2 z-50 p-2 min-w-[190px]"
              style={{
                background: 'rgba(8,10,16,0.97)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid var(--border-bright)',
                borderRadius: '14px',
                boxShadow: '0 20px 48px rgba(0,0,0,0.7)',
              }}>
              <div className="text-xs font-mono uppercase tracking-widest px-2 pb-2 mb-1 font-semibold"
                style={{ color: 'var(--ink-faint)', borderBottom: '1px solid var(--border)' }}>
                Theme
              </div>
              {THEMES.map(t => (
                <motion.button key={t.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setTheme(t.id); setOpen(false) }}
                  className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer text-left"
                  style={{ background: theme === t.id ? 'rgba(255,255,255,0.06)' : 'transparent' }}>
                  {/* Background + accent swatch */}
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border"
                    style={{ borderColor: theme === t.id ? t.accent + '80' : t.id === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)' }}>
                    <div className="absolute inset-0" style={{ background: t.bg }} />
                    {/* Grid lines to show texture */}
                    <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: `repeating-linear-gradient(45deg, ${t.accent}30 0px, ${t.accent}30 1px, transparent 1px, transparent 4px)` }} />
                    {/* Accent corner */}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-tl-md"
                      style={{ background: t.accent, boxShadow: `0 0 6px ${t.accent}80` }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold leading-tight"
                      style={{ color: theme === t.id ? 'var(--ink)' : 'var(--ink-dim)' }}>
                      {t.label}
                    </div>
                    <div className="text-xs leading-tight mt-0.5" style={{ color: 'var(--ink-faint)' }}>
                      {t.description}
                    </div>
                  </div>

                  {theme === t.id && (
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: t.accent }}>✓</span>
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
