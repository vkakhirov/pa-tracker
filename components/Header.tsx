'use client'
import { motion } from 'motion/react'

interface HeaderProps { streak: number; currentWeek: number; currentDay: number }

export function Header({ streak, currentWeek, currentDay }: HeaderProps) {
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  return (
    <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--accent)' }}>PA TRACKER</span>
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>Yandex</span>
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--ink-dim)' }}>
          Week {currentWeek} · Day {currentDay} · {today}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl">🔥</span>
        <div>
          <div className="text-lg font-bold leading-none" style={{ color: 'var(--yellow)' }}>{streak}</div>
          <div className="text-xs" style={{ color: 'var(--ink-faint)' }}>day streak</div>
        </div>
      </div>
    </motion.header>
  )
}
