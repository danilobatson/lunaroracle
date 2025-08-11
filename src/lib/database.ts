import { DbPrediction, DbSocialMetrics, PredictionResponse } from '../types';

export class DatabaseService {
  private db: D1Database;

  constructor(database: D1Database) {
    this.db = database;
  }

  async storePrediction(prediction: PredictionResponse): Promise<string> {
    try {
      const result = await this.db.prepare(`
        INSERT INTO predictions (
          crypto_symbol, prediction_type, confidence_score, target_change,
          timeframe_hours, reasoning, galaxy_score, social_dominance,
          sentiment_spike, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        prediction.prediction === 'bullish' ? 'bullish' : 
        prediction.prediction === 'bearish' ? 'bearish' : 'neutral',
        prediction.confidence,
        prediction.targetChange,
        24, // Default 24h timeframe
        prediction.reasoning,
        prediction.galaxyScore,
        prediction.socialDominance,
        prediction.sentiment,
        prediction.expiresAt.toISOString()
      ).run();

      return result.meta.last_row_id?.toString() || '';
    } catch (error) {
      console.error('Error storing prediction:', error);
      throw error;
    }
  }

  async getPredictions(symbol?: string): Promise<DbPrediction[]> {
    try {
      let query = 'SELECT * FROM predictions';
      let params: any[] = [];

      if (symbol) {
        query += ' WHERE crypto_symbol = ?';
        params.push(symbol);
      }

      query += ' ORDER BY created_at DESC LIMIT 50';

      const result = await this.db.prepare(query).bind(...params).all();
      return result.results as DbPrediction[];
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  }

  async storeSocialMetrics(symbol: string, metrics: any): Promise<void> {
    try {
      await this.db.prepare(`
        INSERT INTO social_metrics (
          crypto_symbol, galaxy_score, social_dominance, sentiment_score,
          posts_active, contributors_active, interactions, price_at_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        symbol,
        metrics.galaxy_score,
        metrics.social_dominance,
        metrics.sentiment,
        metrics.posts_active,
        metrics.contributors_active,
        metrics.interactions,
        metrics.price
      ).run();
    } catch (error) {
      console.error('Error storing social metrics:', error);
      throw error;
    }
  }

  async storeAgentInteraction(userId: string, message: string, response: string, confidence: number): Promise<void> {
    try {
      await this.db.prepare(`
        INSERT INTO agent_interactions (user_id, interaction_type, message, response, confidence)
        VALUES (?, ?, ?, ?, ?)
      `).bind(userId, 'chat', message, response, confidence).run();
    } catch (error) {
      console.error('Error storing agent interaction:', error);
      throw error;
    }
  }
}
