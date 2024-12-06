<script lang="ts">
    export let title: string;
    export let fullWidth = false;
    export let variant: 'default' | 'primary' | 'secondary' = 'default';
    export let loading = false;
    export let error: string | null = null;
    export let collapsible = false;
    export let collapsed = false;

    // Optional icon props
    export let icon: string | null = null; // remixicon icon name
    export let iconPosition: 'left' | 'right' = 'left';

    let isCollapsed = collapsed;

    function toggleCollapse() {
        if (collapsible) {
            isCollapsed = !isCollapsed;
        }
    }
</script>

<div class="card {variant} {fullWidth ? 'full-width' : ''}" 
    class:loading
    class:has-error={error}
    role="region"
    aria-labelledby={title ? 'card-title' : undefined}
>
    {#if title || collapsible}
        <header 
            class="card-header"
            class:clickable={collapsible}
            on:click={toggleCollapse}
            on:keydown={(e) => e.key === 'Enter' && toggleCollapse()}
            tabindex={collapsible ? 0 : undefined}
            role={collapsible ? 'button' : undefined}
            aria-expanded={collapsible ? !isCollapsed : undefined}
        >
            <div class="title-wrapper">
                {#if icon && iconPosition === 'left'}
                    <i class={`icon ${icon}`}></i>
                {/if}
                
                {#if title}
                    <h3 id="card-title" class="card-title">{title}</h3>
                {/if}
                
                {#if icon && iconPosition === 'right'}
                    <span class="icon">{icon}</span>
                {/if}
            </div>

            {#if collapsible}
                <button class="collapse-button" aria-label={isCollapsed ? 'Expand' : 'Collapse'}>
                    <svg 
                        class="chevron" 
                        class:collapsed={isCollapsed}
                        viewBox="0 0 24 24" 
                        width="24" 
                        height="24"
                    >
                        <path 
                            d="M7 10l5 5 5-5" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-width="2" 
                            stroke-linecap="round"
                        />
                    </svg>
                </button>
            {/if}
        </header>
    {/if}

    {#if !isCollapsed}
        <div class="card-content" 
            class:no-padding={$$slots.raw}
            transition:slide|local={{ duration: 200 }}
        >
            {#if loading}
                <div class="loading-indicator">
                    <div class="spinner"></div>
                    <span>Loading...</span>
                </div>
            {:else if error}
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    <p>{error}</p>
                </div>
            {:else}
                <slot />
            {/if}
        </div>
    {/if}

    {#if $$slots.footer && !isCollapsed}
        <footer class="card-footer">
            <slot name="footer" />
        </footer>
    {/if}
</div>

<style>
    .card {
        background: var(--color-surface);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
        transition: all 0.2s ease;
        border: 1px solid var(--color-border);
    }

    .card:hover {
        box-shadow: var(--shadow-lg);
    }

    .full-width {
        width: 100%;
    }

    .card.primary {
        border-left: 4px solid var(--color-primary);
    }

    .card.secondary {
        border-left: 4px solid var(--color-secondary);
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--color-border);
    }

    .clickable {
        cursor: pointer;
        user-select: none;
    }

    .clickable:hover {
        background: var(--color-surface-hover);
    }

    .title-wrapper {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .card-title {
        font-size: var(--font-size-lg);
        color: var(--color-text);
        font-weight: 600;
        margin: 0;
    }

    .icon {
        display: flex;
        align-items: center;
        color: var(--color-text-secondary);
    }

    .card-content {
        padding: var(--spacing-lg);
    }

    .no-padding {
        padding: 0;
    }

    .card-footer {
        padding: var(--spacing-md) var(--spacing-lg);
        border-top: 1px solid var(--color-border);
        background: var(--color-surface-alt);
        border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    }

    .loading-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-md);
        padding: var(--spacing-xl);
        color: var(--color-text-secondary);
    }

    .spinner {
        width: 24px;
        height: 24px;
        border: 3px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .error-message {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background: var(--color-error-bg);
        color: var(--color-error);
        border-radius: var(--border-radius-md);
    }

    .chevron {
        transition: transform 0.2s ease;
    }

    .chevron.collapsed {
        transform: rotate(-90deg);
    }

    .collapse-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: var(--spacing-sm);
        color: var(--color-text-secondary);
        border-radius: var(--border-radius-sm);
    }

    .collapse-button:hover {
        background: var(--color-surface-hover);
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 640px) {
        .card-header {
            padding: var(--spacing-md);
        }

        .card-content {
            padding: var(--spacing-md);
        }

        .card-footer {
            padding: var(--spacing-sm) var(--spacing-md);
        }
    }
</style> 