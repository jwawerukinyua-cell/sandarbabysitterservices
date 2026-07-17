/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BabysitterProfile, ServiceArea, FAQItem, SituationItem, ValueItem, ThemeConfig } from "./types";

export const DEFAULT_PROFILE: BabysitterProfile = {
  name: "Sandra",
  handle: "babysitternairobi",
  phone: "254117280445",
  rawPhone: "0117280445",
  tiktokUrl: "https://www.tiktok.com/@babysitternairobi?is_from_webapp=1&sender_device=pc",
  bio: "I offer premium hourly day and night babysitting services all around Nairobi, Kiambu, Machakos, and Kajiado. Prompt, reliable, and deeply caring.",
  hourlyRate: 250,
  halfDayRate: 1200,
  fullDayRate: 2400,
  dateNightRate: 1400,
  lateNightRate: 300,
  currency: "KSh",
};

export const SERVICE_AREAS: ServiceArea[] = [
  {
    county: "Nairobi County",
    description: "Sandra's primary zone covering core residential estates around Nairobi.",
    color: "rose",
    areas: [
      "Westlands",
      "Kilimani",
      "Kileleshwa",
      "Lavington",
      "South B",
      "South C",
      "Lang'ata",
      "Karen",
      "Embakasi",
      "Kasarani",
      "Roysambu",
      "Ruaka border areas"
    ]
  },
  {
    county: "Kiambu County",
    description: "Covering premium suburbs and major towns bordering northern Nairobi.",
    color: "purple",
    areas: [
      "Ruaka",
      "Runda",
      "Kiambu Town",
      "Kikuyu",
      "Wangige",
      "Limuru",
      "Juja",
      "Ruiru",
      "Kahawa Sukari",
      "Kahawa Wendani",
      "Thika"
    ]
  },
  {
    county: "Machakos County",
    description: "Serving residential communities along Mombasa Road and eastern Nairobi.",
    color: "amber",
    areas: [
      "Syokimau",
      "Mlolongo",
      "Athi River",
      "Katani",
      "Joska",
      "Kangundo Road areas"
    ]
  },
  {
    county: "Kajiado County",
    description: "Extending services to the thriving estates on the southern outskirts.",
    color: "teal",
    areas: [
      "Kitengela",
      "Ongata Rongai",
      "Kiserian",
      "Ngong'"
    ]
  }
];

export const SITUATIONS: SituationItem[] = [
  {
    icon: "🌸",
    title: "You Need a Break",
    description: "Even moms deserve time to rest and recharge. Taking a quiet break for your mental health makes you a better, more energized parent!"
  },
  {
    icon: "🛒",
    title: "Quick Errands",
    description: "Need to step out for a grocery run, salon, or doctor visit? Keep your peace of mind knowing your little human is safe at home."
  },
  {
    icon: "🧹",
    title: "Peaceful Housework",
    description: "Want to clean, organize, or sort files without interruptions and cute little messes being instantly created right behind you? 😭"
  },
  {
    icon: "😴",
    title: "Catch-up Sleep",
    description: "Exhausted after long sleepless nights with a teething baby? Get a few hours of deep, uninterrupted, nourishing sleep."
  },
  {
    icon: "💻",
    title: "Work From Home Focus",
    description: "Zoom meetings, tight project deadlines, and heavy focus tasks are so much easier when a reliable caregiver has hands-on-deck."
  },
  {
    icon: "🎨",
    title: "Active Learning & Play",
    description: "Your child won't just be sitting in front of a screen. We offer screen-free active playtime, simple homework help, and puzzles."
  }
];

export const SAFETY_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do we handle security and trust in my home?",
    answer: "Safety is our absolute #1 priority. We operate entirely transparently. We encourage parents to leave nanny cameras on, outline clear entry and exit protocols for your compound, and establish designated safety guidelines. We also sign an extensive, legally-binding contract outlining our exact identities, emergency procedures, and house boundaries beforehand.",
    category: "safety"
  },
  {
    id: "faq-3",
    question: "Do you have emergency medical training?",
    answer: "Yes! I am trained in infant and toddler basic First Aid and infant CPR. In the rare case of an emergency, our contract has pre-filled contacts for your pediatrician, preferred Nairobi hospital (e.g., Aga Khan, Gertrude's, Nairobi Hospital), and emergency contacts so there is a clear, immediate action plan.",
    category: "safety"
  },
  {
    id: "faq-4",
    question: "How do you provide peace of mind while you're on duty?",
    answer: "I offer regular live updates. This includes photos, short video clips, and text messages at intervals of your choice (e.g., every 1.5 hours) so you can see exactly when they eat, sleep, and play without having to ask.",
    category: "trust"
  },
  {
    id: "faq-5",
    question: "What is the policy for transport and late nights?",
    answer: "For standard daytime hours, transport is included within primary zones. For late-night shifts (after 10:00 PM), or areas that are extremely remote, parents are requested to either provide secure transport (e.g. Uber/Bolt) or support a transport fee to ensure safe transit back home.",
    category: "logistics"
  },
  {
    id: "faq-6",
    question: "Will you follow my baby's specific routine and sleeping rules?",
    answer: "Absolutely. I deeply respect your unique parenting style. Before the shift, we complete a small routine questionnaire covering sleep positions, feeding times, forbidden foods, screen time limits, and general behavior guidelines.",
    category: "activities"
  }
];

export const NAIROBI_CONSTITUENCIES: string[] = [
  "Westlands",
  "Dagoretti North",
  "Dagoretti South",
  "Lang'ata",
  "Kibra",
  "Roysambu",
  "Kasarani",
  "Ruaraka",
  "Embakasi South",
  "Embakasi North",
  "Embakasi Central",
  "Embakasi East",
  "Embakasi West",
  "Makadara",
  "Kamukunji",
  "Starehe",
  "Mathare"
];

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  comment: string;
  rating: number;
  date: string;
}

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Phyllis N.",
    location: "Kilimani",
    comment: "Sandra is an absolute angel! My 2-year-old was fast asleep by 8 PM. She sends photo updates every hour which is so reassuring.",
    rating: 5,
    date: "2026-07-10"
  },
  {
    id: "rev-2",
    name: "Amina O.",
    location: "Westlands",
    comment: "Super reliable! She helped my grade-1 son finish his reading homework and even prepared a healthy meal for him. Totally free of extra charges!",
    rating: 5,
    date: "2026-07-08"
  },
  {
    id: "rev-3",
    name: "Grace K.",
    location: "Karen",
    comment: "Booked Sandra for our anniversary date night. She was extremely professional, signed the safety contract, and left the living room super neat!",
    rating: 5,
    date: "2026-07-04"
  },
  {
    id: "rev-4",
    name: "Mercy W.",
    location: "Kileleshwa",
    comment: "Wonderful care for my two daughters! Sandra arrived right on time and was so patient with my picky eater. Will definitely book again.",
    rating: 5,
    date: "2026-06-28"
  }
];

export const VALUES: ValueItem[] = [
  {
    icon: "✨",
    title: "Parenting Style Respect",
    description: "Your household rules, feeding guidelines, schedules, and behavioral boundaries always come first, no questions asked."
  },
  {
    icon: "📱",
    title: "Continuous Updates",
    description: "Get beautiful photo and text check-ins so you never have to wonder if your baby is happy, dry, and well-fed."
  },
  {
    icon: "🧺",
    title: "Tidy Space Guarantee",
    description: "I leave your baby's room, play station, and kitchen bottles clean and organized, so you return to a serene, neat house."
  },
  {
    icon: "⏰",
    title: "Punctuality You Can Trust",
    description: "No cancellations or sudden delays. I understand your work schedules are rigid, and show up exactly when booked."
  }
];

export const THEMES: ThemeConfig[] = [
  {
    id: "premium-teal-coral",
    name: "Nairobi Premium Teal & Coral ✨",
    primary: "from-brand-teal to-brand-dark-teal",
    secondary: "text-brand-coral",
    accent: "bg-brand-cream/80 border-brand-teal/20 text-brand-teal",
    bgGradient: "bg-gradient-to-b from-brand-cream via-white to-brand-cream/40",
    cardBg: "bg-white border-brand-teal/15 shadow-sm hover:shadow-md",
    badgeBg: "bg-brand-teal/10 text-brand-dark-teal",
  },
  {
    id: "blossom-pink",
    name: "Sandra's Cherry Blossom 🌸",
    primary: "from-rose-400 to-pink-500",
    secondary: "text-rose-600",
    accent: "bg-rose-50 border-rose-200 text-rose-700",
    bgGradient: "bg-radial from-rose-50 via-pink-50 to-white",
    cardBg: "bg-white/80 border-rose-100 shadow-rose-100/30",
    badgeBg: "bg-rose-100 text-rose-800",
  },
  {
    id: "warm-honey",
    name: "Golden Sunny Honey ☀️",
    primary: "from-amber-400 to-orange-500",
    secondary: "text-amber-700",
    accent: "bg-amber-50 border-amber-200 text-amber-800",
    bgGradient: "bg-radial from-amber-50 via-yellow-50 to-white",
    cardBg: "bg-white/80 border-amber-100 shadow-amber-100/30",
    badgeBg: "bg-amber-100 text-amber-900",
  },
  {
    id: "calm-teal",
    name: "Gentle Mint & Teal 🌿",
    primary: "from-teal-400 to-emerald-600",
    secondary: "text-teal-700",
    accent: "bg-teal-50 border-teal-200 text-teal-800",
    bgGradient: "bg-radial from-teal-50 via-emerald-50/50 to-white",
    cardBg: "bg-white/80 border-teal-100 shadow-teal-100/30",
    badgeBg: "bg-teal-100 text-teal-900",
  },
  {
    id: "lavender-cozy",
    name: "Cozy Dreamy Lavender 💤",
    primary: "from-violet-400 to-indigo-500",
    secondary: "text-violet-700",
    accent: "bg-violet-50 border-violet-200 text-violet-800",
    bgGradient: "bg-radial from-violet-50 via-purple-50 to-white",
    cardBg: "bg-white/80 border-purple-100 shadow-purple-100/30",
    badgeBg: "bg-violet-100 text-violet-900",
  }
];
