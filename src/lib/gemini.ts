import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiPredictionOutput } from "./types";

export class GeminiService {
  public model: any;
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.3,
        topK: 10,
        topP: 0.8,
        maxOutputTokens: 1500,
      }
    });
  }

  async generatePrediction(input: any): Promise<GeminiPredictionOutput> {
    const prompt = buildIntelligentPredictionPrompt(input);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response, handling markdown formatting
      const cleanedText = parseJSONFromMarkdown(text);
      const prediction = JSON.parse(cleanedText);
      
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
}

// Modern function syntax - let the LLM do the analysis!
const buildIntelligentPredictionPrompt = (input: any): string => {
  const { 
    cryptoSymbol, 
    socialData, 
    historicalAccuracy, 
    timeframe, 
    recentPostsCount, 
    recentPosts 
  } = input;
  
  // Include sample posts for richer context
  const samplePostsText = recentPosts?.length > 0 
    ? `\nRECENT SAMPLE POSTS:\n${recentPosts.map((post: any, i: number) => 
        `${i + 1}. "${post.text}" (${post.interactions} interactions)`
      ).join('\n')}`
    : '';

  return `You are LunarOracle, an expert crypto prediction AI. Analyze this comprehensive social sentiment data for ${cryptoSymbol.toUpperCase()} and make an intelligent prediction.

SOCIAL DATA ANALYSIS:
- Galaxy Score: ${socialData.galaxy_score}/100 (proprietary LunarCrush metric combining price performance, social volume, and market correlation)
- Social Dominance: ${socialData.social_dominance}% (share of total crypto social conversations)
- Sentiment: ${socialData.sentiment}% (bullish vs bearish from actual social posts)
- Current Price: $${socialData.price}
- 24h Change: ${socialData.percent_change_24h}%
- Social Volume: ${socialData.posts_active} mentions, ${socialData.interactions} total interactions
- Active Creators: ${socialData.contributors_active} unique accounts posting
- Posts in last 24h: ${recentPostsCount}${samplePostsText}

YOUR ANALYSIS TASK:
Intelligently analyze ALL these metrics together. Consider:
1. **Galaxy Score patterns**: What does this score suggest about momentum?
2. **Social Dominance**: Is this high/low relative to market cap? What does it indicate?
3. **Sentiment vs Reality**: Does sentiment align with price action? Any disconnects?
4. **Volume Quality**: High interactions per post = quality engagement
5. **Creator Activity**: Are influencers talking about this asset?
6. **Recent Posts**: What themes emerge from actual social content?

PREDICTION GUIDELINES:
- Historical accuracy for this asset: ${historicalAccuracy}%
- Timeframe: ${timeframe} hours
- Only predict if confidence ≥ 65%
- Consider macro crypto market conditions
- Weight social signals appropriately - don't overfit to one metric
- Think about contrarian vs momentum plays

Analyze these signals intelligently and provide your prediction:

{
  "prediction": "bullish|bearish|neutral",
  "confidence": 75,
  "targetChange": 5.2,
  "reasoning": "Clear, intelligent analysis based on the social data patterns you observed",
  "keyFactors": ["Specific social signals that drove your decision"],
  "riskFactors": ["What could invalidate this prediction"]
}

Respond with ONLY the JSON object - no markdown formatting.`;
};

// Utility function with arrow syntax
const parseJSONFromMarkdown = (text: string): string => {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return jsonMatch ? jsonMatch[1].trim() : text.trim();
};
