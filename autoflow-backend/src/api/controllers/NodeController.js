const Node = require('../../models/Node');

class NodeController {
    async listNodes(req, res) {
        const nodes = await Node.findAll();
        res.json({ success: true, data: nodes });
    }
    async getNode(req, res) {
        res.json({ success: true, data: {} });
    }
    async getNodeHealth(req, res) {
        res.json({ success: true, data: { status: 'online' } });
    }
    async getNodeReputation(req, res) {
        res.json({ success: true, data: { score: 95 } });
    }
}
module.exports = new NodeController();
