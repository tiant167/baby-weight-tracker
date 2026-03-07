import { useState, useEffect } from 'react';

export interface GrowthEntry {
  id: string;
  date: string; // ISO string format YYYY-MM-DD
  weightInKg?: number;
  heightInCm?: number;
  headCirInCm?: number;
}

const STORAGE_KEY = 'baby_weight_records';
const PROFILE_KEY = 'baby_profile';

export interface BabyProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'boy' | 'girl';
}

export function useGrowthData() {
  const [entries, setEntries] = useState<GrowthEntry[]>(() => {
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

  const addEntry = (date: string, weightInKg?: number, heightInCm?: number, headCirInCm?: number) => {
    setEntries(prev => {
      // Check if entry for date already exists and replace it, or add new
      const existingIndex = prev.findIndex(e => e.date === date);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        const existingEntry = updated[existingIndex];
        
        updated[existingIndex] = {
          ...existingEntry,
          weightInKg: weightInKg !== undefined ? weightInKg : existingEntry.weightInKg,
          heightInCm: heightInCm !== undefined ? heightInCm : existingEntry.heightInCm,
          headCirInCm: headCirInCm !== undefined ? headCirInCm : existingEntry.headCirInCm,
        };
        // Sort by date ascending
        return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }

      const newEntry: GrowthEntry = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        date,
        weightInKg,
        heightInCm,
        headCirInCm
      };

      return [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  };

  const updateEntry = (id: string, updates: Partial<GrowthEntry>) => {
    setEntries(prev => {
      const existingIndex = prev.findIndex(e => e.id === id);
      if (existingIndex < 0) return prev;

      const updated = [...prev];
      updated[existingIndex] = { ...updated[existingIndex], ...updates };
      // Sort in case the date was updated
      return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const updateProfile = (newProfile: BabyProfile) => {
    setProfile(newProfile);
  };

  const exportData = () => {
    const data = {
      profile,
      entries,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baby-growth-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    profile,
    updateProfile,
    exportData
  };
}
