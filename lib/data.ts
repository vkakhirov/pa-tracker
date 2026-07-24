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
  {
    id: 'G3',
    label: 'Gate 3',
    unlocksDay: 'Day 3 (dict value semantics)',
    requirement: 'Write First Unique Char + Group Anagrams from memory, zero bugs. State scalar-vs-accumulator rule cold.',
    linkedMistakes: ['ML-005', 'ML-006', 'ML-008', 'ML-009'],
    status: 'passed',
  },
  {
    id: 'G4',
    label: 'Regression Gate (recurring, ~2wk)',
    unlocksDay: 'Recurring — not a one-time unlock',
    requirement: 'Cold re-solve Two Sum + a set/list dedup pattern + Longest Common Prefix from memory, zero bugs. Re-run every ~2 weeks so decay gets caught before a gap does — added after the 2026-07-23 regression (ML-012, ML-013, ML-014) on material already passed back in May.',
    linkedMistakes: ['ML-012', 'ML-013', 'ML-014'],
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
    status: 'gated',
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
    status: 'gated',
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
  {
    id: 'ML-012',
    problem: '#1 Two Sum (regression, cold recall after ~2mo gap)',
    date: '2026-07-23',
    week: 'Regression check',
    status: 'active',
    bugs: [
      { line: 'seen[n] = i  ← written BEFORE the compliment check', explanation: 'Stores current n before checking compliment. If target == 2*n, compliment equals n and matches itself same iteration → wrong pair [i, i].' },
    ],
    rootCause: 'ML-001/ML-006 family (mutate-before-check) resurfacing after a ~2 month gap with no practice — Gate 2 pattern decayed from disuse, not a new misunderstanding.',
    remediation: [
      'Move seen[n] = i to AFTER the compliment check',
      'Trace edge case nums=[3,3] target=6 by hand — confirms the bug and the fix',
      'Rewrite Two Sum from memory 2x with correct order, no lookback',
    ],
    remediationDone: [false, false, false],
  },
  {
    id: 'ML-013',
    problem: 'Freehand drill — set/list method confusion (unlabeled dedup attempt)',
    date: '2026-07-23',
    week: 'Regression check',
    status: 'active',
    bugs: [
      { line: 'filtered.add(sort[i])', explanation: "Lists don't have .add() (that's a set method) — need .append(). Also sort[i] is invalid — sort isn't subscriptable." },
      { line: 'result  (used with no init)', explanation: 'result.add(i) called but result never assigned — needs result = [] first, and .append not .add.' },
      { line: 'if i in filtered: result.add(i)', explanation: 'Fires every pass since i was just added same iteration — never actually detects duplicates across iterations.' },
    ],
    rootCause: 'Same ML-001/ML-005/ML-007 family (list vs set API + init-before-use) resurfacing — 2mo gap, no spaced repetition since last pass.',
    remediation: [
      'Drill: list.append() vs set.add() — write both 3x, say the difference aloud',
      'Rewrite as clean duplicate-finder: seen=set(), dup=[]; for i in nums: if i in seen: dup.append(i) else: seen.add(i)',
    ],
    remediationDone: [false, false],
  },
  {
    id: 'ML-014',
    problem: '#14 Longest Common Prefix (regression — was remediated 2026-05-29/31, redone cold today)',
    date: '2026-07-23',
    week: 'Regression check',
    status: 'active',
    bugs: [
      { line: 'base = strs[0:1]', explanation: 'Slice returns a list [strs[0]], not the string itself. Need base = strs[0]. New slip, not one of the original ML-011 bugs.' },
      { line: 'for i in strs  (missing colon)', explanation: 'Syntax error — needs for i in strs:' },
      { line: 'Incomplete: no shrink-on-mismatch logic', explanation: 'startswith(base) alone never converges — need the shrink loop from ML-011: while not i.startswith(base): base = base[:-1]' },
    ],
    rootCause: 'Full regression on already-remediated material (ML-011, passed ~2mo ago) — worse than the original attempt, since even the slice-vs-index basics slipped this time. Confirms decay was real, not just Two Sum/dedup.',
    remediation: [
      'Fix base = strs[0] (string, not list)',
      'Re-apply ML-011 shrink loop from memory: while not s.startswith(prefix): prefix = prefix[:-1]',
      'Complete + trace on ["flower","flow","flight"] by hand',
      'Re-solve #14 blind once clean — this is the actual Regression Gate (G4) check for this pattern',
    ],
    remediationDone: [false, false, false, false],
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

export type FocusArea = 'Probability' | 'Statistics & A/B' | 'SQL' | 'Python & ML'

export interface FocusDrill {
  title: string
  prompt: string
  hint: string
  theoryEn: string
  theoryRu: string
  minutes: number
}

export const FOCUS_BANK: Record<FocusArea, FocusDrill[]> = {
  Probability: [
    {
      title: 'Coins · conditional probability',
      prompt: 'Two fair coins are tossed. Given that at least one is heads, what is P(both are heads)? Explain the sample space.',
      hint: 'Condition first: remove TT. Do not treat “at least one” as a specific coin.',
      theoryEn: 'Conditional probability: P(A|B) = P(A∩B)/P(B). The sample space for 2 coins is {HH,HT,TH,TT}, each 1/4. Conditioning on "at least one heads" removes TT, leaving 3 equally likely outcomes {HH,HT,TH}. Answer = P(HH)/P(at least one H) = (1/4)/(3/4) = 1/3 — not 1/2, because you are not conditioning on a specific coin.',
      theoryRu: 'Условная вероятность: P(A|B) = P(A∩B)/P(B). Пространство исходов для двух монет: (орёл,орёл), (орёл,решка), (решка,орёл), (решка,решка) — по 1/4 каждый. Условие «хотя бы один орёл» убирает (решка,решка), остаются 3 равновероятных исхода. Ответ = P(оба орла)/P(хотя бы один орёл) = (1/4)/(3/4) = 1/3 — не 1/2, потому что условие не про конкретную монету, а про факт «хотя бы один».',
      minutes: 12,
    },
    {
      title: 'Cards · Bayes',
      prompt: 'Draw two cards without replacement. What is P(the first was an ace | the second is an ace)? Derive it, then explain intuitively.',
      hint: 'Symmetry is a useful check; also write Bayes explicitly.',
      theoryEn: 'Bayes: P(A|B) = P(B|A)P(A)/P(B). Here P(first=ace | second=ace) = P(second=ace|first=ace)·P(first=ace) / P(second=ace). By symmetry, P(second=ace) = P(first=ace) = 4/52 (any card is equally likely to be any rank regardless of draw order), so writing Bayes explicitly is what proves the symmetry argument rigorously rather than just asserting it.',
      theoryRu: 'Байес: P(A|B) = P(B|A)P(A)/P(B). Здесь P(первая=туз | вторая=туз) = P(вторая=туз|первая=туз)·P(первая=туз) / P(вторая=туз). По симметрии P(вторая=туз) = P(первая=туз) = 4/52 (любая карта с равной вероятностью может быть любого ранга независимо от порядка). Явная формула Байеса — способ строго доказать этот симметрийный аргумент, а не просто заявить его.',
      minutes: 14,
    },
    {
      title: 'Traffic lights · expectation',
      prompt: 'You cross 5 independent traffic lights, each red with p=0.4. Find E[red], Var(red), and P(at least 2 red).',
      hint: 'Recognize a Binomial random variable.',
      theoryEn: 'A sum of independent Bernoulli(p) trials is Binomial(n,p). Here n=5, p=0.4: E[red] = np = 2, Var(red) = np(1−p) = 1.2. P(at least 2 red) = 1 − P(0 red) − P(1 red), using P(k) = C(n,k)pᵏ(1−p)ⁿ⁻ᵏ. Recognizing "n independent yes/no trials, same p" as Binomial is the whole trick — the rest is plugging into the formula.',
      theoryRu: 'Сумма независимых испытаний Бернулли(p) — это Биномиальное(n,p). Здесь n=5, p=0.4: E[красный] = np = 2, Var(красный) = np(1−p) = 1.2. P(хотя бы 2 красных) = 1 − P(0) − P(1), где P(k) = C(n,k)pᵏ(1−p)ⁿ⁻ᵏ. Главное — распознать «n независимых да/нет испытаний с одинаковым p» как биномиальное распределение, дальше просто подстановка в формулу.',
      minutes: 15,
    },
    {
      title: 'Chess · combinations',
      prompt: 'Eight rooks are placed uniformly on an 8×8 board, one per row. What is the probability no two attack each other?',
      hint: 'Count all column assignments, then favorable permutations.',
      theoryEn: 'Define the sample space first: each rook independently and uniformly picks a column, one per row, so total outcomes = 8⁸. "No two attack" means all 8 columns are distinct — a permutation of 8 columns — so favorable outcomes = 8!. P(no attack) = 8!/8⁸. The whole exercise is choosing the right sample space (with repetition allowed across rows) before counting favorable cases.',
      theoryRu: 'Сначала пространство исходов: каждая ладья независимо и равновероятно выбирает столбец, по одной в ряд, всего исходов = 8⁸. «Никто никого не бьёт» значит все 8 столбцов различны — перестановка из 8, значит благоприятных исходов = 8!. P(не бьют) = 8!/8⁸. Всё упражнение сводится к правильному выбору пространства исходов (с повторением по рядам) прежде подсчёта благоприятных случаев.',
      minutes: 14,
    },
  ],
  'Statistics & A/B': [
    {
      title: 'A/B · conversion',
      prompt: 'Control: 10,000 users, 8.0% conversion. Treatment: 9,800 users, 8.6%. Formulate H₀/H₁, choose a test, and describe the decision.',
      hint: 'Two-proportion z-test; discuss practical significance and confidence interval.',
      theoryEn: 'Two-proportion z-test: H0: p_control = p_treatment. Pooled p̂ = (x1+x2)/(n1+n2), SE = √(p̂(1−p̂)(1/n1+1/n2)), z = (p̂1−p̂2)/SE, compared to ±1.96 for α=0.05. Always pair the significance test with practical significance: is the lift worth the engineering/rollout cost, and does the 95% CI for the difference exclude 0?',
      theoryRu: 'Z-тест для двух пропорций: H0: p_контроль = p_тест. Объединённая p̂ = (x1+x2)/(n1+n2), SE = √(p̂(1−p̂)(1/n1+1/n2)), z = (p̂1−p̂2)/SE, сравниваем с ±1.96 при α=0.05. Значимость всегда стоит дополнять практической значимостью: стоит ли лифт затрат на внедрение, и не пересекает ли 95% ДИ разницы ноль.',
      minutes: 18,
    },
    {
      title: 'T-test · assumptions',
      prompt: 'When is a Welch t-test preferable to Student’s t-test? What changes when observations are paired?',
      hint: 'Variance equality and independence are the key distinctions.',
      theoryEn: "Student's t-test assumes equal variances between groups; Welch's does not (it adjusts degrees of freedom via the Welch-Satterthwaite equation) — Welch is the safer default since equal variance is rarely guaranteed, and it costs almost nothing when variances ARE equal. Paired data (same unit measured twice, e.g. before/after) needs a paired t-test on the differences, not an independent two-sample test — pairing removes between-subject variance and increases power.",
      theoryRu: 'Т-тест Стьюдента предполагает равенство дисперсий групп; тест Уэлча — нет (корректирует степени свободы через уравнение Уэлча-Саттеруэйта). Уэлч — более безопасный дефолт, так как равенство дисперсий редко гарантировано, а цена перехода на Уэлча почти нулевая, если дисперсии всё же равны. Парные данные (один объект измерен дважды, например до/после) требуют парного t-теста на разностях, а не независимого двухвыборочного — парность убирает межсубъектную дисперсию и повышает мощность.',
      minutes: 12,
    },
    {
      title: 'Bootstrap · confidence interval',
      prompt: 'Explain how to bootstrap a 95% CI for median transaction value. What can go wrong with dependent observations?',
      hint: 'Resample units, not rows, when rows share a customer.',
      theoryEn: 'Bootstrap CI: resample the observed data WITH replacement many times (e.g. 10,000x), compute the statistic (median) on each resample, then take the 2.5th/97.5th percentiles of that distribution as the 95% CI — no distributional assumption needed. The failure mode: if observations are not independent (e.g. multiple transactions per customer), resampling individual rows understates the true variance — you must resample whole customers (clusters), not rows, to preserve the real dependence structure.',
      theoryRu: 'Бутстрап-ДИ: пересэмплируем исходные данные С возвращением много раз (например, 10 000), считаем статистику (медиану) на каждой копии, берём 2.5-й/97.5-й перцентили этого распределения как 95% ДИ — без предположений о распределении. Ловушка: если наблюдения не независимы (например, несколько транзакций на клиента), пересэмплирование строк по отдельности занижает истинную дисперсию — нужно пересэмплировать целых клиентов (кластеры), а не строки, чтобы сохранить реальную структуру зависимости.',
      minutes: 15,
    },
    {
      title: 'Experiment design · banking',
      prompt: 'Design an experiment for a new credit-limit recommendation. Choose unit, primary metric, guardrails, duration, and risks.',
      hint: 'Think defaults, revenue, approval rate, interference and delayed outcomes.',
      theoryEn: 'A full experiment design needs: (1) randomization unit — usually the customer, not the request, to avoid interference; (2) primary metric — one number the decision hinges on, decided BEFORE launch; (3) guardrail metrics — things that must not get worse (complaints, revenue); (4) duration/power — sample size from a power calculation, not a gut feeling; (5) risks — delayed outcomes (defaults surface months later), interference between units, and regulatory/fairness constraints specific to lending.',
      theoryRu: 'Полный дизайн эксперимента требует: (1) единица рандомизации — обычно клиент, а не запрос, чтобы избежать интерференции; (2) основная метрика — одно число, от которого зависит решение, выбранное ДО запуска; (3) guardrail-метрики — то, что не должно ухудшиться (жалобы, выручка); (4) длительность/мощность — размер выборки из расчёта мощности, а не на глаз; (5) риски — отложенные исходы (дефолты проявляются месяцы спустя), интерференция между единицами, регуляторные и fairness-ограничения кредитования.',
      minutes: 20,
    },
  ],
  SQL: [
    {
      title: 'Window functions · retention',
      prompt: 'Given payments(user_id, paid_at, amount), return each user’s first payment, previous payment, and days since previous payment.',
      hint: 'MIN() OVER and LAG() OVER (PARTITION BY user_id ORDER BY paid_at).',
      theoryEn: 'Window functions compute a per-row value across a set of related rows WITHOUT collapsing them (unlike GROUP BY). MIN(paid_at) OVER (PARTITION BY user_id) gives each row that user\'s first payment date. LAG(paid_at) OVER (PARTITION BY user_id ORDER BY paid_at) gives the previous row\'s value within the same partition — subtract from the current row for days-since-previous. PARTITION BY resets the window per group; ORDER BY inside the window controls what "previous/next" means.',
      theoryRu: 'Оконные функции считают значение для каждой строки по набору связанных строк БЕЗ схлопывания (в отличие от GROUP BY). MIN(paid_at) OVER (PARTITION BY user_id) — дата первого платежа этого пользователя в каждой строке. LAG(paid_at) OVER (PARTITION BY user_id ORDER BY paid_at) — значение предыдущей строки в том же разделе — вычесть из текущей, чтобы получить дни с прошлого платежа. PARTITION BY сбрасывает окно по группам, ORDER BY внутри окна задаёт, что значит «предыдущий/следующий».',
      minutes: 18,
    },
    {
      title: 'WITH · cohort quality',
      prompt: 'Compute month-1 repeat-payment rate by acquisition month. State the grain of every CTE before writing SQL.',
      hint: 'Build user cohort → activity month → aggregate. Protect against duplicate rows.',
      theoryEn: 'A CTE (WITH clause) names an intermediate result so a multi-step query reads top-to-bottom instead of nesting subqueries inside subqueries. Before writing SQL, state the GRAIN of each CTE out loud: "one row per user", "one row per user per month" — most cohort bugs come from an accidental grain change (a JOIN silently fans one user-row into N payment-rows) that is not caught until the final aggregate is wrong. CTEs help readability; they do not automatically fix a grain mistake.',
      theoryRu: 'CTE (WITH) даёт имя промежуточному результату, чтобы многошаговый запрос читался сверху вниз, а не вложенными подзапросами. Перед написанием SQL проговорите GRAIN (гранулярность) каждого CTE: «одна строка на пользователя», «одна строка на пользователя в месяц» — большинство багов в когортах из-за незаметной смены гранулярности (JOIN размножает одну строку пользователя в N строк платежей), которая всплывает только в финальной агрегации. CTE улучшают читаемость, но не исправляют ошибку в grain автоматически.',
      minutes: 22,
    },
    {
      title: 'JOIN · missing customers',
      prompt: 'Find customers who applied for credit but have no decision. Explain why LEFT JOIN + IS NULL is safer than NOT IN here.',
      hint: 'NULL semantics make NOT IN surprising.',
      theoryEn: 'LEFT JOIN customers to decisions and filter WHERE decision.id IS NULL — finds customers with no matching decision row. NOT IN (SELECT customer_id FROM decisions) looks equivalent but is dangerous: if the subquery returns even one NULL customer_id, NOT IN returns zero rows for the ENTIRE query (NULL breaks all comparisons, including != and NOT IN). LEFT JOIN + IS NULL does not have this trap, which is why it is the standard idiom for "exists in A but not B".',
      theoryRu: 'LEFT JOIN клиентов к решениям и фильтр WHERE decision.id IS NULL — находит клиентов без соответствующего решения. NOT IN (SELECT customer_id FROM decisions) выглядит эквивалентно, но опасно: если подзапрос вернёт хотя бы один NULL customer_id, NOT IN вернёт ноль строк для ВСЕГО запроса (NULL ломает все сравнения, включая != и NOT IN). У LEFT JOIN + IS NULL этой ловушки нет — поэтому это стандартная идиома для «есть в A, но нет в B».',
      minutes: 12,
    },
    {
      title: 'Ranking · top products',
      prompt: 'Return the top 3 products by revenue inside each category, including ties.',
      hint: 'Aggregate first, then DENSE_RANK by category.',
      theoryEn: 'Aggregate first (SUM revenue per product per category), THEN rank — ranking raw unaggregated rows gives the wrong answer. DENSE_RANK() OVER (PARTITION BY category ORDER BY revenue DESC) assigns ranks with NO gaps after ties (two products tied for #1 both get rank 1, next gets rank 2) — contrast with RANK(), which would skip to 3. Filter WHERE rank <= 3 in an outer query or CTE, since a window function cannot be filtered directly in its own SELECT\'s WHERE clause.',
      theoryRu: 'Сначала агрегируем (SUM выручки по продукту в категории), ПОТОМ ранжируем — ранжирование сырых неагрегированных строк даёт неверный ответ. DENSE_RANK() OVER (PARTITION BY category ORDER BY revenue DESC) даёт ранги без пропусков после связей (два продукта на 1-м месте оба получают ранг 1, следующий — ранг 2) — в отличие от RANK(), который пропустил бы до 3. Фильтр WHERE rank <= 3 делается во внешнем запросе или CTE, так как оконную функцию нельзя фильтровать напрямую в WHERE того же SELECT.',
      minutes: 15,
    },
  ],
  'Python & ML': [
    {
      title: 'pandas · customer features',
      prompt: 'From transactions, create per-customer recency, frequency, mean amount, and 30-day spend without row-wise apply.',
      hint: 'groupby/agg, named aggregations, datetime arithmetic.',
      theoryEn: "groupby('customer_id').agg(...) with named aggregations — agg(recency=('date','max'), frequency=('date','count')) — computes multiple stats per group in one vectorized pass, no row-wise apply (an O(n) Python-level loop, slow). Recency needs datetime arithmetic: (reference_date - df.groupby('customer_id')['date'].transform('max')).dt.days. transform() keeps the original row count (broadcasts the group stat back to every row), unlike agg() which collapses to one row per group.",
      theoryRu: "groupby('customer_id').agg(...) с именованными агрегациями — agg(recency=('date','max'), frequency=('date','count')) — считает несколько статистик на группу за один векторизованный проход, без построчного apply (O(n) цикл на уровне Python, медленно). Recency требует арифметики с датами: (reference_date - df.groupby('customer_id')['date'].transform('max')).dt.days. transform() сохраняет исходное число строк (транслирует статистику группы обратно на каждую строку), в отличие от agg(), который схлопывает до одной строки на группу.",
      minutes: 18,
    },
    {
      title: 'pandas · data quality',
      prompt: 'A merge unexpectedly doubles the row count. Diagnose it and show checks that prevent silent many-to-many joins.',
      hint: 'Check key uniqueness and use merge(validate=...).',
      theoryEn: "A merge multiplying row count means the join key is not unique on at least one side — every match on the many side gets cross-joined against every match on the other many side. Check key uniqueness BEFORE merging: df['key'].duplicated().sum(), or use merge(..., validate='one_to_many') / 'one_to_one' — pandas raises a MergeError if the assumption is violated, catching the bug at merge time instead of silently in downstream numbers.",
      theoryRu: "Умножение числа строк при merge означает, что ключ join не уникален хотя бы с одной стороны — каждое совпадение с «многие»-стороны кросс-джойнится с каждым совпадением с другой «многие»-стороны. Проверяйте уникальность ключа ДО merge: df['key'].duplicated().sum(), или используйте merge(..., validate='one_to_many') / 'one_to_one' — pandas выбросит MergeError при нарушении предположения, поймав баг на моменте merge, а не молча в итоговых цифрах.",
      minutes: 14,
    },
    {
      title: 'ML · credit validation',
      prompt: 'Design validation for a default model. Why can a random split overestimate production quality?',
      hint: 'Time split, leakage, delayed labels, stability across cohorts.',
      theoryEn: "A random train/test split assumes rows are i.i.d. and the future looks like the past — false for time-ordered credit data. A time-based split (train on earlier applications, test on later ones) mimics production, where the model only ever sees the past. Leakage: including a feature computed using information not available at decision time (e.g. derived from the eventual default outcome) inflates test accuracy in a way that will not hold in production. Delayed labels (true default status is not known for months) mean the test set's 'ground truth' may itself be incomplete.",
      theoryRu: 'Случайное разбиение train/test предполагает, что строки i.i.d. и будущее похоже на прошлое — неверно для кредитных данных с временной структурой. Разбиение по времени (train на ранних заявках, test на поздних) имитирует продакшн, где модель видит только прошлое. Утечка (leakage): признак, посчитанный с использованием информации, недоступной на момент решения (например, производный от итогового исхода дефолта), завышает точность на тесте так, что это не подтвердится в продакшне. Отложенные метки (истинный статус дефолта известен только через месяцы) означают, что «истина» в тестовом наборе сама может быть неполной.',
      minutes: 20,
    },
    {
      title: 'Boosting · imbalance',
      prompt: 'For a 3% default target, compare ROC-AUC, PR-AUC, recall, precision and calibration. Which matter to the bank?',
      hint: 'Tie metric choice to the decision threshold and cost of errors.',
      theoryEn: 'With a 3% positive rate, ROC-AUC is misleadingly optimistic (it rewards ranking negatives correctly, and there are so many negatives that is easy) — PR-AUC is more informative because it focuses on how well you rank the rare positives. Recall = caught defaults / all actual defaults; precision = caught defaults / all flagged defaults — which one costs more (missing a default vs. false-flagging a good borrower) should set the decision threshold, not a default 0.5 cutoff. Calibration (do predicted probabilities match observed frequencies?) matters separately when the score feeds a downstream financial decision like pricing.',
      theoryRu: 'При доле позитивного класса 3% ROC-AUC обманчиво оптимистичен (награждает за правильное ранжирование негативов, а их так много, что это легко) — PR-AUC информативнее, так как фокусируется на том, насколько хорошо вы ранжируете редкие позитивы. Recall = пойманные дефолты / все реальные дефолты; precision = пойманные дефолты / все помеченные как дефолт — банку важно, что дороже (пропустить дефолт или ложно пометить хорошего заёмщика), и это должно задавать порог решения, а не дефолтные 0.5. Калибровка (совпадают ли предсказанные вероятности с наблюдаемыми частотами) важна отдельно, когда скор используется для финансового решения вроде ценообразования.',
      minutes: 18,
    },
  ],
}

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
