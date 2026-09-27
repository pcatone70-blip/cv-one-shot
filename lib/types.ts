// ============================================================
// TYPES — CV One Shot
// Struttura dati di tutto l'applicativo
// ============================================================

export type Language = 'it' | 'en'
export type Plan = 'free' | 'pro' | 'lifetime'
export type CVTemplate = 'modern' | 'classic' | 'minimal' | 'executive' | 'creative'
export type SkillLevel = 'base' | 'intermedio' | 'avanzato' | 'esperto'
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'madrelingua'

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  summary: string
  photoUrl?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location?: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  grade?: string
  description?: string
}

export interface Skill {
  id: string
  name: string
  level: SkillLevel
}

export interface LanguageSkill {
  id: string
  name: string
  level: LanguageLevel
}

export interface CVData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  languages: LanguageSkill[]
  template: CVTemplate
  language: Language
  accentColor: string
}

export interface CV {
  id: string
  user_id: string
  title: string
  language: Language
  data: CVData
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  plan: Plan
  stripe_customer_id?: string
  stripe_subscription_id?: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  plan: Plan
  status: 'active' | 'canceled' | 'past_due'
  current_period_end?: string
  created_at: string
}
