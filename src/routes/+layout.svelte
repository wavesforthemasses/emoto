<!-- Root Layout -->
<script lang="ts">
    import '../app.css';
</script>

<div class="app">
    <nav class="main-nav">
        <div class="container nav-content">
            <a href="/" class="logo">
                Mood Tracker
            </a>
            <div class="nav-links">
                <a href="/in/u/demo" class="nav-link">Dashboard</a>
                <a href="/in/c/demo" class="nav-link">Company</a>
                <a href="/in/a" class="nav-link">Admin</a>
            </div>
        </div>
    </nav>

    <main class="main-content">
        <slot />
    </main>

    <footer class="main-footer">
        <div class="container">
            <p>&copy; {new Date().getFullYear()} Mood Tracker. All rights reserved.</p>
        </div>
    </footer>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .main-nav {
        background-color: var(--color-background);
        box-shadow: var(--shadow);
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .nav-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 4rem;
    }

    .logo {
        font-size: var(--font-size-xl);
        font-weight: bold;
        color: var(--color-primary);
        text-decoration: none;
        transition: color var(--transition);
    }

    .logo:hover {
        color: var(--color-primary-dark);
    }

    .nav-links {
        display: flex;
        gap: var(--spacing-4);
    }

    .nav-link {
        color: var(--color-text);
        text-decoration: none;
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
        transition: background-color var(--transition);
    }

    .nav-link:hover {
        background-color: var(--color-surface);
    }

    .main-content {
        flex: 1;
        background-color: var(--color-background);
    }

    .main-footer {
        background-color: var(--color-surface);
        padding: var(--spacing-4) 0;
        text-align: center;
        color: var(--color-text-light);
    }

    @media (max-width: 640px) {
        .nav-content {
            flex-direction: column;
            height: auto;
            padding: var(--spacing-4) 0;
            gap: var(--spacing-4);
        }

        .nav-links {
            width: 100%;
            justify-content: center;
        }
    }
</style> 