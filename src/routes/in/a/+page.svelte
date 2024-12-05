<!-- Admin Dashboard -->
<script lang="ts">
    import { onMount } from 'svelte';
    import type { Company } from '$lib/utils/types';
    import { getStorageItem, setStorageItem } from '$lib/utils/storage';

    let companies: Company[] = [];
    let loading = true;
    let newCompanyName = '';
    let error = '';

    const COMPANIES_STORAGE_KEY = 'mood-tracker-companies';

    onMount(() => {
        loadCompanies();
    });

    function loadCompanies() {
        const storedCompanies = getStorageItem<Company[]>(COMPANIES_STORAGE_KEY);
        companies = storedCompanies || [];
        loading = false;
    }

    function saveCompanies() {
        setStorageItem(COMPANIES_STORAGE_KEY, companies);
    }

    function addCompany() {
        if (!newCompanyName.trim()) {
            error = 'Company name is required';
            return;
        }

        const company: Company = {
            id: crypto.randomUUID(),
            name: newCompanyName.trim(),
            departments: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        companies = [...companies, company];
        saveCompanies();
        newCompanyName = '';
        error = '';
    }

    function deleteCompany(companyId: string) {
        if (confirm('Are you sure you want to delete this company?')) {
            companies = companies.filter(c => c.id !== companyId);
            saveCompanies();
        }
    }
</script>

<svelte:head>
    <title>Admin Dashboard - Mood Tracker</title>
    <meta name="description" content="Manage companies" />
</svelte:head>

<main class="admin-dashboard">
    <header class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p class="subtitle">Manage companies</p>
    </header>

    {#if loading}
        <div class="loading">Loading admin data...</div>
    {:else}
        <div class="dashboard-content">
            <section class="management-card">
                <h2>Companies</h2>
                <div class="form-group">
                    <label for="newCompany">Add Company</label>
                    <div class="input-group">
                        <input
                            type="text"
                            id="newCompany"
                            bind:value={newCompanyName}
                            placeholder="Enter company name"
                        />
                        <button on:click={addCompany} class="btn-primary">Add Company</button>
                    </div>
                </div>

                <div class="companies-list">
                    {#if companies.length === 0}
                        <p class="empty-state">No companies added yet</p>
                    {:else}
                        {#each companies as company}
                            <div class="company-item">
                                <div class="company-info">
                                    <h3>{company.name}</h3>
                                    <span class="meta">
                                        Created: {new Date(company.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div class="company-actions">
                                    <a 
                                        href="/in/c/{company.id}" 
                                        class="btn-secondary"
                                    >
                                        View Dashboard
                                    </a>
                                    <button
                                        class="btn-danger"
                                        on:click={() => deleteCompany(company.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </section>
        </div>

        {#if error}
            <div class="error-message" role="alert">
                {error}
            </div>
        {/if}
    {/if}
</main>

<style>
    .admin-dashboard {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--spacing-6);
    }

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
    }

    .management-card {
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

    .form-group {
        margin-bottom: var(--spacing-4);
    }

    label {
        display: block;
        margin-bottom: var(--spacing-2);
        color: var(--color-text);
    }

    .input-group {
        display: flex;
        gap: var(--spacing-2);
    }

    input {
        flex: 1;
        padding: var(--spacing-2) var(--spacing-3);
        border: 1px solid var(--color-text-light);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
    }

    input:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .companies-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
        margin-top: var(--spacing-4);
    }

    .company-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-4);
        background-color: var(--color-background);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
    }

    .company-info h3 {
        margin: 0;
        font-size: var(--font-size-lg);
    }

    .meta {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
    }

    .company-actions {
        display: flex;
        gap: var(--spacing-2);
    }

    .btn-primary {
        background-color: var(--color-primary);
        color: white;
        border: none;
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: background-color var(--transition);
    }

    .btn-primary:hover {
        background-color: var(--color-primary-dark);
    }

    .btn-secondary {
        background-color: var(--color-surface);
        color: var(--color-primary);
        border: 1px solid var(--color-primary);
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
        cursor: pointer;
        text-decoration: none;
        transition: all var(--transition);
    }

    .btn-secondary:hover {
        background-color: var(--color-primary-light);
        color: white;
    }

    .btn-danger {
        background-color: var(--color-danger);
        color: white;
        border: none;
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: background-color var(--transition);
    }

    .btn-danger:hover {
        opacity: 0.9;
    }

    .empty-state {
        text-align: center;
        color: var(--color-text-light);
        padding: var(--spacing-4);
    }

    .error-message {
        background-color: var(--color-danger);
        color: white;
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        margin-top: var(--spacing-4);
        text-align: center;
    }

    .loading {
        text-align: center;
        color: var(--color-text-light);
        padding: var(--spacing-8);
    }

    @media (max-width: 768px) {
        .admin-dashboard {
            padding: var(--spacing-4);
        }

        .company-item {
            flex-direction: column;
            gap: var(--spacing-4);
            text-align: center;
        }

        .company-actions {
            width: 100%;
            justify-content: center;
        }

        .input-group {
            flex-direction: column;
        }
    }
</style> 