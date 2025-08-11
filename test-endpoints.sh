#!/bin/bash
# LunarOracle Endpoint Testing Script
# Stable URL: https://lunaroracle-j34ob3vf0-danilobatsons-projects.vercel.app

LUNARORACLE_URL="https://lunaroracle-j34ob3vf0-danilobatsons-projects.vercel.app"

echo "🧪 Testing LunarOracle at: $LUNARORACLE_URL"
echo ""

echo "1. Health Check:"
curl -s "$LUNARORACLE_URL/api/health" | jq . || curl -s "$LUNARORACLE_URL/api/health"
echo ""

echo "2. Bitcoin Data:"
curl -s "$LUNARORACLE_URL/api/topic/bitcoin" | jq . || curl -s "$LUNARORACLE_URL/api/topic/bitcoin"
echo ""

echo "3. AI Prediction:"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"cryptoSymbol":"bitcoin","timeframe":24}' \
  "$LUNARORACLE_URL/api/predict" | jq . || curl -s -X POST -H "Content-Type: application/json" -d '{"cryptoSymbol":"bitcoin","timeframe":24}' "$LUNARORACLE_URL/api/predict"
echo ""

echo "4. Agent Chat:"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"message":"What do you think about Bitcoin?","userId":"test"}' \
  "$LUNARORACLE_URL/api/agent/chat" | jq . || curl -s -X POST -H "Content-Type: application/json" -d '{"message":"What do you think about Bitcoin?","userId":"test"}' "$LUNARORACLE_URL/api/agent/chat"
echo ""

echo "5. Predictions History:"
curl -s "$LUNARORACLE_URL/api/predictions" | jq . || curl -s "$LUNARORACLE_URL/api/predictions"
