CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'autonomous_ai', 'api_service', 'human_operator'
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  private_key_encrypted TEXT, -- Encrypted with master key
  api_key VARCHAR(64) UNIQUE NOT NULL,
  balance DECIMAL(20, 8) DEFAULT 0,
  total_tasks_submitted INTEGER DEFAULT 0,
  success_rate DECIMAL(5, 2) DEFAULT 100.00,
  reputation_score DECIMAL(5, 2) DEFAULT 50.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_agents_wallet ON agents(wallet_address);
CREATE INDEX idx_agents_api_key ON agents(api_key);
