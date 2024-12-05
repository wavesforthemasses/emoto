<script lang="ts">
    export let label: string;
    export let value: string;
    export let type: 'text' | 'email' | 'password' | 'number' = 'text';
    export let placeholder = '';
    export let required = false;
    export let disabled = false;
    export let error = '';
</script>

<div class="form-field">
    <label>
        {label}
        {#if required}
            <span class="required">*</span>
        {/if}
    </label>
    
    <input
        {type}
        {placeholder}
        {required}
        {disabled}
        bind:value
        class:error={!!error}
    />
    
    {#if error}
        <span class="error-message">{error}</span>
    {/if}
</div>

<style>
    .form-field {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    label {
        color: var(--color-text);
        font-size: var(--font-size-sm);
        font-weight: 500;
    }

    .required {
        color: var(--color-primary);
        margin-left: var(--spacing-xs);
    }

    input {
        padding: var(--spacing-sm);
        border: 1px solid var(--color-text-secondary);
        border-radius: var(--border-radius-md);
        font-family: inherit;
        font-size: var(--font-size-base);
        background: var(--color-surface);
        color: var(--color-text);
        transition: border-color var(--transition-fast);
    }

    input:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    input:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    input.error {
        border-color: var(--color-primary);
    }

    .error-message {
        color: var(--color-primary);
        font-size: var(--font-size-sm);
    }
</style> 