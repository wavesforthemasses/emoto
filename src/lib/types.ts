export interface StatData {
    id: string;
    userId: string;
    companyId: string;
    value: number;
    timestamp: number;
    type: 'mood' | 'productivity' | 'satisfaction';
} 