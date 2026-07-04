import { Timestamp } from 'firebase/firestore';

export interface AppFAQ {
  question: string;
  answer: string;
}

export interface AppItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  version: string;
  developer: string;
  packageName: string;
  androidVersion: string;
  appSize: string;
  telegramLink: string;
  playStoreLink?: string;
  githubLink?: string;
  websiteLink?: string;
  logoUrl: string;
  bannerUrl: string;
  screenshots: string[];
  features: string[];
  technologies: string[];
  faqs: AppFAQ[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  published: boolean;
  featured: boolean;
  downloadsCount: number;
  viewsCount: number;
  createdAt: any; // Timestamp or Date string
  updatedAt: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  message: string;
  rating: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // React Icons key name (e.g. "FaAndroid")
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0 to 100
  category: string; // "Frontend" | "Backend" | "Android" | "Others"
}

export interface HeroSettings {
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  bioEn: string;
  bioBn: string;
  resumeUrl: string;
  primaryBtnTextEn: string;
  primaryBtnTextBn: string;
  secondaryBtnTextEn: string;
  secondaryBtnTextBn: string;
}

export interface AboutSettings {
  titleEn: string;
  titleBn: string;
  textEn: string;
  textBn: string;
  imageUrl: string;
  experience: number;
  projects: number;
  clients: number;
}

export interface SocialLinks {
  facebook: string;
  github: string;
  linkedin: string;
  telegram: string;
  whatsapp: string;
  email: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
  read: boolean;
}

export interface AnalyticsSummary {
  visitors: number;
  appViews: number;
  downloadClicks: number;
}

export interface AnalyticsEvent {
  id: string;
  type: 'visit' | 'view' | 'download';
  appId?: string;
  appName?: string;
  timestamp: any;
  ip?: string;
  userAgent?: string;
}
