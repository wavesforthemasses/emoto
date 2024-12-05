<script lang="ts">
    export let title: string;
</script>

<section class="dashboard-card">
    <h2>{title}</h2>
    <div class="card-content">
        <slot />
    </div>
</section>

<style>
    .dashboard-card {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-6);
        box-shadow: var(--shadow);
    }

    h2 {
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-4);
        color: var(--color-text);
    }

    .card-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }
</style> 