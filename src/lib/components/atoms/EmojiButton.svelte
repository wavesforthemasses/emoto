<script lang="ts">
    export let emoji: string;
    export let label: string;
    export let score: number;
    export let selected = false;
    export let disabled = false;
</script>

<button
    class="emoji-button"
    class:selected
    {disabled}
    on:click
    aria-label={label}
    role="radio"
    aria-checked={selected}
>
    <span class="emoji">{emoji}</span>
    <span class="sr-only">{label}</span>
</button>

<style>
    .emoji-button {
        background: none;
        border: 2px solid transparent;
        border-radius: var(--border-radius-full);
        padding: var(--spacing-2);
        cursor: pointer;
        transition: transform var(--transition), border-color var(--transition);
        font-size: var(--font-size-2xl);
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .emoji-button:hover:not(:disabled) {
        transform: scale(1.1);
        border-color: var(--color-primary-light);
    }

    .emoji-button:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .emoji-button.selected {
        border-color: var(--color-primary);
        background-color: var(--color-surface);
        transform: scale(1.1);
    }

    .emoji-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .emoji {
        line-height: 1;
        user-select: none;
    }
</style> 