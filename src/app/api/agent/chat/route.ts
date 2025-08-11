import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      );
    }

    // For now, return a simple response
    // TODO: Implement actual AI agent logic
    const response = {
      response: `I received your message about: "${message}". As LunarOracle, I'm analyzing crypto market data to provide insights.`,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      status: 'mock_response'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Agent chat route error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
