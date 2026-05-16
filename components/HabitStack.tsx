'use client'
import { motion } from 'motion/react'

interface HabitItem { cue: string; action: string; duration: string }
interface HabitStackProps { habits: HabitItem[] }

export function HabitStack({ habits }: HabitStackProps) {
  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--ink-dim)' }}>Habit Stack</h2>
      <div className="flex flex-col gap-2">
        {habits.map((h, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-2.5 rounded-lg border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="flex-shrink-0 w-1.5 h-6 rounded-full" style={{ background: 'var(--accent-dim)' }} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium" style={{ color: 'var(--ink-dim)' }}>{h.cue}</div>
              <div className="text-xs" style={{ color: 'var(--ink)' }}>→ {h.action}</div>
            </div>
            <span className="text-xs flex-shrink-0 px-1.5 py-0.5 rounded"
              style={{ background: 'var(--bg-hover)', color: 'var(--ink-faint)' }}>{h.duration}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 p-3 rounded-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-start gap-2">
          <span className="text-sm flex-shrink-0">⚡</span>
          <div>
            <div className="text-xs font-semibold" style={{ color: 'var(--yellow)' }}>Never miss twice</div>
            <div className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
              Miss once → recover next day. Two-minute rule: open one problem and read it. That counts.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
