<script lang="ts">
    export let selected: string;
    export let options: string[];
</script>

<div class="timeframe-selector">
    {#each options as option}
        <button
            class="timeframe-button"
            class:active={selected === option}
            on:click={() => selected = option}
        >
            {option}
        </button>
    {/each}
</div>

<style>
    .timeframe-selector {
        display: flex;
        gap: var(--spacing-xs);
        background: var(--color-surface);
        padding: var(--spacing-xs);
        border-radius: var(--border-radius-md);
    }

    .timeframe-button {
        padding: var(--spacing-xs) var(--spacing-sm);
        border: none;
        background: transparent;
        color: var(--color-text-secondary);
        border-radius: var(--border-radius-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .timeframe-button:hover {
        background: var(--color-surface-hover);
    }

    .timeframe-button.active {
        background: var(--color-primary);
        color: var(--color-surface);
    }
</style> 