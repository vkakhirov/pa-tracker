'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { SessionStep } from '@/lib/data'

interface SessionBlueprintProps { steps: SessionStep[]; onLogSession: () => void }

const PHASE_CFG: Record<string, { color: string; bg: string }> = {
  Before: { color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  During: { color: 'var(--accent)',  bg: 'var(--accent-dim)' },
  After:  { color: 'var(--green)',  bg: 'var(--green-dim)' },
}

const TOTAL = 25 * 60
const R = 36
const CIRC = 2 * Math.PI * R

export function SessionBlueprint({ steps, onLogSession }: SessionBlueprintProps) {
  const [timerRunning, setTimerRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(TOTAL)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) { clearInterval(intervalRef.current!); setTimerRunning(false); return 0 }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const seconds = (secondsLeft % 60).toString().padStart(2, '0')
  const progress = 1 - secondsLeft / TOTAL
  const dashOffset = CIRC * (1 - progress)

  const handleStart = () => { setSecondsLeft(TOTAL); setTimerRunning(true) }
  const handleReset = () => { setTimerRunning(false); setSecondsLeft(TOTAL) }
  const handleComplete = () => { handleReset(); onLogSession() }

  const accentColor = timerRunning ? 'var(--accent)' : 'var(--ink-dim)'

  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--ink-faint)' }}>Session Blueprint</h2>

      {/* Timer card */}
      <div className="rounded-xl p-4 mb-3 relative overflow-hidden"
        style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${timerRunning ? 'rgba(79,142,247,0.25)' : 'var(--border)'}`,
          boxShadow: timerRunning ? '0 0 24px var(--accent-glow)' : 'none',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}>
        {timerRunning && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(79,142,247,0.06) 0%, transparent 70%)' }} />
        )}

        <div className="flex items-center justify-between gap-4">
          {/* SVG ring timer */}
          <div className="relative flex-shrink-0">
            <svg width="88" height="88" viewBox="0 0 88 88">
              {/* Track */}
              <circle cx="44" cy="44" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
              {/* Progress */}
              <motion.circle
                cx="44" cy="44" r={R}
                fill="none"
                stroke={timerRunning ? 'var(--accent)' : 'var(--border-bright)'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 44 44)"
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
              />
              {/* Glow ring (when running) */}
              {timerRunning && (
                <circle cx="44" cy="44" r={R} fill="none"
                  stroke="rgba(79,142,247,0.2)" strokeWidth="10"
                  strokeDasharray={CIRC} strokeDashoffset={dashOffset}
                  transform="rotate(-90 44 44)"
                  style={{ transition: 'stroke-dashoffset 1s linear', filter: 'blur(4px)' }} />
              )}
            </svg>
            {/* Time text inside ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-lg font-bold font-mono leading-none" style={{ color: timerRunning ? 'var(--accent)' : 'var(--ink)' }}>
                {minutes}:{seconds}
              </div>
              <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--ink-faint)' }}>min</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1">
            <div className="text-sm font-medium mb-0.5" style={{ color: timerRunning ? 'var(--ink)' : 'var(--ink-dim)' }}>
              {timerRunning ? 'Focus — no distractions' : 'Pomodoro · 25 min'}
            </div>
            <div className="text-xs mb-3" style={{ color: 'var(--ink-faint)' }}>
              {timerRunning ? `${Math.round(progress * 100)}% complete` : 'Write on paper first'}
            </div>
            <div className="flex gap-2">
              {!timerRunning ? (
                <motion.button whileTap={{ scale: 0.94 }} onClick={handleStart}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer"
                  style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 0 12px var(--accent-glow)' }}>
                  Start
                </motion.button>
              ) : (
                <>
                  <motion.button whileTap={{ scale: 0.94 }} onClick={() => setTimerRunning(false)}
                    className="px-3 py-1.5 rounded-lg text-sm cursor-pointer"
                    style={{ background: 'var(--bg-hover)', color: 'var(--ink-dim)', border: '1px solid var(--border)' }}>
                    Pause
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.94 }} onClick={handleComplete}
                    className="px-3 py-1.5 rounded-lg text-sm cursor-pointer"
                    style={{ background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    Done ✓
                  </motion.button>
                </>
              )}
              {secondsLeft < TOTAL && !timerRunning && (
                <motion.button whileTap={{ scale: 0.94 }} onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-sm cursor-pointer"
                  style={{ background: 'var(--bg-hover)', color: 'var(--ink-faint)' }}>
                  Reset
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Phase cards */}
      <div className="flex flex-col gap-2">
        {steps.map((step, i) => {
          const cfg = PHASE_CFG[step.phase] ?? { color: 'var(--ink-dim)', bg: 'var(--bg-hover)' }
          return (
            <motion.div key={step.phase}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl p-3 relative overflow-hidden"
              style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid var(--border)',
              }}>
              <div className="absolute top-0 left-0 w-0.5 h-full rounded-r-full" style={{ background: cfg.color, opacity: 0.6 }} />
              <div className="pl-2 flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold" style={{ color: cfg.color }}>{step.phase}</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono"
                  style={{ background: cfg.bg, color: cfg.color }}>{step.duration}</span>
              </div>
              <ul className="pl-2 flex flex-col gap-1">
                {step.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ink-dim)' }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: cfg.color, opacity: 0.7 }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
