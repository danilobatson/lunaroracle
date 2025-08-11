#!/bin/bash
# LunarOracle Testing Script - Stable Production URL
# URL: https://lunaroracle.vercel.app

echo "🧪 Testing LunarOracle Production API"
echo "URL: https://lunaroracle.vercel.app"
echo ""

echo "1. Health Check:"
curl -s "https://lunaroracle.vercel.app/api/health" || echo "FAILED"
echo ""

echo "2. Bitcoin Data:"
curl -s "https://lunaroracle.vercel.app/api/topic/bitcoin" || echo "FAILED"
echo ""

echo "3. AI Prediction:"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"cryptoSymbol":"bitcoin","timeframe":24}' \
  "https://lunaroracle.vercel.app/api/predict" || echo "FAILED"
echo ""

echo "4. Agent Chat:"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"message":"What do you think about Bitcoin?","userId":"test"}' \
  "https://lunaroracle.vercel.app/api/agent/chat" || echo "FAILED"
echo ""

echo "5. Predictions History:"
curl -s "https://lunaroracle.vercel.app/api/predictions" || echo "FAILED"
echo ""
