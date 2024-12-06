import { writable, derived } from 'svelte/store';
import { moodStore } from './moodStore';
import type { StatData } from '$lib/types';

// Create derived store from moodStore
export const statsStore = derived(moodStore, ($moodStore) => {
    return $moodStore.entries.map(entry => ({
        id: entry.id,
        userId: entry.userId,
        companyId: entry.companyId,
        timestamp: entry.timestamp,
        type: 'mood',
        value: entry.mood // Assuming mood is a numeric value 1-5
    } satisfies StatData));
}); 