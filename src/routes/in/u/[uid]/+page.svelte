<!-- User Dashboard -->
<script lang="ts">
    import { page } from '$app/stores';
    import MoodSelector from '$lib/components/molecules/MoodSelector.svelte';
    import NotificationOptIn from '$lib/components/molecules/NotificationOptIn.svelte';
    import PWAInstall from '$lib/components/molecules/PWAInstall.svelte';
    import { moodStore, type MoodEntry } from '$lib/stores/moodStore';
    import { onMount } from 'svelte';
    import { getStorageItem } from '$lib/utils/storage';
    import type { User } from '$lib/utils/types';

    const userId = $page.params.uid;
    let loading = true;
    let user: User | null = null;

    // Make userMoods reactive to moodStore changes
    $: userMoods = $moodStore.entries.filter(entry => entry.userId === userId);

    onMount(() => {
        // Load user data including company ID
        const users = getStorageItem<User[]>('mood-tracker-users') || [];
        user = users.find(u => u.id === userId) || null;
        loading = false;
    });

    function handleMoodSelect(event: CustomEvent<{ emoji: string; score: number }>) {
        const { emoji, score } = event.detail;
        // Additional handling if needed
    }

    // Calculate average mood score for the last 7 days
    $: averageMoodScore = userMoods.length > 0
        ? userMoods
            .slice(-7)
            .reduce((acc, curr) => acc + curr.score, 0) / Math.min(userMoods.length, 7)
        : 0;
</script>

<svelte:head>
    <title>Mood Tracker - Dashboard</title>
    <meta name="description" content="Track and monitor your daily mood" />
</svelte:head>

<main class="dashboard">
    <header class="dashboard-header">
        <h1>How are you feeling today?</h1>
        {#if averageMoodScore > 0}
            <p class="average-mood">
                Your average mood for the last 7 days: 
                <span class="score">{averageMoodScore.toFixed(1)}</span>
            </p>
        {/if}
    </header>

    <section class="mood-section" aria-live="polite">
        {#if loading}
            <div class="loading">Loading...</div>
        {:else if user}
            <MoodSelector
                userId={userId}
                companyId={user.companyId}
                departmentId={user.departmentId}
                on:select={handleMoodSelect}
            />
        {/if}
    </section>

    <section class="history-section">
        <h2>Your Mood History</h2>
        {#if userMoods.length === 0}
            <p class="empty-state">No mood entries yet. Start tracking your mood above!</p>
        {:else}
            <div class="mood-list">
                {#each userMoods.slice().reverse() as mood}
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
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </section>

    <section class="settings-section">
        <h2>App Settings</h2>
        <div class="settings-grid">
            <div class="settings-card">
                <h3>Push Notifications</h3>
                <p class="settings-description">Get reminders to track your mood and stay updated.</p>
                <NotificationOptIn />
            </div>

            <div class="settings-card">
                <h3>Install App</h3>
                <p class="settings-description">Install Mood Tracker for quick access and offline use.</p>
                <PWAInstall />
            </div>
        </div>
    </section>
</main>

<style>
    .dashboard {
        max-width: 800px;
        margin: 0 auto;
        padding: var(--spacing-6);
    }

    .dashboard-header {
        text-align: center;
        margin-bottom: var(--spacing-8);
    }

    h1 {
        font-size: var(--font-size-2xl);
        color: var(--color-text);
        margin-bottom: var(--spacing-4);
    }

    .average-mood {
        color: var(--color-text-light);
        font-size: var(--font-size-lg);
    }

    .score {
        color: var(--color-primary);
        font-weight: bold;
    }

    .mood-section {
        margin-bottom: var(--spacing-8);
    }

    .history-section {
        background-color: var(--color-surface);
        padding: var(--spacing-6);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow);
    }

    h2 {
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-4);
    }

    .empty-state {
        text-align: center;
        color: var(--color-text-light);
        padding: var(--spacing-4);
    }

    .mood-list {
        display: grid;
        gap: var(--spacing-4);
        max-height: 400px;
        overflow-y: auto;
    }

    .mood-entry {
        display: flex;
        align-items: center;
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
        flex-grow: 1;
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

    .loading {
        text-align: center;
        color: var(--color-text-light);
        padding: var(--spacing-8);
    }

    .settings-section {
        margin-top: var(--spacing-8);
    }

    .settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-4);
    }

    .settings-card {
        background-color: var(--color-surface);
        padding: var(--spacing-4);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow);
    }

    .settings-card h3 {
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-2);
        color: var(--color-text);
    }

    .settings-description {
        color: var(--color-text-light);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-4);
    }

    @media (max-width: 640px) {
        .dashboard {
            padding: var(--spacing-4);
        }

        .mood-list {
            max-height: 300px;
        }

        .settings-grid {
            grid-template-columns: 1fr;
        }
    }
</style> 