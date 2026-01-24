// MOCKED NODE MODEL
const nodes = [
    {
        id: 'node-1',
        node_id: 'node-ops-1',
        operatorAddress: '0x1111111111111111111111111111111111111111',
        status: 'online',
        specs: { cpuCores: 16, ramGb: 32, gpuAvailable: true },
        currentLoad: 10,
        avgLatencyMs: 45,
        pricePerCpuHour: 0.1,
        pricePerGbHour: 0.05,
        pricePerGpuHour: 1.5,
        reputationScore: 90
    },
    {
        id: 'node-2',
        node_id: 'node-ops-2',
        operatorAddress: '0x2222222222222222222222222222222222222222',
        status: 'online',
        specs: { cpuCores: 8, ramGb: 16, gpuAvailable: false },
        currentLoad: 40,
        avgLatencyMs: 80,
        pricePerCpuHour: 0.08,
        pricePerGbHour: 0.04,
        pricePerGpuHour: 0,
        reputationScore: 85
    }
];

class Node {
    static async findAvailableNodes(requirements) {
        return nodes; // Return all for now
    }

    static async findById(id) {
        return nodes.find(n => n.id === id);
    }

    static async updateLoad(id, load) {
        const node = nodes.find(n => n.id === id);
        if (node) node.currentLoad = load;
    }

    static async incrementTaskCount(id, success) {
        // Mock no-op
    }

    static async updateHealth(id, healthData) {
        const node = nodes.find(n => n.id === id);
        if (node) Object.assign(node, healthData);
    }

    static async findAll() {
        return nodes;
    }

    static async update(id, data) {
        const node = nodes.find(n => n.id === id);
        if (node) Object.assign(node, data);
    }
}

module.exports = Node;
