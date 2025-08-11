import { LunarCrushService } from './lunarcrush';
import { GeminiService } from './gemini';
import { DatabaseInterface } from './database-interface';
import { PredictionResponse } from './types';

// Modern ES6+ functions instead of classes
export const generatePrediction = async (
  cryptoSymbol: string,
  timeframe: number = 24,
  lunarCrush: LunarCrushService,
  gemini: GeminiService,
  database: DatabaseInterface
): Promise<PredictionResponse> => {
  try {
    // Get real social data from LunarCrush SDK
    const socialData = await lunarCrush.getTopicData(cryptoSymbol);
    
    // Store social metrics for historical tracking
    await database.storeSocialMetrics(cryptoSymbol, socialData);
    
    // Get recent posts for additional context
    const recentPosts = await lunarCrush.getTopicPosts(cryptoSymbol, '24h');
    
    // Get historical accuracy (let DB handle the calculation)
    const historicalAccuracy = await getHistoricalAccuracy(cryptoSymbol, database);
    
    // Let the LLM do ALL the analysis - no hardcoded rules!
    const aiPrediction = await gemini.generatePrediction({
      cryptoSymbol,
      socialData,
      historicalAccuracy,
      timeframe,
      recentPostsCount: recentPosts.length,
      recentPosts: recentPosts.slice(0, 5) // Include sample posts for context
    });
    
    // Create prediction response with clean destructuring
    const prediction: PredictionResponse = {
      ...aiPrediction,
      galaxyScore: socialData.galaxy_score,
      socialDominance: socialData.social_dominance,
      sentiment: socialData.sentiment,
      expiresAt: new Date(Date.now() + timeframe * 60 * 60 * 1000),
      createdAt: new Date()
    };
    
    // Store prediction and get ID
    const predictionId = await database.storePrediction(prediction);
    
    return { ...prediction, id: predictionId };
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating prediction:', error);
    throw new Error(`Failed to generate prediction for ${cryptoSymbol}: ${errorMessage}`);
  }
};

export const generateAgentResponse = async (
  userMessage: string,
  lunarCrush: LunarCrushService,
  gemini: GeminiService,
  database: DatabaseInterface,
  cryptoSymbol?: string
): Promise<string> => {
  try {
    if (cryptoSymbol) {
      // Generate prediction-based response
      const prediction = await generatePrediction(cryptoSymbol, 24, lunarCrush, gemini, database);
      
      // Let the LLM format the response naturally
      const responsePrompt = `You are LunarOracle, a crypto prediction AI agent. Format this prediction data into a natural, engaging response:

Crypto: ${cryptoSymbol.toUpperCase()}
Prediction: ${prediction.prediction} (${prediction.confidence}% confidence)
Target Change: ${prediction.targetChange > 0 ? '+' : ''}${prediction.targetChange.toFixed(1)}% in 24h
Galaxy Score: ${prediction.galaxyScore}/100
Social Dominance: ${prediction.socialDominance}%
Sentiment: ${prediction.sentiment}%
Reasoning: ${prediction.reasoning}

Write a concise, engaging response (3-4 lines max) with emojis. Include the key data points but make it conversational.`;

      const result = await gemini.model.generateContent(responsePrompt);
      const response = await result.response;
      return response.text();
    } else {
      // General welcome response
      return `🔮 LunarOracle here! I analyze crypto price movements using social sentiment data. 

Ask me about any major cryptocurrency like:
- "What's your prediction for Bitcoin?"
- "How does ETH look right now?"  
- "Should I buy SOL?"

I combine Galaxy Scores, social dominance, sentiment analysis, and AI to give you data-driven predictions! 📊✨`;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating agent response:', error);
    return `🔮 LunarOracle here! I'm having trouble accessing the social data right now, but I'm working to get back online. Try asking me about a specific crypto in a moment! 🛠️`;
  }
};

// Helper function with modern syntax
const getHistoricalAccuracy = async (cryptoSymbol: string, database: DatabaseInterface): Promise<number> => {
  try {
    const recentPredictions = await database.getPredictions(cryptoSymbol);
    const resolvedPredictions = recentPredictions.filter(({ accuracy_score }) => accuracy_score !== null);
    
    if (resolvedPredictions.length === 0) return 70; // Default starting accuracy
    
    const avgAccuracy = resolvedPredictions.reduce((sum, { accuracy_score }) => sum + (accuracy_score || 0), 0) / resolvedPredictions.length;
    
    return Math.round(avgAccuracy);
  } catch (error: unknown) {
    console.error('Error getting historical accuracy:', error);
    return 70; // Default fallback
  }
};
