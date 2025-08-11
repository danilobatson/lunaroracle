const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Setting up environment variables for testing...');
console.log('We need your API keys to test the integrations.\n');
console.log('📋 Get your API keys from:');
console.log('   LunarCrush: https://lunarcrush.com/developers/api/authentication');
console.log('   Gemini: https://aistudio.google.com/app/apikey');
console.log('');

async function setupEnvironment() {
  return new Promise((resolve) => {
    rl.question('Enter your LunarCrush API key: ', (lunarcrushKey) => {
      if (!lunarcrushKey.trim()) {
        console.log('❌ LunarCrush API key is required');
        rl.close();
        return;
      }
      
      rl.question('Enter your Google Gemini API key: ', (geminiKey) => {
        if (!geminiKey.trim()) {
          console.log('❌ Gemini API key is required');
          rl.close();
          return;
        }
        
        const envContent = `# LunarCrush API Configuration
LUNARCRUSH_API_KEY=${lunarcrushKey}

# Google Gemini AI Configuration  
GEMINI_API_KEY=${geminiKey}

# Creator.bid Integration (to be added later)
CREATOR_BID_API_KEY=your_creator_bid_key_here

# Database Configuration (will be set up with Cloudflare D1 later)
DATABASE_URL=will_be_configured_with_cloudflare_d1

# Environment
ENVIRONMENT=development
`;
        
        fs.writeFileSync('.env', envContent);
        
        const result = {
          success: true,
          message: 'Environment variables configured successfully',
          timestamp: new Date().toISOString(),
          keys_configured: {
            lunarcrush: !!lunarcrushKey,
            gemini: !!geminiKey,
            database_url_pending: true
          },
          notes: ['DATABASE_URL will be configured when we set up Cloudflare D1 database']
        };
        
        console.log('✅ Environment variables configured');
        console.log('📝 Note: DATABASE_URL will be set up later with Cloudflare D1');
        fs.writeFileSync('scripts/environment-test-results.json', JSON.stringify(result, null, 2));
        
        rl.close();
        resolve();
      });
    });
  });
}

setupEnvironment();
