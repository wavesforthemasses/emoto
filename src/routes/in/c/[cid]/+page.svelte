<!-- Company Dashboard -->
<script lang="ts">
    import { page } from '$app/stores';
    import { companyStore } from '$lib/stores/companyStore';
    import type { Company, User, Task } from '$lib/stores/companyStore';
    import CompanyManager from '$lib/components/organisms/CompanyManager.svelte';
    import CompanyStats from '$lib/components/organisms/CompanyStats.svelte';
    import DashboardCard from '$lib/components/molecules/DashboardCard.svelte';
    import { onMount } from 'svelte';

    const companyId: string = $page.params.cid;
    let loading = true;
    let company: Company | undefined;
    let companyUsers: User[] = [];
    let companyTasks: Task[] = [];

    onMount(() => {
        // Simulated loading delay
        setTimeout(() => {
            loading = false;
        }, 500);
    });

    // Subscribe to store changes
    $: {
        const storeData = $companyStore;
        company = storeData.companies.find((c) => c.id === companyId);
        companyUsers = storeData.users.filter((u) => u.companyId === companyId);
        companyTasks = storeData.tasks.filter((t) => t.companyId === companyId);
    }
</script>

<svelte:head>
    <title>{company?.name || 'Company'} Dashboard - Mood Tracker</title>
    <meta name="description" content="Manage company settings and view analytics" />
</svelte:head>

<main class="dashboard">
    <div class="hero">
        <h1>{company?.name || 'Company'} Dashboard</h1>
        <p>Manage your organization and monitor team well-being</p>
    </div>

    {#if loading}
        <div class="loading">
            <span class="loading-text">Loading...</span>
        </div>
    {:else if !company}
        <div class="error-state">
            <h2>Company Not Found</h2>
            <p>The requested company could not be found.</p>
        </div>
    {:else}
        <section class="overview-section">
            <div class="stats-grid">
                <DashboardCard title="Users" icon="ri-user-line">
                    <div class="stat">
                        <span class="stat-value">{companyUsers.length}</span>
                        <span class="stat-label">Total Users</span>
                    </div>
                </DashboardCard>

                <DashboardCard title="Departments" icon="ri-building-line">
                    <div class="stat">
                        <span class="stat-value">{company.departments.length}</span>
                        <span class="stat-label">Total Departments</span>
                    </div>
                </DashboardCard>

                <DashboardCard title="Tasks" icon="ri-task-line">
                    <div class="stat">
                        <span class="stat-value">{companyTasks.length}</span>
                        <span class="stat-label">Active Tasks</span>
                    </div>
                </DashboardCard>
            </div>
        </section>

        <section class="management-section">
            <CompanyManager {companyId} />
        </section>

        <section class="stats-section">
            <CompanyStats {companyId} />
        </section>
    {/if}
</main>

<style>
    .dashboard {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--spacing-xl) var(--spacing-md);
    }

    .hero {
        text-align: center;
        margin-bottom: var(--spacing-2xl);
        background: var(--gradient-background);
        padding: var(--spacing-xl);
        border-radius: var(--border-radius-lg);
        color: var(--color-surface);
    }

    h1 {
        font-size: var(--font-size-3xl);
        margin-bottom: var(--spacing-md);
    }

    .hero p {
        font-size: var(--font-size-lg);
        opacity: 0.9;
    }

    .loading {
        text-align: center;
        padding: var(--spacing-xl);
    }

    .loading-text {
        color: var(--color-text-secondary);
        font-size: var(--font-size-lg);
    }

    .error-state {
        text-align: center;
        padding: var(--spacing-xl);
        background: var(--color-surface);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
    }

    .error-state h2 {
        font-size: var(--font-size-2xl);
        color: var(--color-text);
        margin-bottom: var(--spacing-md);
    }

    .error-state p {
        color: var(--color-text-secondary);
    }

    .overview-section {
        margin-bottom: var(--spacing-2xl);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-lg);
    }

    .stat {
        text-align: center;
    }

    .stat-value {
        font-size: var(--font-size-3xl);
        font-weight: 600;
        color: var(--color-primary);
        display: block;
    }

    .stat-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }

    .management-section {
        background: var(--color-surface);
        padding: var(--spacing-xl);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
    }

    .stats-section {
        background: var(--color-surface);
        padding: var(--spacing-xl);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
    }

    @media (max-width: 640px) {
        .dashboard {
            padding: var(--spacing-md);
        }

        .hero {
            margin: var(--spacing-md);
            padding: var(--spacing-lg);
        }

        h1 {
            font-size: var(--font-size-2xl);
        }

        .hero p {
            font-size: var(--font-size-base);
        }

        .stats-grid {
            grid-template-columns: 1fr;
        }

        .management-section {
            padding: var(--spacing-md);
        }

        .stats-section {
            padding: var(--spacing-md);
        }
    }
</style>