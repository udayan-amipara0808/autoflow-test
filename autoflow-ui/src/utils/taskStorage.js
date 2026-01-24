// Task storage utilities using localStorage
// This allows submitted tasks to persist and appear in TaskMonitor

const TASKS_STORAGE_KEY = 'autoflow_submitted_tasks';

// Get all tasks from localStorage
export const getStoredTasks = () => {
    try {
        const stored = localStorage.getItem(TASKS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading tasks from storage:', error);
        return [];
    }
};

// Add a new task to localStorage
export const addTask = (task) => {
    try {
        const tasks = getStoredTasks();
        const newTask = {
            ...task,
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            createdAt: new Date().toISOString(),
            status: 'Pending',
            progress: 0
        };
        tasks.unshift(newTask); // Add to beginning
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks.slice(0, 50))); // Keep max 50 tasks
        return newTask;
    } catch (error) {
        console.error('Error saving task to storage:', error);
        return null;
    }
};

// Update task status
export const updateTaskStatus = (taskId, updates) => {
    try {
        const tasks = getStoredTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
            return tasks[index];
        }
        return null;
    } catch (error) {
        console.error('Error updating task:', error);
        return null;
    }
};

// Clear all tasks
export const clearTasks = () => {
    localStorage.removeItem(TASKS_STORAGE_KEY);
};

// Initialize with example tasks if empty (for demo purposes)
export const initializeExampleTasks = () => {
    const existing = getStoredTasks();
    if (existing.length === 0) {
        const exampleTasks = [
            {
                id: 'ex001',
                type: 'AI Inference',
                description: 'GPT-4 text generation for content creation',
                status: 'Completed',
                progress: 100,
                escrowAmount: '0.05',
                nodeId: 'node-alpha-1',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                txHash: '0x1234...abcd'
            },
            {
                id: 'ex002',
                type: 'Data Processing',
                description: 'Batch image compression pipeline',
                status: 'Completed',
                progress: 100,
                escrowAmount: '0.02',
                nodeId: 'node-beta-2',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                txHash: '0x5678...efgh'
            },
            {
                id: 'ex003',
                type: 'API Call',
                description: 'External API integration test',
                status: 'Completed',
                progress: 100,
                escrowAmount: '0.01',
                nodeId: 'node-gamma-3',
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                txHash: '0x9abc...ijkl'
            }
        ];
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(exampleTasks));
    }
};
