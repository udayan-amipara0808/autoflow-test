// MOCKED TASK MODEL
const tasks = [];

class Task {
    static async create(data) {
        const task = {
            id: crypto.randomUUID(),
            ...data,
            progress: 0,
            execution_logs_url: null,
            created_at: new Date()
        };
        tasks.push(task);
        return task;
    }

    static async updateStatus(id, status) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.status = status;
            return task;
        }
    }

    static async update(id, updates) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            Object.assign(task, updates);
            return task;
        }
    }

    static async assignNode(taskId, nodeId, score) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.assigned_node_id = nodeId;
            task.orchestration_score = score;
            task.assigned_at = new Date();
            task.status = 'routing';
        }
    }

    static async updateProgress(id, progress) {
        const task = tasks.find(t => t.id === id);
        if (task) task.progress = progress;
    }

    static async completeTask(id, resultUrl, duration) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.status = 'completed';
            task.result_data_url = resultUrl;
            task.execution_duration_seconds = duration;
            task.execution_completed_at = new Date();
            task.progress = 100;
        }
    }

    static async failTask(id, reason) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.status = 'failed';
            task.progress = 0;
            task.failed_reason = reason;
            task.execution_completed_at = new Date();
        }
    }

    static async findById(id) {
        return tasks.find(t => t.id === id);
    }

    static async findByAgent(agentId, filters) {
        return tasks.filter(t => t.agentId === agentId);
    }
}

const crypto = require('crypto');
module.exports = Task;
