<script lang="ts">
    export let message: string;
</script>

<p class="empty-state">
    {message}
</p>

<style>
    .empty-state {
        text-align: center;
        color: var(--color-text-light);
        padding: var(--spacing-4);
        font-size: var(--font-size-base);
    }
</style> 