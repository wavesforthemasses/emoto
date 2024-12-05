<script lang="ts">
    export let tabs: Array<{ id: string; label: string }>;
    export let activeTab: string;
</script>

<nav class="tab-nav" role="tablist">
    {#each tabs as tab}
        <button 
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="panel-{tab.id}"
            class="tab-button"
            class:active={activeTab === tab.id}
            on:click={() => activeTab = tab.id}
        >
            {tab.label}
        </button>
    {/each}
</nav>

<style>
    .tab-nav {
        display: flex;
        gap: var(--spacing-xs);
        padding: var(--spacing-sm);
        background: var(--color-surface);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-sm);
        overflow-x: auto;
    }

    .tab-button {
        padding: var(--spacing-sm) var(--spacing-md);
        border: none;
        background: transparent;
        color: var(--color-text-secondary);
        font-family: inherit;
        font-size: var(--font-size-base);
        font-weight: 500;
        cursor: pointer;
        border-radius: var(--border-radius-md);
        transition: all var(--transition-fast);
        white-space: nowrap;
    }

    .tab-button:hover {
        color: var(--color-text);
        background: var(--color-background);
    }

    .tab-button.active {
        color: var(--color-surface);
        background: var(--gradient-primary);
    }

    @media (max-width: 640px) {
        .tab-nav {
            padding: var(--spacing-xs);
        }

        .tab-button {
            padding: var(--spacing-xs) var(--spacing-sm);
            font-size: var(--font-size-sm);
        }
    }
</style> 