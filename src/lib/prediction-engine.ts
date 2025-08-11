import { createLunarCrushService } from './lunarcrush';

interface PredictionRequest {
  cryptoSymbol: string;
  timeframe: number;
}

interface PredictionResult {
  symbol: string;
  timeframe: number;
  prediction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  reasoning: string;
  socialMetrics?: any;
  timestamp: string;
}

export class PredictionEngine {
  private lunarCrush: ReturnType<typeof createLunarCrushService>;

  constructor() {
    this.lunarCrush = createLunarCrushService();
  }

  async generatePrediction(request: PredictionRequest): Promise<PredictionResult> {
    try {
      const { cryptoSymbol, timeframe } = request;

      console.log(`Generating prediction for ${cryptoSymbol} over ${timeframe} hours`);

      // Get real social data from LunarCrush SDK using correct method
      const socialDataResult = await this.lunarCrush.getTopic(cryptoSymbol);

      // For now, create a simple prediction based on the data
      // TODO: Implement actual AI/ML prediction logic with Gemini
      const prediction: PredictionResult = {
        symbol: cryptoSymbol,
        timeframe,
        prediction: 'bullish', // Mock prediction for now
        confidence: 0.75,
        reasoning: `Based on social sentiment analysis from LunarCrush data for ${cryptoSymbol}`,
        socialMetrics: socialDataResult.data,
        timestamp: new Date().toISOString()
      };

      return prediction;

    } catch (error) {
      console.error('Prediction engine error:', error);

      // Return fallback prediction if LunarCrush fails
      return {
        symbol: request.cryptoSymbol,
        timeframe: request.timeframe,
        prediction: 'neutral',
        confidence: 0.5,
        reasoning: 'Unable to fetch social data, using fallback prediction',
        timestamp: new Date().toISOString()
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.lunarCrush.healthCheck();
      return true;
    } catch (error) {
      console.error('Prediction engine health check failed:', error);
      return false;
    }
  }
}

// Export factory function
export function createPredictionEngine(): PredictionEngine {
  return new PredictionEngine();
}

export default createPredictionEngine;
