#!/bin/bash

# Fix Final TypeScript Errors
cd /Users/batson/Desktop/ForTheNerds/CreatorBid/lunaroracle || exit 1

echo "🔧 Fixing Final TypeScript Errors"
echo "================================="
echo ""

# Fix the remaining agent chat route issues
echo "Fixing agent chat route final TypeScript issues..."

cat > src/app/api/agent/chat/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { createGeminiService } from '@/lib/gemini';
import { createLunarCrushService } from '@/lib/lunarcrush';

interface ChatRequest {
  message: string;
  userId?: string;
}

interface ChatResponse {
  response: string;
  userId: string;
  timestamp: string;
  source: 'ai_agent';
  contextUsed?: any;
}

export async function POST(request: NextRequest) {
  let requestBody: ChatRequest | null = null;

  try {
    requestBody = await request.json();

    // Add null check before destructuring
    if (!requestBody) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { message, userId } = requestBody;

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      );
    }

    console.log(`💬 Agent chat request from ${userId || 'anonymous'}: ${message}`);

    // Create AI services
    const gemini = createGeminiService();
    const lunarCrush = createLunarCrushService();

    // Try to get some crypto context for better responses
    let cryptoContext = null;
    try {
      // Get top cryptocurrencies for context
      const cryptoData = await lunarCrush.getCryptocurrencies({ limit: 5 });
      if (cryptoData.success && cryptoData.data && Array.isArray(cryptoData.data)) {
        // Filter out null values and ensure we have valid crypto objects
        const validCryptos = cryptoData.data
          .filter((c): c is NonNullable<typeof c> => c !== null && c !== undefined && !!c.name && !!c.symbol)
          .map(c => `${c.name} (${c.symbol})`)
          .join(', ');

        if (validCryptos.length > 0) {
          cryptoContext = {
            topCryptos: validCryptos,
            marketSentiment: 'based on current data'
          };
        }
      }
    } catch (contextError) {
      console.warn('Could not fetch crypto context for chat:', contextError);
    }

    // Generate AI response using Gemini
    const aiResponse = await gemini.generateChatResponse(message, cryptoContext);

    console.log(`🤖 AI response generated for user message`);

    const response: ChatResponse = {
      response: aiResponse,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      source: 'ai_agent',
      contextUsed: cryptoContext ? 'crypto_market_data' : 'general_knowledge'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Agent chat route error:', error);

    // Fallback response if AI fails
    const fallbackResponse: ChatResponse = {
      response: `I apologize, but I'm experiencing technical difficulties right now. I'm LunarOracle, your crypto analysis AI, and I'd love to help you with cryptocurrency insights. Please try your question again in a moment.`,
      userId: requestBody?.userId || 'anonymous',
      timestamp: new Date().toISOString(),
      source: 'ai_agent'
    };

    return NextResponse.json(fallbackResponse);
  }
}
EOF

echo "✅ Fixed final agent chat route TypeScript issues"

# Test build to see if all errors are resolved
echo "🔨 Testing Build with Final TypeScript Fixes"
echo "=========================================="

yarn build > build_final_fix.log 2>&1
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ Build successful! All TypeScript errors resolved!"
    rm build_final_fix.log
else
    echo "❌ Build still failing. Checking remaining errors..."
    echo ""
    echo "Build errors:"
    tail -20 build_final_fix.log

    # Let's see what specific errors remain
    echo ""
    echo "Specific TypeScript errors:"
    grep -E "error TS[0-9]+:" build_final_fix.log || echo "No specific TS errors found"
fi

# Commit if successful
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "📝 Committing Final TypeScript Fixes"
    echo "=================================="

    if [ -d ".git" ]; then
        git add .
        git commit -m "fix: resolve final TypeScript errors - proper null checks and type guards"
        echo "✅ Final TypeScript fixes committed"
    fi
fi

mkdir -p diagnostics
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Save results
cat > diagnostics/final_typescript_fix_${TIMESTAMP}.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "final_fixes_applied": [
    "Added null check before destructuring requestBody",
    "Used type guard filter with NonNullable assertion",
    "Proper null handling for crypto data filtering",
    "Ensured all destructured properties are safe"
  ],
  "typescript_patterns_used": [
    "Type guard: (c): c is NonNullable<typeof c> =>",
    "Null check before destructuring: if (!requestBody) return",
    "Safe optional chaining: requestBody?.userId",
    "Proper array filtering with type assertions"
  ],
  "build_result": $([ $BUILD_EXIT_CODE -eq 0 ] && echo '"success"' || echo '"failed"'),
  "all_typescript_errors_resolved": $([ $BUILD_EXIT_CODE -eq 0 ] && echo "true" || echo "false")
}
EOF

echo ""
echo "💾 Final TypeScript fix results saved to diagnostics/final_typescript_fix_${TIMESTAMP}.json"
echo ""

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "🎉 ALL TYPESCRIPT ERRORS FINALLY RESOLVED!"
    echo "========================================="
    echo ""
    echo "✅ Null checking before destructuring"
    echo "✅ Type guards for array filtering"
    echo "✅ Proper type assertions"
    echo "✅ Build passing completely"
    echo ""
    echo "🚀 DEPLOY NOW FOR REAL AI:"
    echo "========================="
    echo "vercel --prod"
    echo ""
    echo "🤖 TEST REAL GEMINI AI:"
    echo "======================"
    echo "./test-lunaroracle-real-ai.sh"
    echo ""
    echo "Expected: Actual AI analysis instead of mocks!"
    echo ""
    echo "🎯 What you'll get:"
    echo "• Real Gemini AI predictions based on LunarCrush data"
    echo "• Intelligent chat responses with crypto context"
    echo "• No more mock responses!"
else
    echo "❌ Build still failing - need to debug remaining errors"
    echo "Check build_final_fix.log for details"
fi

# Cleanup only if successful
[ $BUILD_EXIT_CODE -eq 0 ] && rm -f build_final_fix.log
