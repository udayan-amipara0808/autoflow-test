const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const WebSocketService = require('./services/WebSocketService');
const logger = require('./utils/logger');
const errorHandler = require('./api/middleware/errorHandler');

// Import routes
const agentsRouter = require('./api/routes/agents');
const tasksRouter = require('./api/routes/tasks');
const nodesRouter = require('./api/routes/nodes');
const paymentsRouter = require('./api/routes/payments');
const orchestrationRouter = require('./api/routes/orchestration');
const adminRouter = require('./api/routes/admin');

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors({ origin: true, credentials: true })); // Allow all for demo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date() }));

// Routes
app.use('/api/agents', agentsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/nodes', nodesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/orchestration', orchestrationRouter);
app.use('/api/admin', adminRouter);

app.use(errorHandler);

// Initialize WebSocket
WebSocketService.initialize(server);

const PORT = 3000;
server.listen(PORT, () => {
    logger.info(`🚀 AutoFlow backend running on port ${PORT}`);
    logger.info(`📡 WebSocket available at ws://localhost:${PORT}/ws`);
});

module.exports = app;
