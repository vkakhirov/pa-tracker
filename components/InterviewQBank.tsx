'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { INTERVIEW_QUESTIONS } from '@/lib/data'
import type { InterviewQuestion } from '@/lib/data'

type Topic = InterviewQuestion['topic']

const TOPIC_META: Record<Topic, { color: string; bg: string; icon: string; obsidianFile: string }> = {
  'SQL':             { color: 'var(--yellow)',  bg: 'var(--yellow-dim)',  icon: '◈', obsidianFile: 'Product_A.md § SQL' },
  'Python':          { color: 'var(--purple)',  bg: 'var(--purple-dim)', icon: '⬡', obsidianFile: 'Product_A.md § Python' },
  'Product Metrics': { color: 'var(--accent)',  bg: 'var(--accent-dim)', icon: '◎', obsidianFile: 'Product_A.md § Metrics' },
  'Coding':          { color: 'var(--green)',   bg: 'var(--green-dim)',  icon: '◇', obsidianFile: 'Product_A.md § Coding' },
}

const DIFF_COLOR: Record<InterviewQuestion['difficulty'], string> = {
  easy:   'var(--green)',
  medium: 'var(--yellow)',
  hard:   'var(--red)',
}

const TOPICS: Topic[] = ['SQL', 'Python', 'Product Metrics', 'Coding']

export function InterviewQBank({ currentWeek }: { currentWeek: number }) {
  const [openTopics, setOpenTopics] = useState<Set<Topic>>(new Set(['SQL']))
  const [filter, setFilter] = useState<'all' | 'covered' | 'upcoming'>('all')

  function toggleTopic(t: Topic) {
    setOpenTopics(prev => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }

  function filterQs(qs: InterviewQuestion[]) {
    if (filter === 'covered') return qs.filter(q => !q.weekCovered || q.weekCovered <= currentWeek)
    if (filter === 'upcoming') return qs.filter(q => q.weekCovered && q.weekCovered > currentWeek)
    return qs
  }

  const allQuestions = INTERVIEW_QUESTIONS
  const totalCovered = allQuestions.filter(q => !q.weekCovered || q.weekCovered <= currentWeek).length

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--ink-dim)' }}>
            Interview Q Bank
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>
            Mapped to curriculum weeks · mirrors <span className="font-mono" style={{ color: 'var(--accent)' }}>Product_A.md</span> in Obsidian
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold" style={{ color: 'var(--green)' }}>{totalCovered}<span className="text-xs font-normal" style={{ color: 'var(--ink-faint)' }}>/{allQuestions.length} covered</span></div>
          <div className="text-xs" style={{ color: 'var(--ink-faint)' }}>by Week {currentWeek}</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {(['all', 'covered', 'upcoming'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1 rounded text-xs font-mono capitalize cursor-pointer"
            style={{
              background: filter === f ? 'var(--accent-dim)' : 'var(--bg-card)',
              color: filter === f ? 'var(--accent)' : 'var(--ink-faint)',
              border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Topic sections */}
      <div className="flex flex-col gap-3">
        {TOPICS.map(topic => {
          const meta = TOPIC_META[topic]
          const qs = filterQs(INTERVIEW_QUESTIONS.filter(q => q.topic === topic))
          const isOpen = openTopics.has(topic)
          const coveredCount = qs.filter(q => !q.weekCovered || q.weekCovered <= currentWeek).length

          // group by subtopic
          const bySubtopic = qs.reduce<Record<string, InterviewQuestion[]>>((acc, q) => {
            ;(acc[q.subtopic] ??= []).push(q)
            return acc
          }, {})

          return (
            <div key={topic} className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${isOpen ? `${meta.color}35` : 'var(--border)'}`,
                boxShadow: isOpen ? `0 0 24px ${meta.color}15` : 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}>
              <button onClick={() => toggleTopic(topic)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
                style={{ background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                <span className="flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold flex-shrink-0"
                  style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30` }}>{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{topic}</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>{meta.obsidianFile}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono" style={{ color: meta.color }}>
                    {coveredCount}/{qs.length}
                  </span>
                  <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${qs.length ? coveredCount / qs.length * 100 : 0}%`, background: meta.color }} />
                  </div>
                  <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && qs.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-3 flex flex-col gap-3">
                      {Object.entries(bySubtopic).map(([subtopic, questions]) => (
                        <div key={subtopic}>
                          <div className="text-xs font-mono uppercase mb-1.5 px-1" style={{ color: meta.color }}>
                            {subtopic}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {questions.map(q => {
                              const isCovered = !q.weekCovered || q.weekCovered <= currentWeek
                              return (
                                <div key={q.id} className="rounded-lg p-3 border"
                                  style={{
                                    background: isCovered ? 'var(--bg)' : 'transparent',
                                    borderColor: isCovered ? 'var(--border-bright)' : 'var(--border)',
                                    opacity: isCovered ? 1 : 0.55,
                                  }}>
                                  <div className="flex items-start gap-2">
                                    <div className="flex-1 text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>
                                      {q.question}
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                      <span className="text-xs px-1.5 py-0.5 rounded font-mono"
                                        style={{ background: 'var(--bg-hover)', color: DIFF_COLOR[q.difficulty] }}>
                                        {q.difficulty}
                                      </span>
                                      {q.weekCovered && (
                                        <span className="text-xs px-1.5 py-0.5 rounded font-mono"
                                          style={{
                                            background: isCovered ? 'var(--green-dim)' : 'var(--bg-hover)',
                                            color: isCovered ? 'var(--green)' : 'var(--ink-faint)',
                                          }}>
                                          {isCovered ? '✓ W' : 'W'}{q.weekCovered}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-xs mt-1.5 font-mono" style={{ color: 'var(--ink-faint)' }}>
                                    {q.obsidianSection}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {isOpen && qs.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-4 border-t text-xs text-center" style={{ borderColor: 'var(--border)', color: 'var(--ink-faint)' }}>
                    No questions match current filter.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Obsidian sync note */}
      <div className="mt-4 rounded-xl p-4" style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid var(--border)' }}>
        <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--ink-faint)' }}>
          Obsidian sync
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
          Questions here map 1:1 to sections in <span className="font-mono" style={{ color: 'var(--accent)' }}>Product_A.md</span>.
          After each curriculum week, add real questions you encountered to that Obsidian section — this bank is the template.
          Mark sections "covered" by checking the week badge.
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1">
          {TOPICS.map(t => (
            <div key={t} className="text-xs font-mono py-0.5" style={{ color: 'var(--ink-faint)' }}>
              · {TOPIC_META[t].obsidianFile.split('§ ')[1]}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
