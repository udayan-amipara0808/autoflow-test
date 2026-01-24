CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'escrow_lock', 'payment_release', 'refund', 'slash'
  
  -- Parties
  from_address VARCHAR(42) NOT NULL,
  to_address VARCHAR(42) NOT NULL,
  agent_id UUID REFERENCES agents(id),
  node_id UUID REFERENCES nodes(id),
  task_id UUID REFERENCES tasks(id),
  
  -- Amount
  amount DECIMAL(20, 8) NOT NULL,
  token_symbol VARCHAR(10) DEFAULT 'MONAD',
  usd_value DECIMAL(20, 2),
  
  -- Blockchain status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
  confirmations INTEGER DEFAULT 0,
  block_number BIGINT,
  gas_used BIGINT,
  gas_price DECIMAL(20, 8),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_payments_tx_hash ON payments(tx_hash);
CREATE INDEX idx_payments_agent ON payments(agent_id);
CREATE INDEX idx_payments_task ON payments(task_id);
CREATE INDEX idx_payments_status ON payments(status);
