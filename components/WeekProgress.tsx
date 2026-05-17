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

const WEEK_COLORS = ['var(--accent)', 'var(--purple)', 'var(--green)', 'var(--yellow)']

export function WeekProgress({ weeks, problemStatuses, onSetStatus, currentWeek, currentDay }: WeekProgressProps) {
  const [openWeek, setOpenWeek] = useState<number>(currentWeek)
  const [openDay, setOpenDay] = useState<number>(currentDay)

  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--ink-faint)' }}>Curriculum</h2>
      <div className="flex flex-col gap-2.5">
        {weeks.map((week, wi) => {
          const color = WEEK_COLORS[wi] ?? 'var(--accent)'
          const allProblems = week.days.flatMap(d => d.problems)
          const doneCount = allProblems.filter(p => (problemStatuses[p.id] ?? p.status) === 'done').length
          const progress = allProblems.length > 0 ? doneCount / allProblems.length : 0
          const isCurrentWeek = week.number === currentWeek
          const isOpen = openWeek === week.number

          return (
            <div key={week.number} className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${isCurrentWeek ? `${color}40` : 'var(--border)'}`,
                boxShadow: isCurrentWeek ? `0 0 20px ${color}18` : 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}>
              <button onClick={() => setOpenWeek(isOpen ? 0 : week.number)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
                style={{ background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                {/* Week number badge */}
                <div className="relative flex-shrink-0">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold font-mono"
                    style={{ background: isCurrentWeek ? `${color}22` : 'rgba(255,255,255,0.05)', color: isCurrentWeek ? color : 'var(--ink-faint)' }}>
                    {week.number}
                  </span>
                  {isCurrentWeek && (
                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-lg"
                      style={{ background: color, opacity: 0.15 }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: isCurrentWeek ? 'var(--ink)' : 'var(--ink-dim)' }}>
                    Week {week.number}
                    {isCurrentWeek && <span className="ml-2 text-xs px-1 rounded font-mono"
                      style={{ background: `${color}22`, color }}>active</span>}
                  </div>
                  <div className="text-xs truncate mt-0.5" style={{ color: 'var(--ink-faint)' }}>{week.focus}</div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {allProblems.length > 0 && (
                    <>
                      <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <motion.div className="h-full rounded-full"
                          animate={{ width: `${progress * 100}%` }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          style={{ background: color }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>{doneCount}/{allProblems.length}</span>
                    </>
                  )}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xs" style={{ color: 'var(--ink-faint)', display: 'block' }}>▼</motion.span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-2.5 flex flex-col gap-1">
                      {week.days.map(day => {
                        const isDayOpen = openDay === day.number && isOpen
                        const isCurrentDay = week.number === currentWeek && day.number === currentDay
                        const dayDone = day.problems.filter(p => (problemStatuses[p.id] ?? p.status) === 'done').length

                        return (
                          <div key={day.number} className="rounded-lg overflow-hidden">
                            <button onClick={() => setOpenDay(isDayOpen ? 0 : day.number)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left cursor-pointer rounded-lg transition-colors"
                              style={{ background: isCurrentDay ? `${color}12` : isDayOpen ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                              <span className="text-xs font-mono w-5 flex-shrink-0"
                                style={{ color: isCurrentDay ? color : 'var(--ink-faint)' }}>D{day.number}</span>
                              <span className="text-xs flex-1 truncate font-medium"
                                style={{ color: isCurrentDay ? 'var(--ink)' : 'var(--ink-dim)' }}>{day.title}</span>
                              {day.problems.length > 0 && (
                                <span className="text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>{dayDone}/{day.problems.length}</span>
                              )}
                              {isCurrentDay && (
                                <span className="text-xs px-1.5 py-0.5 rounded font-mono"
                                  style={{ background: `${color}22`, color }}>today</span>
                              )}
                            </button>

                            <AnimatePresence>
                              {isDayOpen && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                  transition={{ duration: 0.22 }} className="overflow-hidden">
                                  <div className="px-2.5 pb-2.5 pt-1">
                                    {day.frog && (
                                      <div className="flex items-center gap-1.5 mb-2.5 px-2 py-1.5 rounded-lg"
                                        style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
                                        <span className="text-sm">🐸</span>
                                        <span className="text-xs" style={{ color: 'var(--yellow)' }}>FROG: {day.frog}</span>
                                      </div>
                                    )}
                                    {day.problems.map((p, pi) => {
                                      const status = problemStatuses[p.id] ?? p.status
                                      return (
                                        <motion.div key={p.id}
                                          initial={{ opacity: 0, x: -4 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: pi * 0.04 }}
                                          className="flex items-center gap-2 py-1.5 border-b last:border-b-0"
                                          style={{ borderColor: 'var(--border)' }}>
                                          <motion.button
                                            whileTap={{ scale: 0.85 }}
                                            onClick={() => onSetStatus(p.id, status === 'done' ? 'pending' : 'done')}
                                            className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center cursor-pointer transition-all duration-200"
                                            style={{
                                              background: status === 'done' ? 'var(--green)' : 'transparent',
                                              border: `1.5px solid ${status === 'done' ? 'var(--green)' : 'var(--border-bright)'}`,
                                              boxShadow: status === 'done' ? '0 0 8px var(--green-glow)' : 'none',
                                            }}>
                                            {status === 'done' && <span className="text-xs text-white font-bold">✓</span>}
                                          </motion.button>
                                          <div className="flex-1 min-w-0">
                                            {p.url ? (
                                              <a href={p.url} target="_blank" rel="noopener noreferrer"
                                                className="text-xs font-medium hover:underline"
                                                style={{ color: status === 'done' ? 'var(--ink-faint)' : 'var(--ink)', textDecoration: status === 'done' ? 'line-through' : 'none' }}>
                                                {p.leetcode && <span className="font-mono mr-1" style={{ color: 'var(--ink-faint)' }}>#{p.leetcode}</span>}
                                                {p.title}
                                              </a>
                                            ) : (
                                              <span className="text-xs font-medium"
                                                style={{ color: status === 'done' ? 'var(--ink-faint)' : 'var(--ink)', textDecoration: status === 'done' ? 'line-through' : 'none' }}>
                                                {p.leetcode && <span className="font-mono mr-1" style={{ color: 'var(--ink-faint)' }}>#{p.leetcode}</span>}
                                                {p.title}
                                              </span>
                                            )}
                                            <div className="text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>{p.pattern}</div>
                                          </div>
                                        </motion.div>
                                      )
                                    })}
                                    {day.pandasTasks && (
                                      <div className="mt-2.5">
                                        <div className="text-xs font-mono uppercase mb-1.5" style={{ color: 'var(--purple)' }}>Pandas</div>
                                        {day.pandasTasks.map((t, ti) => (
                                          <div key={ti} className="text-xs py-0.5 font-mono" style={{ color: 'var(--ink-dim)' }}>· {t}</div>
                                        ))}
                                      </div>
                                    )}
                                    {day.sqlTasks && (
                                      <div className="mt-2.5">
                                        <div className="text-xs font-mono uppercase mb-1.5" style={{ color: 'var(--yellow)' }}>SQL</div>
                                        {day.sqlTasks.map((t, ti) => (
                                          <div key={ti} className="text-xs py-0.5 font-mono" style={{ color: 'var(--ink-dim)' }}>· {t}</div>
                                        ))}
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
