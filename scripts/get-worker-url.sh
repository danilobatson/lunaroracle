#!/bin/bash

echo "🔍 Getting LunarOracle worker URL..."

# Get the worker URL from wrangler
WORKER_URL=$(wrangler whoami 2>/dev/null | grep -o 'https://.*workers.dev' | head -1)

if [ -z "$WORKER_URL" ]; then
    echo "⚠️  Could not automatically detect worker URL"
    echo "📝 Please check your Cloudflare dashboard for the worker URL"
    echo "🌐 Typical format: https://lunaroracle.your-username.workers.dev"
else
    echo "✅ Worker URL found: $WORKER_URL"
fi

echo ""
echo "🧪 To test your deployed worker:"
echo "1. Update the workerUrl in scripts/test-deployed-worker.js"
echo "2. Run: node scripts/test-deployed-worker.js"
echo ""
echo "📊 Available endpoints:"
echo "   GET  $WORKER_URL/health"
echo "   GET  $WORKER_URL/topic/:symbol"
echo "   POST $WORKER_URL/predict"
echo "   POST $WORKER_URL/agent/chat"
echo "   GET  $WORKER_URL/predictions/:symbol?"
