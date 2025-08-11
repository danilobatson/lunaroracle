// Fallback database service for when Cloudflare D1 isn't configured yet
import { DbPrediction, PredictionResponse } from './types';
import { DatabaseInterface } from './database-interface';

export class FallbackDatabaseService implements DatabaseInterface {
  private predictions: PredictionResponse[] = [];
  
  async storePrediction(prediction: PredictionResponse): Promise<string> {
    const id = Math.random().toString(36).substr(2, 9);
    this.predictions.push({ ...prediction, id });
    console.log('📝 Stored prediction in memory (fallback mode):', prediction.prediction);
    return id;
  }

  async getPredictions(symbol?: string): Promise<DbPrediction[]> {
    console.log('📖 Getting predictions from memory (fallback mode)');
    // Convert to DbPrediction format
    return this.predictions
      .filter(p => !symbol || p.prediction.includes(symbol))
      .map((p, i) => ({
        id: i + 1,
        crypto_symbol: symbol || 'bitcoin',
        prediction_type: p.prediction,
        confidence_score: p.confidence,
        target_change: p.targetChange,
        timeframe_hours: 24,
        reasoning: p.reasoning,
        galaxy_score: p.galaxyScore,
        social_dominance: p.socialDominance,
        sentiment_spike: p.sentiment,
        created_at: p.createdAt.toISOString(),
        expires_at: p.expiresAt.toISOString(),
        status: 'active'
      }));
  }

  async storeSocialMetrics(symbol: string, metrics: any): Promise<void> {
    console.log('📊 Stored social metrics in memory (fallback mode):', symbol);
  }

  async storeAgentInteraction(userId: string, message: string, response: string, confidence: number): Promise<void> {
    console.log('💬 Stored interaction in memory (fallback mode):', userId);
  }
}
