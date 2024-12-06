<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let categories: string[] = [];
    export let selected: string[] = [];
    
    const dispatch = createEventDispatcher();
    
    function toggleFilter(category: string) {
        if (selected.includes(category)) {
            selected = selected.filter(item => item !== category);
        } else {
            selected = [...selected, category];
        }
        dispatch('filterChange', { selected });
    }
</script>

<div class="filter-container" role="group" aria-label="Statistics filters">
    {#each categories as category}
        <button
            class="filter-btn"
            class:active={selected.includes(category)}
            on:click={() => toggleFilter(category)}
            aria-pressed={selected.includes(category)}
        >
            <span class="checkbox">
                {#if selected.includes(category)}
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <path 
                            fill="currentColor" 
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                        />
                    </svg>
                {/if}
            </span>
            {category}
        </button>
    {/each}
</div>

<style>
    .filter-container {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-xs);
    }

    .filter-btn {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        padding: var(--space-sm) var(--space-md);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--surface-1);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .filter-btn:hover {
        background: var(--surface-2);
    }

    .filter-btn.active {
        background: var(--primary-light);
        border-color: var(--primary);
        color: var(--primary-dark);
    }

    .checkbox {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
    }

    .active .checkbox {
        background: var(--primary);
        border-color: var(--primary);
        color: white;
    }
</style>
