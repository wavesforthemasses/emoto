<!-- App layout component -->
<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  
  let isDarkMode = false;
  
  onMount(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    isDarkMode = storedTheme === 'dark' || (!storedTheme && prefersDark);
    document.documentElement.classList.toggle('dark', isDarkMode);
  });

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }
</script>

<div class="app">
  <header>
    <nav>
      <div class="logo">
        <a href="/">Mood Tracker</a>
      </div>
      <button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
        {#if isDarkMode}
          🌞
        {:else}
          🌙
        {/if}
      </button>
    </nav>
  </header>

  <div class="content">
    <slot />
  </div>

  <footer>
    <p>Made with ❤️ for better mental health</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  header {
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md) var(--spacing-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo a {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-text);
    text-decoration: none;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--font-size-xl);
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-full);
    transition: transform var(--transition-fast);
  }

  .theme-toggle:hover {
    transform: scale(1.1);
  }

  .content {
    flex: 1;
    width: 100%;
  }

  footer {
    background: var(--color-surface);
    padding: var(--spacing-lg);
    text-align: center;
    color: var(--color-text-secondary);
  }

  @media (max-width: 640px) {
    nav {
      padding: var(--spacing-md);
    }
  }
</style> 