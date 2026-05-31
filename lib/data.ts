export type ProblemStatus = 'done' | 'pending' | 'failed'
export type MistakeStatus = 'active' | 'gated' | 'remediated'
export type GateStatus = 'passed' | 'active' | 'locked'
export type JobStatus = 'wishlist' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'ghosted'

export interface InterviewQuestion {
  id: string
  topic: 'SQL' | 'Python' | 'Product Metrics' | 'Coding'
  subtopic: string
  question: string
  obsidianSection: string
  weekCovered?: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface JobOpportunity {
  id: string
  company: string
  role: string
  status: JobStatus
  dateAdded: string
  dateApplied?: string
  url?: string
  notes?: string
  tags?: string[]
}

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

export interface Flashcard {
  id: string
  front: string
  back: string[]
  drill: string
  linkedMistakes?: string[]
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
    status: 'passed',
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
  {
    id: 'ML-007',
    problem: 'set[] instead of set()',
    date: '2026-05-16',
    week: 'Week 1 — Gate 1 attempt',
    status: 'active',
    bugs: [
      { line: 'seen = set[]', explanation: '`set[]` is subscript syntax → SyntaxError. Empty set = `set()` — always parentheses.' },
    ],
    rootCause: '`[]` = index/slice. `()` = call/construct. Syntax pattern not automatic under pressure.',
    remediation: [
      'Before writing: mentally say "set-open-paren" not "set-bracket"',
      'Flashcard: set() empty set · [] empty list · {} empty dict',
    ],
    remediationDone: [false, false],
  },
  {
    id: 'ML-008',
    problem: '#387 First Unique Character',
    date: '2026-05-18',
    week: 'Week 1, Day 2',
    status: 'active',
    bugs: [
      { line: 'if n in str_val: return i', explanation: 'Attempt 1: returns on first REPEAT — single-pass trap. Two loops required.' },
      { line: 'str[n] = 0', explanation: 'Attempt 1: `str` is Python built-in — shadows it. Use `count[n]`' },
      { line: 'elif: return -1', explanation: 'Attempt 1: `elif` after statement + no condition — syntax error' },
      { line: 'if count_char[n] > 1: return i', explanation: 'Attempt 2: > 1 returns first REPEATED char. Need == 1 for first UNIQUE. Missing return -1.' },
    ],
    rootCause: "Comparison direction flip: > 1 means 'seen more than once' (repeated), not unique. Also missing return -1 fallback.",
    remediation: [
      'Two-pass structure now correct ✓ — next: fix comparison to == 1',
      'Add return -1 after second loop',
      'Re-solve #387 on LeetCode — submit with == 1',
      'Explain why second loop uses enumerate(s) not .items()',
    ],
    remediationDone: [false, false, false, false],
  },
  {
    id: 'ML-009',
    problem: '#49 Group Anagrams (recall)',
    date: '2026-05-18',
    week: 'Week 1, Day 2',
    status: 'active',
    bugs: [
      { line: 'key = sorted(word)', explanation: 'sorted() returns list — unhashable, can\'t be dict key. Fix: tuple(sorted(word))' },
      { line: 'batch[key] = i', explanation: 'Stores index, overwrites on each hit. Need list accumulator: batch[key].append(word)' },
      { line: 'no init for batch[key]', explanation: 'append() on missing key → KeyError. Fix: defaultdict(list) auto-inits []' },
      { line: 'enumerate(words)', explanation: 'i never used. Just: for word in words' },
    ],
    rootCause: 'Dict value must be a list accumulator, not a scalar. defaultdict(list) handles init automatically — same ML-001 pattern (accumulator init).',
    remediation: [
      'Write from memory: defaultdict(list) + tuple(sorted(word)) + .append(word)',
      'Say before writing: "key = tuple (hashable), value = list (accumulator)"',
      'Re-solve #49 on LeetCode blind',
    ],
    remediationDone: [false, false, false],
  },
  {
    id: 'ML-010',
    problem: '#387 First Unique Character (pass 2)',
    date: '2026-05-25',
    week: 'Week 1, Day 2',
    status: 'remediated',
    bugs: [
      { line: 'for i,x in encounters(amount_enc)', explanation: 'Made-up function + iterating dict. Pass 2 must iterate the STRING: enumerate(s)' },
      { line: 'if amount_enc[n]==1', explanation: 'n is pass-1 loop var, out of scope. Use current char from enumerate: amount_enc[x]==1' },
      { line: 'else return -1 inside loop', explanation: 'Returns -1 on first non-unique char, kills loop early. return -1 belongs AFTER the loop.' },
    ],
    rootCause: 'Pass 2 mental model: tried to iterate dict instead of original string. return -1 placement — inside loop vs after loop distinction not solid.',
    remediation: [
      'Recite rule: "Pass 2 always enumerate(s) — index comes from string, not dict"',
      'Recite rule: "return -1 after loop — only when entire string scanned"',
      'Write full #387 from memory once more, zero bugs',
    ],
    remediationDone: [true, true, true],
  },
  {
    id: 'ML-011',
    problem: '#14 Longest Common Prefix',
    date: '2026-05-29',
    week: 'Week 1, Day 2',
    status: 'remediated',
    bugs: [
      { line: 'Def longest_pre', explanation: '`Def` capitalized → SyntaxError. Keyword is lowercase `def`.' },
      { line: 'prefix == strs[0]', explanation: '`==` is comparison, does nothing. Assignment needs single `=`: prefix = strs[0]' },
      { line: 'i.startwith(prefix)', explanation: 'Typo — method is `startswith` (s in the middle).' },
      { line: 'while ... then:', explanation: 'Python has no `then`. Loop header is just `while cond:`' },
      { line: 'while startswith: return prefix', explanation: 'Logic inverted. Shrink WHILE the string does NOT start with prefix: `while not s.startswith(prefix): prefix = prefix[:-1]`. Return AFTER the for-loop.' },
    ],
    rootCause: 'String-shrink mental model inverted + basic syntax slips (=/==, def, startswith). Returned too early inside the loop.',
    remediation: [
      'Recite: "for each string, shrink prefix WHILE not startswith — then move to next string"',
      'Recite: "return prefix AFTER the for-loop, not inside"',
      'Add empty-prefix guard: if prefix == "" : return ""',
      'Re-solve #14 on LeetCode blind, zero bugs',
    ],
    remediationDone: [true, true, true, true],
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
          { id: 'w1d2-2', leetcode: 387, title: 'First Unique Character', pattern: 'Dict + iteration', paRelevance: 'Category frequency in logs', status: 'done', date: '2026-05-29', url: 'https://leetcode.com/problems/first-unique-character-in-a-string/' },
          { id: 'w1d2-3', leetcode: 14, title: 'Longest Common Prefix', pattern: 'String slicing', paRelevance: 'URL/path parsing', status: 'done', date: '2026-05-31', url: 'https://leetcode.com/problems/longest-common-prefix/' },
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
        frog: '#584 Customer Referee — NULL trap (WHERE != misses NULLs, add OR IS NULL)',
        sqlTasks: ['#584 Find Customer Referee — NULL trap 🐸 FROG', '#595 Big Countries — SELECT + WHERE + OR', '#1757 Recyclable Products — AND conditions', '#1683 Invalid Tweets — LENGTH()', '#1148 Article Views — self-reference'],
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

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'FC-001',
    front: '= vs ==  — which one?',
    back: [
      '=   puts value IN   (assign)  →  x = 5 · seen[n] = i',
      '==  ASKS equal?  (compare → True/False)  →  if x == 5 · while prefix == ""',
      'RULE: inside if / while → always ==   ·   making a variable → always =',
    ],
    drill: '"if/while asks, so ==" · "naming puts in, so ="',
    linkedMistakes: ['ML-006', 'ML-008', 'ML-011'],
  },
  {
    id: 'FC-002',
    front: 'Empty set / list / dict — literal?',
    back: [
      'set()   empty set   (NO {} — that is a dict!)',
      '[]      empty list',
      '{}      empty dict',
      'set[] → SyntaxError. () = call/construct, [] = index/slice.',
    ],
    drill: '"set-open-paren, not set-bracket"',
    linkedMistakes: ['ML-007'],
  },
  {
    id: 'FC-003',
    front: 'Dict vs set — add a key?',
    back: [
      'dict:  seen[n] = i        (bracket assign, key→value)',
      'set:   seen.add(n)        (.add method, value only)',
      'Two Sum uses a DICT: seen[n] = i, return [seen[complement], i]',
    ],
    drill: '"dict bracket-equals · set dot-add"',
    linkedMistakes: ['ML-005', 'ML-006'],
  },
  {
    id: 'FC-004',
    front: 'First Unique #387 — two-pass shape?',
    back: [
      'Pass 1: count chars → for n in s: cnt[n] = cnt.get(n,0)+1',
      'Pass 2: enumerate the STRING → for i,x in enumerate(s): if cnt[x]==1: return i',
      'return -1 AFTER the loop (only when whole string scanned)',
    ],
    drill: '"pass 2 = enumerate(s), return -1 after loop"',
    linkedMistakes: ['ML-008', 'ML-010'],
  },
  {
    id: 'FC-005',
    front: 'Dict value = accumulator — init?',
    back: [
      'Need a list per key? → defaultdict(list) auto-inits []',
      'Key must be hashable: tuple(sorted(word)), NOT sorted(word) (list).',
      'Then: groups[key].append(word)',
    ],
    drill: '"key = tuple (hashable), value = list (accumulator)"',
    linkedMistakes: ['ML-009'],
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

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ── SQL ──────────────────────────────────────────────────────────────────────
  {
    id: 'Q-SQL-001', topic: 'SQL', subtopic: 'GROUP BY + HAVING',
    question: 'Find all users who made more than 3 purchases in the last 7 days.',
    obsidianSection: '## SQL — Aggregations', weekCovered: 2, difficulty: 'easy',
  },
  {
    id: 'Q-SQL-002', topic: 'SQL', subtopic: 'GROUP BY + HAVING',
    question: 'Which product categories generated revenue above the category average? (HAVING vs WHERE)',
    obsidianSection: '## SQL — Aggregations', weekCovered: 2, difficulty: 'medium',
  },
  {
    id: 'Q-SQL-003', topic: 'SQL', subtopic: 'JOINs',
    question: 'Find users who registered but never made a single purchase. (LEFT JOIN + IS NULL)',
    obsidianSection: '## SQL — JOINs', weekCovered: 2, difficulty: 'easy',
  },
  {
    id: 'Q-SQL-004', topic: 'SQL', subtopic: 'JOINs',
    question: 'Self-join: find all pairs of users who share the same country and joined in the same month.',
    obsidianSection: '## SQL — JOINs', weekCovered: 2, difficulty: 'medium',
  },
  {
    id: 'Q-SQL-005', topic: 'SQL', subtopic: 'Window Functions',
    question: 'Rank users by total revenue within each country. Return only rank ≤ 3 per country. (DENSE_RANK + PARTITION BY)',
    obsidianSection: '## SQL — Window Functions', weekCovered: 3, difficulty: 'medium',
  },
  {
    id: 'Q-SQL-006', topic: 'SQL', subtopic: 'Window Functions',
    question: 'Calculate 7-day rolling revenue per user using SUM OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW).',
    obsidianSection: '## SQL — Window Functions', weekCovered: 3, difficulty: 'hard',
  },
  {
    id: 'Q-SQL-007', topic: 'SQL', subtopic: 'Window Functions',
    question: 'Day-over-day revenue change per user. Use LAG() to compare today vs yesterday.',
    obsidianSection: '## SQL — Window Functions', weekCovered: 3, difficulty: 'medium',
  },
  {
    id: 'Q-SQL-008', topic: 'SQL', subtopic: 'CTEs',
    question: 'Write a multi-step CTE that calculates D7 retention rate: new_users → retained → ratio.',
    obsidianSection: '## SQL — CTEs', weekCovered: 3, difficulty: 'hard',
  },
  {
    id: 'Q-SQL-009', topic: 'SQL', subtopic: 'CTEs',
    question: 'Rewrite a nested subquery using CTEs. Explain when CTEs improve readability vs performance.',
    obsidianSection: '## SQL — CTEs', weekCovered: 3, difficulty: 'medium',
  },
  {
    id: 'Q-SQL-010', topic: 'SQL', subtopic: 'Funnel in SQL',
    question: 'Given an events table (user_id, event_type, timestamp), write a full funnel query: visit → signup → purchase.',
    obsidianSection: '## SQL — Funnel', weekCovered: 3, difficulty: 'hard',
  },
  // ── Python / pandas ──────────────────────────────────────────────────────────
  {
    id: 'Q-PY-001', topic: 'Python', subtopic: 'groupby + agg',
    question: 'Calculate median, mean, and count of session_duration grouped by country and device_type.',
    obsidianSection: '## Python — GroupBy', weekCovered: 2, difficulty: 'easy',
  },
  {
    id: 'Q-PY-002', topic: 'Python', subtopic: 'merge (JOIN)',
    question: 'LEFT JOIN users onto events to find churned users (no events in last 30 days). Use isna() to detect.',
    obsidianSection: '## Python — Merge', weekCovered: 2, difficulty: 'medium',
  },
  {
    id: 'Q-PY-003', topic: 'Python', subtopic: 'pivot_table',
    question: 'Build a weekly retention cohort table: rows = cohort_week, columns = weeks_since_join, values = retention %.',
    obsidianSection: '## Python — Pivot & Retention', weekCovered: 3, difficulty: 'hard',
  },
  {
    id: 'Q-PY-004', topic: 'Python', subtopic: 'time series',
    question: 'Calculate 7-day rolling average of DAU using .resample("D").nunique() + rolling(7).mean().',
    obsidianSection: '## Python — Time Series', weekCovered: 3, difficulty: 'medium',
  },
  {
    id: 'Q-PY-005', topic: 'Python', subtopic: 'funnel + DAU/MAU',
    question: 'From a raw events DataFrame, compute step-by-step funnel conversion and identify the biggest drop-off.',
    obsidianSection: '## Python — Funnel', weekCovered: 3, difficulty: 'hard',
  },
  {
    id: 'Q-PY-006', topic: 'Python', subtopic: 'A/B testing',
    question: 'Given control and treatment DataFrames, compute conversion rate, lift %, and run scipy t-test. Interpret p-value.',
    obsidianSection: '## Python — A/B Testing', weekCovered: 4, difficulty: 'hard',
  },
  {
    id: 'Q-PY-007', topic: 'Python', subtopic: 'data cleaning',
    question: 'A column has mixed types (numbers as strings, NaN). Normalize with .astype(), fillna(), and validate with .dtype.',
    obsidianSection: '## Python — Cleaning', weekCovered: 1, difficulty: 'easy',
  },
  // ── Product Metrics ──────────────────────────────────────────────────────────
  {
    id: 'Q-PM-001', topic: 'Product Metrics', subtopic: 'DAU/MAU',
    question: 'DAU/MAU dropped 15% this week. Walk me through your diagnosis framework.',
    obsidianSection: '## Metrics — DAU/MAU', weekCovered: 3, difficulty: 'medium',
  },
  {
    id: 'Q-PM-002', topic: 'Product Metrics', subtopic: 'Retention',
    question: "Define D1, D7, D30 retention. What's a healthy D30 for a consumer app? How do you improve it?",
    obsidianSection: '## Metrics — Retention', weekCovered: 3, difficulty: 'medium',
  },
  {
    id: 'Q-PM-003', topic: 'Product Metrics', subtopic: 'Funnel',
    question: 'Conversion from cart → checkout dropped 8%. What data would you look at first and why?',
    obsidianSection: '## Metrics — Funnel', weekCovered: 3, difficulty: 'hard',
  },
  {
    id: 'Q-PM-004', topic: 'Product Metrics', subtopic: 'A/B Testing',
    question: 'Your A/B test shows p=0.04 and +5% lift, but the confidence interval touches 0. Do you ship?',
    obsidianSection: '## Metrics — A/B Testing', weekCovered: 4, difficulty: 'hard',
  },
  {
    id: 'Q-PM-005', topic: 'Product Metrics', subtopic: 'North Star',
    question: 'Pick a north star metric for a B2B SaaS project management tool. Justify the choice.',
    obsidianSection: '## Metrics — North Star', weekCovered: 4, difficulty: 'medium',
  },
  {
    id: 'Q-PM-006', topic: 'Product Metrics', subtopic: 'LTV',
    question: 'How would you estimate LTV for a freemium subscription product? What data do you need?',
    obsidianSection: '## Metrics — LTV', weekCovered: 4, difficulty: 'hard',
  },
  // ── Coding ───────────────────────────────────────────────────────────────────
  {
    id: 'Q-CODE-001', topic: 'Coding', subtopic: 'Dict lookups',
    question: 'Given a list of (user_id, event_type) tuples, return a dict of unique event counts per user. O(n).',
    obsidianSection: '## Coding — Dict Patterns', weekCovered: 1, difficulty: 'easy',
  },
  {
    id: 'Q-CODE-002', topic: 'Coding', subtopic: 'Set dedup',
    question: 'Remove duplicate session IDs from a list while preserving first-seen order. O(n).',
    obsidianSection: '## Coding — Set Patterns', weekCovered: 1, difficulty: 'easy',
  },
  {
    id: 'Q-CODE-003', topic: 'Coding', subtopic: 'Frequency / Top-K',
    question: 'Given a list of page views, return the top 3 most visited pages. (Counter + most_common)',
    obsidianSection: '## Coding — Frequency', weekCovered: 2, difficulty: 'easy',
  },
  {
    id: 'Q-CODE-004', topic: 'Coding', subtopic: 'Sliding window',
    question: 'Find all users active in any consecutive 7-day window (at least 3 sessions in 7 days).',
    obsidianSection: '## Coding — Sliding Window', weekCovered: 2, difficulty: 'medium',
  },
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
