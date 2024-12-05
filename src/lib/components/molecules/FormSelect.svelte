<script lang="ts">
    export let id: string;
    export let label: string;
    export let value: string;
    export let options: { value: string; label: string }[];
    export let placeholder = 'Select an option';
    export let required = false;
</script>

<div class="form-group">
    <label for={id}>{label}</label>
    <select {id} bind:value {required}>
        <option value="">{placeholder}</option>
        {#each options as option}
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>
</div>

<style>
    .form-group {
        margin-bottom: var(--spacing-4);
    }

    label {
        display: block;
        margin-bottom: var(--spacing-2);
        color: var(--color-text);
    }

    select {
        width: 100%;
        padding: var(--spacing-2);
        border: 1px solid var(--color-text-light);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
        background-color: var(--color-background);
    }

    select:focus {
        outline: none;
        border-color: var(--color-primary);
    }
</style> 