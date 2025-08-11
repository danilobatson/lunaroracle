require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function testLLMPoweredAnalysis() {
  console.log('🧠 Testing LLM-Powered Analysis Approach...');
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found');
    }
    
    // Mock real LunarCrush data structure
    const mockSocialData = {
      galaxy_score: 57.10,
      social_dominance: 21.60,
      sentiment: 78,
      posts_active: 168938,
      contributors_active: 65783,
      interactions: 107114453,
      price: 119592.90,
      percent_change_24h: 0.9
    };
    
    // Test LLM analysis instead of hardcoded rules
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
      }
    });
    
    const analysisPrompt = `Analyze this crypto social data intelligently:

Galaxy Score: ${mockSocialData.galaxy_score}/100
Social Dominance: ${mockSocialData.social_dominance}%
Sentiment: ${mockSocialData.sentiment}%
Posts: ${mockSocialData.posts_active}
Interactions: ${mockSocialData.interactions}
Price: $${mockSocialData.price}
24h Change: ${mockSocialData.percent_change_24h}%

Provide intelligent analysis instead of hardcoded rules. What patterns do you see? What's the overall signal?

Respond with JSON:
{
  "overall_signal": "bullish|bearish|neutral",
  "confidence": 85,
  "key_insights": ["insight1", "insight2"],
  "reasoning": "Your intelligent analysis"
}`;

    console.log('🤖 Asking Gemini to analyze social data...');
    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response
    const parseJSON = (text) => {
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      return jsonMatch ? jsonMatch[1].trim() : text.trim();
    };
    
    const cleanedText = parseJSON(text);
    const analysis = JSON.parse(cleanedText);
    
    const testResult = {
      success: true,
      message: 'LLM-powered analysis successful',
      timestamp: new Date().toISOString(),
      approach: 'LLM intelligence instead of hardcoded rules',
      test_data: mockSocialData,
      llm_analysis: analysis,
      benefits: [
        'No hardcoded thresholds',
        'Intelligent pattern recognition', 
        'Contextual analysis',
        'Adaptable to market conditions',
        'Modern ES6+ syntax'
      ],
      raw_llm_response: text
    };
    
    console.log('✅ LLM Analysis Results:');
    console.log(`   Overall Signal: ${analysis.overall_signal.toUpperCase()}`);
    console.log(`   Confidence: ${analysis.confidence}%`);
    console.log(`   Key Insights: ${analysis.key_insights?.join(', ')}`);
    console.log(`   Reasoning: ${analysis.reasoning}`);
    console.log('\n🎯 LLM-powered approach is much more intelligent!');
    
    fs.writeFileSync('scripts/llm-powered-test-results.json', JSON.stringify(testResult, null, 2));
    
  } catch (error) {
    const result = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    console.log('❌ LLM-powered test failed:', error.message);
    fs.writeFileSync('scripts/llm-powered-test-results.json', JSON.stringify(result, null, 2));
  }
}

testLLMPoweredAnalysis();
