// MOCKED LOG MODEL
const logs = [];

class ExecutionLog {
    static async create(data) {
        logs.push({ id: crypto.randomUUID(), ...data, timestamp: new Date() });
    }

    static async findByTask(taskId) {
        return logs.filter(l => l.taskId === taskId);
    }
}

const crypto = require('crypto');
module.exports = ExecutionLog;
