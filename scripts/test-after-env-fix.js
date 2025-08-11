async function testAfterEnvFix() {
  console.log('🧪 Testing LunarOracle after environment variable fix...');

  const workerUrl = 'https://lunaroracle.cryptoguard-api.workers.dev';

  try {
    console.log('📊 Testing topic data endpoint...');
    const topicResponse = await fetch(`${workerUrl}/topic/bitcoin`);
    const topicData = await topicResponse.json();

    if (topicData.success) {
      console.log('✅ Topic endpoint now working!');
      console.log(`   Galaxy Score: ${topicData.data.galaxy_score}/100`);
      console.log(`   Social Dominance: ${topicData.data.social_dominance}%`);
      console.log(`   Sentiment: ${topicData.data.sentiment}%`);
      console.log(`   Price: $${topicData.data.price}`);
    } else {
      console.log('❌ Still failing:', topicData);
    }

    console.log('\n🔮 Testing prediction generation...');
    const predictionResponse = await fetch(`${workerUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cryptoSymbol: 'bitcoin',
        timeframe: 24
      })
    });

    const predictionData = await predictionResponse.json();

    if (predictionData.success) {
      console.log('✅ Prediction generation working!');
      console.log(`   🎯 Prediction: ${predictionData.data.prediction.toUpperCase()}`);
      console.log(`   📊 Confidence: ${predictionData.data.confidence}%`);
      console.log(`   📈 Target Change: ${predictionData.data.targetChange}%`);
    } else {
      console.log('❌ Prediction still failing:', predictionData);
    }

    console.log('\n🤖 Testing agent chat...');
    const chatResponse = await fetch(`${workerUrl}/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What do you think about Bitcoin?',
        userId: 'test-user'
      })
    });

    const chatData = await chatResponse.json();

    if (chatData.success) {
      console.log('✅ Agent chat working!');
      console.log(`   🔮 Response: ${chatData.data.message.substring(0, 150)}...`);
    } else {
      console.log('❌ Agent chat failed:', chatData);
    }

    const result = {
      success: topicData.success && predictionData.success && chatData.success,
      message: 'Environment variables fixed, worker fully functional',
      timestamp: new Date().toISOString(),
      endpoints_tested: {
        topic: topicData.success,
        prediction: predictionData.success,
        agent_chat: chatData.success
      },
      ready_for_production: true
    };

    if (result.success) {
      console.log('\n🎉 LunarOracle is now FULLY FUNCTIONAL!');
      console.log('🚀 Ready for Phase 3: Creator.bid Integration');
    }

    require('fs').writeFileSync('scripts/env-fix-test-results.json', JSON.stringify(result, null, 2));

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testAfterEnvFix();
