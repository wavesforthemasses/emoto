<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { companyStore } from '$lib/stores/companyStore';
    import type { Task } from '$lib/stores/companyStore';
    import Checkbox from '$lib/components/atoms/Checkbox.svelte';

    export let companyId: string;
    export let selectedTasks: string[] = [];

    const dispatch = createEventDispatcher<{
        select: { taskIds: string[] };
    }>();

    // Get available tasks for the company
    $: availableTasks = $companyStore.tasks.filter(
        (task: Task) => task.companyId === companyId
    );

    function handleTaskToggle(taskId: string, isSelected: boolean) {
        let newSelectedTasks: string[];
        
        if (isSelected) {
            // Add task if not already selected
            newSelectedTasks = [...new Set([...selectedTasks, taskId])];
        } else {
            // Remove task
            newSelectedTasks = selectedTasks.filter(id => id !== taskId);
        }

        selectedTasks = newSelectedTasks;
        dispatch('select', { taskIds: newSelectedTasks });
    }
</script>

<div class="task-selector">
    {#if availableTasks.length === 0}
        <p class="empty-state">No tasks available</p>
    {:else}
        <div class="task-list">
            {#each availableTasks as task}
                <div class="task-item">
                    <Checkbox
                        id={`task-${task.id}`}
                        checked={selectedTasks.includes(task.id)}
                        on:change={(e) => handleTaskToggle(task.id, e.detail)}
                    >
                        <div class="task-info">
                            <span class="task-title">{task.title}</span>
                            {#if task.description}
                                <span class="task-description">{task.description}</span>
                            {/if}
                        </div>
                    </Checkbox>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .task-selector {
        width: 100%;
        background: var(--color-surface);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-md);
    }

    .task-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .task-item {
        padding: var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        background: var(--color-surface-alt);
        transition: background-color 0.2s ease;
    }

    .task-item:hover {
        background: var(--color-surface-hover);
    }

    .task-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .task-title {
        font-weight: 500;
    }

    .task-description {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }

    .empty-state {
        text-align: center;
        color: var(--color-text-secondary);
        padding: var(--spacing-md);
    }
</style> 