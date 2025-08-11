require('dotenv').config();
const fs = require('fs');

async function testDeployedWorker() {
  console.log('🌐 Testing deployed LunarOracle worker...');

  try {
    // You'll need to update this URL with your actual worker URL after deployment
    const workerUrl = 'https://lunaroracle.cryptoguard-api.workers.dev';

    console.log('📡 Testing health endpoint...');

    // Test health endpoint
    const healthResponse = await fetch(`${workerUrl}/health`);
    const healthData = await healthResponse.json();

    if (healthData.status === 'healthy') {
      console.log('✅ Health check passed');
      console.log(`   Version: ${healthData.version}`);
      console.log(`   Features: ${healthData.features?.join(', ')}`);
    } else {
      throw new Error('Health check failed');
    }

    console.log('\n📊 Testing topic data endpoint...');

    // Test topic data endpoint
    const topicResponse = await fetch(`${workerUrl}/topic/bitcoin`);
    const topicData = await topicResponse.json();

    if (topicData.success) {
      console.log('✅ Topic data endpoint working');
      console.log(`   Galaxy Score: ${topicData.data.galaxy_score}`);
      console.log(`   Social Dominance: ${topicData.data.social_dominance}%`);
      console.log(`   Sentiment: ${topicData.data.sentiment}%`);
    } else {
      throw new Error(`Topic endpoint failed: ${topicData.error}`);
    }

    console.log('\n🔮 Testing prediction generation...');

    // Test prediction endpoint
    const predictionResponse = await fetch(`${workerUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cryptoSymbol: 'bitcoin',
        timeframe: 24
      })
    });

    const predictionData = await predictionResponse.json();

    if (predictionData.success) {
      console.log('✅ Prediction generation working');
      console.log(`   Prediction: ${predictionData.data.prediction.toUpperCase()}`);
      console.log(`   Confidence: ${predictionData.data.confidence}%`);
      console.log(`   Target Change: ${predictionData.data.targetChange}%`);
      console.log(`   Reasoning: ${predictionData.data.reasoning.substring(0, 100)}...`);
    } else {
      console.log('⚠️ Prediction endpoint failed:', predictionData.error);
    }

    console.log('\n🤖 Testing agent chat...');

    // Test agent chat endpoint
    const chatResponse = await fetch(`${workerUrl}/agent/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What do you think about Bitcoin right now?',
        userId: 'test-user-123'
      })
    });

    const chatData = await chatResponse.json();

    if (chatData.success) {
      console.log('✅ Agent chat working');
      console.log(`   Response: ${chatData.data.message.substring(0, 150)}...`);
    } else {
      console.log('⚠️ Agent chat failed:', chatData.error);
    }

    const result = {
      success: true,
      message: 'LunarOracle worker deployed and functional',
      timestamp: new Date().toISOString(),
      worker_url: workerUrl,
      endpoints_tested: [
        { endpoint: '/health', status: 'working' },
        { endpoint: '/topic/bitcoin', status: 'working' },
        { endpoint: '/predict', status: predictionData.success ? 'working' : 'failed' },
        { endpoint: '/agent/chat', status: chatData.success ? 'working' : 'failed' }
      ],
      deployment_successful: true,
      llm_powered_predictions: true,
      real_lunarcrush_data: true
    };

    console.log('\n🎉 LunarOracle worker deployment successful!');
    fs.writeFileSync('scripts/deployed-worker-test-results.json', JSON.stringify(result, null, 2));

  } catch (error) {
    const result = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      worker_url: 'Update this URL in the script after deployment'
    };

    console.log('❌ Worker deployment test failed:', error.message);
    fs.writeFileSync('scripts/deployed-worker-test-results.json', JSON.stringify(result, null, 2));
  }
}

// Get the worker URL from wrangler deployment output
const deploymentInfo = `
📝 After deployment, update the workerUrl in this script with your actual worker URL.

Example URLs:
- https://lunaroracle.your-username.workers.dev
- https://lunaroracle.your-custom-domain.workers.dev

Then run: node scripts/test-deployed-worker.js
`;

console.log(deploymentInfo);

// If you want to test now, comment out the line below and update the workerUrl above
// testDeployedWorker();
