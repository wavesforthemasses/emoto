<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let id: string;
    export let checked = false;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        change: boolean;
    }>();

    function handleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        dispatch('change', target.checked);
    }
</script>

<div class="checkbox-wrapper">
    <input
        {id}
        type="checkbox"
        bind:checked
        {disabled}
        on:change={handleChange}
    />
    <label for={id}>
        <slot />
    </label>
</div>

<style>
    .checkbox-wrapper {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-sm);
        width: 100%;
    }

    input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 1.2em;
        height: 1.2em;
        border: 2px solid var(--color-text-secondary);
        border-radius: var(--border-radius-sm);
        margin-top: 0.2em;
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease;
    }

    input[type="checkbox"]:checked {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
    }

    input[type="checkbox"]:checked::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        width: 0.25em;
        height: 0.5em;
        border: solid white;
        border-width: 0 2px 2px 0;
    }

    input[type="checkbox"]:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    label {
        cursor: pointer;
        flex: 1;
        padding: var(--spacing-xs) 0;
    }
</style> 