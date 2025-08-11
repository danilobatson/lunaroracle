import { LunarCrushMetrics, SocialPost } from '../types';

export class LunarCrushService {
  private apiKey: string;
  private baseUrl = 'https://lunarcrush.com/api4'\;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getTopicData(symbol: string): Promise<LunarCrushMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/public/topic/${symbol}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`LunarCrush API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        symbol: data.symbol || symbol,
        galaxy_score: data.galaxy_score || 0,
        social_dominance: data.social_dominance || 0,
        sentiment: data.sentiment || 50,
        posts_active: data.posts_active || 0,
        contributors_active: data.contributors_active || 0,
        interactions: data.interactions || 0,
        price: data.close || 0,
        percent_change_24h: data.percent_change_24h || 0,
      };
    } catch (error) {
      console.error('Error fetching topic data:', error);
      throw error;
    }
  }

  async getTopicPosts(symbol: string, interval: string = '24h'): Promise<SocialPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/public/topic/${symbol}/posts/${interval}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`LunarCrush API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.data?.map((post: any) => ({
        id: post.id,
        text: post.text,
        sentiment: post.sentiment || 50,
        interactions: post.interactions || 0,
        created_time: post.created_time,
        user_followers: post.user_followers || 0,
      })) || [];
    } catch (error) {
      console.error('Error fetching topic posts:', error);
      throw error;
    }
  }

  async getTimeSeries(symbol: string, interval: string = '1w'): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/public/topic/${symbol}/time-series/${interval}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`LunarCrush API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching time series:', error);
      throw error;
    }
  }
}
