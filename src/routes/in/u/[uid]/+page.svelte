<!-- User Dashboard -->
<script lang="ts">
    import { page } from '$app/stores';
    import MoodSelector from '$lib/components/molecules/MoodSelector.svelte';
    import MoodIcon from '$lib/components/atoms/MoodIcon.svelte';
    import Button from '$lib/components/atoms/Button.svelte';
    import { moodStore } from '$lib/stores/moodStore';
    import { companyStore } from '$lib/stores/companyStore';
    import { formatDate } from '$lib/utils/dateUtils';
    import { onMount } from 'svelte';
    import TaskSelector from '$lib/components/molecules/TaskSelector.svelte';

    const userId = $page.params.uid;
    let loading = true;
    let user: { id: string; name: string } | null = null;
    
    // Get user's company ID from the store
    $: currentUser = $companyStore.users.find(u => u.id === userId);
    $: companyId = currentUser?.companyId;

    // Make userMoods reactive to moodStore changes
    $: userMoods = $moodStore.entries;

    onMount(() => {
        // Simulated user data loading
        setTimeout(() => {
            user = { id: userId, name: 'User' };
            loading = false;
        }, 500);
    });

    function handleMoodSelect(event: CustomEvent<{ mood: string }>) {
        showNoteInput = true;
        selectedMood = event.detail.mood;
    }

    let showNoteInput = false;
    let selectedMood: string | null = null;
    let note = '';

    let selectedTaskIds: string[] = [];

    function handleTaskSelect(event: CustomEvent<{ taskIds: string[] }>) {
        selectedTaskIds = event.detail.taskIds;
    }

    function handleSubmit() {
        if (!selectedMood) return;
        
        moodStore.addEntry({
            mood: selectedMood as any,
            note: note.trim() || undefined,
            tasks: selectedTaskIds
        });
        
        note = '';
        showNoteInput = false;
        selectedMood = null;
        selectedTaskIds = [];
    }
</script>

<svelte:head>
    <title>Mood Tracker - Dashboard</title>
    <meta name="description" content="Track and monitor your daily mood" />
</svelte:head>

<main class="dashboard">
    <div class="hero">
        <h1>Welcome Back{#if user?.name}, {user.name}{/if}!</h1>
        <p>Track your mood and monitor your emotional well-being</p>
    </div>

    <section class="mood-section" aria-live="polite">
        {#if loading}
            <div class="loading">
                <span class="loading-text">Loading...</span>
            </div>
        {:else}
            <MoodSelector
                selectedMood={selectedMood}
                on:select={handleMoodSelect}
            />

            {#if showNoteInput}
                <div class="task-input">
                    <h3>Select one or more tasks (optional)</h3>
                    {#if companyId}
                        <TaskSelector
                            {companyId}
                            bind:selectedTasks={selectedTaskIds}
                            on:select={handleTaskSelect}
                        />
                    {/if}
                </div>
                <div class="note-input fade-in">
                    <label for="note">Add a note (optional)</label>
                    <textarea
                        id="note"
                        bind:value={note}
                        rows="3"
                        placeholder="How are you feeling today?"
                    ></textarea>
                    <Button on:click={handleSubmit} fullWidth>Save Entry</Button>
                </div>
            {/if}
        {/if}
    </section>

    <section class="history-section">
        <h2>Your Mood History</h2>
        {#if userMoods.length === 0}
            <div class="empty-state">
                <p>No mood entries yet. Start tracking your mood above!</p>
            </div>
        {:else}
            <div class="mood-list">
                {#each userMoods.slice().reverse() as entry}
                    <div class="mood-entry">
                        <div class="mood-header">
                            <MoodIcon
                                mood={entry.mood}
                            />
                            <time datetime={entry.timestamp}>
                                {formatDate(entry.timestamp)}
                            </time>
                        </div>
                        {#if entry?.tasks?.length > 0}
                            <div class="task-list">
                                {#each $companyStore.tasks.filter(
                                    (task: Task) => entry.tasks.includes(task.id)
                                ) as task}
                                    <span class="task-tag">{task.title}</span>
                                {/each}
                            </div>
                        {/if}
                        {#if entry.note}
                            <p class="note">{entry.note}</p>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </section>
</main>

<style>
    .dashboard {
        max-width: 800px;
        margin: 0 auto;
        padding: var(--spacing-xl) var(--spacing-md);
    }

    .hero {
        text-align: center;
        margin-bottom: var(--spacing-2xl);
        background: var(--gradient-background);
        padding: var(--spacing-xl);
        border-radius: var(--border-radius-lg);
        color: var(--color-surface);
    }

    h1 {
        font-size: var(--font-size-3xl);
        margin-bottom: var(--spacing-md);
    }

    .hero p {
        font-size: var(--font-size-lg);
        opacity: 0.9;
    }

    .mood-section {
        max-width: 500px;
        margin: 0 auto var(--spacing-2xl);
    }

    .loading {
        text-align: center;
        padding: var(--spacing-xl);
    }

    .loading-text {
        color: var(--color-text-secondary);
        font-size: var(--font-size-lg);
    }

    .note-input {
        margin-top: var(--spacing-xl);
        background: var(--color-surface);
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
    }

    label {
        display: block;
        margin-bottom: var(--spacing-sm);
        color: var(--color-text);
        font-size: var(--font-size-sm);
    }

    textarea {
        width: 100%;
        padding: var(--spacing-sm);
        border: 1px solid var(--color-text-secondary);
        border-radius: var(--border-radius-md);
        margin-bottom: var(--spacing-md);
        font-family: inherit;
        resize: vertical;
    }

    textarea:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .history-section {
        background: var(--color-surface);
        padding: var(--spacing-xl);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
    }

    h2 {
        font-size: var(--font-size-2xl);
        color: var(--color-text);
        margin-bottom: var(--spacing-xl);
        text-align: center;
    }

    .empty-state {
        text-align: center;
        padding: var(--spacing-xl);
        color: var(--color-text-secondary);
    }

    .mood-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        max-height: 500px;
        overflow-y: auto;
        padding: var(--spacing-md);
    }

    .mood-entry {
        background: var(--color-background);
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-sm);
    }

    .mood-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--spacing-sm);
    }

    time {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
    }

    .note {
        color: var(--color-text);
        font-size: var(--font-size-base);
        margin-top: var(--spacing-sm);
        padding-top: var(--spacing-sm);
        border-top: 1px solid var(--color-text-secondary);
    }

    @media (max-width: 640px) {
        .dashboard {
            padding: var(--spacing-md);
        }

        .hero {
            margin: var(--spacing-md);
            padding: var(--spacing-lg);
        }

        h1 {
            font-size: var(--font-size-2xl);
        }

        .hero p {
            font-size: var(--font-size-base);
        }

        .mood-list {
            max-height: 400px;
        }
    }

    .task-tag {
        background: var(--color-primary);
        color: var(--color-surface);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-lg);
        font-size: var(--font-size-xs);
    }
    .task-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-xs);
    }
</style> 
