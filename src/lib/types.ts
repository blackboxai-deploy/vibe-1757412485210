// TypeScript tip tanımları - Kişisel Gelişim Uygulaması

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'career' | 'personal' | 'education' | 'relationships' | 'finance';
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  completedDates: string[];
  category: 'health' | 'productivity' | 'mindfulness' | 'learning' | 'fitness' | 'social';
  createdAt: string;
  isActive: boolean;
  color: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  createdAt: string;
  weather?: string;
  gratitude?: string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'article' | 'video' | 'podcast' | 'course';
  category: 'motivation' | 'productivity' | 'health' | 'mindfulness' | 'career' | 'relationships';
  url?: string;
  author?: string;
  rating: number;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}

export interface UserStats {
  totalGoals: number;
  completedGoals: number;
  activeHabits: number;
  totalStreak: number;
  journalEntries: number;
  resourcesCompleted: number;
}

export interface DashboardData {
  stats: UserStats;
  recentGoals: Goal[];
  todayHabits: Habit[];
  recentJournalEntries: JournalEntry[];
  weeklyProgress: { day: string; completed: number; total: number }[];
}

export interface AppState {
  goals: Goal[];
  habits: Habit[];
  journalEntries: JournalEntry[];
  resources: Resource[];
  lastUpdated: string;
}

export type CategoryType = 'health' | 'career' | 'personal' | 'education' | 'relationships' | 'finance' | 'productivity' | 'mindfulness' | 'learning' | 'fitness' | 'social' | 'motivation';

export type MoodType = 1 | 2 | 3 | 4 | 5;

export type ThemeMode = 'light' | 'dark' | 'system';

export interface QuoteData {
  id: number;
  text: string;
  author: string;
  category: string;
}