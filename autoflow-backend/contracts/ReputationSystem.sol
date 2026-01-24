// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReputationSystem
 * @dev Tracks reputation scores for nodes and agents in AutoFlow
 */
contract ReputationSystem {
    struct Reputation {
        uint256 score;          // 0-10000 (basis points, 10000 = 100%)
        uint256 totalTasks;
        uint256 successfulTasks;
        uint256 failedTasks;
        uint256 lastUpdated;
    }

    mapping(address => Reputation) public nodeReputations;
    mapping(address => Reputation) public agentReputations;
    
    address public orchestrator;
    
    uint256 public constant MAX_SCORE = 10000;
    uint256 public constant INITIAL_SCORE = 5000; // 50%
    uint256 public constant SUCCESS_BOOST = 100;   // +1%
    uint256 public constant FAILURE_PENALTY = 200; // -2%

    event ReputationUpdated(address indexed account, bool isNode, uint256 newScore);
    event TaskRecorded(address indexed account, bool isNode, bool success);

    modifier onlyOrchestrator() {
        require(msg.sender == orchestrator, "Only orchestrator");
        _;
    }

    constructor() {
        orchestrator = msg.sender;
    }

    function initializeNode(address node) external onlyOrchestrator {
        if (nodeReputations[node].lastUpdated == 0) {
            nodeReputations[node] = Reputation({
                score: INITIAL_SCORE,
                totalTasks: 0,
                successfulTasks: 0,
                failedTasks: 0,
                lastUpdated: block.timestamp
            });
        }
    }

    function initializeAgent(address agent) external onlyOrchestrator {
        if (agentReputations[agent].lastUpdated == 0) {
            agentReputations[agent] = Reputation({
                score: INITIAL_SCORE,
                totalTasks: 0,
                successfulTasks: 0,
                failedTasks: 0,
                lastUpdated: block.timestamp
            });
        }
    }

    function recordNodeTaskSuccess(address node) external onlyOrchestrator {
        Reputation storage rep = nodeReputations[node];
        rep.totalTasks++;
        rep.successfulTasks++;
        rep.score = _min(rep.score + SUCCESS_BOOST, MAX_SCORE);
        rep.lastUpdated = block.timestamp;
        
        emit TaskRecorded(node, true, true);
        emit ReputationUpdated(node, true, rep.score);
    }

    function recordNodeTaskFailure(address node) external onlyOrchestrator {
        Reputation storage rep = nodeReputations[node];
        rep.totalTasks++;
        rep.failedTasks++;
        rep.score = rep.score > FAILURE_PENALTY ? rep.score - FAILURE_PENALTY : 0;
        rep.lastUpdated = block.timestamp;
        
        emit TaskRecorded(node, true, false);
        emit ReputationUpdated(node, true, rep.score);
    }

    function recordAgentTaskSuccess(address agent) external onlyOrchestrator {
        Reputation storage rep = agentReputations[agent];
        rep.totalTasks++;
        rep.successfulTasks++;
        rep.score = _min(rep.score + SUCCESS_BOOST, MAX_SCORE);
        rep.lastUpdated = block.timestamp;
        
        emit TaskRecorded(agent, false, true);
        emit ReputationUpdated(agent, false, rep.score);
    }

    function recordAgentTaskFailure(address agent) external onlyOrchestrator {
        Reputation storage rep = agentReputations[agent];
        rep.totalTasks++;
        rep.failedTasks++;
        rep.score = rep.score > FAILURE_PENALTY ? rep.score - FAILURE_PENALTY : 0;
        rep.lastUpdated = block.timestamp;
        
        emit TaskRecorded(agent, false, false);
        emit ReputationUpdated(agent, false, rep.score);
    }

    function getNodeReputation(address node) external view returns (Reputation memory) {
        return nodeReputations[node];
    }

    function getAgentReputation(address agent) external view returns (Reputation memory) {
        return agentReputations[agent];
    }

    function getNodeScore(address node) external view returns (uint256) {
        return nodeReputations[node].score;
    }

    function getAgentScore(address agent) external view returns (uint256) {
        return agentReputations[agent].score;
    }

    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function updateOrchestrator(address newOrchestrator) external onlyOrchestrator {
        orchestrator = newOrchestrator;
    }
}
