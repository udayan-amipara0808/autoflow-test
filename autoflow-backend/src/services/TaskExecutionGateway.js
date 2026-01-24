const axios = require('axios');
const Task = require('../models/Task');
const Node = require('../models/Node');
const ExecutionLog = require('../models/ExecutionLog');
const logger = require('../utils/logger');

class TaskExecutionGateway {
  async dispatchTask(taskId, nodeId, taskData) {
    try {
      logger.info(`Dispatching task ${taskId} to ${nodeId}`);
      await Task.updateStatus(taskId, 'executing');

      // In a real scenario, we'd POST to the Node's API endpoint found in Node model
      // const node = await Node.findById(nodeId);
      // await axios.post(node.apiEndpoint + '/execute', ...)

      await this.logExecution(taskId, nodeId, 'info', 'Task dispatched to execution environment');

      return {
        executionId: 'exec-' + Math.random().toString(36).substr(2, 9),
        status: 'executing',
        estimatedCompletion: new Date(Date.now() + 60000)
      };
    } catch (error) {
      logger.error(`Dispatch failed: ${error.message}`);
      await Task.updateStatus(taskId, 'failed');
      throw error;
    }
  }

  async logExecution(taskId, nodeId, level, message) {
    await ExecutionLog.create({
      taskId,
      nodeId,
      logLevel: level,
      message,
    });
  }
}

module.exports = new TaskExecutionGateway();
