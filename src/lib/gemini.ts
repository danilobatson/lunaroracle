import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiPredictionInput, GeminiPredictionOutput } from '../types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.3, // Lower for more consistent predictions
        topK: 10,
        topP: 0.8,
        maxOutputTokens: 1000,
      }
    });
  }

  async generatePrediction(input: GeminiPredictionInput): Promise<GeminiPredictionOutput> {
    const prompt = this.buildPredictionPrompt(input);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Strip markdown code blocks if present
      text = text.replace(/```json\s*|\s*```/g, '').trim();
      
      // Parse JSON response from Gemini
      const prediction = JSON.parse(text);
      
      return {
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        targetChange: prediction.targetChange,
        reasoning: prediction.reasoning,
        keyFactors: prediction.keyFactors || [],
        riskFactors: prediction.riskFactors || [],
      };
    } catch (error) {
      console.error('Error generating prediction:', error);
      throw error;
    }
  }

  private buildPredictionPrompt(input: GeminiPredictionInput): string {
    return `
You are LunarOracle, an AI that predicts cryptocurrency price movements using social sentiment data.

Given the following social data for ${input.cryptoSymbol}:
- Galaxy Score: ${input.socialData.galaxy_score}/100 (combines price, sentiment, social correlation)
- Social Dominance: ${input.socialData.social_dominance}% (share of crypto conversations)
- Sentiment Score: ${input.socialData.sentiment}/100 (bullish vs bearish ratio)
- Recent social volume: ${input.socialData.posts_active} mentions
- Current price: $${input.socialData.price}
- 24h price change: ${input.socialData.percent_change_24h}%

Historical context:
- Your previous predictions accuracy: ${input.historicalAccuracy}%
- Prediction timeframe: ${input.timeframe} hours

Provide a prediction with:
1. Direction: "bullish", "bearish", or "neutral"
2. Confidence: 0-100 (only make predictions above 60% confidence)
3. Target: expected % change in next ${input.timeframe} hours
4. Reasoning: 2-3 sentences explaining the key factors
5. Key factors: Array of main bullish/bearish indicators
6. Risk factors: Array of what could invalidate this prediction

Respond ONLY with valid JSON (no markdown formatting):
{
  "prediction": "bullish|bearish|neutral",
  "confidence": 75,
  "targetChange": 5.2,
  "reasoning": "Strong galaxy score spike above 80 combined with increasing social dominance suggests growing retail interest.",
  "keyFactors": ["Galaxy score spike to 85", "Social dominance increased 40%", "Positive sentiment at 72"],
  "riskFactors": ["Low trading volume", "Overall market bearish trend"]
}
`;
  }
}
