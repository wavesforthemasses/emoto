<!-- Main page component -->
<script lang="ts">
  import MoodSelector from '$lib/components/molecules/MoodSelector.svelte';
  import MoodHistory from '$lib/components/organisms/MoodHistory.svelte';
  import Button from '$lib/components/atoms/Button.svelte';
  import { moodStore } from '$lib/stores/moodStore';
  import { isToday } from '$lib/utils/dateUtils';

  let note = '';
  let showNoteInput = false;

  $: canAddMood = !$moodStore.entries.some(entry => isToday(entry.timestamp));

  function handleMoodSelect({ detail }: CustomEvent<{ mood: string }>) {
    showNoteInput = true;
  }

  function handleSubmit() {
    moodStore.addEntry({
      mood: 'great',
      note: note.trim() || undefined
    });
    note = '';
    showNoteInput = false;
  }
</script>

<svelte:head>
  <title>Mood Tracker</title>
  <meta name="description" content="Track your daily mood and well-being" />
</svelte:head>

<main>
  <div class="hero">
    <h1>Track Your Mood</h1>
    <p>Monitor your daily well-being and emotional state</p>
  </div>

  {#if canAddMood}
    <section class="mood-input">
      <MoodSelector on:select={handleMoodSelect} />
      
      {#if showNoteInput}
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
    </section>
  {:else}
    <p class="info-message">You've already logged your mood today. Come back tomorrow!</p>
  {/if}

  <section class="history-section">
    <MoodHistory />
  </section>
</main>

<style>
  main {
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

  .mood-input {
    max-width: 500px;
    margin: 0 auto var(--spacing-2xl);
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

  .info-message {
    text-align: center;
    color: var(--color-text-secondary);
    margin: var(--spacing-xl) 0;
  }

  .history-section {
    margin-top: var(--spacing-2xl);
  }

  @media (max-width: 640px) {
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
  }
</style>
