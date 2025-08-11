import { NextRequest, NextResponse } from 'next/server';
import { CloudflareD1Service } from '@/lib/cloudflare-d1';

export async function GET(
	request: NextRequest,
	{ params }: { params: { symbol: string } }
) {
	try {
		const { symbol } = params;
		const database = new CloudflareD1Service();

		const predictions = await database.getPredictions(symbol);

		return NextResponse.json({ success: true, data: predictions });
	} catch (error: unknown) {
		console.error('Error fetching predictions:', error);
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch predictions',
				message: errorMessage,
			},
			{ status: 500 }
		);
	}
}
