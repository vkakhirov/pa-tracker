'use client'
import { motion } from 'motion/react'
import type { Gate, GateStatus } from '@/lib/data'

interface GatePanelProps {
  gates: Gate[]
  gateStatuses: Record<string, GateStatus>
  onToggle: (id: string, status: GateStatus) => void
}

const CFG: Record<GateStatus, { icon: string; color: string; bg: string; border: string; glow: string }> = {
  passed: { icon: '✓', color: 'var(--green)',  bg: 'var(--green-dim)',  border: 'rgba(34,197,94,0.25)',  glow: 'var(--green-glow)' },
  active: { icon: '◉', color: 'var(--yellow)', bg: 'var(--yellow-dim)', border: 'rgba(245,158,11,0.25)', glow: 'var(--yellow-glow)' },
  locked: { icon: '◌', color: 'var(--ink-faint)', bg: 'var(--border)', border: 'transparent', glow: 'transparent' },
}

export function GatePanel({ gates, gateStatuses, onToggle }: GatePanelProps) {
  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--ink-faint)' }}>Gates</h2>
      <div className="flex flex-col gap-2.5">
        {gates.map((gate, i) => {
          const status = gateStatuses[gate.id] ?? gate.status
          const cfg = CFG[status]
          return (
            <motion.div key={gate.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              className="rounded-xl p-3.5 relative overflow-hidden"
              style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${cfg.border}`,
                boxShadow: `0 0 16px ${cfg.glow}30`,
              }}>
              {/* Top-edge highlight */}
              <div className="absolute top-0 left-4 right-4 h-px rounded-full"
                style={{ background: `linear-gradient(to right, transparent, ${cfg.color}40, transparent)` }} />

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <motion.span
                    animate={status === 'active' ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                    className="flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold flex-shrink-0"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.icon}
                  </motion.span>
                  <div>
                    <div className="text-sm font-semibold leading-none">{gate.label}</div>
                    <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--ink-faint)' }}>unlocks {gate.unlocksDay}</div>
                  </div>
                </div>
                {status !== 'locked' && (
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onToggle(gate.id, status === 'passed' ? 'active' : 'passed')}
                    className="text-xs px-2.5 py-1 rounded-lg cursor-pointer font-mono flex-shrink-0"
                    style={{
                      background: status === 'passed' ? 'var(--green-dim)' : 'var(--accent-dim)',
                      color: status === 'passed' ? 'var(--green)' : 'var(--accent)',
                      border: `1px solid ${status === 'passed' ? 'rgba(34,197,94,0.2)' : 'rgba(79,142,247,0.2)'}`,
                    }}>
                    {status === 'passed' ? 'Passed ✓' : 'Mark passed'}
                  </motion.button>
                )}
              </div>
              <p className="text-xs mt-2.5 leading-relaxed" style={{ color: 'var(--ink-dim)' }}>{gate.requirement}</p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {gate.linkedMistakes.map(ml => (
                  <span key={ml} className="text-xs px-1.5 py-0.5 rounded font-mono"
                    style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    {ml}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
