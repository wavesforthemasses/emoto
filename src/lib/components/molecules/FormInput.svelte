<script lang="ts">
    export let id: string;
    export let label: string;
    export let value: string;
    export let type: 'text' | 'email' | 'password' | 'number' = 'text';
    export let placeholder = '';
    export let required = false;
</script>

<div class="form-group">
    <label for={id}>{label}</label>
    <input
        {id}
        {type}
        {placeholder}
        {required}
        bind:value
    />
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

    input {
        width: 100%;
        padding: var(--spacing-2);
        border: 1px solid var(--color-text-light);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
        background-color: var(--color-background);
    }

    input:focus {
        outline: none;
        border-color: var(--color-primary);
    }
</style> 