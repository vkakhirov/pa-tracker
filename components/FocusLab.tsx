'use client'

import { useEffect, useMemo, useState } from 'react'
import { FOCUS_BANK as BANK, type FocusArea as Area } from '@/lib/data'

type Rating = 'again' | 'hard' | 'good'

const AREAS = Object.keys(BANK) as Area[]
const COLOR: Record<Area, string> = { Probability: '#60a5fa', 'Statistics & A/B': '#c084fc', SQL: '#fbbf24', 'Python & ML': '#34d399' }
const STORAGE = 'pa-focus-lab-v1'

type LabState = { indices: Record<Area, number>; scores: Record<Area, number[]>; notes: Record<Area, string>; star: Record<string, string>; sessions: number }
const blank = (): LabState => ({ indices: { Probability: 0, 'Statistics & A/B': 0, SQL: 0, 'Python & ML': 0 }, scores: { Probability: [], 'Statistics & A/B': [], SQL: [], 'Python & ML': [] }, notes: { Probability: '', 'Statistics & A/B': '', SQL: '', 'Python & ML': '' }, star: {}, sessions: 0 })

function nextIndex(current: number, rating: Rating, length: number) {
  if (rating === 'again') return current
  return (current + (rating === 'good' ? 2 : 1)) % length
}

export function FocusLab({ onSessionComplete, language }: { onSessionComplete: () => void; language: 'ru' | 'en' }) {
  const [state, setState] = useState<LabState>(blank)
  const [ready, setReady] = useState(false)
  const [seconds, setSeconds] = useState(150 * 60)
  const [running, setRunning] = useState(false)
  const [showHint, setShowHint] = useState<Record<Area, boolean>>({ Probability: false, 'Statistics & A/B': false, SQL: false, 'Python & ML': false })

  useEffect(() => { try { const raw = localStorage.getItem(STORAGE); if (raw) setState({ ...blank(), ...JSON.parse(raw) }) } catch {} setReady(true) }, [])
  useEffect(() => { if (ready) localStorage.setItem(STORAGE, JSON.stringify(state)) }, [state, ready])
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setSeconds(s => {
      if (s <= 1) { setRunning(false); if ('Notification' in window && Notification.permission === 'granted') new Notification('PA Focus Lab', { body: 'Session complete. Take a real break before the next set.' }); return 0 }
      return s - 1
    }), 1000)
    return () => clearInterval(id)
  }, [running])

  const mastery = useMemo(() => Object.fromEntries(AREAS.map(a => [a, state.scores[a].length ? Math.round(state.scores[a].reduce((x, y) => x + y, 0) / state.scores[a].length * 50) : 0])) as Record<Area, number>, [state.scores])
  const weakest = [...AREAS].sort((a, b) => mastery[a] - mastery[b])[0]
  const total = Math.floor(seconds / 60).toString().padStart(2, '0') + ':' + (seconds % 60).toString().padStart(2, '0')
  const ru = language === 'ru'
  const areaLabel: Record<Area, string> = { Probability: ru ? 'Теория вероятностей' : 'Probability', 'Statistics & A/B': ru ? 'Статистика и A/B' : 'Statistics & A/B', SQL: 'SQL', 'Python & ML': 'Python и ML' }

  function rate(area: Area, rating: Rating) {
    const value = rating === 'again' ? 0 : rating === 'hard' ? 1 : 2
    setState(s => ({ ...s, indices: { ...s.indices, [area]: nextIndex(s.indices[area], rating, BANK[area].length) }, scores: { ...s.scores, [area]: [...s.scores[area].slice(-9), value] }, notes: { ...s.notes, [area]: '' } }))
    setShowHint(h => ({ ...h, [area]: false }))
  }

  async function start() {
    if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission()
    setRunning(true)
  }

  function completeSession() {
    setRunning(false); setSeconds(150 * 60); setState(s => ({ ...s, sessions: s.sessions + 1 })); onSessionComplete()
  }

  if (!ready) return null
  return (
    <main className="focus-shell">
      <section className="focus-command glass">
        <div>
          <div className="eyebrow"><span className="live-dot" /> OZON БАНК · {ru ? 'ИНТЕРВЬЮ-СПРИНТ' : 'INTERVIEW SPRINT'}</div>
          <h1>{ru ? 'Сегодняшняя фокус-сессия' : 'Today’s focus lab'}</h1>
          <p>{ru ? 'По одной задаче на каждый ключевой навык. Рассуждай вслух, реши и честно оцени результат.' : 'One prompt per core skill. Answer aloud, work it through, then rate honestly.'}</p>
        </div>
        <div className="timer-block">
          <div className="timer-label">{ru ? 'ГЛУБОКАЯ РАБОТА · 2 Ч 30 МИН' : 'DEEP WORK · 2H 30M'}</div>
          <div className="timer">{total}</div>
          <div className="timer-actions">
            <button className="primary" onClick={running ? () => setRunning(false) : start}>{running ? (ru ? 'Пауза' : 'Pause') : seconds < 9000 ? (ru ? 'Продолжить' : 'Resume') : (ru ? 'Начать' : 'Start session')}</button>
            <button onClick={() => setSeconds(150 * 60)}>{ru ? 'Сбросить' : 'Reset'}</button>
            <button onClick={completeSession}>{ru ? 'Завершить' : 'Finish'}</button>
          </div>
        </div>
        <div className="readiness">
          <div><span>{ru ? 'Сессий' : 'Sessions'}</span><strong>{state.sessions}</strong></div>
          <div><span>{ru ? 'Слабая тема' : 'Weakest area'}</span><strong style={{ color: COLOR[weakest] }}>{areaLabel[weakest]}</strong></div>
          <div><span>{ru ? 'Перерыв' : 'Next break'}</span><strong>{running ? `${ru ? 'через' : 'in'} ${Math.ceil(seconds / 60)} ${ru ? 'мин' : 'min'}` : (ru ? 'после сессии' : 'after session')}</strong></div>
        </div>
      </section>

      <section className="drill-grid">
        {AREAS.map(area => { const q = BANK[area][state.indices[area] % BANK[area].length]; return (
          <article className="drill-card" key={area} style={{ '--area': COLOR[area] } as React.CSSProperties}>
            <header><div><span className="area-index">0{AREAS.indexOf(area) + 1}</span><span className="area-name">{areaLabel[area]}</span></div><span className="mastery">{mastery[area]}% {ru ? 'уровень' : 'mastery'}</span></header>
            <div className="progress"><i style={{ width: `${mastery[area]}%` }} /></div>
            <div className="drill-body">
              <div className="drill-meta"><span>{q.title}</span><span>{q.minutes} {ru ? 'МИН' : 'MIN'}</span></div>
              <div className="theory-block">
                <span className="theory-label">{ru ? 'Теория' : 'Theory'}</span>
                <p>{ru ? q.theoryRu : q.theoryEn}</p>
              </div>
              <h2>{q.prompt}</h2>
              <button className="hint-toggle" onClick={() => setShowHint(h => ({ ...h, [area]: !h[area] }))}>{showHint[area] ? (ru ? 'Скрыть подсказку' : 'Hide approach') : (ru ? 'Нужна подсказка?' : 'Need an approach?')}</button>
              {showHint[area] && <p className="hint">{q.hint}</p>}
              <textarea value={state.notes[area]} onChange={e => setState(s => ({ ...s, notes: { ...s.notes, [area]: e.target.value } }))} placeholder={ru ? 'Черновик: допущения, решение, проверки…' : 'Scratchpad: assumptions, solution, checks…'} />
            </div>
            <footer><span>{ru ? 'Как прошло?' : 'How did it feel?'}</span><div><button onClick={() => rate(area, 'again')}>{ru ? 'Ещё раз' : 'Again'}</button><button onClick={() => rate(area, 'hard')}>{ru ? 'Сложно' : 'Hard'}</button><button className="good" onClick={() => rate(area, 'good')}>{ru ? 'Решено' : 'Got it'}</button></div></footer>
          </article>
        )})}
      </section>

      <section className="lower-grid">
        <StarPrep state={state} setState={setState} language={language} />
        <aside className="sprint-plan glass">
          <div className="eyebrow">ADAPTIVE 3-WEEK ROUTE</div><h2>What to prioritize</h2>
          <div className="route active"><b>01 · Foundation</b><span>Probability, statistics, SQL, pandas · 5 days</span></div>
          <div className="route"><b>02 · Model thinking</b><span>Validation, leakage, metrics, boosting · 5 days</span></div>
          <div className="route"><b>03 · Interview mode</b><span>Timed mocks, STAR, credit cases · 4 days</span></div>
          <p className="coach-note"><b>Coach signal:</b> next session should begin with <span style={{ color: COLOR[weakest] }}>{weakest}</span>. The app derives this from your last ten ratings, so “Again” is useful data—not failure.</p>
        </aside>
      </section>
    </main>
  )
}

function StarPrep({ state, setState, language }: { state: LabState; setState: React.Dispatch<React.SetStateAction<LabState>>; language: 'ru' | 'en' }) {
  const ru = language === 'ru'
  const [prompt, setPrompt] = useState('career-change')
  const promptsEn: Record<string, string> = {
    'career-change': 'Why are you changing your career direction, and why Data Science now?',
    ozon: 'Why Ozon Bank and why modelling banking products?',
    failure: 'Tell me about a time your analysis or model was wrong.',
    ambiguity: 'Tell me about a time you solved an ambiguous problem with data.',
  }
  const promptsRu: Record<string, string> = { 'career-change': 'Почему вы решили сменить карьерное направление и почему именно Data Science?', ozon: 'Почему Ozon Банк и моделирование банковских продуктов?', failure: 'Расскажите о случае, когда ваш анализ или модель оказались неверными.', ambiguity: 'Расскажите, как вы решали неоднозначную задачу с помощью данных.' }
  const prompts = ru ? promptsRu : promptsEn
  const fields = ru ? ['Ситуация', 'Задача', 'Действия', 'Результат', 'Вывод'] : ['Situation', 'Task', 'Action', 'Result', 'Learning']
  return <div className="star-card glass"><div className="eyebrow">{ru ? 'РЕКРУТЕР + ЗАЩИТА РЕЗЮМЕ' : 'RECRUITER + CV DEFENCE'}</div><div className="star-head"><h2>{ru ? 'Конструктор ответа STAR' : 'STAR story builder'}</h2><select value={prompt} onChange={e => setPrompt(e.target.value)}>{Object.entries(prompts).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
    <p className="star-question">{prompts[prompt]}</p>
    <div className="star-fields">{fields.map((field, i) => { const key = `${prompt}:${field}`; return <label key={field}><span>{String(i + 1).padStart(2, '0')} · {field}</span><textarea value={state.star[key] || ''} onChange={e => setState(s => ({ ...s, star: { ...s.star, [key]: e.target.value } }))} placeholder={field === 'Result' ? 'Quantify impact; be honest about attribution.' : field === 'Action' ? 'What did you personally decide and do?' : 'Write 1–2 precise sentences.'} /></label> })}</div>
    <div className="story-rule">Career-change answer: <b>past evidence → deliberate bridge → why this role → value you bring.</b> Avoid apologising for the change; make it a coherent progression.</div>
  </div>
}
