'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { JobOpportunity, JobStatus } from '@/lib/data'

interface JobTrackerProps {
  jobs: JobOpportunity[]
  onAdd: (job: Omit<JobOpportunity, 'id' | 'dateAdded'>) => void
  onUpdateStatus: (id: string, status: JobStatus) => void
  onUpdate: (id: string, patch: Partial<JobOpportunity>) => void
  onDelete: (id: string) => void
}

const STATUS_META: Record<JobStatus, { label: string; color: string; bg: string }> = {
  wishlist:  { label: 'Wishlist',  color: 'var(--ink-dim)',  bg: 'var(--bg-hover)' },
  applied:   { label: 'Applied',   color: 'var(--accent)',   bg: 'var(--accent-dim)' },
  screening: { label: 'Screening', color: 'var(--yellow)',   bg: 'var(--yellow-dim)' },
  interview: { label: 'Interview', color: 'var(--purple)',   bg: 'var(--purple-dim)' },
  offer:     { label: 'Offer 🎉',  color: 'var(--green)',    bg: 'var(--green-dim)' },
  rejected:  { label: 'Rejected',  color: 'var(--red)',      bg: 'var(--red-dim)' },
  ghosted:   { label: 'Ghosted',   color: 'var(--ink-faint)', bg: 'var(--bg-hover)' },
}

const STATUSES: JobStatus[] = ['wishlist', 'applied', 'screening', 'interview', 'offer', 'rejected', 'ghosted']

const EMPTY_FORM = { company: '', role: '', url: '', notes: '', status: 'wishlist' as JobStatus, tags: [] as string[], dateApplied: '' }

export function JobTracker({ jobs, onAdd, onUpdateStatus, onUpdate, onDelete }: JobTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesVal, setNotesVal] = useState('')

  const filtered = filterStatus === 'all' ? jobs : jobs.filter(j => j.status === filterStatus)

  const counts = STATUSES.reduce<Record<JobStatus, number>>((acc, s) => {
    acc[s] = jobs.filter(j => j.status === s).length
    return acc
  }, {} as Record<JobStatus, number>)

  function handleAdd() {
    if (!form.company.trim() || !form.role.trim()) return
    onAdd({ company: form.company.trim(), role: form.role.trim(), status: form.status, url: form.url || undefined, notes: form.notes || undefined, dateApplied: form.dateApplied || undefined, tags: form.tags })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  function startEditNotes(job: JobOpportunity) {
    setEditingNotes(job.id)
    setNotesVal(job.notes ?? '')
  }

  function saveNotes(id: string) {
    onUpdate(id, { notes: notesVal })
    setEditingNotes(null)
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: 'var(--ink-dim)' }}>Job Opportunities</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>{jobs.length} tracked · {counts.interview + counts.offer} active</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 rounded text-xs font-medium cursor-pointer"
          style={{ background: showForm ? 'var(--bg-hover)' : 'var(--accent)', color: showForm ? 'var(--ink-dim)' : '#fff' }}>
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid var(--border-bright)', boxShadow: '0 0 24px rgba(79,142,247,0.08)' }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--ink-faint)' }}>Company *</label>
                  <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="Yandex, Tinkoff..." className="w-full px-3 py-2 rounded text-sm outline-none"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border-bright)', color: 'var(--ink)' }} />
                </div>
                <div>
                  <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--ink-faint)' }}>Role *</label>
                  <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    placeholder="Product Analyst..." className="w-full px-3 py-2 rounded text-sm outline-none"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border-bright)', color: 'var(--ink)' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--ink-faint)' }}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as JobStatus }))}
                    className="w-full px-3 py-2 rounded text-sm outline-none cursor-pointer"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border-bright)', color: 'var(--ink)' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--ink-faint)' }}>Applied date</label>
                  <input type="date" value={form.dateApplied} onChange={e => setForm(f => ({ ...f, dateApplied: e.target.value }))}
                    className="w-full px-3 py-2 rounded text-sm outline-none"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border-bright)', color: 'var(--ink)' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--ink-faint)' }}>URL</label>
                <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="https://..." className="w-full px-3 py-2 rounded text-sm outline-none"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border-bright)', color: 'var(--ink)' }} />
              </div>
              <div>
                <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--ink-faint)' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2} placeholder="Referral, salary range, interview details..."
                  className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border-bright)', color: 'var(--ink)' }} />
              </div>
              <button onClick={handleAdd}
                className="px-4 py-2 rounded text-sm font-medium cursor-pointer self-end"
                style={{ background: 'var(--accent)', color: '#fff', opacity: (!form.company || !form.role) ? 0.4 : 1 }}>
                Add Opportunity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status summary bar */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        <button onClick={() => setFilterStatus('all')}
          className="px-2.5 py-1 rounded text-xs font-mono cursor-pointer"
          style={{ background: filterStatus === 'all' ? 'var(--accent-dim)' : 'var(--bg-card)', color: filterStatus === 'all' ? 'var(--accent)' : 'var(--ink-faint)', border: `1px solid ${filterStatus === 'all' ? 'var(--accent)' : 'var(--border)'}` }}>
          All ({jobs.length})
        </button>
        {STATUSES.filter(s => counts[s] > 0 || filterStatus === s).map(s => {
          const meta = STATUS_META[s]
          const active = filterStatus === s
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-2.5 py-1 rounded text-xs font-mono cursor-pointer"
              style={{ background: active ? meta.bg : 'var(--bg-card)', color: active ? meta.color : 'var(--ink-faint)', border: `1px solid ${active ? meta.color : 'var(--border)'}` }}>
              {meta.label} {counts[s] > 0 ? `(${counts[s]})` : ''}
            </button>
          )
        })}
      </div>

      {/* Job cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid var(--border)' }}>
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm" style={{ color: 'var(--ink-dim)' }}>No opportunities yet.</div>
          <div className="text-xs mt-1" style={{ color: 'var(--ink-faint)' }}>Add your first target company above.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((job, i) => {
            const meta = STATUS_META[job.status]
            const isExpanded = expandedId === job.id
            return (
              <motion.div key={job.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid var(--border)', transition: 'border-color 0.2s' }}>
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Status dot */}
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                  {/* Company + role */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{job.company}</span>
                      {job.url && (
                        <a href={job.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs" style={{ color: 'var(--accent)' }}>↗</a>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--ink-dim)' }}>{job.role}</div>
                  </div>
                  {/* Status selector */}
                  <select value={job.status} onChange={e => onUpdateStatus(job.id, e.target.value as JobStatus)}
                    className="text-xs px-2 py-1 rounded font-mono cursor-pointer outline-none"
                    style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40` }}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                  </select>
                  {/* Dates */}
                  <div className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--ink-faint)' }}>
                    {job.dateApplied ?? job.dateAdded}
                  </div>
                  {/* Expand toggle */}
                  <button onClick={() => setExpandedId(isExpanded ? null : job.id)}
                    className="text-xs px-2 py-1 rounded cursor-pointer"
                    style={{ color: 'var(--ink-faint)', background: 'transparent' }}>
                    {isExpanded ? '▲' : '▼'}
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="p-4 flex flex-col gap-3">
                        {/* Notes */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono uppercase" style={{ color: 'var(--ink-faint)' }}>Notes</span>
                            {editingNotes !== job.id ? (
                              <button onClick={() => startEditNotes(job)}
                                className="text-xs cursor-pointer" style={{ color: 'var(--accent)' }}>Edit</button>
                            ) : (
                              <button onClick={() => saveNotes(job.id)}
                                className="text-xs cursor-pointer" style={{ color: 'var(--green)' }}>Save</button>
                            )}
                          </div>
                          {editingNotes === job.id ? (
                            <textarea value={notesVal} onChange={e => setNotesVal(e.target.value)}
                              rows={3} autoFocus className="w-full px-3 py-2 rounded text-xs outline-none resize-none"
                              style={{ background: 'var(--bg)', border: '1px solid var(--border-bright)', color: 'var(--ink)' }} />
                          ) : (
                            <p className="text-xs leading-relaxed" style={{ color: job.notes ? 'var(--ink-dim)' : 'var(--ink-faint)' }}>
                              {job.notes ?? 'No notes yet — click Edit to add context, salary range, referral info...'}
                            </p>
                          )}
                        </div>
                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--ink-faint)' }}>
                          <span className="font-mono">Added {job.dateAdded}{job.dateApplied ? ` · Applied ${job.dateApplied}` : ''}</span>
                          <button onClick={() => onDelete(job.id)}
                            className="text-xs cursor-pointer px-2 py-0.5 rounded"
                            style={{ color: 'var(--red)', background: 'var(--red-dim)' }}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
