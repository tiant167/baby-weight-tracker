import { useState, useEffect } from 'react';

export interface WeightEntry {
  id: string;
  date: string; // ISO string format YYYY-MM-DD
  weightInKg: number;
}

const STORAGE_KEY = 'baby_weight_records';
const PROFILE_KEY = 'baby_profile';

export interface BabyProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'boy' | 'girl';
}

export function useWeightData() {
  const [entries, setEntries] = useState<WeightEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  const [profile, setProfile] = useState<BabyProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(PROFILE_KEY);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (profile) {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  const addEntry = (date: string, weightInKg: number) => {
    setEntries(prev => {
      // Check if entry for date already exists and replace it, or add new
      const existingIndex = prev.findIndex(e => e.date === date);
      const newEntry: WeightEntry = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        date,
        weightInKg,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        // Sort by date ascending
        return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }

      return [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const updateProfile = (newProfile: BabyProfile) => {
    setProfile(newProfile);
  };

  return {
    entries,
    addEntry,
    deleteEntry,
    profile,
    updateProfile
  };
}
