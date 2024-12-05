<!-- Admin Dashboard -->
<script lang="ts">
    import { onMount } from 'svelte';
    import DashboardCard from '$lib/components/molecules/DashboardCard.svelte';
    import FormInput from '$lib/components/molecules/FormInput.svelte';
    import Button from '$lib/components/atoms/Button.svelte';
    import { companyStore } from '$lib/stores/companyStore';

    let loading = true;
    let newCompanyName = '';

    onMount(() => {
        // Simulated loading delay
        setTimeout(() => {
            loading = false;
        }, 500);
    });

    function handleAddCompany() {
        if (!newCompanyName.trim()) return;
        companyStore.addCompany(newCompanyName.trim());
        newCompanyName = '';
    }

    function handleDeleteCompany(id: string) {
        if (confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
            companyStore.deleteCompany(id);
        }
    }
</script>

<svelte:head>
    <title>Admin Dashboard - Mood Tracker</title>
    <meta name="description" content="Manage companies and their settings" />
</svelte:head>

<main class="dashboard">
    <div class="hero">
        <h1>Admin Dashboard</h1>
        <p>Manage companies and their settings</p>
    </div>

    {#if loading}
        <div class="loading">
            <span class="loading-text">Loading...</span>
        </div>
    {:else}
        <section class="companies-section">
            <DashboardCard title="Companies">
                <form class="add-company-form" on:submit|preventDefault={handleAddCompany}>
                    <FormInput
                        label="Company Name"
                        bind:value={newCompanyName}
                        placeholder="Enter company name"
                        required
                    />
                    <Button type="submit">Add Company</Button>
                </form>

                <div class="companies-list">
                    {#if $companyStore.companies.length === 0}
                        <div class="empty-state">
                            <p>No companies added yet</p>
                        </div>
                    {:else}
                        {#each $companyStore.companies as company}
                            <div class="company-card">
                                <div class="company-info">
                                    <h3>{company.name}</h3>
                                    <div class="stats">
                                        <span class="stat">
                                            {company.departments.length} departments
                                        </span>
                                        <span class="stat">
                                            {$companyStore.users.filter(u => u.companyId === company.id).length} users
                                        </span>
                                    </div>
                                </div>
                                <div class="company-actions">
                                    <Button
                                        variant="secondary"
                                        on:click={() => window.location.href = `/in/c/${company.id}`}
                                    >
                                        View Dashboard
                                    </Button>
                                    <Button
                                        variant="text"
                                        on:click={() => handleDeleteCompany(company.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </DashboardCard>
        </section>
    {/if}
</main>

<style>
    .dashboard {
        max-width: 800px;
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

    .add-company-form {
        display: flex;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
    }

    .companies-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .empty-state {
        text-align: center;
        padding: var(--spacing-xl);
        color: var(--color-text-secondary);
    }

    .company-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-lg);
        background: var(--color-background);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-sm);
    }

    .company-info h3 {
        font-size: var(--font-size-lg);
        color: var(--color-text);
        margin-bottom: var(--spacing-xs);
    }

    .stats {
        display: flex;
        gap: var(--spacing-md);
    }

    .stat {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
    }

    .company-actions {
        display: flex;
        gap: var(--spacing-sm);
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

        .add-company-form {
            flex-direction: column;
        }

        .company-card {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
        }

        .stats {
            justify-content: center;
        }

        .company-actions {
            width: 100%;
            justify-content: center;
        }
    }
</style> 