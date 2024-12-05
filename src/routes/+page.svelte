<!-- Landing Page -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { pwaStore } from '$lib/utils/usePWA';
    import { registerServiceWorker } from '$lib/utils/pwa';

    let installPromptShown = false;

    onMount(async () => {
        await registerServiceWorker();
        await pwaStore.init();
        $: installPromptShown = $pwaStore.canInstall;
    });

    function handleInstall() {
        pwaStore.promptInstall();
    }
</script>

<svelte:head>
    <title>Mood Tracker - Track Your Workplace Well-being</title>
    <meta name="description" content="A simple and effective way to track and improve workplace well-being through daily mood tracking." />
</svelte:head>

<main class="landing">
    <section class="hero">
        <div class="container">
            <h1>Track Your Workplace Well-being</h1>
            <p class="hero-subtitle">
                A simple and effective way to monitor and improve workplace satisfaction
                through daily mood tracking.
            </p>
            <div class="cta-buttons">
                <a href="/in/u/demo" class="btn-primary">Get Started</a>
                {#if installPromptShown}
                    <button class="btn-secondary" on:click={handleInstall}>
                        Install App
                    </button>
                {/if}
            </div>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2>Key Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <span class="feature-icon">📊</span>
                    <h3>Track Daily Moods</h3>
                    <p>Record your daily mood with simple emoji selections and optional notes.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">📈</span>
                    <h3>View Trends</h3>
                    <p>Analyze mood patterns over time with intuitive visualizations.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">🏢</span>
                    <h3>Company Insights</h3>
                    <p>Get department-level insights to improve workplace satisfaction.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">📱</span>
                    <h3>Works Offline</h3>
                    <p>Full functionality even without internet connection.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="how-it-works">
        <div class="container">
            <h2>How It Works</h2>
            <div class="steps-grid">
                <div class="step-card">
                    <div class="step-number">1</div>
                    <h3>Record Your Mood</h3>
                    <p>Select an emoji that best represents your current mood.</p>
                </div>

                <div class="step-card">
                    <div class="step-number">2</div>
                    <h3>Add Context</h3>
                    <p>Optionally add notes about your tasks and experiences.</p>
                </div>

                <div class="step-card">
                    <div class="step-number">3</div>
                    <h3>Track Progress</h3>
                    <p>View your mood history and identify patterns.</p>
                </div>

                <div class="step-card">
                    <div class="step-number">4</div>
                    <h3>Gain Insights</h3>
                    <p>Use data to improve workplace well-being.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="cta">
        <div class="container">
            <h2>Start Tracking Today</h2>
            <p>Join companies that prioritize employee well-being.</p>
            <a href="/in/u/demo" class="btn-primary">Get Started</a>
        </div>
    </section>
</main>

<style>
    .landing {
        background-color: var(--color-background);
    }

    .hero {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
        color: white;
        padding: var(--spacing-8) 0;
        text-align: center;
    }

    .hero h1 {
        font-size: clamp(2rem, 5vw, 3.5rem);
        margin-bottom: var(--spacing-4);
    }

    .hero-subtitle {
        font-size: clamp(1rem, 2.5vw, 1.25rem);
        max-width: 600px;
        margin: 0 auto var(--spacing-6);
        opacity: 0.9;
    }

    .cta-buttons {
        display: flex;
        gap: var(--spacing-4);
        justify-content: center;
        flex-wrap: wrap;
    }

    .features,
    .how-it-works {
        padding: var(--spacing-8) 0;
    }

    h2 {
        text-align: center;
        font-size: var(--font-size-2xl);
        margin-bottom: var(--spacing-8);
        color: var(--color-text);
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-6);
    }

    .feature-card {
        text-align: center;
        padding: var(--spacing-6);
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow);
        transition: transform var(--transition);
    }

    .feature-card:hover {
        transform: translateY(-5px);
    }

    .feature-icon {
        font-size: 2.5rem;
        margin-bottom: var(--spacing-4);
        display: inline-block;
    }

    .feature-card h3 {
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-2);
        color: var(--color-text);
    }

    .feature-card p {
        color: var(--color-text-light);
    }

    .steps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-6);
    }

    .step-card {
        text-align: center;
        padding: var(--spacing-6);
        position: relative;
    }

    .step-number {
        width: 40px;
        height: 40px;
        background-color: var(--color-primary);
        color: white;
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin: 0 auto var(--spacing-4);
    }

    .step-card h3 {
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-2);
        color: var(--color-text);
    }

    .step-card p {
        color: var(--color-text-light);
    }

    .cta {
        background-color: var(--color-surface);
        padding: var(--spacing-8) 0;
        text-align: center;
    }

    .cta h2 {
        margin-bottom: var(--spacing-4);
    }

    .cta p {
        color: var(--color-text-light);
        margin-bottom: var(--spacing-6);
    }

    .btn-primary {
        background-color: var(--color-primary);
        color: white;
        text-decoration: none;
        padding: var(--spacing-3) var(--spacing-6);
        border-radius: var(--border-radius);
        font-weight: bold;
        transition: background-color var(--transition);
        display: inline-block;
    }

    .btn-primary:hover {
        background-color: var(--color-primary-dark);
    }

    .btn-secondary {
        background-color: transparent;
        color: white;
        border: 2px solid white;
        padding: var(--spacing-3) var(--spacing-6);
        border-radius: var(--border-radius);
        font-weight: bold;
        transition: all var(--transition);
        cursor: pointer;
    }

    .btn-secondary:hover {
        background-color: white;
        color: var(--color-primary);
    }

    @media (max-width: 768px) {
        .hero {
            padding: var(--spacing-6) 0;
        }

        .features-grid,
        .steps-grid {
            gap: var(--spacing-4);
        }

        .feature-card,
        .step-card {
            padding: var(--spacing-4);
        }
    }
</style>
