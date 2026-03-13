// ─── PLANTS ──────────────────────────────────────────────────────────────────
export const plants = [
  {
    id: 'helsinki',
    name: 'Helsinki',
    flag: '🇫🇮',
    status: 'Operational',
    leadership: 'green',
    workforce: 'green',
    delivery: 'green',
    lastUpdated: 'Mar 6 2026',
  },
  {
    id: 'athens',
    name: 'Athens',
    flag: '🇬🇷',
    status: 'Ramp-up',
    leadership: 'yellow',
    workforce: 'yellow',
    delivery: 'red',
    lastUpdated: 'Mar 5 2026',
  },
  {
    id: 'valencia',
    name: 'Valencia',
    flag: '🇪🇸',
    status: 'Ramp-up',
    leadership: 'yellow',
    workforce: 'green',
    delivery: 'yellow',
    lastUpdated: 'Mar 3 2026',
  },
  {
    id: 'warsaw',
    name: 'Warsaw',
    flag: '🇵🇱',
    status: 'Ramp-up',
    leadership: 'yellow',
    workforce: 'yellow',
    delivery: 'yellow',
    lastUpdated: 'Mar 4 2026',
  },
  {
    id: 'neuss',
    name: 'Neuss JV',
    flag: '🇩🇪',
    status: 'Not started',
    leadership: 'gray',
    workforce: 'gray',
    delivery: 'gray',
    lastUpdated: '—',
  },
  {
    id: 'japan',
    name: 'Japan IHI JV',
    flag: '🇯🇵',
    status: 'Not started',
    leadership: 'gray',
    workforce: 'gray',
    delivery: 'gray',
    lastUpdated: '—',
  },
  {
    id: 'uae',
    name: 'Space42 UAE',
    flag: '🇦🇪',
    status: 'Not started',
    leadership: 'gray',
    workforce: 'gray',
    delivery: 'gray',
    lastUpdated: '—',
  },
  {
    id: 'irvine',
    name: 'Irvine',
    flag: '🇺🇸',
    status: 'Operational',
    leadership: 'green',
    workforce: 'green',
    delivery: 'yellow',
    lastUpdated: 'Mar 6 2026',
  },
];

// ─── LEADERSHIP KPIs ─────────────────────────────────────────────────────────
export const leadershipScores = {
  helsinki: { decisionSpeed: 4.2, ownershipLevel: 4.5, collaboration: 4.0, leaderMaturity: 4.3 },
  athens:   { decisionSpeed: 3.2, ownershipLevel: 2.8, collaboration: 3.5, leaderMaturity: 2.5 },
  valencia: { decisionSpeed: 3.5, ownershipLevel: 3.1, collaboration: 3.8, leaderMaturity: 3.0 },
  warsaw:   { decisionSpeed: 3.0, ownershipLevel: 2.9, collaboration: 3.2, leaderMaturity: 2.7 },
  irvine:   { decisionSpeed: 4.0, ownershipLevel: 4.2, collaboration: 3.9, leaderMaturity: 3.8 },
};

export const leadershipObservations = {
  athens: [
    { date: 'Feb 28', source: 'Forum', text: 'Escalation to HQ on tooling decision — unresolved after 2 weeks' },
    { date: 'Mar 5', source: '1:1', text: 'Ownership of Q2 milestones unclear between plant lead and team leads' },
    { date: 'Mar 5', source: '1:1', text: 'Reactive decision-making pattern observed — low leader maturity signal' },
  ],
  helsinki: [
    { date: 'Mar 1', source: 'Forum', text: 'Cross-site forum ran well — Helsinki lead facilitated Valencia onboarding Q&A' },
    { date: 'Feb 20', source: '1:1', text: 'Strong ownership clarity across team leads' },
    { date: 'Feb 15', source: 'Forum', text: 'Decision on Gen4 tooling resolved locally in under 48h' },
  ],
  valencia: [
    { date: 'Feb 28', source: '1:1', text: 'Plant lead shows initiative but unclear on escalation path to HQ' },
    { date: 'Mar 3', source: 'Forum', text: 'Collaboration improving — Valencia and Athens leads connected on shared challenge' },
    { date: 'Mar 1', source: '1:1', text: 'Q3 delivery milestone ownership confirmed with team leads' },
  ],
  warsaw: [
    { date: 'Mar 4', source: '1:1', text: 'Leadership team newly formed — operating principles not yet internalized' },
    { date: 'Mar 3', source: 'Forum', text: 'First cross-site forum attendance — passive participation' },
    { date: 'Mar 6', source: '1:1', text: 'Escalation criteria unclear — 2 decisions pending without owner' },
  ],
  irvine: [
    { date: 'Mar 5', source: '1:1', text: 'Strong cross-functional alignment observed across manufacturing and quality teams' },
    { date: 'Mar 2', source: 'Forum', text: 'Irvine lead actively contributing to cross-site knowledge sharing' },
    { date: 'Feb 28', source: '1:1', text: 'Delivery performance on track — Gen4 ramp exceeding projections' },
  ],
};

// ─── WORKFORCE OBSERVATIONS ──────────────────────────────────────────────────
export const workforceObservations = {
  helsinki: [
    { date: 'Mar 6', source: 'Review', text: 'All 8 onboardees completed final sign-off — TtP holding at baseline 8 weeks' },
    { date: 'Feb 23', source: '1:1', text: 'Manager feedback positive — W10 cross-functional integration module performing well' },
  ],
  athens: [
    { date: 'Mar 5', source: 'Review', text: 'W6 independent task milestone lagging — 2 employees delayed by tooling access issues' },
    { date: 'Mar 3', source: '1:1', text: 'Manager reports onboarding capacity strained — 2 open slots unmatched to hiring demand' },
  ],
  valencia: [
    { date: 'Mar 3', source: 'Review', text: 'TtP tracking +1 week above baseline — shadowing extension absorbing extra time' },
    { date: 'Mar 1', source: '1:1', text: 'Throughput at 75% demand — one hire pending start date confirmation' },
  ],
  warsaw: [
    { date: 'Mar 4', source: 'Review', text: 'TtP at +5 weeks — W4 milestone not yet reached for either active onboardee' },
    { date: 'Mar 6', source: '1:1', text: 'Manager flagged onboarding framework not fully localized — translation gaps in W2 module' },
  ],
  irvine: [
    { date: 'Mar 6', source: 'Review', text: 'All 6 onboardees on track — TtP matching Helsinki baseline at 8 weeks' },
    { date: 'Mar 2', source: '1:1', text: 'Manager reports high quality sign-offs — W8 QC certification completion rate 100%' },
  ],
};

// ─── ORG HEALTH OBSERVATIONS ─────────────────────────────────────────────────
export const orgHealthObservations = {
  helsinki: [
    { date: 'Mar 6', source: 'Forum', text: 'Helsinki holding green across all three areas — referenced as cross-site benchmark' },
    { date: 'Mar 1', source: '1:1', text: 'Delivery on track — Gen4 satellite ramp at 100% of planned rate' },
  ],
  athens: [
    { date: 'Mar 5', source: 'Forum', text: 'Delivery red — Q2 milestone at risk from stacked delays in leadership and workforce' },
    { date: 'Mar 3', source: '1:1', text: 'Cross-area risk: leadership and workforce gaps compounding delivery exposure' },
  ],
  valencia: [
    { date: 'Mar 3', source: '1:1', text: 'Delivery yellow — production schedule tight but no formal milestone breach yet' },
  ],
  warsaw: [
    { date: 'Mar 4', source: 'Forum', text: 'All areas in watch or below — Warsaw flagged for CMO review at next cross-site forum' },
    { date: 'Mar 6', source: '1:1', text: 'Delivery yellow despite early-stage ramp — demand planning ahead of current capacity' },
  ],
  irvine: [
    { date: 'Mar 6', source: '1:1', text: 'Org health strong — leadership and workforce both green, delivery monitoring Gen4 yield targets' },
  ],
};

// ─── WORKFORCE READINESS ─────────────────────────────────────────────────────
export const workforceData = {
  helsinki: { timeToProductivity: 8, baseline: 8, throughputIn: 8, throughputDemand: 8 },
  athens:   { timeToProductivity: 11, baseline: 8, throughputIn: 4, throughputDemand: 6 },
  valencia: { timeToProductivity: 9, baseline: 8, throughputIn: 3, throughputDemand: 4 },
  warsaw:   { timeToProductivity: 13, baseline: 8, throughputIn: 2, throughputDemand: 5 },
  irvine:   { timeToProductivity: 8, baseline: 8, throughputIn: 6, throughputDemand: 6 },
};

// ─── ONBOARDING EMPLOYEES ────────────────────────────────────────────────────
const milestoneLabels = [
  { week: 'W1', label: 'Site orientation & safety' },
  { week: 'W2', label: 'ICEYE manufacturing principles & SAR basics' },
  { week: 'W4', label: 'Assembly line shadowing 20h' },
  { week: 'W6', label: 'Independent task execution' },
  { week: 'W8', label: 'Quality control certification' },
  { week: 'W10', label: 'Cross-functional integration' },
  { week: 'W12', label: 'Final sign-off & full operational readiness' },
];

export const employees = [
  {
    id: 'e1',
    plant: 'athens',
    name: 'Nikos Papadopoulos',
    role: 'Manufacturing Technician',
    manager: 'Dimitris Kalogerakis',
    startDate: 'Feb 3 2026',
    milestones: [
      { ...milestoneLabels[0], status: 'done', signed: 'Feb 10' },
      { ...milestoneLabels[1], status: 'done', signed: 'Feb 17' },
      { ...milestoneLabels[2], status: 'done', signed: 'Feb 28' },
      { ...milestoneLabels[3], status: 'pending', due: 'Mar 17' },
      { ...milestoneLabels[4], status: 'upcoming' },
      { ...milestoneLabels[5], status: 'upcoming' },
      { ...milestoneLabels[6], status: 'upcoming' },
    ],
  },
  {
    id: 'e2',
    plant: 'athens',
    name: 'Elena Stavros',
    role: 'Quality Control Analyst',
    manager: 'Dimitris Kalogerakis',
    startDate: 'Feb 17 2026',
    milestones: [
      { ...milestoneLabels[0], status: 'done', signed: 'Feb 24' },
      { ...milestoneLabels[1], status: 'done', signed: 'Mar 3' },
      { ...milestoneLabels[2], status: 'pending', due: 'Mar 17' },
      { ...milestoneLabels[3], status: 'upcoming' },
      { ...milestoneLabels[4], status: 'upcoming' },
      { ...milestoneLabels[5], status: 'upcoming' },
      { ...milestoneLabels[6], status: 'upcoming' },
    ],
  },
  {
    id: 'e3',
    plant: 'helsinki',
    name: 'Matti Virtanen',
    role: 'Senior Manufacturing Engineer',
    manager: 'Pekka Heinonen',
    startDate: 'Jan 5 2026',
    milestones: [
      { ...milestoneLabels[0], status: 'done', signed: 'Jan 12' },
      { ...milestoneLabels[1], status: 'done', signed: 'Jan 19' },
      { ...milestoneLabels[2], status: 'done', signed: 'Jan 26' },
      { ...milestoneLabels[3], status: 'done', signed: 'Feb 9' },
      { ...milestoneLabels[4], status: 'done', signed: 'Feb 16' },
      { ...milestoneLabels[5], status: 'done', signed: 'Feb 23' },
      { ...milestoneLabels[6], status: 'done', signed: 'Mar 2' },
    ],
  },
  {
    id: 'e4',
    plant: 'helsinki',
    name: 'Aino Mäkinen',
    role: 'Systems Integration Lead',
    manager: 'Pekka Heinonen',
    startDate: 'Jan 19 2026',
    milestones: [
      { ...milestoneLabels[0], status: 'done', signed: 'Jan 26' },
      { ...milestoneLabels[1], status: 'done', signed: 'Feb 2' },
      { ...milestoneLabels[2], status: 'done', signed: 'Feb 9' },
      { ...milestoneLabels[3], status: 'done', signed: 'Feb 23' },
      { ...milestoneLabels[4], status: 'done', signed: 'Mar 2' },
      { ...milestoneLabels[5], status: 'done', signed: 'Mar 9' },
      { ...milestoneLabels[6], status: 'pending', due: 'Mar 15' },
    ],
  },
  {
    id: 'e5',
    plant: 'valencia',
    name: 'Carlos Mendez',
    role: 'Manufacturing Technician',
    manager: 'Sofia Reig',
    startDate: 'Feb 10 2026',
    milestones: [
      { ...milestoneLabels[0], status: 'done', signed: 'Feb 17' },
      { ...milestoneLabels[1], status: 'done', signed: 'Feb 24' },
      { ...milestoneLabels[2], status: 'done', signed: 'Mar 3' },
      { ...milestoneLabels[3], status: 'pending', due: 'Mar 24' },
      { ...milestoneLabels[4], status: 'upcoming' },
      { ...milestoneLabels[5], status: 'upcoming' },
      { ...milestoneLabels[6], status: 'upcoming' },
    ],
  },
  {
    id: 'e6',
    plant: 'valencia',
    name: 'Laura Ferrer',
    role: 'Process Engineer',
    manager: 'Sofia Reig',
    startDate: 'Feb 24 2026',
    milestones: [
      { ...milestoneLabels[0], status: 'done', signed: 'Mar 3' },
      { ...milestoneLabels[1], status: 'upcoming' },
      { ...milestoneLabels[2], status: 'upcoming' },
      { ...milestoneLabels[3], status: 'upcoming' },
      { ...milestoneLabels[4], status: 'upcoming' },
      { ...milestoneLabels[5], status: 'upcoming' },
      { ...milestoneLabels[6], status: 'upcoming' },
    ],
  },
  {
    id: 'e7',
    plant: 'warsaw',
    name: 'Tomasz Kowalski',
    role: 'Manufacturing Technician',
    manager: 'Aleksandra Nowak',
    startDate: 'Feb 24 2026',
    milestones: [
      { ...milestoneLabels[0], status: 'done', signed: 'Mar 3' },
      { ...milestoneLabels[1], status: 'upcoming' },
      { ...milestoneLabels[2], status: 'upcoming' },
      { ...milestoneLabels[3], status: 'upcoming' },
      { ...milestoneLabels[4], status: 'upcoming' },
      { ...milestoneLabels[5], status: 'upcoming' },
      { ...milestoneLabels[6], status: 'upcoming' },
    ],
  },
];

export const siteComparisonData = [
  { site: 'Helsinki', flag: '🇫🇮', baseline: '8 wks', current: '8 wks', delta: '—', status: 'on-track' },
  { site: 'Athens', flag: '🇬🇷', baseline: '8 wks', current: '11 wks', delta: '+3 wks', status: 'delayed' },
  { site: 'Valencia', flag: '🇪🇸', baseline: '8 wks', current: '9 wks', delta: '+1 wk', status: 'watch' },
  { site: 'Warsaw', flag: '🇵🇱', baseline: '8 wks', current: '13 wks', delta: '+5 wks', status: 'at-risk' },
  { site: 'Irvine', flag: '🇺🇸', baseline: '8 wks', current: '8 wks', delta: '—', status: 'on-track' },
];

// ─── AI ALERTS (MOCK) ────────────────────────────────────────────────────────
export const mockAlerts = [
  {
    id: 'a1',
    severity: 'critical',
    area: 'Delivery',
    plant: 'Athens',
    text: 'Athens delivery is red with 2 active onboardings behind schedule and an unresolved escalation pending since Feb 28. Q2 production milestone at risk.',
    action: 'Schedule CMO joint 1:1 with Athens plant lead this week.',
  },
  {
    id: 'a2',
    severity: 'watch',
    area: 'Leadership',
    plant: 'Warsaw',
    text: 'Warsaw leadership team is newly formed with no internalized operating principles yet. 2 decisions pending without an assigned owner.',
    action: 'Prioritize Week 1 leadership integration session before further hiring.',
  },
  {
    id: 'a3',
    severity: 'watch',
    area: 'Workforce',
    plant: 'Athens',
    text: 'Athens Time to Productivity is +3 weeks above baseline. W6 milestone showing highest lag across all active plants.',
    action: 'Review W6 module with Athens manager — potential framework bottleneck.',
  },
  {
    id: 'a4',
    severity: 'insight',
    area: 'Cross-site',
    plant: null,
    text: 'Valencia is ramping 2 weeks faster than Athens at the same point in the playbook. The W4 shadowing extension and bi-weekly sign-off cadence appear to be driving the improvement.',
    action: 'Document Valencia delta as Playbook v1 validated improvement. Apply to Warsaw.',
  },
];

// ─── SYSTEM PROMPT FOR AI ALERTS ─────────────────────────────────────────────
export const alertSystemPrompt = `You are an organizational intelligence agent for Atlas, ICEYE's manufacturing transformation platform. Analyze the provided plant data across Leadership Score, Workforce Readiness and Delivery Performance. Identify the 3 most critical risks, 2 watch items, and 1 cross-site insight. For each, provide a severity, area tag, plant, 2-sentence analysis and a concrete suggested action. Respond in JSON array format.

Each item must have this shape:
{
  "id": "unique string",
  "severity": "critical" | "watch" | "insight",
  "area": "Leadership" | "Workforce" | "Delivery" | "Cross-site",
  "plant": "plant name or null for cross-site",
  "text": "2-sentence analysis",
  "action": "concrete suggested action"
}`;

export const buildAlertContext = () => `
PLANT STATUS OVERVIEW:
- Helsinki (Operational): Leadership green, Workforce green, Delivery green
- Athens (Ramp-up): Leadership yellow, Workforce yellow, Delivery RED
- Valencia (Ramp-up): Leadership yellow, Workforce green, Delivery yellow
- Warsaw (Ramp-up): Leadership yellow, Workforce yellow, Delivery yellow
- Irvine (Operational): Leadership green, Workforce green, Delivery yellow
- Neuss JV, Japan IHI JV, Space42 UAE: Not started

LEADERSHIP SCORES (1-5):
- Helsinki: Decision Speed 4.2, Ownership 4.5, Collaboration 4.0, Maturity 4.3
- Athens: Decision Speed 3.2, Ownership 2.8, Collaboration 3.5, Maturity 2.5
- Valencia: Decision Speed 3.5, Ownership 3.1, Collaboration 3.8, Maturity 3.0
- Warsaw: Decision Speed 3.0, Ownership 2.9, Collaboration 3.2, Maturity 2.7
- Irvine: Decision Speed 4.0, Ownership 4.2, Collaboration 3.9, Maturity 3.8

KEY OBSERVATIONS:
- Athens: Unresolved HQ escalation on tooling (2 weeks), unclear Q2 ownership, reactive decision-making
- Warsaw: Leadership team newly formed, 2 decisions pending without owner, passive cross-site engagement
- Valencia: Initiative present but escalation path unclear

TIME TO PRODUCTIVITY (vs 8-week baseline):
- Helsinki: 8 wks (on track) | Athens: 11 wks (+3) | Valencia: 9 wks (+1) | Warsaw: 13 wks (+5) | Irvine: 8 wks

THROUGHPUT (in onboarding / demand):
- Helsinki: 8/8 | Athens: 4/6 | Valencia: 3/4 | Warsaw: 2/5 | Irvine: 6/6

PLAYBOOK DELTAS APPLIED:
- Athens→Valencia: W4 shadowing extended to 25h, explicit escalation exercise added W7, manager sign-off moved to bi-weekly
`;
