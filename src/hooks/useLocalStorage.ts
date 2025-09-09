"use client";

import { useState, useEffect } from 'react';

// LocalStorage custom hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State başlatma - SSR uyumluluğu için initial state'i initialValue olarak ayarla
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Component mount olduğunda localStorage'dan değeri oku
  useEffect(() => {
    try {
      // Client-side check
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`LocalStorage okuma hatası (${key}):`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Değer güncelleme fonksiyonu
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Yeni değeri hesapla
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // State'i güncelle
      setStoredValue(valueToStore);
      
      // localStorage'a kaydet (sadece client-side)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`LocalStorage kaydetme hatası (${key}):`, error);
    }
  };

  // Değeri sil
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`LocalStorage silme hatası (${key}):`, error);
    }
  };

  return [storedValue, setValue, removeValue, isLoading] as const;
}

// AppState için özel hook
import { AppState } from '../lib/types';
import { loadAppState, saveAppState } from '../lib/storage';

export function useAppState() {
  const [appState, setAppState] = useState<AppState>(loadAppState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Component mount olduğunda veriyi yükle
    const state = loadAppState();
    setAppState(state);
    setIsLoading(false);
  }, []);

  // State güncelleme ve kaydetme
  const updateAppState = (updater: (prevState: AppState) => AppState) => {
    setAppState(prevState => {
      const newState = updater(prevState);
      saveAppState(newState);
      return newState;
    });
  };

  // Belirli alanları güncelleme
  const updateGoals = (updater: (goals: AppState['goals']) => AppState['goals']) => {
    updateAppState(state => ({
      ...state,
      goals: updater(state.goals)
    }));
  };

  const updateHabits = (updater: (habits: AppState['habits']) => AppState['habits']) => {
    updateAppState(state => ({
      ...state,
      habits: updater(state.habits)
    }));
  };

  const updateJournalEntries = (updater: (entries: AppState['journalEntries']) => AppState['journalEntries']) => {
    updateAppState(state => ({
      ...state,
      journalEntries: updater(state.journalEntries)
    }));
  };

  const updateResources = (updater: (resources: AppState['resources']) => AppState['resources']) => {
    updateAppState(state => ({
      ...state,
      resources: updater(state.resources)
    }));
  };

  return {
    appState,
    isLoading,
    updateAppState,
    updateGoals,
    updateHabits,
    updateJournalEntries,
    updateResources
  };
}