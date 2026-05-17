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

const AREA_COLORS: Record<string, string> = {
  'SQL': 'var(--yellow)',
  'Python / pandas': 'var(--purple)',
  'Product metrics': 'var(--accent)',
  'Basic Python logic': 'var(--green)',
  'Hard algorithms': 'var(--ink-faint)',
}

export function StatsBar({ weeks, problemStatuses, completedDates, areaWeights }: StatsBarProps) {
  const allProblems = weeks.flatMap(w => w.days.flatMap(d => d.problems))
  const totalDone = allProblems.filter(p => (problemStatuses[p.id] ?? p.status) === 'done').length
  const pct = allProblems.length > 0 ? Math.round((totalDone / allProblems.length) * 100) : 0

  const stats = [
    { label: 'Solved', value: `${totalDone}/${allProblems.length}`, sub: `${pct}% complete`, color: 'var(--green)', glow: 'var(--green-glow)' },
    { label: 'Sessions', value: completedDates.length, sub: 'logged', color: 'var(--accent)', glow: 'var(--accent-glow)' },
    { label: 'Weeks', value: weeks.length, sub: 'planned', color: 'var(--purple)', glow: 'var(--purple-glow)' },
    { label: 'Days', value: completedDates.length, sub: 'active', color: 'var(--yellow)', glow: 'var(--yellow-glow)' },
  ]

  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      {/* Priority weights */}
      <div className="px-6 py-2.5 flex items-center gap-5 overflow-x-auto border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}>
        <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--ink-faint)' }}>Priority</span>
        {areaWeights.map((a) => {
          const color = AREA_COLORS[a.area] ?? 'var(--ink-faint)'
          return (
            <div key={a.area} className="flex items-center gap-2 flex-shrink-0">
              <div className="flex gap-0.5 items-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-1 rounded-sm transition-all"
                    style={{
                      height: `${8 + i * 2}px`,
                      background: i < a.weight ? color : 'var(--border)',
                      opacity: i < a.weight ? 1 : 0.4,
                    }} />
                ))}
              </div>
              <span className="text-xs font-mono" style={{ color: a.weight >= 4 ? color : 'var(--ink-dim)' }}>{a.area}</span>
            </div>
          )
        })}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="px-6 py-3.5 border-r last:border-r-0 flex items-center gap-3 group"
            style={{ borderColor: 'var(--border)' }}>
            <div className="w-0.5 h-7 rounded-full flex-shrink-0 transition-all duration-300"
              style={{ background: `linear-gradient(to bottom, ${s.color}, transparent)` }} />
            <div>
              <div className="text-lg font-bold leading-none font-mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--ink-faint)' }}>
                {s.label} <span style={{ color: 'var(--ink-faint)', opacity: 0.6 }}>· {s.sub}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
