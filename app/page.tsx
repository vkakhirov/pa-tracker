'use client'

import { useState } from 'react'
import { GATES, MISTAKES, WEEKS, SESSION_STEPS, HABIT_STACK, AREA_WEIGHTS } from '@/lib/data'
import { useStore } from '@/lib/store'
import { Header } from '@/components/Header'
import { StatsBar } from '@/components/StatsBar'
import { GatePanel } from '@/components/GatePanel'
import { MistakeLog } from '@/components/MistakeLog'
import { WeekProgress } from '@/components/WeekProgress'
import { SessionBlueprint } from '@/components/SessionBlueprint'
import { HabitStack } from '@/components/HabitStack'
import { EatFrog } from '@/components/EatFrog'
import { InterviewQBank } from '@/components/InterviewQBank'
import { JobTracker } from '@/components/JobTracker'

// Set this once — dashboard auto-tracks week/day from here
const START_DATE = '2026-05-13'

function getCurrentPosition() {
  const start = new Date(START_DATE)
  const today = new Date()
  const daysSince = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const totalDay = Math.max(0, daysSince)
  const week = Math.min(Math.floor(totalDay / 7) + 1, 4)
  const day = Math.min((totalDay % 7) + 1, 7)
  return { week, day }
}

const { week: CURRENT_WEEK, day: CURRENT_DAY } = getCurrentPosition()

type Tab = 'dashboard' | 'interview' | 'jobs'

const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'interview', label: 'Interview Bank' },
  { id: 'jobs',      label: 'Jobs' },
]

export default function Dashboard() {
  const { state, mounted, setProblemStatus, setGateStatus, toggleRemediation, logSession, addJob, updateJobStatus, updateJob, deleteJob } = useStore()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Header streak={state.streak} currentWeek={CURRENT_WEEK} currentDay={CURRENT_DAY} />

      {/* Tab nav */}
      <div className="flex items-center gap-0 border-b px-6" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2.5 text-xs font-mono uppercase tracking-widest cursor-pointer transition-colors relative"
            style={{ color: activeTab === tab.id ? 'var(--accent)' : 'var(--ink-faint)', background: 'transparent', border: 'none' }}>
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t" style={{ background: 'var(--accent)' }} />
            )}
            {tab.id === 'jobs' && state.jobs.length > 0 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded font-mono"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                {state.jobs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <>
          <StatsBar weeks={WEEKS} problemStatuses={state.problemStatuses} completedDates={state.completedDates} areaWeights={AREA_WEIGHTS} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[calc(100vh-180px)]">
            <div className="border-r p-5 flex flex-col gap-4" style={{ borderColor: 'var(--border)' }}>
              <EatFrog weeks={WEEKS} currentWeek={CURRENT_WEEK} currentDay={CURRENT_DAY} />
              <GatePanel gates={GATES} gateStatuses={state.gateStatuses} onToggle={setGateStatus} />
              <HabitStack habits={HABIT_STACK} />
            </div>
            <div className="border-r p-5" style={{ borderColor: 'var(--border)' }}>
              <WeekProgress weeks={WEEKS} problemStatuses={state.problemStatuses} onSetStatus={setProblemStatus} currentWeek={CURRENT_WEEK} currentDay={CURRENT_DAY} />
            </div>
            <div className="p-5 flex flex-col gap-6">
              <MistakeLog mistakes={MISTAKES} remediationDone={state.remediationDone} onToggleRemediation={toggleRemediation} />
              <SessionBlueprint steps={SESSION_STEPS} onLogSession={logSession} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'interview' && (
        <InterviewQBank currentWeek={CURRENT_WEEK} />
      )}

      {activeTab === 'jobs' && (
        <JobTracker
          jobs={state.jobs}
          onAdd={addJob}
          onUpdateStatus={updateJobStatus}
          onUpdate={updateJob}
          onDelete={deleteJob}
        />
      )}
    </div>
  )
}
