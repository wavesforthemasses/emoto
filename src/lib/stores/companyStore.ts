import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Company {
    id: string;
    name: string;
    departments: Department[];
}

export interface Department {
    id: string;
    name: string;
}

export interface User {
    id: string;
    companyId: string;
    name: string;
    email: string;
    departmentId?: string;
    role: 'user' | 'admin';
}

export interface Task {
    id: string;
    companyId: string;
    title: string;
    description?: string;
}

export interface CompanyStore {
    companies: Company[];
    users: User[];
    tasks: Task[];
}

const initialState: CompanyStore = {
    companies: [],
    users: [],
    tasks: []
};

function createCompanyStore() {
    // Load initial data from localStorage if available
    const storedData = browser ? localStorage.getItem('company-data') : null;
    const initialData = storedData ? JSON.parse(storedData) : initialState;
    
    const { subscribe, set, update } = writable<CompanyStore>(initialData);

    return {
        subscribe,
        addCompany: (name: string) => {
            update(store => {
                const newCompany = {
                    id: crypto.randomUUID(),
                    name,
                    departments: []
                };
                const newStore = {
                    ...store,
                    companies: [...store.companies, newCompany]
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        deleteCompany: (id: string) => {
            update(store => {
                const newStore = {
                    companies: store.companies.filter(c => c.id !== id),
                    users: store.users.filter(u => u.companyId !== id),
                    tasks: store.tasks.filter(t => t.companyId !== id)
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        addDepartment: (companyId: string, name: string) => {
            update(store => {
                const newDepartment = {
                    id: crypto.randomUUID(),
                    name
                };
                const newStore = {
                    ...store,
                    companies: store.companies.map(company => 
                        company.id === companyId 
                            ? { ...company, departments: [...company.departments, newDepartment] }
                            : company
                    )
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        deleteDepartment: (companyId: string, departmentId: string) => {
            update(store => {
                const newStore = {
                    ...store,
                    companies: store.companies.map(company =>
                        company.id === companyId
                            ? {
                                ...company,
                                departments: company.departments.filter(d => d.id !== departmentId)
                            }
                            : company
                    ),
                    users: store.users.map(user =>
                        user.departmentId === departmentId
                            ? { ...user, departmentId: undefined }
                            : user
                    ),
                    tasks: store.tasks.map(task => ({
                        ...task,
                        departmentIds: task.departmentIds.filter(id => id !== departmentId)
                    }))
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        addUser: (userData: Omit<User, 'id'>) => {
            update(store => {
                const newUser = {
                    ...userData,
                    id: crypto.randomUUID()
                };
                const newStore = {
                    ...store,
                    users: [...store.users, newUser]
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        deleteUser: (id: string) => {
            update(store => {
                const newStore = {
                    ...store,
                    users: store.users.filter(u => u.id !== id)
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        addTask: (taskData: Omit<Task, 'id'>) => {
            update(store => {
                const newTask = {
                    ...taskData,
                    id: crypto.randomUUID()
                };
                const newStore = {
                    ...store,
                    tasks: [...store.tasks, newTask]
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        deleteTask: (id: string) => {
            update(store => {
                const newStore = {
                    ...store,
                    tasks: store.tasks.filter(t => t.id !== id)
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        updateTask: (taskData: Task) => {
            update(store => {
                const newStore = {
                    ...store,
                    tasks: store.tasks.map(task =>
                        task.id === taskData.id ? taskData : task
                    )
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        updateUser: (userData: User) => {
            update(store => {
                const newStore = {
                    ...store,
                    users: store.users.map(user =>
                        user.id === userData.id ? userData : user
                    )
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        updateDepartment: (companyId: string, departmentData: Department) => {
            update(store => {
                const newStore = {
                    ...store,
                    companies: store.companies.map(company =>
                        company.id === companyId
                            ? {
                                ...company,
                                departments: company.departments.map(dept =>
                                    dept.id === departmentData.id ? departmentData : dept
                                )
                            }
                            : company
                    )
                };
                if (browser) {
                    localStorage.setItem('company-data', JSON.stringify(newStore));
                }
                return newStore;
            });
        },
        reset: () => {
            set(initialState);
            if (browser) {
                localStorage.setItem('company-data', JSON.stringify(initialState));
            }
        }
    };
}

export const companyStore = createCompanyStore();