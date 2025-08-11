// Connect to Cloudflare D1 database from Vercel using HTTP API
import { DbPrediction, PredictionResponse } from './types';
import { DatabaseInterface } from './database-interface';

// Type the Cloudflare D1 API response
interface D1ApiResponse {
  result: Array<{
    results?: any[];
    success: boolean;
    meta: {
      last_row_id?: number;
      changes?: number;
      duration?: number;
    };
  }>;
  success: boolean;
  errors: any[];
  messages: any[];
}

export class CloudflareD1Service implements DatabaseInterface {
  private accountId: string;
  private databaseId: string;
  private apiToken: string;
  private baseUrl: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    this.databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID!;
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN!;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}`;
  }

  private async query(sql: string, params: any[] = []) {
    try {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params
        }),
      });

      if (!response.ok) {
        throw new Error(`D1 API error: ${response.statusText}`);
      }

      const data = await response.json() as D1ApiResponse;
      
      if (!data.success) {
        throw new Error(`D1 query failed: ${JSON.stringify(data.errors)}`);
      }
      
      return data.result[0]; // D1 returns array of results
    } catch (error: unknown) {
      console.error('D1 query error:', error);
      throw error;
    }
  }

  async storePrediction(prediction: PredictionResponse): Promise<string> {
    const sql = `
      INSERT INTO predictions (
        crypto_symbol, prediction_type, confidence_score, target_change,
        timeframe_hours, reasoning, galaxy_score, social_dominance,
        sentiment_spike, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      prediction.prediction === 'bullish' ? 'bullish' : 
      prediction.prediction === 'bearish' ? 'bearish' : 'neutral',
      prediction.confidence,
      prediction.targetChange,
      24,
      prediction.reasoning,
      prediction.galaxyScore,
      prediction.socialDominance,
      prediction.sentiment,
      prediction.expiresAt.toISOString()
    ];

    const result = await this.query(sql, params);
    return result.meta?.last_row_id?.toString() || '';
  }

  async getPredictions(symbol?: string): Promise<DbPrediction[]> {
    let sql = 'SELECT * FROM predictions';
    let params: any[] = [];

    if (symbol) {
      sql += ' WHERE crypto_symbol = ?';
      params.push(symbol);
    }

    sql += ' ORDER BY created_at DESC LIMIT 50';

    const result = await this.query(sql, params);
    return (result.results || []) as DbPrediction[];
  }

  async storeSocialMetrics(symbol: string, metrics: any): Promise<void> {
    const sql = `
      INSERT INTO social_metrics (
        crypto_symbol, galaxy_score, social_dominance, sentiment_score,
        posts_active, contributors_active, interactions, price_at_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      symbol,
      metrics.galaxy_score,
      metrics.social_dominance,
      metrics.sentiment,
      metrics.posts_active,
      metrics.contributors_active,
      metrics.interactions,
      metrics.price
    ];

    await this.query(sql, params);
  }

  async storeAgentInteraction(userId: string, message: string, response: string, confidence: number): Promise<void> {
    const sql = `
      INSERT INTO agent_interactions (user_id, interaction_type, message, response, confidence)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await this.query(sql, [userId, 'chat', message, response, confidence]);
  }
}
