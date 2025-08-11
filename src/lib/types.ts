// Core prediction interfaces
export interface PredictionRequest {
  cryptoSymbol: string;
  timeframe: number; // 24, 48, 72 hours
}

export interface PredictionResponse {
  id?: string;
  prediction: 'bullish' | 'bearish' | 'neutral';
  confidence: number; // 0-100
  targetChange: number; // expected % change
  reasoning: string;
  galaxyScore: number;
  socialDominance: number;
  sentiment: number;
  expiresAt: Date;
  createdAt: Date;
}

// LunarCrush data interfaces
export interface LunarCrushMetrics {
  symbol: string;
  galaxy_score: number;
  social_dominance: number;
  sentiment: number;
  posts_active: number;
  contributors_active: number;
  interactions: number;
  price: number;
  percent_change_24h: number;
}

export interface SocialPost {
  id: string;
  text: string;
  sentiment: number;
  interactions: number;
  created_time: string;
  user_followers: number;
}

// Gemini AI interfaces
export interface GeminiPredictionInput {
  cryptoSymbol: string;
  socialData: LunarCrushMetrics;
  historicalAccuracy: number;
  timeframe: number;
}

export interface GeminiPredictionOutput {
  prediction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  targetChange: number;
  reasoning: string;
  keyFactors: string[];
  riskFactors: string[];
}

// Database interfaces
export interface DbPrediction {
  id: number;
  crypto_symbol: string;
  prediction_type: string;
  confidence_score: number;
  target_change: number;
  timeframe_hours: number;
  reasoning: string;
  galaxy_score: number;
  social_dominance: number;
  sentiment_spike: number;
  created_at: string;
  expires_at: string;
  status: string;
  actual_change?: number;
  accuracy_score?: number;
}

export interface DbSocialMetrics {
  id: number;
  crypto_symbol: string;
  galaxy_score: number;
  social_dominance: number;
  sentiment_score: number;
  posts_active: number;
  contributors_active: number;
  interactions: number;
  price_at_time: number;
  timestamp: string;
}

// Agent interaction interfaces
export interface AgentResponse {
  message: string;
  prediction?: PredictionResponse;
  confidence: number;
  emoji: string;
  timestamp: Date;
}

export interface CreatorBidMessage {
  userId: string;
  message: string;
  timestamp: Date;
}

// Configuration interfaces
export interface AppConfig {
  environment: 'development' | 'production';
  lunarCrushApiKey: string;
  geminiApiKey: string;
  creatorBidApiKey?: string;
}

// Error interfaces
export interface AppError {
  message: string;
  code: string;
  details?: any;
}
