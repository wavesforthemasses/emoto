<script lang="ts">
  export let label: string;
  export let value: string | string[];
  export let options: Array<{ value: string; label: string }>;
  export let required = false;
  export let disabled = false;
  export let error = '';
  
  $: isMultiple = Array.isArray(value);
</script>

<div class="form-field">
  <label>
    {label}
    {#if required}
      <span class="required">*</span>
    {/if}
  </label>
  
  {#if isMultiple}
    <select
      multiple
      bind:value
      {required}
      {disabled}
      class:error={!!error}
    >
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {:else}
    <select
      bind:value
      {required}
      {disabled}
      class:error={!!error}
    >
      <option value="">Select an option</option>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {/if}
  
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

  select {
    padding: var(--spacing-sm);
    border: 1px solid var(--color-text-secondary);
    border-radius: var(--border-radius-md);
    font-family: inherit;
    font-size: var(--font-size-base);
    background: var(--color-surface);
    color: var(--color-text);
    transition: border-color var(--transition-fast);
    cursor: pointer;
  }

  select[multiple] {
    padding: var(--spacing-xs);
    min-height: 120px;
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  select:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  select.error {
    border-color: var(--color-primary);
  }

  .error-message {
    color: var(--color-primary);
    font-size: var(--font-size-sm);
  }
</style> 