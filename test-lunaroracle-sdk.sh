#!/bin/bash
# LunarOracle Testing Script - Fixed SDK Integration
# URL: https://lunaroracle.vercel.app

STABLE_URL="https://lunaroracle.vercel.app"

echo "🧪 Testing LunarOracle with Fixed LunarCrush SDK Integration"
echo "URL: $STABLE_URL"
echo ""

echo "1. Health Check:"
curl -s "$STABLE_URL/api/health" | jq . 2>/dev/null || curl -s "$STABLE_URL/api/health"
echo ""

echo "2. Bitcoin Data (SDK):"
curl -s "$STABLE_URL/api/topic/bitcoin" | jq . 2>/dev/null || curl -s "$STABLE_URL/api/topic/bitcoin"
echo ""

echo "3. Ethereum Data (SDK):"
curl -s "$STABLE_URL/api/topic/ethereum" | jq . 2>/dev/null || curl -s "$STABLE_URL/api/topic/ethereum"
echo ""

echo "4. Cryptocurrencies List (SDK):"
curl -s "$STABLE_URL/api/cryptocurrencies?limit=5" | jq . 2>/dev/null || curl -s "$STABLE_URL/api/cryptocurrencies?limit=5"
echo ""

echo "5. AI Prediction (Mock):"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"cryptoSymbol":"bitcoin","timeframe":24}' \
  "$STABLE_URL/api/predict" | jq . 2>/dev/null || curl -s -X POST -H "Content-Type: application/json" -d '{"cryptoSymbol":"bitcoin","timeframe":24}' "$STABLE_URL/api/predict"
echo ""

echo "6. Agent Chat (Mock):"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"message":"What do you think about Bitcoin?","userId":"test"}' \
  "$STABLE_URL/api/agent/chat" | jq . 2>/dev/null || curl -s -X POST -H "Content-Type: application/json" -d '{"message":"What do you think about Bitcoin?","userId":"test"}' "$STABLE_URL/api/agent/chat"
echo ""
