import { NextRequest, NextResponse } from 'next/server';
import { LunarCrushService } from '@/lib/lunarcrush';

export async function GET(
	request: NextRequest,
	{ params }: { params: { symbol: string } }
) {
	try {
		const { symbol } = params;
		const lunarCrush = new LunarCrushService(process.env.LUNARCRUSH_API_KEY!);

		const topicData = await lunarCrush.getTopicData(symbol);
		await lunarCrush.close();

		return NextResponse.json({ success: true, data: topicData });
	} catch (error) {
		console.error('Error fetching topic data:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch topic data',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
