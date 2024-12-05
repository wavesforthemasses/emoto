<!-- Company management component -->
<script lang="ts">
    import { companyStore } from '$lib/stores/companyStore';
    import type { Company, User, Task, Department } from '$lib/stores/companyStore';
    import TabNavigation from '$lib/components/molecules/TabNavigation.svelte';
    import FormInput from '$lib/components/molecules/FormInput.svelte';
    import FormSelect from '$lib/components/molecules/FormSelect.svelte';
    import DashboardCard from '$lib/components/molecules/DashboardCard.svelte';
    import Button from '$lib/components/atoms/Button.svelte';
    import { goto } from '$app/navigation';

    export let companyId: string;

    // Tab management
    const tabs = ['Users', 'Departments', 'Tasks'];
    let activeTab = 'Users';

    // Form states
    let newUserName = '';
    let newUserEmail = '';
    let newUserDepartment = '';
    let newDepartmentName = '';
    let newTaskTitle = '';
    let newTaskDescription = '';

    // Add edit state variables
    let editingTaskId: string | null = null;
    let editingUserId: string | null = null;
    let editingDepartmentId: string | null = null;

    // Task edit states
    let editTaskTitle = '';
    let editTaskDescription = '';

    // User edit states
    let editUserName = '';
    let editUserEmail = '';
    let editUserDepartment = '';

    // Department edit states
    let editDepartmentName = '';

    // Add state for form visibility
    let showUserForm = false;
    let showDepartmentForm = false;
    let showTaskForm = false;

    // Get current company data with proper typing
    $: company = $companyStore.companies.find((c: Company) => c.id === companyId);
    $: users = $companyStore.users.filter((u: User) => u.companyId === companyId);
    $: tasks = $companyStore.tasks.filter((t: Task) => t.companyId === companyId);
    $: departments = company?.departments || [];

    // Department options for select with proper typing
    $: departmentOptions = departments.map((d: Department) => ({
        value: d.id,
        label: d.name
    }));

    // Form handlers
    function handleAddUser() {
        if (!newUserName || !newUserEmail) return;
        
        companyStore.addUser({
            name: newUserName,
            email: newUserEmail,
            companyId,
            departmentId: newUserDepartment || undefined,
            role: 'user'
        });

        resetForms();
    }

    function handleAddDepartment() {
        if (!newDepartmentName) return;
        
        companyStore.addDepartment(companyId, newDepartmentName);
        resetForms();
    }

    function handleAddTask() {
        if (!newTaskTitle) return;
        
        companyStore.addTask({
            title: newTaskTitle,
            description: newTaskDescription,
            companyId,
        });

        resetForms();
    }

    function handleDeleteUser(userId: string) {
        if (confirm('Are you sure you want to delete this user?')) {
            companyStore.deleteUser(userId);
        }
    }

    function handleDeleteDepartment(departmentId: string) {
        if (confirm('Are you sure you want to delete this department?')) {
            companyStore.deleteDepartment(companyId, departmentId);
        }
    }

    function handleDeleteTask(taskId: string) {
        if (confirm('Are you sure you want to delete this task?')) {
            companyStore.deleteTask(taskId);
        }
    }

    function navigateToUser(userId: string) {
        goto(`/in/u/${userId}`);
    }

    // Add edit handler functions
    function handleEditTask(task: Task) {
        editingTaskId = task.id;
        editTaskTitle = task.title;
        editTaskDescription = task.description || '';
    }

    function handleSaveTask() {
        if (!editingTaskId || !editTaskTitle) return;
        
        companyStore.updateTask({
            id: editingTaskId,
            title: editTaskTitle,
            description: editTaskDescription,
            companyId
        });

        // Reset edit state
        editingTaskId = null;
        editTaskTitle = '';
        editTaskDescription = '';
    }

    function handleCancelEdit() {
        editingTaskId = null;
        editTaskTitle = '';
        editTaskDescription = '';
    }

    // User edit handlers
    function handleEditUser(user: User) {
        editingUserId = user.id;
        editUserName = user.name;
        editUserEmail = user.email;
        editUserDepartment = user.departmentId || '';
    }

    function handleSaveUser() {
        if (!editingUserId || !editUserName || !editUserEmail) return;
        
        companyStore.updateUser({
            id: editingUserId,
            name: editUserName,
            email: editUserEmail,
            companyId,
            departmentId: editUserDepartment || undefined,
            role: 'user' // Maintain existing role
        });

        editingUserId = null;
        editUserName = '';
        editUserEmail = '';
        editUserDepartment = '';
    }

    function handleCancelUserEdit() {
        editingUserId = null;
        editUserName = '';
        editUserEmail = '';
        editUserDepartment = '';
    }

    // Department edit handlers
    function handleEditDepartment(department: Department) {
        editingDepartmentId = department.id;
        editDepartmentName = department.name;
    }

    function handleSaveDepartment() {
        if (!editingDepartmentId || !editDepartmentName) return;
        
        companyStore.updateDepartment(companyId, {
            id: editingDepartmentId,
            name: editDepartmentName
        });

        editingDepartmentId = null;
        editDepartmentName = '';
    }

    function handleCancelDepartmentEdit() {
        editingDepartmentId = null;
        editDepartmentName = '';
    }

    // Add function to reset forms
    function resetForms() {
        // Reset User form
        newUserName = '';
        newUserEmail = '';
        newUserDepartment = '';
        showUserForm = false;

        // Reset Department form
        newDepartmentName = '';
        showDepartmentForm = false;

        // Reset Task form
        newTaskTitle = '';
        newTaskDescription = '';
        showTaskForm = false;
    }
</script>

<div class="company-manager">
    <TabNavigation {tabs} bind:activeTab />

    <div class="tab-content">
        {#if activeTab === 'Users'}
            <div class="user-section">
                {#if users.length > 0}
                    <div class="section-header">
                        <Button 
                            variant="primary" 
                            on:click={() => showUserForm = !showUserForm}
                        >
                            {showUserForm ? 'Cancel' : 'Add New User'}
                        </Button>
                    </div>
                {/if}

                {#if showUserForm || users.length === 0}
                    <DashboardCard title="Add New User">
                        <form on:submit|preventDefault={handleAddUser} class="form-grid">
                            <FormInput
                                label="Name"
                                bind:value={newUserName}
                                required
                            />
                            <FormInput
                                label="Email"
                                type="email"
                                bind:value={newUserEmail}
                                required
                            />
                            <FormSelect
                                label="Department"
                                options={departmentOptions}
                                bind:value={newUserDepartment}
                            />
                            <Button type="submit" variant="primary">Add User</Button>
                        </form>
                    </DashboardCard>
                {/if}

                <DashboardCard title="User List">
                    <div class="list">
                        {#each users as user}
                            <div class="list-item">
                                {#if editingUserId === user.id}
                                    <form on:submit|preventDefault={handleSaveUser} class="edit-form">
                                        <FormInput
                                            label="Name"
                                            bind:value={editUserName}
                                            required
                                        />
                                        <FormInput
                                            label="Email"
                                            type="email"
                                            bind:value={editUserEmail}
                                            required
                                        />
                                        <FormSelect
                                            label="Department"
                                            options={departmentOptions}
                                            bind:value={editUserDepartment}
                                        />
                                        <div class="edit-actions">
                                            <Button type="submit" variant="primary">Save</Button>
                                            <Button 
                                                type="button" 
                                                variant="secondary"
                                                on:click={handleCancelUserEdit}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                {:else}
                                    <div class="item-info">
                                        <h3>{user.name}</h3>
                                        <p>{user.email}</p>
                                        <p class="department">
                                            {departments.find(d => d.id === user.departmentId)?.name || 'No Department'}
                                        </p>
                                    </div>
                                    <div class="item-actions">
                                        <Button 
                                            variant="secondary"
                                            on:click={() => handleEditUser(user)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="secondary"
                                            on:click={() => navigateToUser(user.id)}
                                        >
                                            View Profile
                                        </Button>
                                        <Button 
                                            variant="danger"
                                            on:click={() => handleDeleteUser(user.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </DashboardCard>
            </div>

        {:else if activeTab === 'Departments'}
            <div class="department-section">
                {#if departments.length > 0}
                    <div class="section-header">
                        <Button 
                            variant="primary" 
                            on:click={() => showDepartmentForm = !showDepartmentForm}
                        >
                            {showDepartmentForm ? 'Cancel' : 'Add New Department'}
                        </Button>
                    </div>
                {/if}

                {#if showDepartmentForm || departments.length === 0}
                    <DashboardCard title="Add New Department">
                        <form on:submit|preventDefault={handleAddDepartment} class="form-grid">
                            <FormInput
                                label="Department Name"
                                bind:value={newDepartmentName}
                                required
                            />
                            <Button type="submit" variant="primary">Add Department</Button>
                        </form>
                    </DashboardCard>
                {/if}

                <DashboardCard title="Department List">
                    <div class="list">
                        {#each departments as department}
                            <div class="list-item">
                                {#if editingDepartmentId === department.id}
                                    <form on:submit|preventDefault={handleSaveDepartment} class="edit-form">
                                        <FormInput
                                            label="Department Name"
                                            bind:value={editDepartmentName}
                                            required
                                        />
                                        <div class="edit-actions">
                                            <Button type="submit" variant="primary">Save</Button>
                                            <Button 
                                                type="button" 
                                                variant="secondary"
                                                on:click={handleCancelDepartmentEdit}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                {:else}
                                    <div class="item-info">
                                        <h3>{department.name}</h3>
                                        <p>
                                            {users.filter(u => u.departmentId === department.id).length} Users
                                        </p>
                                    </div>
                                    <div class="item-actions">
                                        <Button 
                                            variant="secondary"
                                            on:click={() => handleEditDepartment(department)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="danger"
                                            on:click={() => handleDeleteDepartment(department.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </DashboardCard>
            </div>

        {:else if activeTab === 'Tasks'}
            <div class="task-section">
                {#if tasks.length > 0}
                    <div class="section-header">
                        <Button 
                            variant="primary" 
                            on:click={() => showTaskForm = !showTaskForm}
                        >
                            {showTaskForm ? 'Cancel' : 'Add New Task'}
                        </Button>
                    </div>
                {/if}

                {#if showTaskForm || tasks.length === 0}
                    <DashboardCard title="Add New Task">
                        <form on:submit|preventDefault={handleAddTask} class="form-grid">
                            <FormInput
                                label="Task Title"
                                bind:value={newTaskTitle}
                                required
                            />
                            <FormInput
                                label="Description"
                                bind:value={newTaskDescription}
                                type="textarea"
                            />
                            <Button type="submit" variant="primary">Add Task</Button>
                        </form>
                    </DashboardCard>
                {/if}

                <DashboardCard title="Task List">
                    <div class="list">
                        {#each tasks as task}
                            <div class="list-item">
                                {#if editingTaskId === task.id}
                                    <form on:submit|preventDefault={handleSaveTask} class="edit-form">
                                        <FormInput
                                            label="Task Title"
                                            bind:value={editTaskTitle}
                                            required
                                        />
                                        <FormInput
                                            label="Description"
                                            bind:value={editTaskDescription}
                                            type="textarea"
                                        />
                                        <div class="edit-actions">
                                            <Button type="submit" variant="primary">Save</Button>
                                            <Button 
                                                type="button" 
                                                variant="secondary"
                                                on:click={handleCancelEdit}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                {:else}
                                    <div class="item-info">
                                        <h3>{task.title}</h3>
                                        {#if task.description}
                                            <p>{task.description}</p>
                                        {/if}
                                    </div>
                                    <div class="item-actions">
                                        <Button 
                                            variant="secondary"
                                            on:click={() => handleEditTask(task)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="danger"
                                            on:click={() => handleDeleteTask(task.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </DashboardCard>
            </div>
        {/if}
    </div>
</div>

<style>
    .company-manager {
        margin-top: var(--spacing-lg);
    }

    .tab-content {
        margin-top: var(--spacing-lg);
    }

    .form-grid {
        display: grid;
        gap: var(--spacing-md);
        max-width: 600px;
        margin-bottom: var(--spacing-lg);
    }

    .list {
        display: grid;
        gap: var(--spacing-md);
        margin-top: var(--spacing-md);
    }

    .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        background: var(--color-surface-alt);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-sm);
    }

    .item-info h3 {
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-xs);
    }

    .item-info p {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
    }

    .department {
        font-style: italic;
    }

    .item-actions {
        display: flex;
        gap: var(--spacing-sm);
    }

    .edit-form {
        width: 100%;
        display: grid;
        gap: var(--spacing-md);
    }

    .edit-actions {
        display: flex;
        gap: var(--spacing-sm);
        justify-content: flex-end;
        margin-top: var(--spacing-sm);
    }

    .section-header {
        display: flex;
        justify-content: flex-end;
        margin-bottom: var(--spacing-md);
    }

    @media (max-width: 640px) {
        .list-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
        }

        .item-actions {
            width: 100%;
            justify-content: flex-end;
        }

        .edit-actions {
            width: 100%;
        }
    }
</style> 