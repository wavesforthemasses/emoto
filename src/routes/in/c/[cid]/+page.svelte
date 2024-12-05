<!-- Company Dashboard -->
<script lang="ts">
    import { page } from '$app/stores';
    import { moodStore } from '$lib/stores/moodStore';
    import type { MoodEntry, MoodStats, Company, Department, User, Task } from '$lib/utils/types';
    import { getStorageItem, setStorageItem } from '$lib/utils/storage';
    import { onMount } from 'svelte';
    import DashboardHeader from '$lib/components/atoms/DashboardHeader.svelte';
    import LoadingSpinner from '$lib/components/atoms/LoadingSpinner.svelte';
    import EmptyState from '$lib/components/atoms/EmptyState.svelte';
    import DashboardCard from '$lib/components/molecules/DashboardCard.svelte';
    import MoodList from '$lib/components/molecules/MoodList.svelte';
    import FormInput from '$lib/components/molecules/FormInput.svelte';
    import FormSelect from '$lib/components/molecules/FormSelect.svelte';
    import ListItem from '$lib/components/molecules/ListItem.svelte';
    import TabNavigation from '$lib/components/molecules/TabNavigation.svelte';

    // Add these new variables
    let selectedTask: Task | null = null;
    let editingTask: Task | null = null;
    let selectedDepartments: string[] = [];
    let taskTitle = '';
    let taskDescription = '';
    let editingUser: User | null = null;
    let editingDepartment: Department | null = null;
    let editingCompany = false;
    let companyName = '';

    function initializeTaskForm(task: Task | null = null) {
        if (task) {
            editingTask = task;
            taskTitle = task.title;
            taskDescription = task.description || '';
            selectedDepartments = [...task.departmentIds];
        } else {
            editingTask = null;
            taskTitle = '';
            taskDescription = '';
            selectedDepartments = [];
        }
    }

    function initializeUserForm(user: User | null = null) {
        if (user) {
            editingUser = user;
            newUserName = user.name;
            newUserEmail = user.email;
            newUserDepartment = user.departmentId || '';
            newUserRole = user.role;
        } else {
            editingUser = null;
            newUserName = '';
            newUserEmail = '';
            newUserDepartment = '';
            newUserRole = 'employee';
        }
    }

    function initializeDepartmentForm(department: Department | null = null) {
        if (department) {
            editingDepartment = department;
            newDepartmentName = department.name;
        } else {
            editingDepartment = null;
            newDepartmentName = '';
        }
    }

    function initializeCompanyForm() {
        if (company) {
            companyName = company.name;
            editingCompany = true;
        } else {
            companyName = '';
            editingCompany = false;
        }
    }

    function handleTaskSubmit() {
        if (!taskTitle.trim()) {
            error = 'Task title is required';
            return;
        }

        const taskDb = getStorageItem<Task[]>(TASKS_STORAGE_KEY) || [];
        
        if (editingTask) {
            // Update existing task
            const updatedTask = {
                ...editingTask,
                title: taskTitle.trim(),
                description: taskDescription.trim(),
                departmentIds: selectedDepartments,
                updatedAt: Date.now()
            };
            
            const taskIndex = taskDb.findIndex(t => t.id === editingTask.id);
            if (taskIndex !== -1) {
                taskDb[taskIndex] = updatedTask;
            }
        } else {
            // Create new task
            const newTask: Task = {
                id: crypto.randomUUID(),
                title: taskTitle.trim(),
                description: taskDescription.trim(),
                departmentIds: selectedDepartments,
                companyId,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            taskDb.push(newTask);
        }

        setStorageItem(TASKS_STORAGE_KEY, taskDb);
        tasks = taskDb.filter(t => t.companyId === companyId);
        initializeTaskForm(); // Reset form
        error = '';
    }

    function handleTaskClick(task: Task) {
        if (selectedTask?.id === task.id) {
            selectedTask = null;
            initializeTaskForm();
        } else {
            selectedTask = task;
            initializeTaskForm(task);
        }
    }

    function deleteTask(taskId: string) {
        const tdb = getStorageItem<Task[]>(TASKS_STORAGE_KEY) || [];
        const updatedTasks = tdb.filter(t => t.id !== taskId);
        setStorageItem(TASKS_STORAGE_KEY, updatedTasks);
        tasks = updatedTasks.filter(t => t.companyId === companyId);
        
        // Clear selection if deleted task was selected
        if (selectedTask?.id === taskId) {
            selectedTask = null;
        }
    }

    function deleteUser(userId: string) {
        const udb = getStorageItem<User[]>(USERS_STORAGE_KEY) || [];
        const updatedUsers = udb.filter(u => u.id !== userId);
        setStorageItem(USERS_STORAGE_KEY, updatedUsers);
        users = updatedUsers.filter(u => u.companyId === companyId);
    }

    const companyId = $page.params.cid;
    let company: Company | null = null;
    let companyMoods: MoodEntry[] = [];
    let moodStats: MoodStats;
    let loading = true;
    let activeTab: 'overview' | 'departments' | 'users' | 'tasks' = 'overview';

    // Form states
    let newDepartmentName = '';
    let newUserName = '';
    let newUserEmail = '';
    let newUserDepartment = '';
    let newUserRole: 'employee' | 'manager' = 'employee';
    let newTaskTitle = '';
    let newTaskDescription = '';
    let newTaskDepartment = '';
    let error = '';

    const COMPANIES_STORAGE_KEY = 'mood-tracker-companies';
    const USERS_STORAGE_KEY = 'mood-tracker-users';
    const TASKS_STORAGE_KEY = 'mood-tracker-tasks';

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'departments', label: 'Departments' },
        { id: 'users', label: 'Users' },
        { id: 'tasks', label: 'Tasks' }
    ];

    onMount(async () => {
        await loadCompanyData();
        loadMoodData();
        loading = false;
    });

    async function loadCompanyData() {
        const companies = getStorageItem<Company[]>(COMPANIES_STORAGE_KEY) || [];
        company = companies.find(c => c.id === companyId) || null;
    }

    function loadMoodData() {
        // Filter moods for this company only
        companyMoods = $moodStore.entries.filter(entry => {
            const user = getStorageItem<User[]>(USERS_STORAGE_KEY)?.find(u => u.id === entry.userId);
            return user?.companyId === companyId;
        });
        calculateStats();
    }

    function calculateStats() {
        const totalEntries = companyMoods.length;
        const totalScore = companyMoods.reduce((acc, curr) => acc + curr.score, 0);
        const averageScore = totalEntries > 0 ? totalScore / totalEntries : 0;

        // Group by department
        const byDepartment: { [key: string]: { scores: number[]; entries: number } } = {};
        companyMoods.forEach(mood => {
            if (mood.departmentId) {
                if (!byDepartment[mood.departmentId]) {
                    byDepartment[mood.departmentId] = { scores: [], entries: 0 };
                }
                byDepartment[mood.departmentId].scores.push(mood.score);
                byDepartment[mood.departmentId].entries++;
            }
        });

        // Calculate department averages
        const departmentStats: MoodStats['byDepartment'] = {};
        Object.entries(byDepartment).forEach(([deptId, data]) => {
            departmentStats[deptId] = {
                averageScore: data.scores.reduce((a, b) => a + b, 0) / data.entries,
                totalEntries: data.entries
            };
        });

        moodStats = {
            averageScore,
            totalEntries,
            lastEntry: companyMoods[companyMoods.length - 1],
            byDepartment: departmentStats
        };
    }

    // Department Management
    function addDepartment() {
        if (!newDepartmentName.trim()) {
            error = 'Department name is required';
            return;
        }

        const companies = getStorageItem<Company[]>(COMPANIES_STORAGE_KEY) || [];
        const currentCompany = companies.find(c => c.id === companyId);
        
        if (!currentCompany) return;

        if (editingDepartment) {
            // Update existing department
            currentCompany.departments = currentCompany.departments.map(d => 
                d.id === editingDepartment.id 
                    ? { ...d, name: newDepartmentName.trim(), updatedAt: Date.now() }
                    : d
            );
        } else {
            // Create new department
            const department: Department = {
                id: crypto.randomUUID(),
                name: newDepartmentName.trim(),
                companyId,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            currentCompany.departments.push(department);
        }

        const updatedCompanies = companies.map(c => 
            c.id === companyId ? currentCompany : c
        );

        setStorageItem(COMPANIES_STORAGE_KEY, updatedCompanies);
        company = currentCompany;
        initializeDepartmentForm(); // Reset form
        error = '';
    }

    // User Management
    function addUser() {
        if (!newUserName.trim() || !newUserEmail.trim()) {
            error = 'Name and email are required';
            return;
        }

        const udb = getStorageItem<User[]>(USERS_STORAGE_KEY) || [];
        
        if (editingUser) {
            // Update existing user
            const updatedUser = {
                ...editingUser,
                name: newUserName.trim(),
                email: newUserEmail.trim(),
                departmentId: newUserDepartment || undefined,
                role: newUserRole,
                updatedAt: Date.now()
            };
            
            const userIndex = udb.findIndex(u => u.id === editingUser.id);
            if (userIndex !== -1) {
                udb[userIndex] = updatedUser;
            }
        } else {
            // Create new user
            const user: User = {
                id: crypto.randomUUID(),
                name: newUserName.trim(),
                email: newUserEmail.trim(),
                companyId,
                departmentId: newUserDepartment || undefined,
                role: newUserRole,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            udb.push(user);
        }

        setStorageItem(USERS_STORAGE_KEY, udb);
        users = udb.filter(u => u.companyId === companyId);
        initializeUserForm(); // Reset form
        error = '';
    }

    // Task Management
    function addTask() {
        if (!newTaskTitle.trim()) {
            error = 'Task title is required';
            return;
        }

        const task: Task = {
            id: crypto.randomUUID(),
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim(),
            departmentIds: [newTaskDepartment],
            companyId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const tdb = getStorageItem<Task[]>(TASKS_STORAGE_KEY) || [];
        setStorageItem(TASKS_STORAGE_KEY, [...tdb, task]);
        tasks = [...tdb, task].filter(t => t.companyId === companyId);
        // Reset form
        newTaskTitle = '';
        newTaskDescription = '';
        newTaskDepartment = '';
        error = '';
    }

    // Get company users
    $: users = getStorageItem<User[]>(USERS_STORAGE_KEY)?.filter(u => u.companyId === companyId) || [];

    // Get company tasks
    $: tasks = getStorageItem<Task[]>(TASKS_STORAGE_KEY)?.filter(t => t.companyId === companyId) || [];

    function deleteDepartment(departmentId: string) {
        if (!confirm('Are you sure? This will affect all users and tasks in this department.')) return;

        const companies = getStorageItem<Company[]>(COMPANIES_STORAGE_KEY) || [];
        const currentCompany = companies.find(c => c.id === companyId);
        
        if (!currentCompany) return;

        // Remove department
        currentCompany.departments = currentCompany.departments.filter(d => d.id !== departmentId);

        // Update storage
        const updatedCompanies = companies.map(c => 
            c.id === companyId ? currentCompany : c
        );
        setStorageItem(COMPANIES_STORAGE_KEY, updatedCompanies);
        company = currentCompany;

        // Update affected users
        const udb = getStorageItem<User[]>(USERS_STORAGE_KEY) || [];
        const updatedUsers = udb.map(u => 
            u.departmentId === departmentId 
                ? { ...u, departmentId: undefined }
                : u
        );
        setStorageItem(USERS_STORAGE_KEY, updatedUsers);
        users = updatedUsers.filter(u => u.companyId === companyId);

        // Update affected tasks
        const tdb = getStorageItem<Task[]>(TASKS_STORAGE_KEY) || [];
        const updatedTasks = tdb.map(t => ({
            ...t,
            departmentIds: t.departmentIds.filter(id => id !== departmentId)
        }));
        setStorageItem(TASKS_STORAGE_KEY, updatedTasks);
        tasks = updatedTasks.filter(t => t.companyId === companyId);
    }

    function deleteCompany() {
        if (!confirm('Are you sure? This will delete all company data including departments, users, and tasks.')) return;

        // Delete company
        const companies = getStorageItem<Company[]>(COMPANIES_STORAGE_KEY) || [];
        const updatedCompanies = companies.filter(c => c.id !== companyId);
        setStorageItem(COMPANIES_STORAGE_KEY, updatedCompanies);

        // Delete users
        const udb = getStorageItem<User[]>(USERS_STORAGE_KEY) || [];
        const updatedUsers = udb.filter(u => u.companyId !== companyId);
        setStorageItem(USERS_STORAGE_KEY, updatedUsers);

        // Delete tasks
        const tdb = getStorageItem<Task[]>(TASKS_STORAGE_KEY) || [];
        const updatedTasks = tdb.filter(t => t.companyId !== companyId);
        setStorageItem(TASKS_STORAGE_KEY, updatedTasks);

        // Redirect to admin page
        window.location.href = '/in/a';
    }

    // Add this function to handle company updates
    function updateCompany() {
        if (!companyName.trim()) {
            error = 'Company name is required';
            return;
        }

        const companies = getStorageItem<Company[]>(COMPANIES_STORAGE_KEY) || [];
        const currentCompany = companies.find(c => c.id === companyId);
        
        if (!currentCompany) return;

        // Update company name
        currentCompany.name = companyName.trim();
        currentCompany.updatedAt = Date.now();

        const updatedCompanies = companies.map(c => 
            c.id === companyId ? currentCompany : c
        );

        setStorageItem(COMPANIES_STORAGE_KEY, updatedCompanies);
        company = currentCompany;
        editingCompany = false;
        error = '';
    }
</script>

<svelte:head>
    <title>Company Dashboard - Mood Tracker</title>
    <meta name="description" content="Monitor your company's mood and well-being" />
</svelte:head>

<main class="company-dashboard">
    <DashboardHeader 
        title={company?.name || 'Company'} 
        subtitle={moodStats?.averageScore ? `Company Average Mood: ${moodStats.averageScore.toFixed(1)}` : null} 
    />

    <div class="company-actions">
        {#if editingCompany}
            <form class="company-edit-form" on:submit|preventDefault={updateCompany}>
                <FormInput
                    id="companyName"
                    label="Company Name"
                    bind:value={companyName}
                    placeholder="Enter company name"
                    required
                />
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        Update Company
                    </button>
                    <button 
                        type="button" 
                        class="btn-secondary" 
                        on:click={() => editingCompany = false}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        {:else}
            <button 
                class="btn-secondary"
                on:click={() => initializeCompanyForm()}
            >
                Edit Company
            </button>
            <button class="btn-danger" on:click={deleteCompany}>
                Delete Company
            </button>
        {/if}
    </div>

    {#if loading}
        <LoadingSpinner message="Loading company data..." />
    {:else}
        <TabNavigation {tabs} bind:activeTab />

        <div class="tab-content">
            {#if activeTab === 'overview'}
                <div class="dashboard-grid">
                    <DashboardCard title="Overall Statistics">
                        <div class="stats-content">
                            <div class="stat-item">
                                <span class="stat-label">Total Entries</span>
                                <span class="stat-value">{moodStats?.totalEntries || 0}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Average Mood</span>
                                <span class="stat-value">
                                    {moodStats?.averageScore ? moodStats.averageScore.toFixed(1) : 'N/A'}
                                </span>
                            </div>
                            {#if moodStats?.lastEntry}
                                <div class="stat-item">
                                    <span class="stat-label">Latest Entry</span>
                                    <span class="stat-value">{moodStats.lastEntry.emoji}</span>
                                </div>
                            {/if}
                        </div>
                    </DashboardCard>

                    <DashboardCard title="Department Statistics">
                        <div class="stats-content">
                            {#if moodStats?.byDepartment && Object.keys(moodStats.byDepartment).length > 0}
                                {#each Object.entries(moodStats.byDepartment) as [deptId, stats]}
                                    <div class="department-stat">
                                        <h3>{company?.departments.find(d => d.id === deptId)?.name || 'Unknown Department'}</h3>
                                        <div class="stat-item">
                                            <span class="stat-label">Average</span>
                                            <span class="stat-value">{stats.averageScore.toFixed(1)}</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-label">Entries</span>
                                            <span class="stat-value">{stats.totalEntries}</span>
                                        </div>
                                    </div>
                                {/each}
                            {:else}
                                <p class="empty-state">No department data available</p>
                            {/if}
                        </div>
                    </DashboardCard>

                    <DashboardCard title="Recent Entries">
                        <MoodList 
                            moods={companyMoods.slice(-5)} 
                            showDepartment={true}
                            departmentName={(id) => company?.departments.find(d => d.id === id)?.name}
                        />
                    </DashboardCard>
                </div>

            {:else if activeTab === 'departments'}
                <section class="management-section">
                    <DashboardCard title={editingDepartment ? 'Edit Department' : 'Add Department'}>
                        <form on:submit|preventDefault={addDepartment}>
                            <FormInput
                                id="departmentName"
                                label="Department Name"
                                bind:value={newDepartmentName}
                                placeholder="Enter department name"
                                required
                            />
                            <div class="form-actions">
                                <button type="submit" class="btn-primary">
                                    {editingDepartment ? 'Update Department' : 'Add Department'}
                                </button>
                                {#if editingDepartment}
                                    <button 
                                        type="button" 
                                        class="btn-secondary" 
                                        on:click={() => initializeDepartmentForm()}
                                    >
                                        Cancel
                                    </button>
                                {/if}
                            </div>
                        </form>
                    </DashboardCard>

                    <DashboardCard title="Departments">
                        {#if company?.departments.length}
                            <div class="list">
                                {#each company.departments as department}
                                    <ListItem
                                        title={department.name}
                                        subtitle={`Created: ${new Date(department.createdAt).toLocaleDateString()}`}
                                    >
                                        <svelte:fragment slot="actions">
                                            <button 
                                                class="btn-secondary"
                                                on:click={() => initializeDepartmentForm(department)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                class="btn-danger"
                                                on:click={() => deleteDepartment(department.id)}
                                            >
                                                Delete
                                            </button>
                                        </svelte:fragment>
                                    </ListItem>
                                {/each}
                            </div>
                        {:else}
                            <EmptyState message="No departments added yet" />
                        {/if}
                    </DashboardCard>
                </section>

            {:else if activeTab === 'users'}
                <section class="management-section">
                    <DashboardCard title={editingUser ? 'Edit User' : 'Add User'}>
                        <form on:submit|preventDefault={addUser}>
                            <FormInput
                                id="userName"
                                label="Name"
                                bind:value={newUserName}
                                placeholder="Enter user name"
                                required
                            />
                            <FormInput
                                id="userEmail"
                                label="Email"
                                type="email"
                                bind:value={newUserEmail}
                                placeholder="Enter user email"
                                required
                            />
                            <FormSelect
                                id="userDepartment"
                                label="Department"
                                bind:value={newUserDepartment}
                                options={company?.departments.map(d => ({ value: d.id, label: d.name })) || []}
                                placeholder="Select Department"
                            />
                            <FormSelect
                                id="userRole"
                                label="Role"
                                bind:value={newUserRole}
                                options={[
                                    { value: 'employee', label: 'Employee' },
                                    { value: 'manager', label: 'Manager' }
                                ]}
                            />
                            <div class="form-actions">
                                <button type="submit" class="btn-primary">
                                    {editingUser ? 'Update User' : 'Add User'}
                                </button>
                                {#if editingUser}
                                    <button 
                                        type="button" 
                                        class="btn-secondary" 
                                        on:click={() => initializeUserForm()}
                                    >
                                        Cancel
                                    </button>
                                {/if}
                            </div>
                        </form>
                    </DashboardCard>

                    <DashboardCard title="Users">
                        {#if users.length}
                            <div class="list">
                                {#each users as user}
                                    <ListItem
                                        title={user.name}
                                        subtitle={user.email}
                                        tag={company?.departments.find(d => d.id === user.departmentId)?.name}
                                    >
                                        <svelte:fragment slot="actions">
                                            <button 
                                                class="btn-secondary"
                                                on:click={() => initializeUserForm(user)}
                                            >
                                                Edit
                                            </button>
                                            <a href={`/in/u/${user.id}`} class="btn-secondary">View</a>
                                            <button 
                                                class="btn-danger"
                                                on:click={() => deleteUser(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </svelte:fragment>
                                    </ListItem>
                                {/each}
                            </div>
                        {:else}
                            <EmptyState message="No users added yet" />
                        {/if}
                    </DashboardCard>
                </section>

            {:else if activeTab === 'tasks'}
                <section class="management-section">
                    <DashboardCard title={editingTask ? 'Edit Task' : 'Add Task'}>
                        <form on:submit|preventDefault={handleTaskSubmit}>
                            <FormInput
                                id="taskTitle"
                                label="Title"
                                bind:value={taskTitle}
                                placeholder="Enter task title"
                                required
                            />
                            <div class="form-group">
                                <label for="taskDescription">Description</label>
                                <textarea
                                    id="taskDescription"
                                    bind:value={taskDescription}
                                    placeholder="Enter task description"
                                    rows="3"
                                ></textarea>
                            </div>
                            
                            <!-- Multiple Department Selection -->
                            <div class="form-group">
                                <label>Departments</label>
                                <div class="department-checkboxes">
                                    {#each company?.departments || [] as department}
                                        <label class="checkbox-label">
                                            <input
                                                type="checkbox"
                                                value={department.id}
                                                bind:group={selectedDepartments}
                                            />
                                            {department.name}
                                        </label>
                                    {/each}
                                </div>
                                <p class="help-text">Leave empty to make available to all departments</p>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn-primary">
                                    {editingTask ? 'Update Task' : 'Add Task'}
                                </button>
                                {#if editingTask}
                                    <button 
                                        type="button" 
                                        class="btn-secondary" 
                                        on:click={() => initializeTaskForm()}
                                    >
                                        Cancel
                                    </button>
                                {/if}
                            </div>
                        </form>
                    </DashboardCard>

                    <DashboardCard title="Tasks">
                        {#if tasks.length}
                            <div class="list">
                                {#each tasks as task}
                                    <ListItem
                                        title={task.title}
                                        subtitle={task.description}
                                        tag={task.departmentIds.length 
                                            ? task.departmentIds
                                                .map(id => company?.departments.find(d => d.id === id)?.name)
                                                .filter(Boolean)
                                                .join(', ')
                                            : 'All Departments'
                                        }
                                        clickable
                                        selected={selectedTask?.id === task.id}
                                        on:click={() => handleTaskClick(task)}
                                    >
                                        <svelte:fragment slot="actions">
                                            <button 
                                                class="btn-secondary"
                                                on:click|stopPropagation={() => handleTaskClick(task)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                class="btn-danger"
                                                on:click|stopPropagation={() => deleteTask(task.id)}
                                            >
                                                Delete
                                            </button>
                                        </svelte:fragment>
                                        <svelte:fragment slot="details">
                                            <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
                                            <p>Last Updated: {new Date(task.updatedAt).toLocaleString()}</p>
                                            <p>Departments: {task.departmentIds.length 
                                                ? task.departmentIds
                                                    .map(id => company?.departments.find(d => d.id === id)?.name)
                                                    .filter(Boolean)
                                                    .join(', ')
                                                : 'All Departments'
                                            }</p>
                                        </svelte:fragment>
                                    </ListItem>
                                {/each}
                            </div>
                        {:else}
                            <EmptyState message="No tasks added yet" />
                        {/if}
                    </DashboardCard>
                </section>
            {/if}
        </div>

        {#if error}
            <div class="error-message" role="alert">
                {error}
            </div>
        {/if}
    {/if}
</main>

<style>
    .company-dashboard {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--spacing-6);
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-6);
    }

    .management-section {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: var(--spacing-6);
    }

    .error-message {
        background-color: var(--color-danger);
        color: white;
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        margin-top: var(--spacing-4);
        text-align: center;
    }

    @media (max-width: 768px) {
        .company-dashboard {
            padding: var(--spacing-4);
        }

        .management-section {
            grid-template-columns: 1fr;
        }
    }

    /* Add these new styles */
    .department-checkboxes {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-2);
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        font-size: var(--font-size-sm);
    }

    .help-text {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
    }

    .form-actions {
        display: flex;
        gap: var(--spacing-2);
        margin-top: var(--spacing-4);
    }

    .company-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-4);
        align-items: flex-start;
    }

    .company-edit-form {
        background-color: var(--color-surface);
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
        width: 100%;
        max-width: 400px;
    }
</style> 