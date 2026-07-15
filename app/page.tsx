'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { GATES, MISTAKES, WEEKS, SESSION_STEPS, HABIT_STACK, AREA_WEIGHTS, FLASHCARDS } from '@/lib/data'
import { useStore } from '@/lib/store'
import { Header } from '@/components/Header'
import { StatsBar } from '@/components/StatsBar'
import { GatePanel } from '@/components/GatePanel'
import { MistakeLog } from '@/components/MistakeLog'
import { WeekProgress } from '@/components/WeekProgress'
import { SessionBlueprint } from '@/components/SessionBlueprint'
import { HabitStack } from '@/components/HabitStack'
import { FlashcardDeck } from '@/components/FlashcardDeck'
import { EatFrog } from '@/components/EatFrog'
import { InterviewQBank } from '@/components/InterviewQBank'
import { JobTracker } from '@/components/JobTracker'
import { FocusLab } from '@/components/FocusLab'

// Update manually when a gate is passed and you move to the next day
const CURRENT_WEEK = 1
const CURRENT_DAY = 2

type Tab = 'focus' | 'dashboard' | 'interview' | 'jobs'

const TABS: { id: Tab; label: string }[] = [
  { id: 'focus', label: 'Focus Lab' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'interview', label: 'Interview Bank' },
  { id: 'jobs',      label: 'Jobs' },
]

export default function Dashboard() {
  const { state, mounted, setProblemStatus, setGateStatus, toggleRemediation, logSession, addJob, updateJobStatus, updateJob, deleteJob } = useStore()
  const [activeTab, setActiveTab] = useState<Tab>('focus')
  const [language, setLanguage] = useState<'ru' | 'en'>('ru')
  useEffect(() => { const saved = localStorage.getItem('pa-language'); if (saved === 'en' || saved === 'ru') setLanguage(saved) }, [])
  function changeLanguage(next: 'ru' | 'en') { setLanguage(next); localStorage.setItem('pa-language', next) }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Header streak={state.streak} currentWeek={CURRENT_WEEK} currentDay={CURRENT_DAY} language={language} onLanguageChange={changeLanguage} />

      {/* Tab nav */}
      <div className="flex items-center gap-1 border-b px-6" style={{ borderColor: 'var(--border)', background: 'var(--bg-header)' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="relative px-4 py-3 text-xs font-mono uppercase tracking-widest cursor-pointer transition-all duration-200"
            style={{ color: activeTab === tab.id ? 'var(--accent)' : 'var(--ink-faint)', background: 'transparent', border: 'none' }}>
            {language === 'ru' ? ({ focus: 'Фокус', dashboard: 'План', interview: 'Вопросы', jobs: 'Вакансии' } as Record<Tab, string>)[tab.id] : tab.label}
            {tab.id === 'jobs' && state.jobs.length > 0 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-mono"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                {state.jobs.length}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div layoutId="tab-indicator"
                className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full"
                style={{ background: 'linear-gradient(to right, transparent, var(--accent), transparent)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'focus' && <FocusLab onSessionComplete={logSession} language={language} />}

      {activeTab === 'dashboard' && (
        <>
          <StatsBar weeks={WEEKS} problemStatuses={state.problemStatuses} completedDates={state.completedDates} areaWeights={AREA_WEIGHTS} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[calc(100vh-180px)]">
            <div className="border-r p-5 flex flex-col gap-4" style={{ borderColor: 'var(--border)' }}>
              <EatFrog weeks={WEEKS} currentWeek={CURRENT_WEEK} currentDay={CURRENT_DAY} />
              <GatePanel gates={GATES} gateStatuses={state.gateStatuses} onToggle={setGateStatus} />
              <FlashcardDeck cards={FLASHCARDS} />
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
