export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "I joined a support group without fear of recognition and my social anxiety has measurably decreased.",
    name: "M.C.",
    title: "Program Participant",
  },
  {
    quote: "The crisis resources helped me de-escalate during a breakdown I thought would never end.",
    name: "S.W.",
    title: "Licensed Social Worker",
  },
  {
    quote: "My scholarship covered the full cost of my certification exam. I am now a licensed counselor.",
    name: "J.R.",
    title: "Scholarship Recipient",
  },
  {
    quote: "Facilitator training gave me tools to hold space for others while processing my own trauma.",
    name: "E.F.",
    title: "Peer Support Specialist",
  },
  {
    quote: "I went from isolated to leading three peer support sessions per week in just four months.",
    name: "A.T.",
    title: "Community Program Graduate",
  },
];