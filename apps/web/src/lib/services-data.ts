import { User, Users, Clock, LucideIcon } from "lucide-react"

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  category: "coaching" | "peer-support" | "workshop";
  icon: LucideIcon;
  longDescription: string;
}

export const SERVICES_CATALOG: Service[] = [
  {
    id: "peer-support-1on1",
    slug: "peer-support-1on1",
    title: "1-on-1 Peer Support",
    description: "Confidential, one-on-one sessions with a trained peer support specialist. Ideal for discussing personal challenges in a private, camera-free environment.",
    longDescription: "This session provides a confidential space to discuss your challenges with a trained peer support specialist. Whether you are dealing with workplace stress, relationship issues, or daily stress, our specialists are here to listen and guide you.",
    price: "$50",
    duration: "45 min",
    category: "peer-support",
    icon: User,
  },
  {
    id: "group-coaching-stress",
    slug: "group-coaching-stress",
    title: "Group Coaching: Stress & Worry Management",
    description: "Join an anonymous small group (max 8) to learn practical tools for navigating daily stress. Facilitated by a certified coach.",
    longDescription: "Our group sessions offer a collaborative environment where you can learn from others facing similar challenges. Facilitated by certified coaches, these sessions focus on evidence-based stress reduction techniques.",
    price: "$30",
    duration: "60 min",
    category: "coaching",
    icon: Users,
  },
  {
    id: "career-transition-workshop",
    slug: "career-transition-workshop",
    title: "Career Transition Workshop",
    description: "A secure environment to discuss workplace burnout, transition strategies, and professional development without fear of employer discovery.",
    longDescription: "Navigating a career change can be isolating. This workshop provides professional guidance and peer support for those looking to transition roles or industries anonymously.",
    price: "$75",
    duration: "90 min",
    category: "workshop",
    icon: Clock,
  }
]
