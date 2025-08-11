import { LunarCrush } from 'lunarcrush-sdk';

// Simple LunarCrush service using only confirmed working methods
export class LunarCrushService {
  private client: LunarCrush;

  constructor(apiKey: string) {
    this.client = new LunarCrush(apiKey);
  }

  // Get topic data for a cryptocurrency (using confirmed working method)
  async getTopic(symbol: string) {
    try {
      console.log(`Getting topic data for: ${symbol}`);

      // Use the SDK's coins.get method (confirmed to exist)
      const data = await this.client.coins.get(symbol);

      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('LunarCrush topic error:', error);
      throw new Error(`Failed to fetch topic data for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get list of cryptocurrencies (using confirmed working method)
  async getCryptocurrencies(options = {}) {
    try {
      console.log('Getting cryptocurrency list');

      // Use the SDK's coins.list method (confirmed to exist)
      const data = await this.client.coins.list(options);

      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('LunarCrush cryptocurrencies error:', error);
      throw new Error(`Failed to fetch cryptocurrencies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Health check for the service
  async healthCheck() {
    try {
      // Simple test with minimal data to verify API key works
      const data = await this.client.coins.list({ limit: 1 });
      return {
        success: true,
        message: 'LunarCrush SDK is working',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('LunarCrush health check error:', error);
      throw new Error(`LunarCrush SDK health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Factory function to create LunarCrush service
export function createLunarCrushService(apiKey?: string): LunarCrushService {
  const key = apiKey || process.env.LUNARCRUSH_API_KEY;

  if (!key) {
    throw new Error('LunarCrush API key is required. Set LUNARCRUSH_API_KEY environment variable.');
  }

  return new LunarCrushService(key);
}

export default createLunarCrushService;
