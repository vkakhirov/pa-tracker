'use client'
import { FOCUS_BANK, type FocusArea } from '@/lib/data'

const AREAS = Object.keys(FOCUS_BANK) as FocusArea[]
const COLOR: Record<FocusArea, string> = { Probability: '#60a5fa', 'Statistics & A/B': '#c084fc', SQL: '#fbbf24', 'Python & ML': '#34d399' }

export function TheoryBank({ language }: { language: 'ru' | 'en' }) {
  const ru = language === 'ru'
  const areaLabel: Record<FocusArea, string> = {
    Probability: ru ? 'Теория вероятностей' : 'Probability',
    'Statistics & A/B': ru ? 'Статистика и A/B' : 'Statistics & A/B',
    SQL: 'SQL',
    'Python & ML': ru ? 'Python и ML' : 'Python & ML',
  }

  return (
    <main className="theory-shell">
      <section className="theory-head glass">
        <div className="eyebrow"><span className="live-dot" /> OZON БАНК · {ru ? 'СПРАВОЧНИК' : 'REFERENCE'}</div>
        <h1>{ru ? 'Теория для собеседования' : 'Interview theory bank'}</h1>
        <p>{ru ? 'Всё, что появлялось в задачах Focus Lab, — в одном месте, не привязано к текущей ротации.' : 'Everything that has come up in Focus Lab drills, in one place, independent of the current rotation.'}</p>
      </section>

      {AREAS.map(area => (
        <section key={area} className="theory-area glass" style={{ '--area': COLOR[area] } as React.CSSProperties}>
          <h2><span className="area-dot" />{areaLabel[area]}</h2>
          <div className="theory-list">
            {FOCUS_BANK[area].map((d, i) => (
              <article key={i} className="theory-item">
                <div className="theory-item-title">{d.title}</div>
                <p>{ru ? d.theoryRu : d.theoryEn}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
