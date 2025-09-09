// LocalStorage veri yönetimi sistemi
import { AppState, Goal, Habit, JournalEntry, Resource } from './types';

const STORAGE_KEY = 'personal-development-app';

// Varsayılan uygulama durumu
const defaultAppState: AppState = {
  goals: [],
  habits: [],
  journalEntries: [],
  resources: [],
  lastUpdated: new Date().toISOString(),
};

// LocalStorage'dan veri okuma
export const loadAppState = (): AppState => {
  try {
    if (typeof window === 'undefined') {
      return defaultAppState;
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultAppState;
    }
    
    const parsed = JSON.parse(stored);
    return {
      ...defaultAppState,
      ...parsed,
    };
  } catch (error) {
    console.error('Veri yükleme hatası:', error);
    return defaultAppState;
  }
};

// LocalStorage'a veri kaydetme
export const saveAppState = (state: AppState): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    const stateToSave = {
      ...state,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Veri kaydetme hatası:', error);
  }
};

// Hedef işlemleri
export const saveGoal = (goal: Goal): void => {
  const state = loadAppState();
  const existingIndex = state.goals.findIndex(g => g.id === goal.id);
  
  if (existingIndex >= 0) {
    state.goals[existingIndex] = { ...goal, updatedAt: new Date().toISOString() };
  } else {
    state.goals.push(goal);
  }
  
  saveAppState(state);
};

export const deleteGoal = (goalId: string): void => {
  const state = loadAppState();
  state.goals = state.goals.filter(g => g.id !== goalId);
  saveAppState(state);
};

export const updateGoalProgress = (goalId: string, progress: number): void => {
  const state = loadAppState();
  const goal = state.goals.find(g => g.id === goalId);
  
  if (goal) {
    goal.progress = progress;
    goal.updatedAt = new Date().toISOString();
    
    if (progress >= 100 && goal.status !== 'completed') {
      goal.status = 'completed';
    } else if (progress < 100 && goal.status === 'completed') {
      goal.status = 'active';
    }
    
    saveAppState(state);
  }
};

// Alışkanlık işlemleri
export const saveHabit = (habit: Habit): void => {
  const state = loadAppState();
  const existingIndex = state.habits.findIndex(h => h.id === habit.id);
  
  if (existingIndex >= 0) {
    state.habits[existingIndex] = habit;
  } else {
    state.habits.push(habit);
  }
  
  saveAppState(state);
};

export const deleteHabit = (habitId: string): void => {
  const state = loadAppState();
  state.habits = state.habits.filter(h => h.id !== habitId);
  saveAppState(state);
};

export const toggleHabitToday = (habitId: string): void => {
  const state = loadAppState();
  const habit = state.habits.find(h => h.id === habitId);
  
  if (habit) {
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.completedDates.includes(today);
    
    if (isCompletedToday) {
      // Bugün tamamlanmışsa, kaldır
      habit.completedDates = habit.completedDates.filter(date => date !== today);
      habit.streak = calculateStreak(habit.completedDates);
    } else {
      // Bugün tamamlanmamışsa, ekle
      habit.completedDates.push(today);
      habit.completedDates.sort();
      habit.streak = calculateStreak(habit.completedDates);
    }
    
    saveAppState(state);
  }
};

// Alışkanlık streaki hesaplama
const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort().reverse();
  let streak = 0;
  
  // Bugünden başlayarak geriye doğru kontrol et
  let currentDate = new Date();
  
  for (const dateStr of sortedDates) {
    const checkDate = currentDate.toISOString().split('T')[0];
    
    if (dateStr === checkDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Günlük işlemleri
export const saveJournalEntry = (entry: JournalEntry): void => {
  const state = loadAppState();
  const existingIndex = state.journalEntries.findIndex(e => e.id === entry.id);
  
  if (existingIndex >= 0) {
    state.journalEntries[existingIndex] = entry;
  } else {
    state.journalEntries.push(entry);
  }
  
  saveAppState(state);
};

export const deleteJournalEntry = (entryId: string): void => {
  const state = loadAppState();
  state.journalEntries = state.journalEntries.filter(e => e.id !== entryId);
  saveAppState(state);
};

// Kaynak işlemleri
export const saveResource = (resource: Resource): void => {
  const state = loadAppState();
  const existingIndex = state.resources.findIndex(r => r.id === resource.id);
  
  if (existingIndex >= 0) {
    state.resources[existingIndex] = resource;
  } else {
    state.resources.push(resource);
  }
  
  saveAppState(state);
};

export const toggleResourceCompleted = (resourceId: string): void => {
  const state = loadAppState();
  const resource = state.resources.find(r => r.id === resourceId);
  
  if (resource) {
    resource.isCompleted = !resource.isCompleted;
    resource.completedAt = resource.isCompleted ? new Date().toISOString() : undefined;
    saveAppState(state);
  }
};

// Veriyi sıfırlama (geliştirme amaçlı)
export const resetAppData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Veri dışa aktarma
export const exportAppData = (): string => {
  const state = loadAppState();
  return JSON.stringify(state, null, 2);
};

// Veri içe aktarma
export const importAppData = (jsonData: string): boolean => {
  try {
    const importedState = JSON.parse(jsonData) as AppState;
    saveAppState(importedState);
    return true;
  } catch (error) {
    console.error('Veri içe aktarma hatası:', error);
    return false;
  }
};