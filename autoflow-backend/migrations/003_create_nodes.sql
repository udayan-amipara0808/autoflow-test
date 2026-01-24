CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id VARCHAR(100) UNIQUE NOT NULL, -- NodeOps node identifier
  operator_address VARCHAR(42) NOT NULL,
  status VARCHAR(20) DEFAULT 'online', -- 'online', 'offline', 'busy', 'suspended'
  
  -- Specifications
  specs JSONB NOT NULL,
  -- { "cpu_cores": 16, "ram_gb": 64, "gpu_available": true, "gpu_model": "A100", "region": "us-east" }
  
  -- Performance metrics
  current_load DECIMAL(5, 2) DEFAULT 0, -- Percentage
  health_score DECIMAL(5, 2) DEFAULT 100,
  avg_latency_ms INTEGER DEFAULT 0,
  total_tasks_completed INTEGER DEFAULT 0,
  tasks_failed INTEGER DEFAULT 0,
  reputation_score DECIMAL(5, 2) DEFAULT 50.00,
  
  -- Pricing
  price_per_cpu_hour DECIMAL(10, 4),
  price_per_gb_hour DECIMAL(10, 4),
  price_per_gpu_hour DECIMAL(10, 4),
  
  -- Registration & health
  registered_at TIMESTAMP DEFAULT NOW(),
  last_heartbeat_at TIMESTAMP,
  last_health_check_at TIMESTAMP,
  total_uptime_seconds BIGINT DEFAULT 0,
  
  -- Metadata
  api_endpoint TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_nodes_status ON nodes(status);
CREATE INDEX idx_nodes_health ON nodes(health_score DESC);
CREATE INDEX idx_nodes_reputation ON nodes(reputation_score DESC);
