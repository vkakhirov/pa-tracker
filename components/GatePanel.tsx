'use client'
import { motion } from 'motion/react'
import type { Gate, GateStatus } from '@/lib/data'

interface GatePanelProps {
  gates: Gate[]
  gateStatuses: Record<string, GateStatus>
  onToggle: (id: string, status: GateStatus) => void
}

const CFG: Record<GateStatus, { icon: string; color: string; bg: string }> = {
  passed: { icon: '✓', color: 'var(--green)', bg: 'var(--green-dim)' },
  active: { icon: '◉', color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  locked: { icon: '◌', color: 'var(--ink-faint)', bg: 'var(--bg-hover)' },
}

export function GatePanel({ gates, gateStatuses, onToggle }: GatePanelProps) {
  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--ink-dim)' }}>Gates</h2>
      <div className="flex flex-col gap-3">
        {gates.map((gate, i) => {
          const status = gateStatuses[gate.id] ?? gate.status
          const cfg = CFG[status]
          return (
            <motion.div key={gate.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-lg p-3 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded text-xs font-bold flex-shrink-0"
                    style={{ background: cfg.bg, color: cfg.color }}>{cfg.icon}</span>
                  <div>
                    <div className="text-sm font-semibold leading-none">{gate.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--ink-dim)' }}>unlocks {gate.unlocksDay}</div>
                  </div>
                </div>
                {status !== 'locked' && (
                  <button onClick={() => onToggle(gate.id, status === 'passed' ? 'active' : 'passed')}
                    className="text-xs px-2 py-0.5 rounded cursor-pointer"
                    style={{ background: status === 'passed' ? 'var(--green-dim)' : 'var(--accent-dim)', color: status === 'passed' ? 'var(--green)' : 'var(--accent)' }}>
                    {status === 'passed' ? 'Passed ✓' : 'Mark passed'}
                  </button>
                )}
              </div>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--ink-dim)' }}>{gate.requirement}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {gate.linkedMistakes.map(ml => (
                  <span key={ml} className="text-xs px-1.5 py-0.5 rounded font-mono"
                    style={{ background: 'var(--red-dim)', color: 'var(--red)' }}>{ml}</span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
