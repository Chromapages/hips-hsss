export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "I joined a support group without fear of recognition and my social anxiety has measurably decreased.",
    name: "Marcus Chen",
    title: "Program Participant",
  },
  {
    quote: "The crisis resources helped me de-escalate during a breakdown I thought would never end.",
    name: "Sarah Williams",
    title: "Licensed Social Worker",
  },
  {
    quote: "My scholarship covered the full cost of my certification exam. I am now a licensed counselor.",
    name: "James Rivera",
    title: "Scholarship Recipient",
  },
  {
    quote: "Facilitator training gave me tools to hold space for others while processing my own trauma.",
    name: "Dr. Emily Foster",
    title: "Peer Support Specialist",
  },
  {
    quote: "I went from isolated to leading three peer support sessions per week in just four months.",
    name: "Angela Torres",
    title: "Community Program Graduate",
  },
];