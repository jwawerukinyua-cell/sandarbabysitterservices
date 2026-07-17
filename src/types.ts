/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BabysitterProfile {
  name: string;
  handle: string;
  phone: string; // WhatsApp formatted
  rawPhone: string; // Raw display number
  tiktokUrl: string;
  bio: string;
  hourlyRate: number;
  halfDayRate: number;
  fullDayRate: number;
  dateNightRate: number;
  lateNightRate: number;
  currency: string;
}

export interface ServiceArea {
  county: string;
  description: string;
  color: string;
  areas: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "safety" | "logistics" | "activities" | "trust";
}

export interface SituationItem {
  icon: string;
  title: string;
  description: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  primary: string; // tailwind classes
  secondary: string;
  accent: string;
  bgGradient: string;
  cardBg: string;
  badgeBg: string;
}
