'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Flashcard } from '@/lib/data'

interface FlashcardDeckProps { cards: Flashcard[] }

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (cards.length === 0) return null
  const card = cards[index]

  const go = (dir: number) => {
    setFlipped(false)
    setIndex(i => (i + dir + cards.length) % cards.length)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: 'var(--ink-faint)' }}>
          Flashcards
        </h2>
        <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-tag)', color: 'var(--ink-faint)' }}>
          {index + 1} / {cards.length}
        </span>
      </div>

      {/* Card — click to flip */}
      <div className="relative" style={{ perspective: '1200px' }}>
        <motion.button
          onClick={() => setFlipped(f => !f)}
          className="w-full text-left cursor-pointer"
          style={{ background: 'transparent', border: 'none', padding: 0 }}
          whileTap={{ scale: 0.985 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${card.id}-${flipped ? 'b' : 'f'}`}
              initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-xl p-4 min-h-[168px] flex flex-col"
              style={{
                transformStyle: 'preserve-3d',
                background: flipped
                  ? 'linear-gradient(135deg, rgba(79,142,247,0.1) 0%, rgba(79,142,247,0.05) 100%)'
                  : 'var(--bg-glass)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: flipped ? '1px solid var(--accent-glow)' : '1px solid var(--border)',
                boxShadow: flipped ? '0 0 28px rgba(79,142,247,0.12)' : 'none',
              }}>
              {/* Corner tag */}
              <span className="absolute top-3 right-3 text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>
                {flipped ? 'BACK' : 'FRONT'}
              </span>

              {!flipped ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-4">
                  <span className="text-2xl leading-none">🃏</span>
                  <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
                    {card.front}
                  </p>
                  <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>tap to reveal</span>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-2 pt-1">
                  {card.back.map((line, i) => (
                    <motion.p key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                      className="text-xs font-mono leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
                      {line}
                    </motion.p>
                  ))}
                  <div className="mt-auto pt-2.5 flex items-start gap-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <span className="text-xs flex-shrink-0">🗣</span>
                    <p className="text-xs font-medium leading-snug" style={{ color: 'var(--accent)' }}>
                      {card.drill}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Linked mistakes + nav */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1 flex-wrap">
          {card.linkedMistakes?.map(m => (
            <span key={m} className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red, #ef4444)' }}>
              {m}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <NavBtn onClick={() => go(-1)} label="‹" />
          <NavBtn onClick={() => go(1)} label="›" />
        </div>
      </div>
    </div>
  )
}

function NavBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <motion.button onClick={onClick}
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
      className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer text-sm font-mono"
      style={{ background: 'var(--bg-tag)', color: 'var(--ink-dim)', border: '1px solid var(--border)' }}>
      {label}
    </motion.button>
  )
}
