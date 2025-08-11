#!/bin/bash
echo "🚀 Deploying LunarOracle to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

echo ""
echo "🔑 IMPORTANT: You'll need to set these environment variables in Vercel:"
echo ""
echo "Required for basic functionality:"
echo "  LUNARCRUSH_API_KEY=vcbhz3zf90hd7rtk97d3k436x8me7eb0tb77fjk2d"
echo "  GEMINI_API_KEY=AIzaSyCBKmjYBpNOm-ZA4UKrqjlyoWXkWZRdKNc"
echo ""
echo "Optional for Cloudflare D1 database (can add later):"
echo "  CLOUDFLARE_ACCOUNT_ID=your_account_id"
echo "  CLOUDFLARE_D1_DATABASE_ID=your_database_id"
echo "  CLOUDFLARE_API_TOKEN=your_api_token"
echo ""
echo "📝 The app will work with just the first two keys and use fallback storage."
echo ""

read -p "🤔 Do you want to continue with deployment? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo "🚀 Starting Vercel deployment..."
vercel --prod

echo ""
echo "✅ Deployment started!"
echo ""
echo "📋 Next steps:"
echo "1. Add environment variables in Vercel dashboard when prompted"
echo "2. Wait for deployment to complete"
echo "3. Test your live API endpoints"
echo "4. (Optional) Add Cloudflare D1 credentials later"
