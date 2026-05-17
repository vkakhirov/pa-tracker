'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Mistake, MistakeStatus } from '@/lib/data'

interface MistakeLogProps {
  mistakes: Mistake[]
  remediationDone: Record<string, boolean[]>
  onToggleRemediation: (mistakeId: string, index: number, total: number) => void
}

const CFG: Record<MistakeStatus, { color: string; bg: string; border: string }> = {
  active:     { color: 'var(--red)',    bg: 'var(--red-dim)',    border: 'rgba(239,68,68,0.2)' },
  gated:      { color: 'var(--yellow)', bg: 'var(--yellow-dim)', border: 'rgba(245,158,11,0.2)' },
  remediated: { color: 'var(--green)',  bg: 'var(--green-dim)',  border: 'rgba(34,197,94,0.2)' },
}

export function MistakeLog({ mistakes, remediationDone, onToggleRemediation }: MistakeLogProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const activeCount = mistakes.filter(m => m.status !== 'remediated').length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: 'var(--ink-faint)' }}>Mistake Log</h2>
        <motion.span
          animate={{ opacity: activeCount > 0 ? [1, 0.6, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs px-2 py-0.5 rounded-full font-mono"
          style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {activeCount} active
        </motion.span>
      </div>
      <div className="flex flex-col gap-2">
        {mistakes.map((mistake, i) => {
          const cfg = CFG[mistake.status]
          const isOpen = expanded === mistake.id
          const done = remediationDone[mistake.id] ?? mistake.remediationDone
          const doneCount = done.filter(Boolean).length
          const progress = done.length > 0 ? doneCount / done.length : 0

          return (
            <motion.div key={mistake.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: `1px solid ${isOpen ? cfg.border : 'var(--border)'}`,
                transition: 'border-color 0.2s',
              }}>
              <button onClick={() => setExpanded(isOpen ? null : mistake.id)}
                className="w-full flex items-center gap-3 px-3.5 py-3 text-left cursor-pointer"
                style={{ background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg flex-shrink-0"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {mistake.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{mistake.problem}</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--ink-faint)' }}>{mistake.week} · {mistake.date}</div>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {done.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <motion.div className="h-full rounded-full"
                          animate={{ width: `${progress * 100}%` }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          style={{ background: progress === 1 ? 'var(--green)' : 'var(--accent)' }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>{doneCount}/{done.length}</span>
                    </div>
                  )}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                    className="text-xs" style={{ color: 'var(--ink-faint)', display: 'block' }}>▼</motion.span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden">
                    <div className="px-3.5 pb-3.5 border-t" style={{ borderColor: 'var(--border)' }}>
                      {/* Bugs */}
                      <div className="mt-3">
                        <div className="text-xs font-mono uppercase tracking-wide mb-2" style={{ color: 'var(--ink-faint)' }}>Bugs</div>
                        <div className="flex flex-col gap-1.5">
                          {mistake.bugs.map((bug, j) => (
                            <motion.div key={j}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.05 }}
                              className="flex gap-2 text-xs items-start">
                              <code className="px-1.5 py-0.5 rounded-lg flex-shrink-0 text-xs leading-relaxed"
                                style={{
                                  background: 'var(--red-dim)',
                                  color: 'var(--red)',
                                  border: '1px solid rgba(239,68,68,0.15)',
                                  fontFamily: 'var(--font-mono)',
                                }}>
                                {bug.line}
                              </code>
                              <span style={{ color: 'var(--ink-dim)' }}>{bug.explanation}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Root cause */}
                      <div className="mt-3 p-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
                        <div className="text-xs font-mono uppercase tracking-wide mb-1" style={{ color: 'var(--ink-faint)' }}>Root cause</div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-dim)' }}>{mistake.rootCause}</p>
                      </div>

                      {/* Remediation */}
                      <div className="mt-3">
                        <div className="text-xs font-mono uppercase tracking-wide mb-2" style={{ color: 'var(--ink-faint)' }}>Remediation</div>
                        <div className="flex flex-col gap-1.5">
                          {mistake.remediation.map((r, j) => (
                            <motion.label key={j}
                              whileHover={{ x: 1 }}
                              className="flex items-start gap-2.5 cursor-pointer group">
                              <div
                                onClick={() => onToggleRemediation(mistake.id, j, mistake.remediation.length)}
                                className="mt-0.5 flex-shrink-0 w-4 h-4 rounded flex items-center justify-center cursor-pointer transition-all duration-200"
                                style={{
                                  background: done[j] ? 'var(--green)' : 'transparent',
                                  border: `1.5px solid ${done[j] ? 'var(--green)' : 'var(--border-bright)'}`,
                                  boxShadow: done[j] ? '0 0 8px var(--green-glow)' : 'none',
                                }}>
                                {done[j] && <span className="text-xs text-white font-bold leading-none">✓</span>}
                              </div>
                              <span className="text-xs leading-relaxed"
                                style={{ color: done[j] ? 'var(--ink-faint)' : 'var(--ink-dim)', textDecoration: done[j] ? 'line-through' : 'none' }}>
                                {r}
                              </span>
                            </motion.label>
                          ))}
                        </div>
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
