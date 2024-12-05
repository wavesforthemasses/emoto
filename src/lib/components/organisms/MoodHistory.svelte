<!-- A component to display mood history -->
<script lang="ts">
  import { moodStore } from '$lib/stores/moodStore';
  import { formatDate, getRelativeTimeString, groupEntriesByDate } from '$lib/utils/dateUtils';
  import MoodIcon from '../atoms/MoodIcon.svelte';
  import Button from '../atoms/Button.svelte';

  // Reactive statement to group entries by date
  $: groupedEntries = groupEntriesByDate($moodStore.entries);
  $: dates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

  function handleDelete(timestamp: string) {
    if (confirm('Are you sure you want to delete this entry?')) {
      moodStore.deleteEntry(timestamp);
    }
  }
</script>

<div class="mood-history">
  <h2>Your Mood History</h2>
  
  {#if dates.length === 0}
    <div class="empty-state">
      <p>No mood entries yet. Start tracking your mood!</p>
    </div>
  {:else}
    {#each dates as date}
      <div class="date-group">
        <h3>{formatDate(date)}</h3>
        <div class="entries">
          {#each groupedEntries[date] as entry}
            <div class="entry">
              <div class="entry-header">
                <MoodIcon mood={entry.mood} size="sm" />
                <span class="timestamp">{getRelativeTimeString(entry.timestamp)}</span>
              </div>
              {#if entry.note}
                <p class="note">{entry.note}</p>
              {/if}
              <Button
                variant="text"
                size="sm"
                on:click={() => handleDelete(entry.timestamp)}
              >
                Delete
              </Button>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .mood-history {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
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
    background: var(--color-surface);
    border-radius: var(--border-radius-lg);
    color: var(--color-text-secondary);
  }

  .date-group {
    margin-bottom: var(--spacing-xl);
  }

  h3 {
    font-size: var(--font-size-lg);
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--color-text-secondary);
    padding-bottom: var(--spacing-xs);
  }

  .entries {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .entry {
    background: var(--color-surface);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
  }

  .entry-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
  }

  .timestamp {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  .note {
    margin: var(--spacing-sm) 0;
    color: var(--color-text);
    font-size: var(--font-size-base);
  }

  @media (max-width: 640px) {
    .mood-history {
      padding: 0 var(--spacing-md);
    }
  }
</style> 