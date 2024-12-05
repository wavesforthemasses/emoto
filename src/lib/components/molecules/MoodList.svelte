<script lang="ts">
    import type { MoodEntry } from '$lib/utils/types';
    import EmptyState from '../atoms/EmptyState.svelte';

    export let moods: MoodEntry[];
    export let showDepartment = false;
    export let departmentName: (id: string) => string | undefined = () => undefined;
</script>

<div class="mood-list">
    {#if moods.length === 0}
        <EmptyState message="No mood entries yet" />
    {:else}
        {#each moods.slice().reverse() as mood}
            <div class="mood-entry">
                <span class="mood-emoji">{mood.emoji}</span>
                <div class="mood-details">
                    <time datetime={new Date(mood.timestamp).toISOString()}>
                        {new Date(mood.timestamp).toLocaleString()}
                    </time>
                    {#if mood.task}
                        <p class="task-info">Current Task: {mood.task}</p>
                    {/if}
                    {#if mood.bestTask}
                        <p class="task-info positive">Best Task: {mood.bestTask}</p>
                    {/if}
                    {#if mood.worstTask}
                        <p class="task-info negative">Challenging Task: {mood.worstTask}</p>
                    {/if}
                    {#if showDepartment && mood.departmentId}
                        <span class="department-tag">
                            {departmentName(mood.departmentId)}
                        </span>
                    {/if}
                </div>
            </div>
        {/each}
    {/if}
</div>

<style>
    .mood-list {
        display: grid;
        gap: var(--spacing-4);
        max-height: 400px;
        overflow-y: auto;
    }

    .mood-entry {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-4);
        padding: var(--spacing-3);
        background-color: var(--color-background);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
    }

    .mood-emoji {
        font-size: var(--font-size-xl);
    }

    .mood-details {
        flex: 1;
    }

    time {
        color: var(--color-text-light);
        font-size: var(--font-size-sm);
    }

    .task-info {
        margin: var(--spacing-1) 0;
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
    }

    .task-info.positive {
        color: var(--color-success);
    }

    .task-info.negative {
        color: var(--color-warning);
    }

    .department-tag {
        display: inline-block;
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
        background-color: var(--color-surface);
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--border-radius-sm);
        margin-top: var(--spacing-2);
    }

    @media (max-width: 640px) {
        .mood-list {
            max-height: 300px;
        }
    }
</style> 