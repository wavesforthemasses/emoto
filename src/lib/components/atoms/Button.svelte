<!-- A reusable button component -->
<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'text' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let fullWidth = false;
</script>

<button
  {type}
  {disabled}
  class="button {variant} {size} {fullWidth ? 'full-width' : ''}"
  on:click
>
  <slot />
</button>

<style>
  .button {
    font-family: var(--font-family);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-fast);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .full-width {
    width: 100%;
  }

  /* Variants */
  .primary {
    background: var(--gradient-primary);
    color: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  .primary:hover:not(:disabled) {
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .secondary {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-text-secondary);
  }

  .secondary:hover:not(:disabled) {
    background: var(--color-background);
  }

  .text {
    background: transparent;
    color: var(--color-text);
    padding: 0;
  }

  .text:hover:not(:disabled) {
    color: var(--color-primary);
  }

  /* Sizes */
  .sm {
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .md {
    font-size: var(--font-size-base);
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .lg {
    font-size: var(--font-size-lg);
    padding: var(--spacing-md) var(--spacing-lg);
  }
</style> 