'use client'

import { useEffect, useMemo, useState } from 'react'

type Area = 'Probability' | 'Statistics & A/B' | 'SQL' | 'Python & ML'
type Rating = 'again' | 'hard' | 'good'

type Drill = { title: string; prompt: string; hint: string; minutes: number }

const BANK: Record<Area, Drill[]> = {
  Probability: [
    { title: 'Coins · conditional probability', prompt: 'Two fair coins are tossed. Given that at least one is heads, what is P(both are heads)? Explain the sample space.', hint: 'Condition first: remove TT. Do not treat “at least one” as a specific coin.', minutes: 12 },
    { title: 'Cards · Bayes', prompt: 'Draw two cards without replacement. What is P(the first was an ace | the second is an ace)? Derive it, then explain intuitively.', hint: 'Symmetry is a useful check; also write Bayes explicitly.', minutes: 14 },
    { title: 'Traffic lights · expectation', prompt: 'You cross 5 independent traffic lights, each red with p=0.4. Find E[red], Var(red), and P(at least 2 red).', hint: 'Recognize a Binomial random variable.', minutes: 15 },
    { title: 'Chess · combinations', prompt: 'Eight rooks are placed uniformly on an 8×8 board, one per row. What is the probability no two attack each other?', hint: 'Count all column assignments, then favorable permutations.', minutes: 14 },
  ],
  'Statistics & A/B': [
    { title: 'A/B · conversion', prompt: 'Control: 10,000 users, 8.0% conversion. Treatment: 9,800 users, 8.6%. Formulate H₀/H₁, choose a test, and describe the decision.', hint: 'Two-proportion z-test; discuss practical significance and confidence interval.', minutes: 18 },
    { title: 'T-test · assumptions', prompt: 'When is a Welch t-test preferable to Student’s t-test? What changes when observations are paired?', hint: 'Variance equality and independence are the key distinctions.', minutes: 12 },
    { title: 'Bootstrap · confidence interval', prompt: 'Explain how to bootstrap a 95% CI for median transaction value. What can go wrong with dependent observations?', hint: 'Resample units, not rows, when rows share a customer.', minutes: 15 },
    { title: 'Experiment design · banking', prompt: 'Design an experiment for a new credit-limit recommendation. Choose unit, primary metric, guardrails, duration, and risks.', hint: 'Think defaults, revenue, approval rate, interference and delayed outcomes.', minutes: 20 },
  ],
  SQL: [
    { title: 'Window functions · retention', prompt: 'Given payments(user_id, paid_at, amount), return each user’s first payment, previous payment, and days since previous payment.', hint: 'MIN() OVER and LAG() OVER (PARTITION BY user_id ORDER BY paid_at).', minutes: 18 },
    { title: 'WITH · cohort quality', prompt: 'Compute month-1 repeat-payment rate by acquisition month. State the grain of every CTE before writing SQL.', hint: 'Build user cohort → activity month → aggregate. Protect against duplicate rows.', minutes: 22 },
    { title: 'JOIN · missing customers', prompt: 'Find customers who applied for credit but have no decision. Explain why LEFT JOIN + IS NULL is safer than NOT IN here.', hint: 'NULL semantics make NOT IN surprising.', minutes: 12 },
    { title: 'Ranking · top products', prompt: 'Return the top 3 products by revenue inside each category, including ties.', hint: 'Aggregate first, then DENSE_RANK by category.', minutes: 15 },
  ],
  'Python & ML': [
    { title: 'pandas · customer features', prompt: 'From transactions, create per-customer recency, frequency, mean amount, and 30-day spend without row-wise apply.', hint: 'groupby/agg, named aggregations, datetime arithmetic.', minutes: 18 },
    { title: 'pandas · data quality', prompt: 'A merge unexpectedly doubles the row count. Diagnose it and show checks that prevent silent many-to-many joins.', hint: 'Check key uniqueness and use merge(validate=...).', minutes: 14 },
    { title: 'ML · credit validation', prompt: 'Design validation for a default model. Why can a random split overestimate production quality?', hint: 'Time split, leakage, delayed labels, stability across cohorts.', minutes: 20 },
    { title: 'Boosting · imbalance', prompt: 'For a 3% default target, compare ROC-AUC, PR-AUC, recall, precision and calibration. Which matter to the bank?', hint: 'Tie metric choice to the decision threshold and cost of errors.', minutes: 18 },
  ],
}

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
