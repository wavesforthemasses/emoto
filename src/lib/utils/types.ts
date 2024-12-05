/**
 * PWA Types
 */
export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

/**
 * User Types
 */
export interface User {
    id: string;
    name: string;
    email: string;
    companyId: string;
    departmentId?: string;
    role: 'employee' | 'manager' | 'admin';
    createdAt: number;
    updatedAt: number;
}

/**
 * Company Types
 */
export interface Company {
    id: string;
    name: string;
    departments: Department[];
    createdAt: number;
    updatedAt: number;
}

export interface Department {
    id: string;
    name: string;
    companyId: string;
    createdAt: number;
    updatedAt: number;
}

/**
 * Mood Types
 */
export interface MoodEntry {
    id: string;
    userId: string;
    companyId: string;
    departmentId?: string;
    emoji: string;
    score: number;
    note?: string;
    task?: string;
    timestamp: number;
}

export interface MoodStats {
    averageScore: number;
    totalEntries: number;
    lastEntry?: MoodEntry;
    byDepartment?: {
        [key: string]: {
            averageScore: number;
            totalEntries: number;
        };
    };
}

/**
 * Task Types
 */
export interface Task {
    id: string;
    title: string;
    description?: string;
    departmentIds: string[];
    companyId: string;
    createdAt: number;
    updatedAt: number;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: number;
}

/**
 * Store Types
 */
export interface StoreState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    timestamp: number;
} 