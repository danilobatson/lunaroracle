import { createLunarCrushService } from './lunarcrush';
import { createGeminiService } from './gemini';

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
  socialMetrics: any;
  timestamp: string;
  source: 'ai_analysis';
}

export class PredictionEngine {
  private lunarCrush: ReturnType<typeof createLunarCrushService>;
  private gemini: ReturnType<typeof createGeminiService>;

  constructor() {
    this.lunarCrush = createLunarCrushService();
    this.gemini = createGeminiService();
  }

  async generatePrediction(request: PredictionRequest): Promise<PredictionResult> {
    try {
      const { cryptoSymbol, timeframe } = request;

      console.log(`🤖 Generating AI prediction for ${cryptoSymbol} over ${timeframe} hours`);

      // Get real social data from LunarCrush SDK
      const socialDataResult = await this.lunarCrush.getTopic(cryptoSymbol);
      const socialData = socialDataResult?.data;

      if (!socialData) {
        throw new Error('No social data available for prediction');
      }

      console.log(`📊 Got social data for ${cryptoSymbol}:`, {
        price: socialData.price || 'unknown',
        galaxy_score: socialData.galaxy_score || 'unknown',
        name: socialData.name || 'unknown'
      });

      // Generate real AI prediction using Gemini
      const aiPrediction = await this.gemini.generatePrediction(cryptoSymbol, socialData);

      console.log(`🧠 AI prediction generated:`, aiPrediction);

      const prediction: PredictionResult = {
        symbol: cryptoSymbol,
        timeframe,
        prediction: aiPrediction.prediction,
        confidence: aiPrediction.confidence,
        reasoning: aiPrediction.reasoning,
        socialMetrics: socialData,
        timestamp: new Date().toISOString(),
        source: 'ai_analysis'
      };

      return prediction;

    } catch (error) {
      console.error('Prediction engine error:', error);

      // If AI fails, still try to get social data for context
      let socialData = null;
      try {
        const socialDataResult = await this.lunarCrush.getTopic(request.cryptoSymbol);
        socialData = socialDataResult?.data || null;
      } catch (socialError) {
        console.error('Could not fetch social data for fallback:', socialError);
      }

      // Return error prediction with any available data
      return {
        symbol: request.cryptoSymbol,
        timeframe: request.timeframe,
        prediction: 'neutral',
        confidence: 0.5,
        reasoning: `Unable to generate AI prediction: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        socialMetrics: socialData,
        timestamp: new Date().toISOString(),
        source: 'ai_analysis'
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const lunarCrushOK = await this.lunarCrush.healthCheck();
      const geminiOK = await this.gemini.healthCheck();
      return lunarCrushOK && geminiOK;
    } catch (error) {
      console.error('Prediction engine health check failed:', error);
      return false;
    }
  }
}

export function createPredictionEngine(): PredictionEngine {
  return new PredictionEngine();
}

export default createPredictionEngine;
