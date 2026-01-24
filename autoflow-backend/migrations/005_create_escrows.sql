CREATE TABLE escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_contract_id BIGINT UNIQUE, -- On-chain escrow ID
  task_id UUID UNIQUE REFERENCES tasks(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id),
  node_id UUID REFERENCES nodes(id),
  
  -- Amounts
  locked_amount DECIMAL(20, 8) NOT NULL,
  fee_percentage DECIMAL(5, 2) DEFAULT 2.00,
  platform_fee DECIMAL(20, 8),
  node_payment DECIMAL(20, 8),
  
  -- Status
  status VARCHAR(20) DEFAULT 'locked', -- 'locked', 'released', 'refunded', 'disputed', 'slashed'
  
  -- Conditions
  release_conditions JSONB,
  -- { "task_completion": true, "result_verification": true, "timeout_hours": 72 }
  
  -- Transactions
  lock_tx_hash VARCHAR(66),
  release_tx_hash VARCHAR(66),
  
  -- Timestamps
  locked_at TIMESTAMP DEFAULT NOW(),
  released_at TIMESTAMP,
  timeout_at TIMESTAMP,
  
  -- Dispute handling
  disputed BOOLEAN DEFAULT false,
  dispute_reason TEXT,
  dispute_resolved_at TIMESTAMP,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_escrows_task ON escrows(task_id);
CREATE INDEX idx_escrows_status ON escrows(status);
CREATE INDEX idx_escrows_timeout ON escrows(timeout_at);
