<!-- A reusable mood icon component -->
<script lang="ts">
  export let mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible' = 'good';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let selected = false;

  const moodEmojis = {
    great: '😄',
    good: '🙂',
    okay: '😐',
    bad: '🙁',
    terrible: '😢'
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
</script>

<button
  class="mood-icon {sizeClasses[size]} {selected ? 'selected' : ''}"
  aria-label="Mood: {mood}"
  on:click
>
  <span class="emoji">{moodEmojis[mood]}</span>
</button>

<style>
  .mood-icon {
    background: var(--color-surface);
    border: 2px solid transparent;
    border-radius: var(--border-radius-full);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-sm);
  }

  .mood-icon:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }

  .mood-icon.selected {
    border-color: var(--color-primary);
    background: var(--gradient-primary);
  }

  .emoji {
    font-size: 1.2em;
    line-height: 1;
  }
</style> 