-- Predictions tracking table
CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crypto_symbol TEXT NOT NULL,
  prediction_type TEXT NOT NULL, -- 'bullish', 'bearish', 'neutral'
  confidence_score INTEGER NOT NULL, -- 0-100
  target_change REAL NOT NULL, -- expected % change
  timeframe_hours INTEGER NOT NULL, -- 24, 48, 72
  reasoning TEXT NOT NULL,
  galaxy_score INTEGER,
  social_dominance REAL,
  sentiment_spike REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'resolved', 'expired'
  actual_change REAL, -- filled when resolved
  accuracy_score REAL -- calculated when resolved
);

-- Social metrics tracking
CREATE TABLE IF NOT EXISTS social_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crypto_symbol TEXT NOT NULL,
  galaxy_score INTEGER,
  social_dominance REAL,
  sentiment_score REAL,
  posts_active INTEGER,
  contributors_active INTEGER,
  interactions INTEGER,
  price_at_time REAL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agent performance tracking
CREATE TABLE IF NOT EXISTS agent_performance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  total_predictions INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  accuracy_rate REAL DEFAULT 0,
  avg_confidence REAL DEFAULT 0,
  total_followers INTEGER DEFAULT 0,
  engagement_rate REAL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Creator.bid integration tracking
CREATE TABLE IF NOT EXISTS agent_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  interaction_type TEXT, -- 'query', 'prediction_request', 'follow'
  message TEXT,
  response TEXT,
  confidence INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_predictions_symbol ON predictions(crypto_symbol);
CREATE INDEX IF NOT EXISTS idx_predictions_created ON predictions(created_at);
CREATE INDEX IF NOT EXISTS idx_predictions_status ON predictions(status);
CREATE INDEX IF NOT EXISTS idx_social_metrics_symbol ON social_metrics(crypto_symbol);
CREATE INDEX IF NOT EXISTS idx_social_metrics_timestamp ON social_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_user ON agent_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_timestamp ON agent_interactions(timestamp);
