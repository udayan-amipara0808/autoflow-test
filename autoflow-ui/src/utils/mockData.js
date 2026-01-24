// Utility to generate random data
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generateId = () => Math.random().toString(36).substring(2, 9);
const generateHash = () => '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

// Task Types
export const TASK_TYPES = ['AI Inference', 'Data Processing', 'API Call', 'Custom'];
export const TASK_STATUSES = ['Pending', 'Routing', 'Executing', 'Completed', 'Failed'];

// Mock Tasks
export const mockTasks = Array.from({ length: 20 }, (_, i) => ({
  id: generateId(),
  type: getRandomItem(TASK_TYPES),
  description: "Task #" + (i + 1) + ": " + getRandomItem(['Analyze sophisticated dataset', 'Generate 3D implementation plan', 'Process blockchain transaction batch', 'Train neural network layer']),
  status: getRandomItem(TASK_STATUSES),
  nodeId: Math.random() > 0.3 ? "Node-" + generateId().substring(0, 4) : null,
  escrowAmount: getRandomInt(10, 200),
  startedAt: new Date(Date.now() - getRandomInt(0, 86400000)).toISOString(),
  progress: getRandomInt(0, 100),
  computeRequirements: {
    cpu: getRandomInt(2, 16),
    ram: getRandomInt(4, 64),
    gpu: Math.random() > 0.5
  }
})).sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

// Mock Nodes
export const mockNodes = Array.from({ length: 12 }, (_, i) => ({
  id: "Node-" + generateId().substring(0, 4),
  status: getRandomItem(['Online', 'Online', 'Online', 'Busy', 'Offline']),
  health: getRandomInt(60, 100),
  load: getRandomInt(0, 95),
  specs: {
    cpu: getRandomItem([8, 16, 32, 64]),
    ram: getRandomItem([16, 32, 64, 128]),
    gpu: Math.random() > 0.3
  },
  latency: getRandomInt(10, 200),
  tasksCompleted: getRandomInt(100, 5000),
  reputation: (Math.random() * 1.5 + 3.5).toFixed(1),
  location: getRandomItem(['US-East', 'EU-West', 'Asia-Pacific', 'US-West'])
}));

// Mock Payments
export const mockPayments = Array.from({ length: 30 }, () => ({
  hash: generateHash(),
  type: getRandomItem(['Escrow Lock', 'Payment Release', 'Refund']),
  amount: getRandomInt(10, 200),
  from: generateHash(),
  to: generateHash(),
  status: getRandomItem(['Pending', 'Confirmed']),
  confirmations: getRandomInt(0, 12),
  timestamp: new Date(Date.now() - getRandomInt(0, 7 * 86400000)).toISOString()
}));

// Mock Events
export const mockEvents = Array.from({ length: 50 }, () => ({
  id: generateId(),
  type: getRandomItem(['task_submitted', 'task_assigned', 'task_completed', 'payment_released', 'node_online', 'node_offline']),
  description: 'Event description placeholder', // Will be enriched in component
  timestamp: new Date(Date.now() - getRandomInt(0, 7200000)).toISOString(),
  relatedId: generateId()
})).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

// Agent Profile
export const mockAgent = {
  id: 'agent-alice-7f3a',
  name: "Agent Alice",
  type: "Autonomous AI",
  walletAddress: "0x7f3a8b2c9d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7",
  createdAt: "2023-11-15T10:00:00Z",
  totalTasks: 234,
  successRate: 94.5,
  balance: 1234.56,
  apiKey: "sk_live_..."
};
