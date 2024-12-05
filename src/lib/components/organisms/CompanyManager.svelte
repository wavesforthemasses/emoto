<!-- Company management component -->
<script lang="ts">
    import { companyStore } from '$lib/stores/companyStore';
    import DashboardCard from '../molecules/DashboardCard.svelte';
    import FormInput from '../molecules/FormInput.svelte';
    import FormSelect from '../molecules/FormSelect.svelte';
    import Button from '../atoms/Button.svelte';
    import TabNavigation from '../molecules/TabNavigation.svelte';

    export let companyId: string;

    let activeTab: 'users' | 'departments' | 'tasks' = 'users';
    const tabs = [
        { id: 'users', label: 'Users' },
        { id: 'departments', label: 'Departments' },
        { id: 'tasks', label: 'Tasks' }
    ];

    // Form states
    let userName = '';
    let userEmail = '';
    let userDepartment = '';
    let userRole: 'user' | 'admin' = 'user';
    let departmentName = '';
    let taskTitle = '';
    let taskDescription = '';
    let taskDepartments: string[] = [];

    // Get company data
    $: company = $companyStore.companies.find(c => c.id === companyId);
    $: companyUsers = $companyStore.users.filter(u => u.companyId === companyId);
    $: companyTasks = $companyStore.tasks.filter(t => t.companyId === companyId);

    // Handle form submissions
    function handleAddUser() {
        if (!company || !userName || !userEmail) return;

        companyStore.addUser({
            name: userName,
            email: userEmail,
            role: userRole,
            departmentId: userDepartment || undefined,
            companyId: company.id
        });

        // Reset form
        userName = '';
        userEmail = '';
        userDepartment = '';
        userRole = 'user';
    }

    function handleAddDepartment() {
        if (!company || !departmentName) return;

        companyStore.addDepartment(company.id, departmentName);

        // Reset form
        departmentName = '';
    }

    function handleAddTask() {
        if (!company || !taskTitle) return;

        companyStore.addTask({
            title: taskTitle,
            description: taskDescription || undefined,
            departmentIds: taskDepartments,
            companyId: company.id
        });

        // Reset form
        taskTitle = '';
        taskDescription = '';
        taskDepartments = [];
    }

    function handleDeleteUser(userId: string) {
        if (confirm('Are you sure you want to delete this user?')) {
            companyStore.deleteUser(userId);
        }
    }

    function handleDeleteDepartment(departmentId: string) {
        if (confirm('Are you sure you want to delete this department?')) {
            companyStore.deleteDepartment(company!.id, departmentId);
        }
    }

    function handleDeleteTask(taskId: string) {
        if (confirm('Are you sure you want to delete this task?')) {
            companyStore.deleteTask(taskId);
        }
    }
</script>

<div class="company-manager">
    <TabNavigation {tabs} bind:activeTab />

    <div class="tab-content">
        {#if activeTab === 'users'}
            <DashboardCard title="Users">
                <form class="management-form" on:submit|preventDefault={handleAddUser}>
                    <FormInput
                        label="Name"
                        bind:value={userName}
                        required
                    />
                    <FormInput
                        label="Email"
                        type="email"
                        bind:value={userEmail}
                        required
                    />
                    <FormSelect
                        label="Department"
                        bind:value={userDepartment}
                        options={company?.departments.map(d => ({
                            value: d.id,
                            label: d.name
                        })) || []}
                    />
                    <FormSelect
                        label="Role"
                        bind:value={userRole}
                        options={[
                            { value: 'user', label: 'User' },
                            { value: 'admin', label: 'Admin' }
                        ]}
                    />
                    <Button type="submit">Add User</Button>
                </form>

                <div class="list">
                    {#if companyUsers.length === 0}
                        <p class="empty-state">No users added yet</p>
                    {:else}
                        {#each companyUsers as user}
                            <div class="list-item">
                                <div class="item-info">
                                    <h4>{user.name}</h4>
                                    <p class="item-meta">{user.email}</p>
                                    {#if user.departmentId}
                                        <span class="tag">
                                            {company?.departments.find(d => d.id === user.departmentId)?.name}
                                        </span>
                                    {/if}
                                    <span class="tag">{user.role}</span>
                                </div>
                                <Button
                                    variant="text"
                                    on:click={() => handleDeleteUser(user.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        {/each}
                    {/if}
                </div>
            </DashboardCard>

        {:else if activeTab === 'departments'}
            <DashboardCard title="Departments">
                <form class="management-form" on:submit|preventDefault={handleAddDepartment}>
                    <FormInput
                        label="Department Name"
                        bind:value={departmentName}
                        required
                    />
                    <Button type="submit">Add Department</Button>
                </form>

                <div class="list">
                    {#if !company?.departments.length}
                        <p class="empty-state">No departments added yet</p>
                    {:else}
                        {#each company.departments as department}
                            <div class="list-item">
                                <div class="item-info">
                                    <h4>{department.name}</h4>
                                    <p class="item-meta">
                                        {companyUsers.filter(u => u.departmentId === department.id).length} users
                                    </p>
                                </div>
                                <Button
                                    variant="text"
                                    on:click={() => handleDeleteDepartment(department.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        {/each}
                    {/if}
                </div>
            </DashboardCard>

        {:else if activeTab === 'tasks'}
            <DashboardCard title="Tasks">
                <form class="management-form" on:submit|preventDefault={handleAddTask}>
                    <FormInput
                        label="Task Title"
                        bind:value={taskTitle}
                        required
                    />
                    <FormInput
                        label="Description"
                        bind:value={taskDescription}
                    />
                    <FormSelect
                        label="Departments"
                        bind:value={taskDepartments}
                        options={company?.departments.map(d => ({
                            value: d.id,
                            label: d.name
                        })) || []}
                        multiple
                    />
                    <Button type="submit">Add Task</Button>
                </form>

                <div class="list">
                    {#if companyTasks.length === 0}
                        <p class="empty-state">No tasks added yet</p>
                    {:else}
                        {#each companyTasks as task}
                            <div class="list-item">
                                <div class="item-info">
                                    <h4>{task.title}</h4>
                                    {#if task.description}
                                        <p class="item-meta">{task.description}</p>
                                    {/if}
                                    <div class="tags">
                                        {#each task.departmentIds as deptId}
                                            <span class="tag">
                                                {company?.departments.find(d => d.id === deptId)?.name}
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                                <Button
                                    variant="text"
                                    on:click={() => handleDeleteTask(task.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        {/each}
                    {/if}
                </div>
            </DashboardCard>
        {/if}
    </div>
</div>

<style>
    .company-manager {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .management-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
    }

    .list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .empty-state {
        text-align: center;
        padding: var(--spacing-xl);
        color: var(--color-text-secondary);
    }

    .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-lg);
        background: var(--color-background);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-sm);
    }

    .item-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .item-info h4 {
        font-size: var(--font-size-lg);
        color: var(--color-text);
        margin: 0;
    }

    .item-meta {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        margin: 0;
    }

    .tags {
        display: flex;
        gap: var(--spacing-xs);
        flex-wrap: wrap;
    }

    .tag {
        font-size: var(--font-size-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        background: var(--color-surface);
        border-radius: var(--border-radius-full);
        color: var(--color-text-secondary);
    }

    @media (max-width: 640px) {
        .list-item {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
        }

        .item-info {
            align-items: center;
        }
    }
</style> 