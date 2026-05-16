'use client'

import { GATES, MISTAKES, WEEKS, SESSION_STEPS, HABIT_STACK, AREA_WEIGHTS } from '@/lib/data'
import { useStore } from '@/lib/store'
import { Header } from '@/components/Header'
import { StatsBar } from '@/components/StatsBar'
import { GatePanel } from '@/components/GatePanel'
import { MistakeLog } from '@/components/MistakeLog'
import { WeekProgress } from '@/components/WeekProgress'
import { SessionBlueprint } from '@/components/SessionBlueprint'
import { HabitStack } from '@/components/HabitStack'

// Set this once — dashboard auto-tracks week/day from here
const START_DATE = '2026-05-13'

function getCurrentPosition() {
  const start = new Date(START_DATE)
  const today = new Date()
  const daysSince = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const totalDay = Math.max(0, daysSince) // 0-indexed
  const week = Math.min(Math.floor(totalDay / 7) + 1, 4)
  const day = Math.min((totalDay % 7) + 1, 7)
  return { week, day }
}

const { week: CURRENT_WEEK, day: CURRENT_DAY } = getCurrentPosition()

export default function Dashboard() {
  const { state, mounted, setProblemStatus, setGateStatus, toggleRemediation, logSession } = useStore()

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
      <StatsBar weeks={WEEKS} problemStatuses={state.problemStatuses} completedDates={state.completedDates} areaWeights={AREA_WEIGHTS} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[calc(100vh-140px)]">
        <div className="border-r p-5 flex flex-col gap-6" style={{ borderColor: 'var(--border)' }}>
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
    </div>
  )
}
