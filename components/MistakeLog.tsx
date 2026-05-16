'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Mistake, MistakeStatus } from '@/lib/data'

interface MistakeLogProps {
  mistakes: Mistake[]
  remediationDone: Record<string, boolean[]>
  onToggleRemediation: (mistakeId: string, index: number, total: number) => void
}

const CFG: Record<MistakeStatus, { color: string; bg: string }> = {
  active:     { color: 'var(--red)',    bg: 'var(--red-dim)' },
  gated:      { color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  remediated: { color: 'var(--green)',  bg: 'var(--green-dim)' },
}

export function MistakeLog({ mistakes, remediationDone, onToggleRemediation }: MistakeLogProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const activeCount = mistakes.filter(m => m.status !== 'remediated').length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--ink-dim)' }}>Mistake Log</h2>
        <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'var(--red-dim)', color: 'var(--red)' }}>{activeCount} active</span>
      </div>
      <div className="flex flex-col gap-2">
        {mistakes.map((mistake, i) => {
          const cfg = CFG[mistake.status]
          const isOpen = expanded === mistake.id
          const done = remediationDone[mistake.id] ?? mistake.remediationDone
          const doneCount = done.filter(Boolean).length
          const progress = done.length > 0 ? doneCount / done.length : 0

          return (
            <motion.div key={mistake.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-lg border overflow-hidden"
              style={{ background: 'var(--bg-card)', borderColor: isOpen ? 'var(--border-bright)' : 'var(--border)' }}>
              <button onClick={() => setExpanded(isOpen ? null : mistake.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left cursor-pointer"
                style={{ background: isOpen ? 'var(--bg-hover)' : 'transparent' }}>
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: cfg.bg, color: cfg.color }}>{mistake.id}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{mistake.problem}</div>
                  <div className="text-xs" style={{ color: 'var(--ink-dim)' }}>{mistake.week} · {mistake.date}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {done.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${progress * 100}%`, background: progress === 1 ? 'var(--green)' : 'var(--accent)' }} />
                      </div>
                      <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>{doneCount}/{done.length}</span>
                    </div>
                  )}
                  <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-3 pb-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="mt-3">
                        <div className="text-xs font-mono uppercase tracking-wide mb-2" style={{ color: 'var(--ink-dim)' }}>Bugs</div>
                        {mistake.bugs.map((bug, j) => (
                          <div key={j} className="flex gap-2 text-xs mb-1.5">
                            <code className="px-1.5 py-0.5 rounded flex-shrink-0"
                              style={{ background: 'var(--red-dim)', color: 'var(--red)', fontFamily: 'monospace' }}>{bug.line}</code>
                            <span style={{ color: 'var(--ink-dim)' }}>{bug.explanation}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <div className="text-xs font-mono uppercase tracking-wide mb-1" style={{ color: 'var(--ink-dim)' }}>Root cause</div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-dim)' }}>{mistake.rootCause}</p>
                      </div>
                      <div className="mt-3">
                        <div className="text-xs font-mono uppercase tracking-wide mb-2" style={{ color: 'var(--ink-dim)' }}>Remediation</div>
                        {mistake.remediation.map((r, j) => (
                          <label key={j} className="flex items-start gap-2 cursor-pointer mb-1.5">
                            <input type="checkbox" checked={done[j] ?? false}
                              onChange={() => onToggleRemediation(mistake.id, j, mistake.remediation.length)}
                              className="mt-0.5 flex-shrink-0 accent-green-500" />
                            <span className="text-xs leading-relaxed"
                              style={{ color: done[j] ? 'var(--ink-faint)' : 'var(--ink-dim)', textDecoration: done[j] ? 'line-through' : 'none' }}>{r}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
