'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ProblemStatus, GateStatus } from './data'

const STORAGE_KEY = 'pa-tracker-state'

interface StoredState {
  problemStatuses: Record<string, ProblemStatus>
  gateStatuses: Record<string, GateStatus>
  remediationDone: Record<string, boolean[]>
  streak: number
  lastSessionDate: string | null
  completedDates: string[]
}

const DEFAULT_STATE: StoredState = {
  problemStatuses: {
    'w1d1-1': 'done',
    'w1d1-2': 'done',
    'w1d1-3': 'done',
    'w1d2-1': 'done',
  },
  gateStatuses: { G1: 'passed', G2: 'active' },
  remediationDone: {},
  streak: 4,
  lastSessionDate: '2026-05-16',
  completedDates: ['2026-05-13', '2026-05-14', '2026-05-15', '2026-05-16'],
}

function load(): StoredState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

function save(state: StoredState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function calculateStreak(dates: string[]): number {
  if (!dates.length) return 0
  const sorted = [...dates].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  let streak = 0
  let check = today
  for (const d of sorted) {
    if (d === check) {
      streak++
      const prev = new Date(check)
      prev.setDate(prev.getDate() - 1)
      check = prev.toISOString().slice(0, 10)
    } else break
  }
  return streak
}

export function useStore() {
  const [state, setState] = useState<StoredState>(DEFAULT_STATE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setState(load()); setMounted(true) }, [])

  const setProblemStatus = useCallback((id: string, status: ProblemStatus) => {
    setState(prev => {
      const next = { ...prev, problemStatuses: { ...prev.problemStatuses, [id]: status } }
      save(next); return next
    })
  }, [])

  const setGateStatus = useCallback((id: string, status: GateStatus) => {
    setState(prev => {
      const next = { ...prev, gateStatuses: { ...prev.gateStatuses, [id]: status } }
      save(next); return next
    })
  }, [])

  const toggleRemediation = useCallback((mistakeId: string, index: number, total: number) => {
    setState(prev => {
      const current = prev.remediationDone[mistakeId] ?? Array(total).fill(false)
      const next = [...current]
      next[index] = !next[index]
      const nextState = { ...prev, remediationDone: { ...prev.remediationDone, [mistakeId]: next } }
      save(nextState); return nextState
    })
  }, [])

  const logSession = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10)
    setState(prev => {
      const dates = prev.completedDates.includes(today) ? prev.completedDates : [...prev.completedDates, today]
      const streak = calculateStreak(dates)
      const next = { ...prev, completedDates: dates, lastSessionDate: today, streak }
      save(next); return next
    })
  }, [])

  return { state, mounted, setProblemStatus, setGateStatus, toggleRemediation, logSession }
}
