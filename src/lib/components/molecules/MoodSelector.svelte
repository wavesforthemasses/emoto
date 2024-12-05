<script lang="ts">
  import MoodIcon from '../atoms/MoodIcon.svelte';
  import { createEventDispatcher } from 'svelte';

  export let selectedMood: string | null = null;
  
  const moods = ['great', 'good', 'okay', 'bad', 'terrible'] as const;
  const dispatch = createEventDispatcher<{
    select: { mood: typeof moods[number] }
  }>();

  function handleSelect(mood: typeof moods[number]) {
    selectedMood = mood;
    dispatch('select', { mood });
  }
</script>

<div class="mood-selector">
  <h2>How are you feeling?</h2>
  <div class="moods">
    {#each moods as mood}
      <MoodIcon
        {mood}
        selected={selectedMood === mood}
        on:click={() => handleSelect(mood)}
      />
    {/each}
  </div>
</div>

<style>
  .mood-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
  }

  h2 {
    font-size: var(--font-size-xl);
    color: var(--color-text);
    font-weight: 600;
    margin: 0;
  }

  .moods {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--color-surface);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 640px) {
    .moods {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style> 