<script lang="ts">
    import { onMount } from 'svelte';
    import { statsStore } from '$lib/stores/statsStore';
    import type { StatData } from '$lib/types';
    import TimeframeSelector from '$lib/components/molecules/TimeframeSelector.svelte';
    import StatFilter from '$lib/components/molecules/StatFilter.svelte';
    import StackedHistogram from '$lib/components/molecules/StackedHistogram.svelte';
    
    export let companyId: string;
    
    type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';
    let selectedTimeframe: TimeFrame = 'monthly';
    let selectedFilters: string[] = ['mood', 'productivity', 'satisfaction'];

    // Subscribe to statsStore and filter by companyId
    $: companyStats = $statsStore.filter(stat => stat.companyId === companyId);

    $: console.log('companyStats', companyStats);

    // Process data based on timeframe and filters
    $: {
        if (companyStats.length > 0) {
            processedData = processDataByTimeframe(companyStats, selectedTimeframe);
        }
    }

    // Add proper typing for processed data
    interface ProcessedDataPoint {
        timestamp: Date;
        values: {
            mood: number;
            productivity: number;
            satisfaction: number;
        };
    }
    let processedData: ProcessedDataPoint[] = [];

    function processDataByTimeframe(stats: StatData[], timeframe: TimeFrame): ProcessedDataPoint[] {
        // Add input validation
        if (!stats?.length) return [];

        // Add value mapping for mood strings
        const moodValueMap = {
            'bad': 0,
            'okay': 50,
            'good': 100
        };

        const groupedStats = stats.reduce((acc, stat) => {
            // Validate stat data
            if (!stat?.timestamp || !stat?.type) return acc;

            const date = new Date(stat.timestamp);
            let key: string;
            
            // Improve date grouping logic
            switch (timeframe) {
                case 'daily':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'weekly':
                    // Use ISO week numbers for more accurate weekly grouping
                    const startOfWeek = new Date(date);
                    startOfWeek.setDate(date.getDate() - date.getDay());
                    key = startOfWeek.toISOString().split('T')[0];
                    break;
                case 'monthly':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'yearly':
                    key = date.getFullYear().toString();
                    break;
            }

            if (!acc[key]) {
                acc[key] = {
                    timestamp: date,
                    values: {
                        mood: 0,
                        productivity: 0,
                        satisfaction: 0
                    },
                    count: {
                        mood: 0,
                        productivity: 0,
                        satisfaction: 0
                    }
                };
            }

            // Convert string values to numbers if needed
            let numericalValue: number;
            if (typeof stat.value === 'number') {
                numericalValue = stat.value;
            } else if (stat.type === 'mood' && typeof stat.value === 'string') {
                numericalValue = moodValueMap[stat.value.toLowerCase()] ?? 50; // default to 50 if unknown
            } else {
                // Skip invalid values
                return acc;
            }

            // Ensure value is within valid range (0-100)
            const normalizedValue = Math.max(0, Math.min(100, numericalValue));
            acc[key].values[stat.type] += normalizedValue;
            acc[key].count[stat.type]++;

            return acc;
        }, {} as Record<string, any>);

        // Calculate averages and format data
        return Object.entries(groupedStats)
            .map(([key, data]) => ({
                timestamp: data.timestamp,
                values: {
                    mood: Number((data.count.mood ? data.values.mood / data.count.mood : 0).toFixed(2)),
                    productivity: Number((data.count.productivity ? data.values.productivity / data.count.productivity : 0).toFixed(2)),
                    satisfaction: Number((data.count.satisfaction ? data.values.satisfaction / data.count.satisfaction : 0).toFixed(2))
                }
            }))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }

    // Add loading state
    let isLoading = true;

    onMount(() => {
        isLoading = false;
    });
</script>

<div class="stats-container" role="region" aria-label="Company Statistics">
    <header class="stats-header">
        <TimeframeSelector 
            bind:selected={selectedTimeframe}
            options={['daily', 'weekly', 'monthly', 'yearly']}
        />
        <StatFilter
            bind:selected={selectedFilters}
            categories={['mood', 'productivity', 'satisfaction']}
        />
    </header>

    <div class="stats-content">
        {#if isLoading}
            <div class="loading-state" aria-label="Loading statistics">
                Loading...
            </div>
        {:else if processedData.length > 0}
            <StackedHistogram 
                data={processedData}
                categories={selectedFilters}
                timeframe={selectedTimeframe}
            />
        {:else}
            <p class="no-data" role="alert">No data available for the selected timeframe</p>
        {/if}
    </div>
</div>

<style>
    .stats-container {
        background: var(--surface-1);
        border-radius: var(--radius-lg);
        padding: var(--space-lg);
        box-shadow: var(--shadow-sm);
    }

    .stats-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-md);
        flex-wrap: wrap;
        gap: var(--space-sm);
    }

    .stats-content {
        min-height: 400px;
        position: relative;
    }

    .no-data {
        text-align: center;
        color: var(--text-muted);
        padding: var(--space-xl);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .stats-header {
            flex-direction: column;
            align-items: stretch;
        }
    }

    .loading-state {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
        color: var(--text-muted);
    }
</style>
