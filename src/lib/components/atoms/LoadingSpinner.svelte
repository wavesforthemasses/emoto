<script lang="ts">
    export let message = 'Loading...';
</script>

<div class="loading" role="status">
    <div class="spinner"></div>
    <span>{message}</span>
</div>

<style>
    .loading {
        text-align: center;
        color: var(--color-text-light);
        padding: var(--spacing-8);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-4);
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--color-surface);
        border-top: 4px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style> 