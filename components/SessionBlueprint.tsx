'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import type { SessionStep } from '@/lib/data'

interface SessionBlueprintProps { steps: SessionStep[]; onLogSession: () => void }

const PHASE_COLORS: Record<string, string> = {
  Before: 'var(--yellow)', During: 'var(--accent)', After: 'var(--green)',
}

export function SessionBlueprint({ steps, onLogSession }: SessionBlueprintProps) {
  const [timerRunning, setTimerRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => { if (s <= 1) { clearInterval(intervalRef.current!); setTimerRunning(false); return 0 } return s - 1 })
      }, 1000)
    } else { if (intervalRef.current) clearInterval(intervalRef.current) }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const seconds = (secondsLeft % 60).toString().padStart(2, '0')
  const progress = 1 - secondsLeft / (25 * 60)

  const handleStart = () => { setSecondsLeft(25 * 60); setTimerRunning(true) }
  const handleReset = () => { setTimerRunning(false); setSecondsLeft(25 * 60) }
  const handleComplete = () => { handleReset(); onLogSession() }

  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--ink-dim)' }}>Session Blueprint</h2>
      <div className="rounded-lg border p-4 mb-3" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-mono font-bold" style={{ color: timerRunning ? 'var(--accent)' : 'var(--ink)' }}>
              {minutes}:{seconds}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--ink-dim)' }}>
              {timerRunning ? 'Focus — no distractions' : 'Pomodoro · 25 min'}
            </div>
          </div>
          <div className="flex gap-2">
            {!timerRunning ? (
              <button onClick={handleStart} className="px-4 py-2 rounded text-sm font-medium cursor-pointer"
                style={{ background: 'var(--accent)', color: '#fff' }}>Start</button>
            ) : (
              <>
                <button onClick={() => setTimerRunning(false)} className="px-3 py-2 rounded text-sm cursor-pointer"
                  style={{ background: 'var(--bg-hover)', color: 'var(--ink-dim)' }}>Pause</button>
                <button onClick={handleComplete} className="px-3 py-2 rounded text-sm cursor-pointer"
                  style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>Done ✓</button>
              </>
            )}
            {secondsLeft < 25 * 60 && !timerRunning && (
              <button onClick={handleReset} className="px-3 py-2 rounded text-sm cursor-pointer"
                style={{ background: 'var(--bg-hover)', color: 'var(--ink-faint)' }}>Reset</button>
            )}
          </div>
        </div>
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'var(--accent)' }}
            animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {steps.map(step => {
          const color = PHASE_COLORS[step.phase] ?? 'var(--ink-dim)'
          return (
            <div key={step.phase} className="rounded-lg border p-3" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold" style={{ color }}>{step.phase}</span>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-hover)', color: 'var(--ink-faint)' }}>{step.duration}</span>
              </div>
              <ul className="flex flex-col gap-1">
                {step.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ink-dim)' }}>
                    <span style={{ color }}>·</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
