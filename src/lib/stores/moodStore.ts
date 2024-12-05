import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface MoodEntry {
    id: string;
    timestamp: number;
    emoji: string;
    score: number;
    task?: string;
    bestTask?: string;
    worstTask?: string;
    departmentId?: string;
    userId: string;
}

export interface MoodState {
    entries: MoodEntry[];
    lastEntry?: MoodEntry;
    loading: boolean;
    error: string | null;
}

const STORAGE_KEY = 'mood-tracker-data';

function createMoodStore() {
    // Initialize from localStorage if available
    const storedData = typeof window !== 'undefined' 
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    
    const initialState: MoodState = storedData 
        ? JSON.parse(storedData)
        : {
            entries: [],
            loading: false,
            error: null
        };

    const { subscribe, set, update }: Writable<MoodState> = writable(initialState);

    function persistToStorage(state: MoodState) {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    }

    return {
        subscribe,
        addEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
            update(state => {
                const newEntry: MoodEntry = {
                    ...entry,
                    id: crypto.randomUUID(),
                    timestamp: Date.now()
                };

                const newState = {
                    ...state,
                    entries: [...state.entries, newEntry],
                    lastEntry: newEntry
                };

                persistToStorage(newState);
                return newState;
            });
        },
        updateLastEntry: (updatedEntry: MoodEntry) => {
            update(state => {
                const entries = state.entries.map(entry => 
                    entry.id === updatedEntry.id ? updatedEntry : entry
                );

                const newState = {
                    ...state,
                    entries,
                    lastEntry: updatedEntry
                };

                persistToStorage(newState);
                return newState;
            });
        },
        clearError: () => {
            update(state => ({ ...state, error: null }));
        },
        setLoading: (loading: boolean) => {
            update(state => ({ ...state, loading }));
        },
        setError: (error: string) => {
            update(state => ({ ...state, error }));
        }
    };
}

export const moodStore = createMoodStore(); 