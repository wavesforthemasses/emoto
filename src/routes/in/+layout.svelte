<!-- Internal pages layout -->
<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/atoms/Button.svelte';

  const navigation = [
    { href: '/in/u/demo', label: 'Personal' },
    { href: '/in/c/demo', label: 'Company' },
    { href: '/in/a', label: 'Admin' }
  ];
</script>

<div class="internal-layout">
  <header>
    <nav>
      <div class="nav-content">
        {#each navigation as item}
          <Button
            variant={$page.url.pathname.startsWith(item.href) ? 'primary' : 'secondary'}
            on:click={() => window.location.href = item.href}
          >
            {item.label}
          </Button>
        {/each}
      </div>
    </nav>
  </header>

  <main>
    <slot />
  </main>
</div>

<style>
  .internal-layout {
    min-height: 100vh;
    background: var(--color-background);
  }

  header {
    background: var(--color-surface);
    box-shadow: var(--shadow-md);
    position: sticky;
    top: 0;
    z-index: 20;
  }

  nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md) var(--spacing-lg);
  }

  .nav-content {
    display: flex;
    gap: var(--spacing-sm);
  }

  main {
    flex: 1;
  }

  @media (max-width: 640px) {
    nav {
      padding: var(--spacing-md);
    }

    .nav-content {
      flex-wrap: wrap;
    }
  }
</style> 