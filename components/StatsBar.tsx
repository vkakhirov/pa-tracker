'use client'
import { motion } from 'motion/react'
import type { Week, ProblemStatus } from '@/lib/data'

interface AreaWeight { area: string; weight: number; focus: string }
interface StatsBarProps {
  weeks: Week[]
  problemStatuses: Record<string, ProblemStatus>
  completedDates: string[]
  areaWeights: AreaWeight[]
}

export function StatsBar({ weeks, problemStatuses, completedDates, areaWeights }: StatsBarProps) {
  const allProblems = weeks.flatMap(w => w.days.flatMap(d => d.problems))
  const totalDone = allProblems.filter(p => (problemStatuses[p.id] ?? p.status) === 'done').length

  const stats = [
    { label: 'Problems solved', value: `${totalDone}/${allProblems.length}`, color: 'var(--green)' },
    { label: 'Sessions logged', value: completedDates.length, color: 'var(--accent)' },
    { label: 'Weeks planned', value: weeks.length, color: 'var(--purple)' },
    { label: 'Days logged', value: completedDates.length, color: 'var(--yellow)' },
  ]

  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="px-6 py-3 flex items-center gap-6 overflow-x-auto border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--ink-faint)' }}>Priority:</span>
        {areaWeights.map(a => (
          <div key={a.area} className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-1.5 h-3 rounded-sm"
                  style={{ background: i < a.weight ? 'var(--accent)' : 'var(--border)' }} />
              ))}
            </div>
            <span className="text-xs" style={{ color: a.weight >= 4 ? 'var(--ink)' : 'var(--ink-dim)' }}>{a.area}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="px-6 py-3 border-r last:border-r-0 flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
            <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <div>
              <div className="text-sm font-bold leading-none" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--ink-dim)' }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
