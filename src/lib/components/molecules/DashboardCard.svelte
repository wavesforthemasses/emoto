<script lang="ts">
    export let title: string;
    export let fullWidth = false;
</script>

<div class="card {fullWidth ? 'full-width' : ''}">
    {#if title}
        <h3 class="card-title">{title}</h3>
    {/if}
    <div class="card-content">
        <slot />
    </div>
</div>

<style>
    .card {
        background: var(--color-surface);
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
    }

    .full-width {
        width: 100%;
    }

    .card-title {
        font-size: var(--font-size-lg);
        color: var(--color-text);
        margin-bottom: var(--spacing-md);
        font-weight: 600;
    }

    .card-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }
</style> 