import { createLunarCrushMCP } from 'lunarcrush-sdk';
import { LunarCrushMetrics, SocialPost } from '../types';

export class LunarCrushService {
  private apiKey: string;
  private mcp: any = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async initMCP() {
    if (!this.mcp) {
      this.mcp = await createLunarCrushMCP(this.apiKey);
    }
    return this.mcp;
  }

  async getTopicData(symbol: string): Promise<LunarCrushMetrics> {
    try {
      const mcp = await this.initMCP();
      
      // Use the SDK's topic method for full topic details
      const topicData = await mcp.topics(symbol);
      
      // Parse the response - SDK returns structured data
      const data = topicData.data?.[0] || topicData;
      
      return {
        symbol: data.symbol || symbol,
        galaxy_score: data.galaxy_score || data.gs || 0,
        social_dominance: data.social_dominance || data.sd || 0,
        sentiment: data.sentiment || data.ss || 50,
        posts_active: data.posts_active || data.pa || 0,
        contributors_active: data.contributors_active || data.ca || 0,
        interactions: data.interactions || data.i || 0,
        price: data.close || data.price || data.p || 0,
        percent_change_24h: data.percent_change_24h || data.pc24h || 0,
      };
    } catch (error) {
      console.error('Error fetching topic data with SDK:', error);
      throw error;
    }
  }

  async getTopicPosts(symbol: string, interval: string = '24h'): Promise<SocialPost[]> {
    try {
      const mcp = await this.initMCP();
      
      // Use SDK's topicPosts method
      const postsData = await mcp.topicPosts(symbol, { interval });
      const posts = postsData.data || [];
      
      return posts.map((post: any) => ({
        id: post.id || Math.random().toString(),
        text: post.text || post.content || '',
        sentiment: post.sentiment || 50,
        interactions: post.interactions || post.likes || post.retweets || 0,
        created_time: post.created_time || post.created_at || new Date().toISOString(),
        user_followers: post.user_followers || post.followers || 0,
      }));
    } catch (error) {
      console.error('Error fetching topic posts with SDK:', error);
      return [];
    }
  }

  async getTimeSeries(symbol: string, interval: string = '1w'): Promise<any[]> {
    try {
      const mcp = await this.initMCP();
      
      // Use SDK's timeSeries method - returns TSV format
      const timeSeriesData = await mcp.timeSeries(symbol, { interval });
      
      // Parse TSV data if needed, or return as-is
      return timeSeriesData.data || [];
    } catch (error) {
      console.error('Error fetching time series with SDK:', error);
      return [];
    }
  }

  async getCryptocurrencies(options: any = {}): Promise<any[]> {
    try {
      const mcp = await this.initMCP();
      
      // Use SDK's cryptocurrencies method for market data
      const cryptoData = await mcp.cryptocurrencies(options);
      return cryptoData.data || [];
    } catch (error) {
      console.error('Error fetching cryptocurrencies with SDK:', error);
      return [];
    }
  }

  async searchTopics(query: string): Promise<any[]> {
    try {
      const mcp = await this.initMCP();
      
      // Use SDK's universal search
      const searchData = await mcp.search(query);
      return searchData.data || [];
    } catch (error) {
      console.error('Error searching topics with SDK:', error);
      return [];
    }
  }

  async close(): Promise<void> {
    if (this.mcp) {
      await this.mcp.close();
      this.mcp = null;
    }
  }
}
