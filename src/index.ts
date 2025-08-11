import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { LunarCrushService } from './lib/lunarcrush';
import { GeminiService } from './lib/gemini';
import { DatabaseService } from './lib/database';
import { PredictionEngine } from './lib/prediction-engine';
import { AgentResponse, PredictionRequest } from './types';

// Cloudflare Worker bindings
interface Bindings {
  DB: D1Database;
  CACHE: KVNamespace;
  LUNARCRUSH_API_KEY: string;
  GEMINI_API_KEY: string;
  ENVIRONMENT: string;
}

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    service: 'LunarOracle API',
    version: '0.1.0',
    timestamp: new Date().toISOString() 
  });
});

// Get topic data endpoint
app.get('/topic/:symbol', async (c) => {
  try {
    const symbol = c.req.param('symbol');
    const lunarCrush = new LunarCrushService(c.env.LUNARCRUSH_API_KEY);
    
    const topicData = await lunarCrush.getTopicData(symbol);
    await lunarCrush.close();
    
    return c.json({ success: true, data: topicData });
  } catch (error) {
    console.error('Error fetching topic data:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch topic data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Generate prediction endpoint
app.post('/predict', async (c) => {
  try {
    const request = await c.req.json() as PredictionRequest;
    const { cryptoSymbol, timeframe } = request;
    
    // Initialize services
    const lunarCrush = new LunarCrushService(c.env.LUNARCRUSH_API_KEY);
    const gemini = new GeminiService(c.env.GEMINI_API_KEY);
    const database = new DatabaseService(c.env.DB);
    const predictionEngine = new PredictionEngine(lunarCrush, gemini, database);
    
    // Generate prediction
    const prediction = await predictionEngine.generatePrediction(cryptoSymbol, timeframe);
    
    // Cleanup
    await lunarCrush.close();
    
    return c.json({ success: true, data: prediction });
  } catch (error) {
    console.error('Error generating prediction:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to generate prediction',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Agent chat endpoint for Creator.bid integration
app.post('/agent/chat', async (c) => {
  try {
    const { message, userId } = await c.req.json();
    
    // Initialize services
    const lunarCrush = new LunarCrushService(c.env.LUNARCRUSH_API_KEY);
    const gemini = new GeminiService(c.env.GEMINI_API_KEY);
    const database = new DatabaseService(c.env.DB);
    
    // Process agent response (to be implemented)
    const response: AgentResponse = {
      message: `🔮 LunarOracle here! You asked: "${message}". Let me analyze the crypto social sentiment...`,
      confidence: 85,
      emoji: '🔮',
      timestamp: new Date()
    };
    
    // Store interaction
    await database.storeAgentInteraction(userId, message, response.message, response.confidence);
    
    // Cleanup
    await lunarCrush.close();
    
    return c.json({ success: true, data: response });
  } catch (error) {
    console.error('Error processing agent chat:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to process chat',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get predictions history
app.get('/predictions/:symbol?', async (c) => {
  try {
    const symbol = c.req.param('symbol');
    const database = new DatabaseService(c.env.DB);
    
    const predictions = await database.getPredictions(symbol);
    
    return c.json({ success: true, data: predictions });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch predictions',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default app;
