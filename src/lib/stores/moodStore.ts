import { writable } from 'svelte/store';

interface MoodEntry {
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  timestamp: string;
  note?: string;
}

interface MoodStore {
  entries: MoodEntry[];
}

// Load initial data from localStorage
const loadInitialData = (): MoodStore => {
  if (typeof window === 'undefined') return { entries: [] };
  
  const storedData = localStorage.getItem('mood-tracker');
  return storedData ? JSON.parse(storedData) : { entries: [] };
};

// Create the store
const createMoodStore = () => {
  const { subscribe, set, update } = writable<MoodStore>(loadInitialData());

  return {
    subscribe,
    addEntry: (entry: Omit<MoodEntry, 'timestamp'>) => {
      update(store => {
        const newEntry = {
          ...entry,
          timestamp: new Date().toISOString()
        };
        const newStore = {
          entries: [...store.entries, newEntry]
        };
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('mood-tracker', JSON.stringify(newStore));
        }
        return newStore;
      });
    },
    updateEntry: (timestamp: string, updates: Partial<MoodEntry>) => {
      update(store => {
        const newEntries = store.entries.map(entry =>
          entry.timestamp === timestamp ? { ...entry, ...updates } : entry
        );
        const newStore = { entries: newEntries };
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('mood-tracker', JSON.stringify(newStore));
        }
        return newStore;
      });
    },
    deleteEntry: (timestamp: string) => {
      update(store => {
        const newStore = {
          entries: store.entries.filter(entry => entry.timestamp !== timestamp)
        };
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('mood-tracker', JSON.stringify(newStore));
        }
        return newStore;
      });
    },
    clear: () => {
      const emptyStore = { entries: [] };
      set(emptyStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mood-tracker', JSON.stringify(emptyStore));
      }
    }
  };
};

export const moodStore = createMoodStore(); 