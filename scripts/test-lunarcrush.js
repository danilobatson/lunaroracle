require('dotenv').config();
const fs = require('fs');

async function testLunarCrush() {
  console.log('🌙 Testing LunarCrush API connection...');
  
  try {
    const apiKey = process.env.LUNARCRUSH_API_KEY;
    
    if (!apiKey) {
      throw new Error('LUNARCRUSH_API_KEY not found in environment variables');
    }
    
    // Test basic API call
    const response = await fetch('https://lunarcrush.com/api4/public/topic/bitcoin', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const result = {
      success: true,
      message: 'LunarCrush API connection successful',
      timestamp: new Date().toISOString(),
      test_data: {
        symbol: data.symbol || 'bitcoin',
        galaxy_score: data.galaxy_score || 0,
        social_dominance: data.social_dominance || 0,
        sentiment: data.sentiment || 50,
        price: data.close || 0
      },
      api_response_received: true
    };
    
    console.log('✅ LunarCrush API test passed');
    console.log(`   Galaxy Score: ${result.test_data.galaxy_score}`);
    console.log(`   Social Dominance: ${result.test_data.social_dominance}%`);
    console.log(`   Price: $${result.test_data.price}`);
    
    fs.writeFileSync('scripts/lunarcrush-test-results.json', JSON.stringify(result, null, 2));
    
  } catch (error) {
    const result = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    console.log('❌ LunarCrush API test failed:', error.message);
    fs.writeFileSync('scripts/lunarcrush-test-results.json', JSON.stringify(result, null, 2));
  }
}

testLunarCrush();
