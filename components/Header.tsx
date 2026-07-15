'use client'
import { motion } from 'motion/react'
import { ThemePicker } from '@/components/ThemePicker'

interface HeaderProps { streak: number; currentWeek: number; currentDay: number; language: 'ru' | 'en'; onLanguageChange: (language: 'ru' | 'en') => void }

export function Header({ streak, currentWeek, currentDay, language, onLanguageChange }: HeaderProps) {
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg-header)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
      {/* Left: wordmark */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)' }}>
          <span className="text-xs font-bold font-mono" style={{ color: 'var(--accent)', letterSpacing: '0.05em' }}>PA</span>
          <div className="absolute inset-0 rounded-xl" style={{ boxShadow: '0 0 14px var(--accent-glow)' }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--ink)' }}>PA Tracker</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(79,142,247,0.2)' }}>
              Ozon Bank · DS
            </span>
          </div>
          <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--ink-faint)' }}>
            {language === 'ru' ? `Неделя ${currentWeek} · День ${currentDay}` : `Week ${currentWeek} · Day ${currentDay}`} · {today}
          </div>
        </div>
      </div>

      {/* Right: theme picker + streak */}
      <div className="flex items-center gap-3">
        <ThemePicker />
        <div className="language-switch" aria-label="Language switcher">
          {(['ru', 'en'] as const).map(lang => <button key={lang} onClick={() => onLanguageChange(lang)} className={language === lang ? 'active' : ''}>{lang.toUpperCase()}</button>)}
        </div>

        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'var(--yellow-dim)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="relative">
            <div className="text-lg leading-none">🔥</div>
            <div className="absolute -inset-1 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />
          </div>
          <div>
            <div className="text-base font-bold leading-none font-mono" style={{ color: 'var(--yellow)' }}>{streak}</div>
            <div className="text-xs" style={{ color: 'var(--ink-faint)' }}>{language === 'ru' ? 'серия' : 'streak'}</div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}
