const OrchestrationEngine = require('../../services/OrchestrationEngine');

class OrchestratorController {
    async getWeights(req, res) {
        res.json({ success: true, data: { latency: 0.3, cost: 0.2, load: 0.25, reputation: 0.25 } });
    }
    async simulateSelection(req, res) {
        const result = await OrchestrationEngine.selectNode(req.body, 100);
        res.json({ success: true, data: result });
    }
    async updateWeights(req, res) { res.json({ success: true }); }
    async getStats(req, res) { res.json({ success: true, data: {} }); }
}
module.exports = new OrchestratorController();
