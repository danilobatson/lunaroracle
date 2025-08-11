import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;

    // Get LunarCrush API key from environment
    const apiKey = process.env.LUNARCRUSH_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'LunarCrush API key not configured' },
        { status: 500 }
      );
    }

    // Simple fetch to LunarCrush API (no complex SDK needed for basic calls)
    const response = await fetch(
      `https://lunarcrush.com/api4/public/coins/${symbol}?data=market,social&key=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `LunarCrush API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Topic route error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch topic data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
