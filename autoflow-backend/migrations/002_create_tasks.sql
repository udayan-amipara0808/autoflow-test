CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_hash VARCHAR(66) UNIQUE NOT NULL, -- Blockchain task hash
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'ai_inference', 'data_processing', 'api_call', 'custom'
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'routing', 'executing', 'completed', 'failed', 'cancelled'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  
  -- Compute requirements
  compute_requirements JSONB NOT NULL,
  -- { "cpu_cores": 4, "ram_gb": 16, "gpu_required": true, "duration_estimate_seconds": 300 }
  
  -- Node assignment
  assigned_node_id UUID REFERENCES nodes(id),
  orchestration_score JSONB, -- Scoring breakdown
  assigned_at TIMESTAMP,
  
  -- Execution tracking
  execution_started_at TIMESTAMP,
  execution_completed_at TIMESTAMP,
  execution_duration_seconds INTEGER,
  progress DECIMAL(5, 2) DEFAULT 0,
  execution_logs_url TEXT, -- IPFS or S3 URL
  result_data_url TEXT,
  
  -- Payment & escrow
  escrow_id UUID REFERENCES escrows(id),
  max_budget DECIMAL(20, 8) NOT NULL,
  actual_cost DECIMAL(20, 8),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_tasks_agent ON tasks(agent_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_node ON tasks(assigned_node_id);
CREATE INDEX idx_tasks_created ON tasks(created_at DESC);
