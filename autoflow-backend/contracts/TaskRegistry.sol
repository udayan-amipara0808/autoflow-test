// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TaskRegistry
 * @dev On-chain registry for AutoFlow tasks
 */
contract TaskRegistry {
    struct Task {
        bytes32 taskId;
        address agent;
        address assignedNode;
        TaskStatus status;
        string taskType;
        uint256 createdAt;
        uint256 completedAt;
        bytes32 resultHash;
    }

    enum TaskStatus { Pending, Assigned, Running, Completed, Failed, Cancelled }

    mapping(bytes32 => Task) public tasks;
    mapping(address => bytes32[]) public agentTasks;
    mapping(address => bytes32[]) public nodeTasks;
    
    address public orchestrator;
    uint256 public taskCount;

    event TaskCreated(bytes32 indexed taskId, address indexed agent, string taskType);
    event TaskAssigned(bytes32 indexed taskId, address indexed node);
    event TaskCompleted(bytes32 indexed taskId, bytes32 resultHash);
    event TaskFailed(bytes32 indexed taskId, string reason);

    modifier onlyOrchestrator() {
        require(msg.sender == orchestrator, "Only orchestrator");
        _;
    }

    constructor() {
        orchestrator = msg.sender;
    }

    function createTask(
        bytes32 taskId,
        address agent,
        string calldata taskType
    ) external onlyOrchestrator {
        require(tasks[taskId].createdAt == 0, "Task already exists");
        
        tasks[taskId] = Task({
            taskId: taskId,
            agent: agent,
            assignedNode: address(0),
            status: TaskStatus.Pending,
            taskType: taskType,
            createdAt: block.timestamp,
            completedAt: 0,
            resultHash: bytes32(0)
        });
        
        agentTasks[agent].push(taskId);
        taskCount++;
        
        emit TaskCreated(taskId, agent, taskType);
    }

    function assignTask(bytes32 taskId, address node) external onlyOrchestrator {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Pending, "Invalid status");
        
        task.assignedNode = node;
        task.status = TaskStatus.Assigned;
        nodeTasks[node].push(taskId);
        
        emit TaskAssigned(taskId, node);
    }

    function startTask(bytes32 taskId) external onlyOrchestrator {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Assigned, "Invalid status");
        task.status = TaskStatus.Running;
    }

    function completeTask(bytes32 taskId, bytes32 resultHash) external onlyOrchestrator {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Running, "Invalid status");
        
        task.status = TaskStatus.Completed;
        task.completedAt = block.timestamp;
        task.resultHash = resultHash;
        
        emit TaskCompleted(taskId, resultHash);
    }

    function failTask(bytes32 taskId, string calldata reason) external onlyOrchestrator {
        Task storage task = tasks[taskId];
        require(
            task.status == TaskStatus.Pending || 
            task.status == TaskStatus.Assigned || 
            task.status == TaskStatus.Running,
            "Invalid status"
        );
        
        task.status = TaskStatus.Failed;
        task.completedAt = block.timestamp;
        
        emit TaskFailed(taskId, reason);
    }

    function getTask(bytes32 taskId) external view returns (Task memory) {
        return tasks[taskId];
    }

    function getAgentTaskCount(address agent) external view returns (uint256) {
        return agentTasks[agent].length;
    }

    function getNodeTaskCount(address node) external view returns (uint256) {
        return nodeTasks[node].length;
    }

    function updateOrchestrator(address newOrchestrator) external onlyOrchestrator {
        orchestrator = newOrchestrator;
    }
}
