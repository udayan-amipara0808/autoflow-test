// MOCKED AGENT MODEL for demonstration without DB
const agents = [];

class Agent {
    static async create(data) {
        const agent = {
            id: crypto.randomUUID(),
            ...data,
            balance: 0,
            total_tasks_submitted: 0,
            success_rate: 100,
            reputation_score: 50,
            created_at: new Date(),
            isActive: true
        };
        agents.push(agent);
        return agent;
    }

    static async findByApiKey(apiKey) {
        return agents.find(a => a.apiKey === apiKey);
    }

    static async findById(id) {
        return agents.find(a => a.id === id);
    }

    static async update(id, updates) {
        const agent = agents.find(a => a.id === id);
        if (agent) {
            Object.assign(agent, updates);
            return agent;
        }
        return null;
    }
}

const crypto = require('crypto');
module.exports = Agent;
