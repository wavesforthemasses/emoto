<script lang="ts">
    export let tabs: { id: string; label: string }[];
    export let activeTab: string;
</script>

<nav class="tab-navigation">
    {#each tabs as tab}
        <button 
            class="tab-button" 
            class:active={activeTab === tab.id}
            on:click={() => activeTab = tab.id}
        >
            {tab.label}
        </button>
    {/each}
</nav>

<style>
    .tab-navigation {
        display: flex;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-6);
        border-bottom: 1px solid var(--color-text-light);
        padding-bottom: var(--spacing-2);
    }

    .tab-button {
        background: none;
        border: none;
        padding: var(--spacing-2) var(--spacing-4);
        cursor: pointer;
        color: var(--color-text-light);
        font-size: var(--font-size-base);
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        transition: all var(--transition);
    }

    .tab-button.active {
        color: var(--color-primary);
        background-color: var(--color-surface);
        font-weight: bold;
    }

    .tab-button:hover:not(.active) {
        color: var(--color-text);
        background-color: var(--color-surface);
    }

    @media (max-width: 768px) {
        .tab-navigation {
            flex-wrap: wrap;
        }

        .tab-button {
            flex: 1;
            text-align: center;
            min-width: 120px;
        }
    }
</style> 