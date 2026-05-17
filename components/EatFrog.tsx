'use client'
import { motion } from 'motion/react'
import type { Week } from '@/lib/data'

interface EatFrogProps {
  weeks: Week[]
  currentWeek: number
  currentDay: number
}

export function EatFrog({ weeks, currentWeek, currentDay }: EatFrogProps) {
  const week = weeks.find(w => w.number === currentWeek)
  const day = week?.days.find(d => d.number === currentDay)
  const frog = day?.frog ?? week?.days[0]?.frog ?? 'Start with the hardest task first'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(249,115,22,0.07) 100%)',
        border: '1px solid rgba(245,158,11,0.25)',
        boxShadow: '0 0 32px rgba(245,158,11,0.12), inset 0 1px 0 rgba(245,158,11,0.1)',
      }}>
      {/* Ambient glow blob */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)' }} />

      <div className="relative p-4">
        {/* Label row */}
        <div className="flex items-center gap-2 mb-3">
          <motion.span
            animate={{ rotate: [0, -8, 8, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            className="text-xl leading-none">
            🐸
          </motion.span>
          <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--yellow)' }}>
            Eat The Frog First
          </span>
          <span className="ml-auto text-xs px-1.5 py-0.5 rounded font-mono"
            style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--yellow)', border: '1px solid rgba(245,158,11,0.2)' }}>
            W{currentWeek} · D{currentDay}
          </span>
        </div>

        {/* Frog task */}
        <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
          {frog}
        </p>

        {/* Subline */}
        <div className="flex items-center gap-1.5 mt-3 pt-3"
          style={{ borderTop: '1px solid rgba(245,158,11,0.1)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--yellow)' }} />
          <p className="text-xs" style={{ color: 'var(--ink-dim)' }}>
            Before email. Before warm-up. This task first.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
