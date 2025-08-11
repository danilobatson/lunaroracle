require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function testGemini() {
  console.log('🤖 Testing Gemini AI connection...');
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.3,
        topK: 10,
        topP: 0.8,
        maxOutputTokens: 500,
      }
    });
    
    // Test with simple prediction prompt
    const prompt = `You are LunarOracle. Given Bitcoin has a Galaxy Score of 75, Social Dominance of 8.5%, and Sentiment of 68, predict the price direction for the next 24 hours.

Respond ONLY with valid JSON:
{
  "prediction": "bullish|bearish|neutral",
  "confidence": 75,
  "reasoning": "Brief explanation"
}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON response
    let parsedPrediction;
    try {
      parsedPrediction = JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Failed to parse AI response as JSON: ${text}`);
    }
    
    const testResult = {
      success: true,
      message: 'Gemini AI connection and prediction generation successful',
      timestamp: new Date().toISOString(),
      test_prediction: parsedPrediction,
      raw_response: text,
      api_working: true
    };
    
    console.log('✅ Gemini AI test passed');
    console.log(`   Prediction: ${parsedPrediction.prediction}`);
    console.log(`   Confidence: ${parsedPrediction.confidence}%`);
    console.log(`   Reasoning: ${parsedPrediction.reasoning}`);
    
    fs.writeFileSync('scripts/gemini-test-results.json', JSON.stringify(testResult, null, 2));
    
  } catch (error) {
    const result = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    console.log('❌ Gemini AI test failed:', error.message);
    fs.writeFileSync('scripts/gemini-test-results.json', JSON.stringify(result, null, 2));
  }
}

testGemini();
