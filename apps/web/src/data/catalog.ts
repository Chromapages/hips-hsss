export const services = [
  {
    slug: "one-on-one-coaching",
    name: "One-on-one coaching",
    price: "$65",
    duration: "50 minutes",
    category: "Individual support",
    summary: "Private peer support for focused reflection and next steps.",
  },
  {
    slug: "group-coaching-worry",
    name: "Group Coaching: Worry Management",
    price: "$35",
    duration: "75 minutes",
    category: "Group support",
    summary: "Join an anonymous small group (max 8) to learn practical tools for navigating daily worry. Facilitated by a peer guide.",
  },
  {
    slug: "peer-resource-planning",
    name: "Peer resource planning",
    price: "$50",
    duration: "45 minutes",
    category: "Planning",
    summary: "Practical benefits, resource, and life-path planning with a peer guide.",
  },
] as const;

export const packages = [
  { name: "Starter", sessions: "2 sessions", price: "$120", savings: "$10" },
  { name: "Steady", sessions: "4 sessions", price: "$220", savings: "$40" },
  { name: "Deep work", sessions: "6 sessions", price: "$315", savings: "$75" },
] as const;

export const donationTiers = [
  { amount: "$25", label: "Resource access" },
  { amount: "$75", label: "One session offset" },
  { amount: "$150", label: "Scholarship pool" },
  { amount: "$500", label: "Community partner support" },
] as const;

export const adminQueue = [
  {
    id: "safe-2048",
    sessionRef: "session-a81e",
    level: "crisis",
    age: "4 min",
    status: "Open",
  },
  {
    id: "safe-2031",
    sessionRef: "session-b19c",
    level: "urgent",
    age: "11 min",
    status: "Reviewing",
  },
] as const;
