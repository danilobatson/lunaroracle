import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Analyze crypto data and generate prediction
  async generatePrediction(symbol: string, socialData: any): Promise<{
    prediction: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    reasoning: string;
  }> {
    try {
      // Safely extract data using actual LunarCrush properties
      const price = socialData?.price || 'unknown';
      const change24h = socialData?.percent_change_24h || 0;
      const change7d = socialData?.percent_change_7d || 0;
      const galaxyScore = socialData?.galaxy_score || 'unknown';
      const altRank = socialData?.alt_rank || 'unknown';
      const marketCapRank = socialData?.market_cap_rank || 'unknown';
      const volatility = socialData?.volatility || 'unknown';
      const volume24h = socialData?.volume_24h || 'unknown';
      const marketCap = socialData?.market_cap || 'unknown';

      const prompt = `
You are LunarOracle, an expert crypto analyst. Analyze this real social and market data for ${symbol} and provide a prediction.

Data:
- Price: $${price}
- 24h Change: ${change24h}%
- 7d Change: ${change7d}%
- Galaxy Score: ${galaxyScore}/100 (social intelligence score)
- Alt Rank: ${altRank} (lower is better)
- Market Cap Rank: ${marketCapRank}
- Volatility: ${volatility}
- Volume 24h: $${volume24h}
- Market Cap: $${marketCap}

Provide your analysis in this exact JSON format:
{
  "prediction": "bullish|bearish|neutral",
  "confidence": 0.XX,
  "reasoning": "Your detailed analysis based on the data"
}

Focus on price momentum, market position, and galaxy score trends. Be specific about why the data supports your prediction.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            prediction: parsed.prediction,
            confidence: Math.min(Math.max(parsed.confidence, 0), 1), // Ensure 0-1 range
            reasoning: parsed.reasoning
          };
        }
      } catch (parseError) {
        console.warn('Could not parse JSON from Gemini response, using fallback');
      }

      // Fallback if JSON parsing fails
      return {
        prediction: 'neutral' as const,
        confidence: 0.5,
        reasoning: text || 'Analysis generated but formatting issue occurred'
      };

    } catch (error) {
      console.error('Gemini prediction error:', error);
      throw new Error(`Failed to generate AI prediction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate chat response based on user message and crypto context
  async generateChatResponse(message: string, cryptoContext?: any): Promise<string> {
    try {
      let prompt = `
You are LunarOracle, an expert crypto analyst AI. Respond to this user message: "${message}"

Your personality:
- Expert in cryptocurrency markets and social sentiment analysis
- Use real data and insights when possible
- Be helpful, informative, and engaging
- Keep responses concise but insightful
- Reference specific metrics when relevant

`;

      if (cryptoContext && cryptoContext.topCryptos) {
        prompt += `
Current market context you can reference:
- Popular cryptos: ${cryptoContext.topCryptos}
- Market sentiment: Generally positive based on recent data
- Use specific data points when they're relevant to the user's question

`;
      }

      prompt += `
Respond naturally as LunarOracle. If the user asks about specific cryptocurrencies, provide insights based on social sentiment and market data.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Gemini chat error:', error);
      throw new Error(`Failed to generate chat response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Health check for Gemini service
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Hello, respond with just "OK"');
      const response = await result.response;
      return response.text().includes('OK');
    } catch (error) {
      console.error('Gemini health check failed:', error);
      return false;
    }
  }
}

// Factory function
export function createGeminiService(apiKey?: string): GeminiService {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error('Gemini API key is required. Set GEMINI_API_KEY environment variable.');
  }

  return new GeminiService(key);
}

export default createGeminiService;
