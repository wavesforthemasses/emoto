<script lang="ts">
    export let title: string;
    export let subtitle: string | null = null;
    export let tag: string | null = null;
    export let clickable = false;
    export let selected = false;
</script>

<div 
    class="list-item"
    class:clickable
    class:selected
    on:click
>
    <div class="item-info">
        <h3>{title}</h3>
        {#if subtitle}
            <span class="meta">{subtitle}</span>
        {/if}
        {#if tag}
            <span class="tag">{tag}</span>
        {/if}
    </div>
    <div class="item-actions">
        <slot name="actions" />
    </div>
    {#if selected}
        <div class="item-details">
            <slot name="details" />
        </div>
    {/if}
</div>

<style>
    .list-item {
        padding: var(--spacing-4);
        background-color: var(--color-background);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
    }

    .clickable {
        cursor: pointer;
        transition: background-color var(--transition);
    }

    .clickable:hover {
        background-color: var(--color-surface);
    }

    .selected {
        border: 1px solid var(--color-primary);
    }

    .item-info h3 {
        margin: 0;
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-2);
    }

    .meta {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
    }

    .tag {
        display: inline-block;
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
        background-color: var(--color-surface);
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--border-radius-sm);
        margin-top: var(--spacing-2);
    }

    .item-actions {
        display: flex;
        gap: var(--spacing-2);
        margin-top: var(--spacing-2);
    }

    .item-details {
        margin-top: var(--spacing-4);
        padding-top: var(--spacing-4);
        border-top: 1px solid var(--color-text-light);
    }
</style> 