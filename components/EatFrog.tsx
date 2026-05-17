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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border-2 p-4"
      style={{ background: 'linear-gradient(135deg, #1a1200 0%, #2a1e00 100%)', borderColor: 'var(--yellow)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🐸</span>
        <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--yellow)' }}>
          Eat The Frog First
        </span>
        <span className="ml-auto text-xs px-1.5 py-0.5 rounded font-mono"
          style={{ background: 'var(--yellow-dim)', color: 'var(--yellow)' }}>
          W{currentWeek}D{currentDay}
        </span>
      </div>
      <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
        {frog}
      </p>
      <p className="text-xs mt-2" style={{ color: 'var(--ink-dim)' }}>
        Do this before anything else. No email, no Slack, no warm-up.
      </p>
    </motion.div>
  )
}
