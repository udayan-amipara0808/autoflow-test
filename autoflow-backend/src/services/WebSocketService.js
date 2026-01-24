const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

class WebSocketService {
    constructor() {
        this.clients = new Map();
    }

    initialize(server) {
        this.wss = new WebSocket.Server({ server, path: '/ws' });
        this.wss.on('connection', (ws, req) => this.handleConnection(ws, req));
        logger.info('WebSocket server initialized');
    }

    handleConnection(ws, req) {
        // In production, parse URL for token
        // const token = new URL(req.url, 'http://localhost').searchParams.get('token');
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const agentId = decoded.agentId;
        const agentId = 'mock-agent-id'; // For demo ease

        this.clients.set(agentId, ws);
        logger.info(`WebSocket connected: ${agentId}`);

        ws.send(JSON.stringify({ type: 'connected', message: 'Connected to AutoFlow Orchestrator' }));

        ws.on('close', () => this.clients.delete(agentId));
    }

    broadcast(data) {
        this.clients.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
        });
    }
}

module.exports = new WebSocketService();
