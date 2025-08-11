require('dotenv').config();
const fs = require('fs');

async function testLunarCrushSDK() {
  console.log('🌙 Testing LunarCrush SDK data structure...');

  try {
    // Import the SDK
    const { createLunarCrushMCP } = require('lunarcrush-sdk');

    const apiKey = process.env.LUNARCRUSH_API_KEY;
    if (!apiKey) {
      throw new Error('LUNARCRUSH_API_KEY not found');
    }

    console.log('📡 Creating MCP connection...');
    const mcp = await createLunarCrushMCP(apiKey);

    console.log('📊 Fetching Bitcoin topic data...');
    const topicData = await mcp.topics('bitcoin');

    console.log('📱 Fetching Bitcoin posts...');
    const postsData = await mcp.topicPosts('bitcoin', { interval: '1d' });

    console.log('📈 Fetching Bitcoin time series...');
    const timeSeriesData = await mcp.timeSeries('bitcoin', { interval: '1w' });

    await mcp.close();

    const result = {
      success: true,
      message: 'LunarCrush SDK test successful',
      timestamp: new Date().toISOString(),
      topic_data_structure: typeof topicData === 'object' ? Object.keys(topicData) : 'not object',
      posts_data_structure: typeof postsData === 'object' ? Object.keys(postsData) : 'not object',
      time_series_structure: typeof timeSeriesData === 'object' ? Object.keys(timeSeriesData) : 'not object',
      sample_topic_data: topicData,
      sample_posts_count: postsData?.data?.length || 0,
      sample_time_series_count: timeSeriesData?.data?.length || 0,
      notes: [
        'Sentiment will be calculated by Gemini AI from post content',
        'LunarCrush provides raw social data and galaxy scores',
        'We will analyze post text for sentiment using AI'
      ]
    };

    console.log('✅ LunarCrush SDK test passed');
    console.log(`   Topic data keys: ${Object.keys(topicData).join(', ')}`);
    console.log(`   Posts fetched: ${postsData?.data?.length || 0}`);
    console.log(`   Time series points: ${timeSeriesData?.data?.length || 0}`);

    fs.writeFileSync('scripts/lunarcrush-sdk-test-results.json', JSON.stringify(result, null, 2));

  } catch (error) {
    const result = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };

    console.log('❌ LunarCrush SDK test failed:', error.message);
    fs.writeFileSync('scripts/lunarcrush-sdk-test-results.json', JSON.stringify(result, null, 2));
  }
}

testLunarCrushSDK();
