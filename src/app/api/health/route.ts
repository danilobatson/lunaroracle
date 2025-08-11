import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simple health check - no authentication required
    return NextResponse.json({
      status: 'healthy',
      service: 'LunarOracle API',
      timestamp: new Date().toISOString(),
      version: '0.3.0'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
