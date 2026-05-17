'use client'
import { motion } from 'motion/react'

interface HabitItem { cue: string; action: string; duration: string }
interface HabitStackProps { habits: HabitItem[] }

const CUE_ICONS: Record<string, string> = {
  'Morning coffee': '☕',
  'Timer starts': '⏱',
  'After session': '🧠',
  'After dinner': '🌙',
  'Before sleep': '📝',
}

export function HabitStack({ habits }: HabitStackProps) {
  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--ink-faint)' }}>Habit Stack</h2>
      <div className="relative">
        {/* Connector line */}
        <div className="absolute left-[18px] top-4 bottom-4 w-px"
          style={{ background: 'linear-gradient(to bottom, var(--accent-glow), transparent)' }} />

        <div className="flex flex-col gap-2">
          {habits.map((h, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              className="flex items-center gap-3 pl-2 pr-3 py-2.5 rounded-xl relative"
              style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid var(--border)',
              }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                style={{ background: 'var(--accent-dim)', border: '1px solid rgba(79,142,247,0.15)' }}>
                {CUE_ICONS[h.cue] ?? '·'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs" style={{ color: 'var(--ink-faint)' }}>{h.cue}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--ink)' }}>→ {h.action}</div>
              </div>
              <span className="text-xs flex-shrink-0 px-1.5 py-0.5 rounded font-mono"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--ink-faint)' }}>
                {h.duration}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-3 p-3 rounded-xl relative overflow-hidden"
        style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.15)',
        }}>
        <div className="flex items-start gap-2.5">
          <span className="text-base flex-shrink-0 leading-tight">⚡</span>
          <div>
            <div className="text-xs font-semibold" style={{ color: 'var(--yellow)' }}>Never miss twice</div>
            <div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
              Miss once → recover next day. Two-minute rule: open one problem and read it. That counts.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
