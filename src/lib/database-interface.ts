import { DbPrediction, PredictionResponse } from './types';

export interface DatabaseInterface {
  storePrediction(prediction: PredictionResponse): Promise<string>;
  getPredictions(symbol?: string): Promise<DbPrediction[]>;
  storeSocialMetrics(symbol: string, metrics: any): Promise<void>;
  storeAgentInteraction(userId: string, message: string, response: string, confidence: number): Promise<void>;
}
