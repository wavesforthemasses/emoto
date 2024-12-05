<script lang="ts">
    import { onMount } from 'svelte';
    import { pwaStore } from '$lib/utils/usePWA';

    let installable = false;
    let installing = false;

    onMount(async () => {
        await pwaStore.init();
        installable = $pwaStore.canInstall;
    });

    async function handleInstall() {
        installing = true;
        try {
            await pwaStore.promptInstall();
        } catch (error) {
            console.error('Failed to install PWA:', error);
        } finally {
            installing = false;
        }
    }
</script>

<div class="pwa-install">
    {#if installable}
        <button 
            class="btn-secondary"
            on:click={handleInstall}
            disabled={installing}
        >
            {installing ? 'Installing...' : 'Install App'}
        </button>
    {/if}
</div>

<style>
    .pwa-install {
        display: flex;
        justify-content: center;
    }

    .btn-secondary {
        background-color: var(--color-surface);
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all var(--transition);
        font-size: var(--font-size-base);
    }

    .btn-secondary:hover:not(:disabled) {
        background-color: var(--color-primary);
        color: white;
    }

    .btn-secondary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style> 