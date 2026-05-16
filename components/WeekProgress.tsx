'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Week, ProblemStatus } from '@/lib/data'

interface WeekProgressProps {
  weeks: Week[]
  problemStatuses: Record<string, ProblemStatus>
  onSetStatus: (id: string, status: ProblemStatus) => void
  currentWeek: number
  currentDay: number
}

export function WeekProgress({ weeks, problemStatuses, onSetStatus, currentWeek, currentDay }: WeekProgressProps) {
  const [openWeek, setOpenWeek] = useState<number>(currentWeek)
  const [openDay, setOpenDay] = useState<number>(currentDay)

  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--ink-dim)' }}>Curriculum</h2>
      <div className="flex flex-col gap-2">
        {weeks.map(week => {
          const allProblems = week.days.flatMap(d => d.problems)
          const doneCount = allProblems.filter(p => (problemStatuses[p.id] ?? p.status) === 'done').length
          const progress = allProblems.length > 0 ? doneCount / allProblems.length : 0
          const isCurrentWeek = week.number === currentWeek
          const isOpen = openWeek === week.number

          return (
            <div key={week.number} className="rounded-lg border overflow-hidden"
              style={{ background: 'var(--bg-card)', borderColor: isCurrentWeek ? 'var(--border-bright)' : 'var(--border)' }}>
              <button onClick={() => setOpenWeek(isOpen ? 0 : week.number)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left cursor-pointer"
                style={{ background: isOpen ? 'var(--bg-hover)' : 'transparent' }}>
                <span className="text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded flex-shrink-0"
                  style={{ background: isCurrentWeek ? 'var(--accent-dim)' : 'var(--bg-hover)', color: isCurrentWeek ? 'var(--accent)' : 'var(--ink-faint)' }}>
                  {week.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Week {week.number}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--ink-dim)' }}>{week.focus}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {allProblems.length > 0 && (
                    <>
                      <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${progress * 100}%`, background: 'var(--green)' }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>{doneCount}/{allProblems.length}</span>
                    </>
                  )}
                  <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-2 flex flex-col gap-1">
                      {week.days.map(day => {
                        const isDayOpen = openDay === day.number && isOpen
                        const isCurrentDay = week.number === currentWeek && day.number === currentDay
                        const dayDone = day.problems.filter(p => (problemStatuses[p.id] ?? p.status) === 'done').length

                        return (
                          <div key={day.number} className="rounded overflow-hidden">
                            <button onClick={() => setOpenDay(isDayOpen ? 0 : day.number)}
                              className="w-full flex items-center gap-2 px-2 py-1.5 text-left cursor-pointer rounded"
                              style={{ background: isCurrentDay ? 'var(--accent-dim)' : isDayOpen ? 'var(--bg-hover)' : 'transparent' }}>
                              <span className="text-xs font-mono w-4 flex-shrink-0"
                                style={{ color: isCurrentDay ? 'var(--accent)' : 'var(--ink-faint)' }}>D{day.number}</span>
                              <span className="text-xs flex-1 truncate"
                                style={{ color: isCurrentDay ? 'var(--accent)' : 'var(--ink)' }}>{day.title}</span>
                              {day.problems.length > 0 && (
                                <span className="text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>{dayDone}/{day.problems.length}</span>
                              )}
                              {isCurrentDay && <span className="text-xs px-1 rounded" style={{ background: 'var(--accent)', color: '#fff' }}>today</span>}
                            </button>

                            <AnimatePresence>
                              {isDayOpen && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                  <div className="px-2 pb-2">
                                    {day.frog && (
                                      <div className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--ink-dim)' }}>
                                        <span>🐸</span> FROG: {day.frog}
                                      </div>
                                    )}
                                    {day.problems.map(p => {
                                      const status = problemStatuses[p.id] ?? p.status
                                      return (
                                        <div key={p.id} className="flex items-center gap-2 py-1 border-b" style={{ borderColor: 'var(--border)' }}>
                                          <button onClick={() => onSetStatus(p.id, status === 'done' ? 'pending' : 'done')}
                                            className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer"
                                            style={{ background: status === 'done' ? 'var(--green)' : 'transparent', borderColor: status === 'done' ? 'var(--green)' : 'var(--border-bright)' }}>
                                            {status === 'done' && <span className="text-xs text-white font-bold">✓</span>}
                                          </button>
                                          <div className="flex-1 min-w-0">
                                            {p.url ? (
                                              <a href={p.url} target="_blank" rel="noopener noreferrer"
                                                className="text-xs font-medium hover:underline"
                                                style={{ color: status === 'done' ? 'var(--ink-faint)' : 'var(--ink)', textDecoration: status === 'done' ? 'line-through' : 'none' }}>
                                                {p.leetcode && <span className="font-mono mr-1">#{p.leetcode}</span>}{p.title}
                                              </a>
                                            ) : (
                                              <span className="text-xs font-medium"
                                                style={{ color: status === 'done' ? 'var(--ink-faint)' : 'var(--ink)', textDecoration: status === 'done' ? 'line-through' : 'none' }}>
                                                {p.leetcode && <span className="font-mono mr-1">#{p.leetcode}</span>}{p.title}
                                              </span>
                                            )}
                                            <div className="text-xs" style={{ color: 'var(--ink-faint)' }}>{p.pattern}</div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                    {day.pandasTasks && (
                                      <div className="mt-2">
                                        <div className="text-xs font-mono uppercase mb-1" style={{ color: 'var(--purple)' }}>Pandas</div>
                                        {day.pandasTasks.map((t, i) => <div key={i} className="text-xs py-0.5" style={{ color: 'var(--ink-dim)' }}>· {t}</div>)}
                                      </div>
                                    )}
                                    {day.sqlTasks && (
                                      <div className="mt-2">
                                        <div className="text-xs font-mono uppercase mb-1" style={{ color: 'var(--yellow)' }}>SQL</div>
                                        {day.sqlTasks.map((t, i) => <div key={i} className="text-xs py-0.5" style={{ color: 'var(--ink-dim)' }}>· {t}</div>)}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
