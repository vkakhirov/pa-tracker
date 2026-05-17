'use client'
import { motion } from 'motion/react'

interface HeaderProps { streak: number; currentWeek: number; currentDay: number }

export function Header({ streak, currentWeek, currentDay }: HeaderProps) {
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{
        borderColor: 'var(--border)',
        background: 'rgba(6,6,9,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
      {/* Left: wordmark */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-7 h-7 rounded-lg"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)' }}>
          <span className="text-xs font-bold font-mono" style={{ color: 'var(--accent)' }}>PA</span>
          <div className="absolute inset-0 rounded-lg" style={{ boxShadow: '0 0 12px var(--accent-glow)' }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: 'var(--ink)' }}>PA Tracker</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(79,142,247,0.2)' }}>
              Yandex
            </span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>
            Week {currentWeek} · Day {currentDay} · {today}
          </div>
        </div>
      </div>

      {/* Right: streak */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
        style={{ background: 'var(--yellow-dim)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div className="relative">
          <div className="text-lg leading-none">🔥</div>
          <div className="absolute -inset-1 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />
        </div>
        <div>
          <div className="text-base font-bold leading-none font-mono" style={{ color: 'var(--yellow)' }}>{streak}</div>
          <div className="text-xs" style={{ color: 'var(--ink-faint)' }}>streak</div>
        </div>
      </motion.div>
    </motion.header>
  )
}
