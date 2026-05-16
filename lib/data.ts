export type ProblemStatus = 'done' | 'pending' | 'failed'
export type MistakeStatus = 'active' | 'gated' | 'remediated'
export type GateStatus = 'passed' | 'active' | 'locked'

export interface Problem {
  id: string
  leetcode?: number
  title: string
  pattern: string
  paRelevance: string
  status: ProblemStatus
  date?: string
  url?: string
}

export interface Day {
  number: number
  title: string
  frog?: string
  problems: Problem[]
  pandasTasks?: string[]
  sqlTasks?: string[]
}

export interface Week {
  number: number
  focus: string
  days: Day[]
}

export interface Gate {
  id: string
  label: string
  unlocksDay: string
  requirement: string
  linkedMistakes: string[]
  status: GateStatus
}

export interface MistakeBug {
  line: string
  explanation: string
}

export interface Mistake {
  id: string
  problem: string
  date: string
  week: string
  status: MistakeStatus
  bugs: MistakeBug[]
  rootCause: string
  remediation: string[]
  remediationDone: boolean[]
}

export interface SessionStep {
  phase: string
  duration: string
  items: string[]
}

export const GATES: Gate[] = [
  {
    id: 'G1',
    label: 'Gate 1',
    unlocksDay: 'Day 2',
    requirement: 'Write both set-dedup patterns from memory, zero bugs',
    linkedMistakes: ['ML-001', 'ML-002'],
    status: 'passed',
  },
  {
    id: 'G2',
    label: 'Gate 2',
    unlocksDay: 'Day 3',
    requirement: 'Write Two Sum from memory + trace [2,7,11,15] target=9 on paper, zero bugs',
    linkedMistakes: ['ML-005', 'ML-006'],
    status: 'active',
  },
]

export const MISTAKES: Mistake[] = [
  {
    id: 'ML-001',
    problem: '#217 Contains Duplicate',
    date: '2026-05-13',
    week: 'Week 1, Day 1',
    status: 'active',
    bugs: [
      { line: 'encount=0 inside for', explanation: 'Resets counter every iteration — move OUTSIDE loop' },
      { line: 'if i in x', explanation: 'i comes FROM x — always True, detects nothing' },
      { line: 'Entire approach', explanation: 'Used manual count — should use set (Day 1 lesson)' },
    ],
    rootCause: "Set mental model not applied. Knew 'set = bag, no duplicates' but didn't connect it.",
    remediation: [
      'Write Pattern 2 (seen-set) from memory 3× without looking',
      'Explain set dedup out loud',
      'Re-solve #217 on LeetCode blind',
      'Solve #219 Contains Duplicate II',
    ],
    remediationDone: [false, false, false, false],
  },
  {
    id: 'ML-002',
    problem: '#217 Contains Duplicate (seen-set)',
    date: '2026-05-13',
    week: 'Week 1, Day 1',
    status: 'active',
    bugs: [
      { line: 'seen.add(n) missing', explanation: 'seen stays empty forever → always returns False' },
    ],
    rootCause: 'Knows CHECK (if n in seen) but forgot UPDATE (seen.add(n)). Two-step ritual: check THEN add.',
    remediation: [
      'Write full seen-set 5× — both lines: if n in seen AND seen.add(n)',
      'Verbal check: say "check, then add" out loud after writing',
    ],
    remediationDone: [false, false],
  },
  {
    id: 'ML-003',
    problem: 'Indentation (recurring)',
    date: '2026-05-13',
    week: 'Week 1, Day 1',
    status: 'active',
    bugs: [
      { line: 'seen = set() at col 0', explanation: 'Class body needs 8 spaces (2 levels)' },
      { line: ' for i in x:', explanation: 'Leading space before for — remove it' },
      { line: ' class Solution:', explanation: 'class must be at column 0' },
    ],
    rootCause: 'Indentation map not automatic. 3+ errors in one session.',
    remediation: [
      'Before every submission: scan each line for correct column',
      'Write indentation map from memory once per day this week',
    ],
    remediationDone: [false, false],
  },
  {
    id: 'ML-004',
    problem: 'Missing self in class method',
    date: '2026-05-13',
    week: 'Week 1, Day 1',
    status: 'active',
    bugs: [
      { line: 'def check_dup(x):', explanation: 'No self — every class method takes self as first arg' },
    ],
    rootCause: 'LeetCode template not memorized cold.',
    remediation: ['Memorize LeetCode template cold (Card 14 in Drill Deck)'],
    remediationDone: [false],
  },
  {
    id: 'ML-005',
    problem: '#1 Two Sum',
    date: '2026-05-14',
    week: 'Week 1, Day 1',
    status: 'gated',
    bugs: [
      { line: 'seen.add(n)', explanation: ".add() is set method. Dict: seen[n] = i" },
      { line: 'complement[i]', explanation: "complement is int, can't index it" },
      { line: 'n[i]', explanation: "n is int from enumerate, can't index it" },
      { line: 'return (complement[i], n[i])', explanation: 'Return indices not values: [seen[complement], i]' },
    ],
    rootCause: 'Dict vs set API confusion + returning values instead of indices.',
    remediation: [
      'Write full Two Sum from memory. Verify seen[n] = i not seen.add(n)',
      'Verify return is [seen[complement], i] — two indices in a list',
      'Trace [2,7,11,15] target=9 on paper before submitting',
    ],
    remediationDone: [false, false, false],
  },
  {
    id: 'ML-006',
    problem: '#1 Two Sum (retry)',
    date: '2026-05-16',
    week: 'Week 1 retry',
    status: 'active',
    bugs: [
      { line: 'seen[compliment, x]', explanation: 'Tuple key never stored. Should be seen[complement]' },
      { line: 'return seen[compliment, x]', explanation: 'Return [seen[complement], i] — two indices' },
      { line: 'seen[x].appen(i)', explanation: 'Uninitialized key + typo. Should be seen[x] = i' },
    ],
    rootCause: 'ML-001 pattern repeating (mutate before init) + ML-005 return format still confused.',
    remediation: [
      'Write Two Sum from memory, match correct solution exactly',
      'Trace [2,7,11,15] target=9 on paper: show seen state after each step',
      'Pass Gate 2 to unlock Day 3',
    ],
    remediationDone: [false, false, false],
  },
]

export const WEEKS: Week[] = [
  {
    number: 1,
    focus: 'Data structures + pandas basics + SQL warm-up',
    days: [
      {
        number: 1,
        title: 'Data Structures Foundation',
        frog: 'Two Sum first',
        problems: [
          { id: 'w1d1-1', leetcode: 1, title: 'Two Sum', pattern: 'Dict O(1) lookup', paRelevance: 'Fast ID matching in event data', status: 'done', date: '2026-05-14', url: 'https://leetcode.com/problems/two-sum/' },
          { id: 'w1d1-2', leetcode: 217, title: 'Contains Duplicate', pattern: 'Set dedup', paRelevance: 'Remove duplicate events', status: 'done', date: '2026-05-13', url: 'https://leetcode.com/problems/contains-duplicate/' },
          { id: 'w1d1-3', leetcode: 242, title: 'Valid Anagram', pattern: 'Dict counting', paRelevance: 'Same as .value_counts()', status: 'done', date: '2026-05-16', url: 'https://leetcode.com/problems/valid-anagram/' },
        ],
      },
      {
        number: 2,
        title: 'Comprehensions + Strings',
        frog: 'Group Anagrams first',
        problems: [
          { id: 'w1d2-1', leetcode: 49, title: 'Group Anagrams', pattern: 'Dict of lists', paRelevance: 'Grouping events by key', status: 'done', date: '2026-05-16', url: 'https://leetcode.com/problems/group-anagrams/' },
          { id: 'w1d2-2', leetcode: 387, title: 'First Unique Character', pattern: 'Dict + iteration', paRelevance: 'Category frequency in logs', status: 'pending', url: 'https://leetcode.com/problems/first-unique-character-in-a-string/' },
          { id: 'w1d2-3', leetcode: 14, title: 'Longest Common Prefix', pattern: 'String slicing', paRelevance: 'URL/path parsing', status: 'pending', url: 'https://leetcode.com/problems/longest-common-prefix/' },
        ],
      },
      {
        number: 3,
        title: 'Pandas Basics',
        frog: 'LC Pandas Study Plan — first 5',
        pandasTasks: ['pd.DataFrame({}) — create', '.shape — size', '.head(n) — first rows', "df['col'] — select column", '.iloc[n] — select row'],
        problems: [],
      },
      {
        number: 4,
        title: 'Pandas Transformation',
        frog: 'LC Pandas Study Plan — next 4',
        pandasTasks: ["df['new'] = df['a'] * 2 — new column", ".rename(columns={'old':'new'})", ".astype('float64') — type cast", '.fillna(0) — fill nulls'],
        problems: [],
      },
      {
        number: 5,
        title: 'Pandas Cleaning + GroupBy',
        frog: 'GroupBy aggregation first',
        pandasTasks: ['.drop_duplicates()', ".dropna(subset=['col'])", "df[df['col']>val]", ".sort_values('date')", ".groupby('user_id')['revenue'].sum()"],
        problems: [],
      },
      {
        number: 6,
        title: 'SQL Warm-up',
        frog: 'SQL 50 Study Plan — first 5',
        sqlTasks: ['#595 Big Countries — SELECT + WHERE + OR', '#1757 Recyclable Products — AND', '#584 Find Customer Referee — NULL handling', '#1683 Invalid Tweets — LENGTH()', '#1148 Article Views — self-reference'],
        problems: [],
      },
      { number: 7, title: 'Integration + Recall', frog: 'No new material — consolidation', problems: [] },
    ],
  },
  {
    number: 2,
    focus: 'Pandas advanced (merge, groupby, pivot) + SQL aggregations + JOINs + Retention Table',
    days: [
      { number: 1, title: 'Pandas Merge (= SQL JOIN)', frog: "how='left' first", pandasTasks: ["merge(users, events, on='user_id', how='inner')", "merge(users, events, on='user_id', how='left')", 'Find churned: LEFT JOIN + isna()'], problems: [] },
      { number: 2, title: 'GroupBy Deep Dive', frog: '.agg() with multiple functions', pandasTasks: [".groupby('country')['revenue'].agg(['sum','mean','count'])", ".agg({'col1':['sum'],'col2':'count'})", ".transform('mean') — keeps rows"], problems: [] },
      { number: 3, title: 'Pivot Table + Retention Table', frog: 'Build retention table from scratch', pandasTasks: ['pivot_table(values/index/columns/aggfunc)', 'melt — unpivot', 'Retention: first_seen → days_since → pd.cut → nunique'], problems: [] },
      { number: 4, title: 'SQL GROUP BY + HAVING', frog: 'HAVING — hardest concept', sqlTasks: ['GROUP BY + COUNT/SUM', 'HAVING COUNT(*) >= N', 'WHERE vs HAVING distinction', 'SQL 50: aggregation 6-10'], problems: [] },
      { number: 5, title: 'SQL JOINs', frog: 'LEFT JOIN + IS NULL pattern', sqlTasks: ['INNER JOIN — matching rows only', 'LEFT JOIN — all left + NaN right', 'Self-join', 'NULL trap: != 2 misses NULLs'], problems: [] },
      {
        number: 6, title: 'Python Logic + Frequency', frog: 'Top K Frequent Elements',
        problems: [
          { id: 'w2d6-1', leetcode: 347, title: 'Top K Frequent Elements', pattern: 'Dict count + sort', paRelevance: 'Top K users by revenue', status: 'pending', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
          { id: 'w2d6-2', leetcode: 169, title: 'Majority Element', pattern: 'Dict / Boyer-Moore', paRelevance: 'Dominant category in event log', status: 'pending', url: 'https://leetcode.com/problems/majority-element/' },
        ],
      },
      { number: 7, title: 'Integration + Retention Recall', frog: 'No new material', problems: [] },
    ],
  },
  {
    number: 3,
    focus: 'SQL Window Functions + CTEs + Pandas Time Series + Funnel + DAU/MAU',
    days: [
      { number: 1, title: 'SQL Window Functions — Ranking', frog: 'DENSE_RANK with PARTITION BY', sqlTasks: ['ROW_NUMBER / RANK / DENSE_RANK', 'PARTITION BY + ORDER BY', 'Top N per group'], problems: [] },
      { number: 2, title: 'SQL Window Functions — Running Totals', frog: 'SUM OVER (ORDER BY date)', sqlTasks: ['SUM() OVER (PARTITION BY)', 'LAG() / LEAD()', '7-day rolling revenue'], problems: [] },
      { number: 3, title: 'CTEs', frog: 'Multi-step CTE chains', sqlTasks: ['WITH cte AS (...)', 'CTE chains', 'CTE vs subquery'], problems: [] },
      { number: 4, title: 'Pandas Time Series', frog: 'resample — most complex', pandasTasks: ['pd.to_datetime()', '.dt.days / .dt.month', ".resample('7D').sum()", 'rolling(7).mean()'], problems: [] },
      { number: 5, title: 'Funnel + DAU/MAU', frog: 'Funnel drop-off', pandasTasks: ['DAU: nunique per date', 'MAU: rolling 30-day window', 'Funnel: step-by-step counts', 'Conversion rate per step'], problems: [] },
      { number: 6, title: 'SQL Full Queries', sqlTasks: ['D7 retention in SQL', 'Funnel in SQL', 'SQL 50: window function problems'], problems: [] },
      { number: 7, title: 'Integration + Mock Query', frog: 'No new material', problems: [] },
    ],
  },
  {
    number: 4,
    focus: 'Integration + mock interviews + A/B test + full case practice',
    days: [
      { number: 1, title: 'A/B Test Aggregation', pandasTasks: ['Split control/treatment', 'Compare conversion rates', 't-test with scipy.stats', 'groupby + agg across variants'], problems: [] },
      { number: 2, title: 'Full SQL Mock', sqlTasks: ['Write full PA query from scratch', 'Retention + funnel + JOIN + window', 'No notes, 25 min timer'], problems: [] },
      { number: 3, title: 'Python Integration', frog: 'Full pipeline from memory', problems: [] },
      { number: 4, title: 'Mock Case 1', problems: [] },
      { number: 5, title: 'Mock Case 2', problems: [] },
      { number: 6, title: 'Mock Case 3', problems: [] },
      { number: 7, title: 'Final Review', problems: [] },
    ],
  },
]

export const SESSION_STEPS: SessionStep[] = [
  {
    phase: 'Before',
    duration: '2 min',
    items: [
      'Open Mistake Log — read all active mistakes aloud',
      'State the ML pattern to watch this session',
      'Set Pomodoro timer (25 min)',
    ],
  },
  {
    phase: 'During',
    duration: '25 min',
    items: [
      'Write solution on paper first (no IDE) — forces real recall',
      'Translate to IDE only after full attempt',
      'If fails: no hints for 5 min, think first',
    ],
  },
  {
    phase: 'After',
    duration: '5 min',
    items: [
      'Feynman: explain solution in 1-2 sentences',
      'Mistake audit: did any ML-00X pattern fire?',
      'One flashcard: the fix, not the bug',
    ],
  },
]

export const HABIT_STACK = [
  { cue: 'Morning coffee', action: 'Open Mistake Log FIRST (not IDE)', duration: '2 min' },
  { cue: 'Timer starts', action: 'LeetCode FROG — hardest problem', duration: '25 min' },
  { cue: 'After session', action: "Feynman: explain today's concept", duration: '5 min' },
  { cue: 'After dinner', action: "Plan tomorrow's FROG", duration: '3 min' },
  { cue: 'Before sleep', action: "Paper recall of today's methods", duration: '5 min' },
]

export const AREA_WEIGHTS = [
  { area: 'SQL', weight: 5, focus: 'Window functions, CTEs, aggregations, JOINs' },
  { area: 'Python / pandas', weight: 4, focus: 'DataFrame ops, groupby, merge, pivot, cleaning' },
  { area: 'Product metrics', weight: 4, focus: 'DAU/MAU, retention, funnel, LTV, A/B logic' },
  { area: 'Basic Python logic', weight: 3, focus: 'Dict/list ops, comprehensions, string handling' },
  { area: 'Hard algorithms', weight: 1, focus: 'Almost none — not SWE role' },
]

// ─── HOW TO UPDATE DAILY ──────────────────────────────────────────────────────
//
// Current day auto-tracks from START_DATE in app/page.tsx — no edits needed.
//
// Mark problem done → click checkbox in dashboard (localStorage, instant).
// Mark gate passed  → click "Mark passed" in Gates panel (localStorage, instant).
//
// New mistake after session → copy template below into MISTAKES array above,
// fill in the fields, then: git add -A && git push
// Vercel redeploys in ~30s automatically.
//
// ─── NEW MISTAKE TEMPLATE ─────────────────────────────────────────────────────
//
// {
//   id: 'ML-007',                          // next sequential ID
//   problem: '#X Problem Name',
//   date: '2026-XX-XX',
//   week: 'Week X, Day X',
//   status: 'active',                      // active | gated | remediated
//   bugs: [
//     { line: 'the_bad_code', explanation: 'what went wrong and why' },
//   ],
//   rootCause: 'One sentence: what mental model was missing.',
//   remediation: [
//     'Specific action to fix it',
//     'Write from memory N times',
//   ],
//   remediationDone: [false, false],        // one false per remediation item
// },
//
// ─── NEW PROBLEM TEMPLATE ─────────────────────────────────────────────────────
//
// To mark a problem solved, click the checkbox in the dashboard.
// To add a new problem to the curriculum, add to the relevant week/day above:
//
// { id: 'w1d2-4', leetcode: 219, title: 'Contains Duplicate II',
//   pattern: 'Sliding window + set', paRelevance: 'Session-based dedup',
//   status: 'pending', url: 'https://leetcode.com/problems/contains-duplicate-ii/' },
