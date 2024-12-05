<script lang="ts">
    export let tabs: string[];
    export let activeTab: string;
</script>

<nav class="tab-navigation" role="tablist">
    {#each tabs as tab}
        <button
            role="tab"
            class="tab-button"
            class:active={activeTab === tab}
            aria-selected={activeTab === tab}
            on:click={() => activeTab = tab}
        >
            {tab}
        </button>
    {/each}
</nav>

<style>
    .tab-navigation {
        display: flex;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        background: var(--color-surface);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-sm);
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .tab-button {
        padding: var(--spacing-sm) var(--spacing-lg);
        border: none;
        background: transparent;
        color: var(--color-text-secondary);
        font-size: var(--font-size-base);
        font-weight: 500;
        cursor: pointer;
        border-radius: var(--border-radius-md);
        transition: all var(--transition-fast);
        white-space: nowrap;
    }

    .tab-button:hover {
        color: var(--color-text);
        background: var(--color-surface-hover);
    }

    .tab-button.active {
        color: var(--color-primary);
        background: var(--color-primary-light);
    }

    @media (max-width: 640px) {
        .tab-navigation {
            padding: var(--spacing-xs);
        }

        .tab-button {
            padding: var(--spacing-xs) var(--spacing-md);
            font-size: var(--font-size-sm);
        }
    }
</style> 