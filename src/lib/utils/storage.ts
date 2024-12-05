import { browser } from '$app/environment';
/**
 * Type-safe LocalStorage utility functions
 */

/**
 * Generic type for storage items
 */
export interface StorageItem<T> {
    value: T;
    timestamp: number;
}

/**
 * Save data to LocalStorage with type safety
 */
export function setStorageItem<T>(key: string, value: T): void {
    try {
        const item: StorageItem<T> = {
            value,
            timestamp: Date.now()
        };
        if (browser) {
            localStorage.setItem(key, JSON.stringify(item));
        }
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Retrieve data from LocalStorage with type safety
 */
export function getStorageItem<T>(key: string): T | null {
    try {
        const item = browser ? localStorage.getItem(key) : null;
        if (!item) return null;

        const parsedItem: StorageItem<T> = JSON.parse(item);
        return parsedItem.value;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

/**
 * Remove item from LocalStorage
 */
export function removeStorageItem(key: string): void {
    try {
        if (browser) {
            localStorage.removeItem(key);
        }
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

/**
 * Clear all items from LocalStorage
 */
export function clearStorage(): void {
    try {
        if (browser) {
            localStorage.clear();
        }
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

/**
 * Check if an item exists in LocalStorage
 */
export function hasStorageItem(key: string): boolean {
    return browser ? localStorage.getItem(key) !== null : false;
}

/**
 * Get the timestamp of when an item was last updated
 */
export function getItemTimestamp(key: string): number | null {
    try {
        const item = browser ? localStorage.getItem(key) : null;
        if (!item) return null;

        const parsedItem: StorageItem<unknown> = JSON.parse(item);
        return parsedItem.timestamp;
    } catch (error) {
        console.error('Error getting timestamp:', error);
        return null;
    }
} 