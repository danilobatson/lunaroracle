#!/bin/bash
# LunarOracle Testing Script - Real AI Integration
# URL: https://lunaroracle.vercel.app

STABLE_URL="https://lunaroracle.vercel.app"

echo "🤖 Testing LunarOracle with REAL AI Integration"
echo "URL: $STABLE_URL"
echo ""

echo "1. Health Check:"
curl -s "$STABLE_URL/api/health" | jq . 2>/dev/null || curl -s "$STABLE_URL/api/health"
echo ""

echo "2. Bitcoin Data (Real LunarCrush):"
curl -s "$STABLE_URL/api/topic/bitcoin" | jq . 2>/dev/null || curl -s "$STABLE_URL/api/topic/bitcoin"
echo ""

echo "3. REAL AI Prediction (Gemini + LunarCrush):"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"cryptoSymbol":"bitcoin","timeframe":24}' \
  "$STABLE_URL/api/predict" | jq . 2>/dev/null || curl -s -X POST -H "Content-Type: application/json" -d '{"cryptoSymbol":"bitcoin","timeframe":24}' "$STABLE_URL/api/predict"
echo ""

echo "4. REAL AI Agent Chat (Gemini):"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"message":"What do you think about Bitcoin right now?","userId":"test"}' \
  "$STABLE_URL/api/agent/chat" | jq . 2>/dev/null || curl -s -X POST -H "Content-Type: application/json" -d '{"message":"What do you think about Bitcoin right now?","userId":"test"}' "$STABLE_URL/api/agent/chat"
echo ""

echo "5. Another AI Chat Test:"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"message":"Should I invest in Ethereum today?","userId":"test"}' \
  "$STABLE_URL/api/agent/chat" | jq . 2>/dev/null || curl -s -X POST -H "Content-Type: application/json" -d '{"message":"Should I invest in Ethereum today?","userId":"test"}' "$STABLE_URL/api/agent/chat"
echo ""
