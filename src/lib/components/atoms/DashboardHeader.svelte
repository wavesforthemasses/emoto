<script lang="ts">
    export let title: string;
    export let subtitle: string | null = null;
</script>

<header class="dashboard-header">
    <h1>{title}</h1>
    {#if subtitle}
        <p class="subtitle">{subtitle}</p>
    {/if}
</header>

<style>
    .dashboard-header {
        text-align: center;
        margin-bottom: var(--spacing-8);
    }

    h1 {
        font-size: var(--font-size-2xl);
        color: var(--color-text);
        margin-bottom: var(--spacing-2);
    }

    .subtitle {
        color: var(--color-text-light);
        font-size: var(--font-size-lg);
    }
</style> 