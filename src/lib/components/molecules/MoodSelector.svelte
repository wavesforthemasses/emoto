<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import EmojiButton from '../atoms/EmojiButton.svelte';
    import { moodStore } from '$lib/stores/moodStore';
    import { getStorageItem } from '$lib/utils/storage';
    import type { Task } from '$lib/utils/types';

    const dispatch = createEventDispatcher<{
        select: { emoji: string; score: number };
    }>();

    export let userId: string;
    export let companyId: string;
    export let departmentId: string | undefined = undefined;
    export let disabled = false;

    const moods = [
        { emoji: '😢', label: 'Very Unhappy', score: 1 },
        { emoji: '😕', label: 'Unhappy', score: 2 },
        { emoji: '😐', label: 'Neutral', score: 3 },
        { emoji: '🙂', label: 'Happy', score: 4 },
        { emoji: '😄', label: 'Very Happy', score: 5 }
    ];

    let selectedMood: { emoji: string; score: number } | null = null;
    let currentTask = '';
    let bestTask = '';
    let worstTask = '';
    let showQuestions = false;

    // Get available tasks for the user's department
    $: availableTasks = getStorageItem<Task[]>('mood-tracker-tasks')?.filter(task => 
        task.companyId === companyId && 
        (!task.departmentIds.length || // Available to all departments if empty
         (departmentId && task.departmentIds.includes(departmentId)))
    ) || [];

    $: {
        console.log('Available Tasks:', availableTasks);
        console.log('Company ID:', companyId);
        console.log('Department ID:', departmentId);
        if (currentTask === 'other') {
            currentTask = '';
        }
        if (bestTask === 'other') {
            bestTask = '';
        }
        if (worstTask === 'other') {
            worstTask = '';
        }
    }

    function handleSelect(mood: typeof moods[number]) {
        if (disabled) return;
        
        selectedMood = { emoji: mood.emoji, score: mood.score };
        showQuestions = true;
        dispatch('select', selectedMood);

        // Update store immediately
        moodStore.addEntry({
            emoji: mood.emoji,
            score: mood.score,
            userId,
            departmentId,
            timestamp: new Date().toISOString() // Ensure timestamp is set
        });
    }

    function handleSubmitTasks() {
        if (!selectedMood) return;

        // Update the last entry with task information
        const entries = $moodStore.entries;
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
            moodStore.updateLastEntry({
                ...lastEntry,
                task: currentTask,
                bestTask,
                worstTask
            });
        }

        // Reset form
        currentTask = '';
        bestTask = '';
        worstTask = '';
        showQuestions = false;
    }

    // Check if user has submitted a mood in the last hour
    $: {
        const userEntries = $moodStore.entries.filter(entry => entry.userId === userId);
        const lastUserEntry = userEntries[userEntries.length - 1];
        
        if (lastUserEntry) {
            const lastEntryTime = new Date(lastUserEntry.timestamp);
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            disabled = lastEntryTime > oneHourAgo;
        } else {
            disabled = false;
        }
    }
</script>

<div 
    class="mood-selector"
    role="radiogroup"
    aria-label="Select your current mood"
>
    <div class="moods-container">
        {#each moods as mood}
            <EmojiButton
                emoji={mood.emoji}
                label={mood.label}
                score={mood.score}
                selected={selectedMood?.emoji === mood.emoji}
                {disabled}
                on:click={() => handleSelect(mood)}
            />
        {/each}
    </div>

    {#if showQuestions}
        <div class="task-questions scale-in">
            <h3>Tell us about your tasks</h3>
            <div class="form-group">
                <label for="currentTask">What are you working on right now?</label>
                <select
                    id="currentTask"
                    bind:value={currentTask}
                >
                    <option value="">Select a task (optional)</option>
                    {#each availableTasks as task}
                        <option value={task.title}>{task.title}</option>
                    {/each}
                    <option value="other">Other</option>
                </select>
                {#if currentTask === ''}
                    <input
                        type="text"
                        class="other-input"
                        bind:value={currentTask}
                        placeholder="Enter your current task"
                        aria-label="Enter custom task"
                    />
                {/if}
            </div>

            <div class="form-group">
                <label for="bestTask">Best task of the day so far?</label>
                <select
                    id="bestTask"
                    bind:value={bestTask}
                >
                    <option value="">Select a task (optional)</option>
                    {#each availableTasks as task}
                        <option value={task.title}>{task.title}</option>
                    {/each}
                    <option value="other">Other</option>
                </select>
                {#if bestTask === ''}
                    <input
                        type="text"
                        class="other-input"
                        bind:value={bestTask}
                        placeholder="Enter the best task"
                        aria-label="Enter custom best task"
                    />
                {/if}
            </div>

            <div class="form-group">
                <label for="worstTask">Most challenging task of the day?</label>
                <select
                    id="worstTask"
                    bind:value={worstTask}
                >
                    <option value="">Select a task (optional)</option>
                    {#each availableTasks as task}
                        <option value={task.title}>{task.title}</option>
                    {/each}
                    <option value="other">Other</option>
                </select>
                {#if worstTask === ''}
                    <input
                        type="text"
                        class="other-input"
                        bind:value={worstTask}
                        placeholder="Enter the challenging task"
                        aria-label="Enter custom challenging task"
                    />
                {/if}
            </div>

            <button class="btn-primary" on:click={handleSubmitTasks}>
                Submit Task Info
            </button>
        </div>
    {/if}

    {#if disabled}
        <p class="info-text">You can submit your mood again in an hour</p>
    {/if}
</div>

<style>
    .mood-selector {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-4);
        padding: var(--spacing-4);
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow);
    }

    .moods-container {
        display: flex;
        gap: var(--spacing-4);
        flex-wrap: wrap;
        justify-content: center;
    }

    .task-questions {
        width: 100%;
        max-width: 500px;
        padding: var(--spacing-4);
        background-color: var(--color-background);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
    }

    h3 {
        text-align: center;
        margin-bottom: var(--spacing-4);
        color: var(--color-text);
    }

    .form-group {
        margin-bottom: var(--spacing-4);
    }

    label {
        display: block;
        margin-bottom: var(--spacing-2);
        color: var(--color-text);
        font-size: var(--font-size-sm);
    }

    select,
    input {
        width: 100%;
        padding: var(--spacing-2);
        border: 1px solid var(--color-text-light);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
        background-color: var(--color-background);
    }

    .other-input {
        margin-top: var(--spacing-2);
    }

    select:focus,
    input:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .btn-primary {
        width: 100%;
        background-color: var(--color-primary);
        color: white;
        border: none;
        padding: var(--spacing-3);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: background-color var(--transition);
    }

    .btn-primary:hover {
        background-color: var(--color-primary-dark);
    }

    .info-text {
        color: var(--color-text-light);
        font-size: var(--font-size-sm);
        margin: 0;
    }

    @media (max-width: 480px) {
        .moods-container {
            gap: var(--spacing-2);
        }

        .task-questions {
            padding: var(--spacing-3);
        }
    }
</style> 