const Task = require('../../models/Task');
const OrchestrationEngine = require('../../services/OrchestrationEngine');
const SettlementService = require('../../services/SettlementService');
const TaskExecutionGateway = require('../../services/TaskExecutionGateway');
const logger = require('../../utils/logger');

class TaskController {
    async submitTask(req, res, next) {
        try {
            const { type, description, computeRequirements, maxBudget, priority } = req.body;
            const agentId = req.agent.id;

            // 1. Create Task
            const task = await Task.create({
                agentId, type, description, computeRequirements, maxBudget, priority: priority || 'medium'
            });

            // 2. Lock Escrow
            const escrow = await SettlementService.lockEscrow(task.id, agentId, maxBudget);

            // 3. Orchestrate
            const nodeSelection = await OrchestrationEngine.selectNode(computeRequirements, maxBudget);
            await Task.assignNode(task.id, nodeSelection.nodeId, nodeSelection.breakdown);

            // 4. Dispatch
            const exec = await TaskExecutionGateway.dispatchTask(task.id, nodeSelection.nodeId, {
                type, description
            });

            res.status(201).json({
                success: true,
                data: {
                    taskId: task.id,
                    status: 'executing',
                    assignedNode: nodeSelection.nodeId,
                    escrow,
                    execution: exec
                }
            });
        } catch (e) { next(e); }
    }

    async listTasks(req, res, next) {
        try {
            // Return valid JSON array
            res.json({ success: true, data: [] });
        } catch (e) { next(e); }
    }
}

module.exports = new TaskController();
